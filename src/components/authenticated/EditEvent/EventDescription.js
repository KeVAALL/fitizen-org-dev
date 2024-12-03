// React imports
import React, { useEffect, useRef, useState } from "react";

// Third-party imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// Project imports
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import Loader from "../../../utils/BackdropLoader";
import QuillEditor from "../../QuillEditor";

const initialFormValues = {
  Event_Description: "",
  Rules_Regulations: "",
  Refund_Cancellation: "",
};

function EventDescription() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [fetchingDescription, setFetchingDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);

  const validationSchema = Yup.object().shape({
    Event_Description: Yup.string(),
    Rules_Regulations: Yup.string(),
    Refund_Cancellation: Yup.string(),
  });
  const submitDescriptionForm = async (values) => {
    const reqdata = {
      Method_Name: "Descripition",
      Event_Id: decryptData(event_id),
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
        toast.dismiss();
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
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
      Event_Id: decryptData(event_id),
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
    if (event_id) {
      LoadDescription();
    }
  }, [event_id]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {!isEditing ? (
        <div className="col-12 d-flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
            className="button w-200 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-14 d-flex gap-10"
          >
            <i className="far fa-edit text-14"></i>
            Edit Description
          </button>
        </div>
      ) : (
        <></>
      )}
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
              <div className="row y-gap-20 py-20">
                <div className="col-12">
                  <div className="single-field w-full y-gap-10">
                    <label className="text-13 fw-500">Enter Description</label>
                    <Field name="Event_Description">
                      {({ field, form }) => (
                        // <ReactQuill
                        //   readOnly={!isEditing}
                        //   theme="snow"
                        //   value={field.value}
                        //   onChange={(content) =>
                        //     setFieldValue("Event_Description", content)
                        //   }
                        //   placeholder="Add more about event"
                        // />
                        <QuillEditor
                          name="Event_Description"
                          value={field.value}
                          readOnly={!isEditing}
                          setFieldValue={form.setFieldValue}
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
                        // <ReactQuill
                        //   readOnly={!isEditing}
                        //   theme="snow"
                        //   value={field.value}
                        //   onChange={(content) =>
                        //     setFieldValue("Refund_Cancellation", content)
                        //   }
                        //   placeholder="Add Refund and Cancellation Policy"
                        // />
                        <QuillEditor
                          name="Refund_Cancellation"
                          value={field.value}
                          readOnly={!isEditing}
                          setFieldValue={form.setFieldValue}
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
                        // <ReactQuill
                        //   readOnly={!isEditing}
                        //   theme="snow"
                        //   value={field.value}
                        //   onChange={(content) =>
                        //     setFieldValue("Rules_Regulations", content)
                        //   }
                        //   placeholder="Add Rules and Regulations"
                        // />
                        <QuillEditor
                          name="Rules_Regulations"
                          value={field.value}
                          readOnly={!isEditing}
                          setFieldValue={form.setFieldValue}
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

                {isEditing && (
                  <div className="col-12 d-flex justify-end">
                    <div className="row">
                      <div className="col-auto relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(false);
                            LoadDescription();
                          }}
                          className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-auto relative">
                        <button
                          disabled={submitForm}
                          type="submit"
                          className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                        >
                          {!submitForm ? (
                            `Save`
                          ) : (
                            <span className="btn-spinner"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default EventDescription;
