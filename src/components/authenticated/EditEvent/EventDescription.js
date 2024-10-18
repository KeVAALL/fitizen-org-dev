import React, { useEffect, useState } from "react";
import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";

import Select from "react-select";
import { selectCustomStyle } from "../../../utils/selectCustomStyle";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../../utils/storage";
import { RestfulApiService } from "../../../config/service";
import { Backdrop, CircularProgress } from "@mui/material";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loader from "../../../utils/Loader";

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
  const [submitForm, setSubmitForm] = useState(false);

  const validationSchema = Yup.object().shape({
    Event_Description: Yup.string().required("Event description is required"),
    Rules_Regulations: Yup.string().required(
      "Rules and regulations are required"
    ),
    Refund_Cancellation: Yup.string().required(
      "Refund & cancellation policy is required"
    ),
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
    if (event_id) {
      LoadDescription();
    }
  }, [event_id]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {fetchingDescription ? (
        <Loader fetching={fetchingDescription} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitDescriptionForm(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="row y-gap-20 py-20">
                <div className="col-12 d-flex justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
                  >
                    <i className="far fa-edit text-16"></i>
                    Edit Description
                  </button>
                </div>

                <div className="col-12">
                  <div className="single-field w-full y-gap-10">
                    <label className="text-13 fw-500">
                      Enter Description <sup className="asc">*</sup>
                    </label>
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
                      Refund & Cancellation Policy <sup className="asc">*</sup>
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
                      Rules & Regulations <sup className="asc">*</sup>
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
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default EventDescription;

/* <div className="col-12">
          <div className="y-gap-10">
            <label className="text-13 fw-500">
              Race Day Facilities <sup className="asc">*</sup>
            </label>
            <div className="py-30 px-30 border-light rounded-8">
              <div className="row y-gap-20">
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox
                    // checked={true}
                    // onChange={(e) =>
                    //   setFieldValue(
                    //     `menuIds[${index}].edit_flag`,
                    //     e.target.checked ? 1 : 0
                    //   )
                    // }
                    />
                    <label className="text-15 text-reading fw-500">
                      Parking
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox />
                    <label className="text-15 text-reading fw-500">
                      Shuttle Services
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox />
                    <label className="text-15 text-reading fw-500">
                      Post Race Survey
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox disabled />
                    <label className="text-15 text-reading fw-500">
                      Pacing Bus
                    </label>
                  </div>
                </div>
                <div className="col-xl-12">
                  <div className="d-flex justify-end items-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="button rounded-24 py-10 px-15 text-primary border-primary -primary-1 fw-500 text-13 d-flex gap-10"
                    >
                      <i className="fas fa-plus text-12"></i>
                      Add Others
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */
/* <Autocomplete
              multiple
              disableClearable
              disableCloseOnSelect
              disableListWrap
              options={[]}
              getOptionLabel={(option) => option.label}
              value={[]} // Bind selected options to the filter state
              onChange={() => {}}
              renderOption={(props, option, { selected }) => (
                <li
                  {...props}
                  key={option.value}
                  style={{
                    backgroundColor: selected ? "white" : "transparent",
                  }}
                >
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<Checkbox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    // Set checkbox color to primary color when selected
                    // color={selected ? "orange" : "default"}
                    sx={{
                      color: selected ? "#f05736" : undefined, // Checkbox color when selected
                      "&.Mui-checked": {
                        color: "#f05736", // Checkbox color when selected
                      },
                    }}
                  />
                  {option.label}
                </li>
              )}
              renderTags={(tagValue) => {
                const numSelected = [].length;
                return (
                  <Chip
                    label={
                      numSelected > 0 ? `${numSelected} Selected` : "Filter"
                    }
                    size="small"
                  />
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled
                  placeholder="Add Race Day Takeaways"
                  className="multi-select-field"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "12px",
                      left: "-5px",
                      top: "-5px",
                    },
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "14px", // Adjust font size
                      color: "gray", // Adjust color
                    },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Disable typing
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: "38px", // Custom height for the TextField
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                />
              )}
              ListboxProps={{
                sx: {
                  fontSize: "12px",
                  "& .MuiAutocomplete-option": {
                    paddingLeft: "0px",
                  },
                },
              }}
            /> */
