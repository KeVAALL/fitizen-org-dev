// React imports
import React, { useEffect, useState } from "react";

// Third-party imports
import { useSelector } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Project imports
import { RestfulApiService } from "../../../config/service";
import Loader from "../../../utils/BackdropLoader";

const initialFormValues = {
  Event_Description: "",
  Rules_Regulations: "",
  Refund_Cancellation: "",
};

function AddEventDescription({ handleStep, prevIndex, nextIndex }) {
  const user = useSelector((state) => state.user.userProfile);
  const newEventId = useSelector((state) => state.newEvent.currentEventId);
  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [fetchingDescription, setFetchingDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);

  const validationSchema = Yup.object().shape({
    Event_Description: Yup.string().nullable(),
    // .required("Event description is required"),
    Rules_Regulations: Yup.string().nullable(),
    //   .required(
    //   "Rules and regulations are required"
    // ),
    Refund_Cancellation: Yup.string().nullable(),
    //   .required(
    //   "Refund & cancellation policy is required"
    // ),
  });
  const submitDescriptionForm = async (values) => {
    const reqdata = {
      Method_Name: "Descripition",
      Event_Id: newEventId,
      Event_Name: values?.Event_Name,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      XMLData: "",
      TakeAwayXMLData: "",
      FacilityXMLData: "",
      QuestionXMLData: "",
      Event_Description: values?.Event_Description,
      Rules_Regulations: values?.Rules_Regulations,
      Refund_Cancellation: values?.Refund_Cancellation,
    };

    try {
      setSubmitForm(true);

      const result = await RestfulApiService(reqdata, "organizer/SaveEvent");

      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }

      if (result) {
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        handleStep(nextIndex);
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitForm(false);
    }
  };
  async function LoadDescription() {
    const reqdata = {
      Method_Name: "Descripition",
      Event_Id: newEventId,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Name: "",
      Event_Period: "",
      EventType_Id: "",
    };
    try {
      setFetchingDescription(true);
      const result = await RestfulApiService(reqdata, "organizer/GetEvent");
      if (result) {
        const result1 = result?.data?.Result?.Table1[0];

        setInitialValues({
          Event_Description: result1?.Event_Description,
          Rules_Regulations: result1?.Rules_Regulations,
          Refund_Cancellation: result1?.Refund_Cancellation,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingDescription(false);
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    if (newEventId) {
      LoadDescription();
    }
  }, [newEventId]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {fetchingDescription ? (
        <Loader fetching={fetchingDescription} />
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitDescriptionForm(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="row y-gap-30 py-20">
                <div className="col-12">
                  <div className="single-field w-full y-gap-10">
                    <label className="text-13 fw-500">Description</label>
                    <Field name="Event_Description">
                      {({ field, form }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={(content) =>
                            setFieldValue("Event_Description", content)
                          }
                          placeholder="Add more about event"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Event_Description"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="single-field w-full y-gap-10">
                    <label className="text-13 fw-500">
                      Refund & Cancellation Policy
                    </label>
                    <Field name="Refund_Cancellation">
                      {({ field, form }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={(content) =>
                            setFieldValue("Refund_Cancellation", content)
                          }
                          placeholder="Add Refund and Cancellation Policy"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Refund_Cancellation"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="single-field w-full y-gap-10">
                    <label className="text-13 fw-500">
                      Rules & Regulations
                    </label>
                    <Field name="Rules_Regulations">
                      {({ field, form }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={(content) =>
                            setFieldValue("Rules_Regulations", content)
                          }
                          placeholder="Add Rules and Regulations"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Rules_Regulations"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-12 d-flex justify-end">
                  <div className="row">
                    <div className="col-auto relative">
                      <button
                        type="button"
                        onClick={() => {
                          handleStep(prevIndex);
                        }}
                        className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12 d-flex gap-25 load-button"
                      >
                        Back
                      </button>
                    </div>
                    {/* <div className="col-12 d-flex justify-end">
                      <div className="row"> */}
                    <div className="col-auto relative">
                      <button
                        disabled={submitForm}
                        type="submit"
                        className="button bg-primary w-150 h-40 rounded-24 px-15 text-white text-12 border-light load-button"
                      >
                        {!submitForm ? (
                          `Save & Next`
                        ) : (
                          <span className="btn-spinner"></span>
                        )}
                      </button>
                    </div>
                    {/* </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default AddEventDescription;
