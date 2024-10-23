import React, { useCallback, useEffect, useState } from "react";
import Event5 from "../../../assets/img/events/event5.png";
import Select from "react-select";
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import { toUpper } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import toast from "react-hot-toast";
import EventTitle from "../EventTitle";
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
  Payment_Time: "",
  Selected_Bank: "",
  Payment_Days: "",
};
function Payout({ setShowPayout, getData }) {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);

  const [selectedData, setSelectedData] = useState(initialData);
  const [bankList, setBankList] = useState([]);

  console.log("bankList", bankList);
  const handleGetBank = useCallback(async () => {
    const reqdata = {
      Method_Name: "GetBank",
      Org_Id: user?.Org_Id,
      ParentField_Id: decryptData(event_id),
      SearchText: "",
      Session_User_Id: user?.User_Id,
    };

    try {
      const result = await RestfulApiService(reqdata, "master/Getdropdown");
      if (result) {
        setBankList(
          result?.data?.Result?.Table1?.map((curBank) => ({
            label: curBank?.Item_Name,
            value: curBank?.Item_Id,
          })) ?? []
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [user, event_id]);

  useEffect(() => {
    handleGetBank();
  }, [handleGetBank]);

  useEffect(() => {
    setSelectedData({
      ...selectedData,
      Payment_Time: getData?.Payment_Frequency,
      Selected_Bank: getData?.Bank_Id,
      Payment_Days: getData?.Payment_Day,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData]);

  const handleSubmit = useCallback(async () => {
    const requestData = {
      Method_Name: "Create",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Id: decryptData(event_id),
      Payment_Frequency: selectedData?.Payment_Time,
      Payment_Day: selectedData?.Payment_Days,
      Bank_Id: selectedData?.Selected_Bank,
    };
    try {
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
      console.log(err);
    }
  }, [
    selectedData,
    user?.User_Id,
    user?.User_Display_Name,
    user?.Organizer_Id,
    user?.Org_Id,
    event_id,
  ]);

  return (
    <div class="dashboard__main">
      <div class="dashboard__content pt-20">
        <section class="layout-pb-md">
          <div class="container">
            <div class="row y-gap-30">
              <EventTitle />
              <div class="col-xl-9 col-md-9">
                <div class="py-20 px-20 border-light rounded-8">
                  <div class="row y-gap-20 justify-between items-center">
                    <div class="col-6">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          I would like to receive payment{" "}
                          <sup class="asc">*</sup>
                        </label>
                        <Select
                          isSearchable={false}
                          styles={selectCustomStyle}
                          options={options}
                          value={options.find((option) => {
                            return option.value === selectedData?.Payment_Time;
                          })}
                          onChange={(event) => {
                            setSelectedData({
                              ...selectedData,
                              Payment_Time: event.value,
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* ====== for days ========= */}
                    <div class="col-6">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Select Day <sup class="asc">*</sup>
                        </label>
                        <Select
                          isSearchable={false}
                          styles={selectCustomStyle}
                          options={weekDays}
                          value={weekDays.find((option) => {
                            return option.value === selectedData?.Payment_Days;
                          })}
                          onChange={(event) => {
                            setSelectedData({
                              ...selectedData,
                              Payment_Days: event.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Select Default Bank <sup class="asc">*</sup>
                        </label>
                        <div className="col-xl-3 col-md-6 w-full">
                          <Select
                            isSearchable={false}
                            styles={selectCustomStyle}
                            options={bankList}
                            value={bankList.find((option) => {
                              return (
                                option.value === selectedData?.Selected_Bank
                              );
                            })}
                            onChange={(event) => {
                              setSelectedData({
                                ...selectedData,
                                Selected_Bank: event.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row col-12 mt-15">
                      <div class="col-2">
                        <a
                          onClick={(e) => {
                            e.preventDefault();

                            setShowPayout(false);
                          }}
                          class="button border-primary rounded-22 px-30 py-10 text-primary text-12 -primary-1"
                        >
                          Back
                        </a>
                      </div>
                      <div class="col-3">
                        <a
                          href="#0"
                          class="button bg-primary rounded-22 px-20 py-10 text-white text-12 -grey-1"
                          onClick={handleSubmit}
                        >
                          Save & Confirm
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Payout;
