// React imports
import React, { useCallback, useEffect, useState } from "react";

// Third-party imports
import Select from "react-select";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Project imports
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import EventTitle from "../EventTitle";
import Loader from "../../../utils/BackdropLoader";

const options = [
  { label: "Every Week", value: "W" },
  { label: "Every Month", value: "M" },
];

const weekDays = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
];

const initialData = {
  Payment_Time: null,
  Selected_Bank: null,
  Payment_Days: null,
};
function Payout({ setShowPayout, getData }) {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [selectedData, setSelectedData] = useState(initialData);
  const [bankList, setBankList] = useState([]);
  const [loadingPayout, setLoadingPayout] = useState(false);
  const [submitPayout, setSubmitPayout] = useState(false);

  const validationSchema = Yup.object({
    Payment_Time: Yup.object().required("Payment time is required"),
    Payment_Days: Yup.object().required("Payment day is required"),
    Selected_Bank: Yup.object().required("Bank selection is required"),
  });
  const handleGetBank = useCallback(async () => {
    const reqdata = {
      Method_Name: "GetBank",
      Org_Id: user?.Org_Id,
      ParentField_Id: decryptData(event_id),
      SearchText: "",
      Session_User_Id: user?.User_Id,
    };

    try {
      setLoadingPayout(true);
      const result = await RestfulApiService(reqdata, "master/Getdropdown");
      if (result) {
        setBankList(
          result?.data?.Result?.Table1?.map((curBank) => ({
            label: curBank?.Item_Name,
            value: curBank?.Item_Id,
          })) ?? []
        );
        setSelectedData({
          ...selectedData,
          Payment_Time: options.find(
            (option) => option.value === getData?.Payment_Frequency
          ),
          Payment_Days: weekDays.find(
            (option) => option.value === getData?.Payment_Day
          ),
          Selected_Bank: result?.data?.Result?.Table1?.map((curBank) => ({
            label: curBank?.Item_Name,
            value: curBank?.Item_Id,
          })).find((option) => option.value === getData?.Bank_Id),
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPayout(false);
    }
  }, [user, event_id]);
  const handleSubmit = useCallback(
    async (values) => {
      const requestData = {
        Method_Name: "Create",
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
        Org_Id: user?.Org_Id,
        Event_Id: decryptData(event_id),
        Payment_Frequency: values?.Payment_Time?.value,
        Payment_Day: values?.Payment_Days?.value,
        Bank_Id: values?.Selected_Bank?.value,
      };
      try {
        setSubmitPayout(true);
        const { data } = await RestfulApiService(
          requestData,
          "organizer/payoutreq"
        );
        if (data?.Result?.Table1?.[0]?.Result_Id !== 1) {
          toast.error(
            data?.Result?.Table1?.[0]?.Result_Description ||
              "Something Went wrong"
          );
          return;
        }
        toast.success(data?.Result?.Table1?.[0]?.Result_Description);
        setShowPayout(false);
      } catch (err) {
        toast.error("Something Went wrong");
      } finally {
        setSubmitPayout(false);
      }
    },
    [
      selectedData,
      user?.User_Id,
      user?.User_Display_Name,
      user?.Organizer_Id,
      user?.Org_Id,
      event_id,
    ]
  );
  useEffect(() => {
    handleGetBank();
  }, [handleGetBank]);

  return (
    <div class="dashboard__main">
      <div class="dashboard__content pt-20">
        <section class="layout-pb-md">
          {loadingPayout ? (
            <Loader fetching={loadingPayout} />
          ) : (
            <div class="container">
              <div class="row y-gap-30">
                <EventTitle />
                <div class="col-xl-9 col-md-9">
                  <div class="py-20 px-20 border-light rounded-8">
                    <Formik
                      enableReinitialize
                      initialValues={selectedData}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ setFieldValue, values }) => (
                        <Form>
                          <div class="row y-gap-20 justify-between items-center">
                            <div className="col-6">
                              <div className="y-gap-10">
                                <label className="text-13 fw-500">
                                  I would like to receive payment{" "}
                                  <sup className="asc">*</sup>
                                </label>
                                <Select
                                  isSearchable={false}
                                  styles={selectCustomStyle}
                                  options={options}
                                  value={values.Payment_Time}
                                  onChange={(event) => {
                                    setFieldValue("Payment_Time", event);
                                  }}
                                />
                                <ErrorMessage
                                  name="Payment_Time"
                                  component="div"
                                  className="text-error-2 text-13"
                                />
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="y-gap-10">
                                <label className="text-13 fw-500">
                                  Select Day <sup className="asc">*</sup>
                                </label>
                                <Select
                                  isSearchable={false}
                                  styles={selectCustomStyle}
                                  options={weekDays}
                                  value={values.Payment_Days}
                                  onChange={(event) => {
                                    setFieldValue("Payment_Days", event);
                                  }}
                                />
                                <ErrorMessage
                                  name="Payment_Days"
                                  component="div"
                                  className="text-error-2 text-13"
                                />
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="y-gap-10">
                                <label className="text-13 fw-500">
                                  Select Default Bank{" "}
                                  <sup className="asc">*</sup>
                                </label>
                                <Select
                                  isSearchable={false}
                                  styles={selectCustomStyle}
                                  options={bankList}
                                  value={values.Selected_Bank}
                                  onChange={(event) => {
                                    setFieldValue("Selected_Bank", event);
                                  }}
                                />
                                <ErrorMessage
                                  name="Selected_Bank"
                                  component="div"
                                  className="text-error-2 text-13"
                                />
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="row col-12 mt-15">
                              <div className="col-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowPayout(false);
                                  }}
                                  className="button border-primary w-full rounded-22 px-30 py-10 text-primary text-12 -primary-1"
                                >
                                  Back
                                </button>
                              </div>
                              <div className="col-3">
                                <button
                                  disabled={submitPayout}
                                  type="submit"
                                  className="button bg-primary w-full rounded-22 px-20 py-10 text-white text-12 -grey-1"
                                >
                                  Save & Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Payout;
