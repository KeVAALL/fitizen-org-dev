import React, { useEffect, useState } from "react";
import Select from "react-select";
import { selectCustomStyle } from "../../../utils/selectCustomStyle";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../../utils/storage";
import { RestfullApiService } from "../../../config/service";
import { Backdrop, CircularProgress } from "@mui/material";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";

const initialFormValues = {
  Event_Name: "",
  EventType_Id: null,
  RaceDay_Takeaways: [],
  RaceDay_Facilities: [],
  Pincode: null,
  Country: null,
  State: "",
  City: "",
  Event_Venue: "",
  Timezone: null,
  PGCharges_Flag: null,
  PlatformFee_Flag: null,
  Is_Gst: null,
};

function EventDetails() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [eventTypeDropdown, setEventTypeDropdown] = useState([]);
  const [takeawayDropdown, setTakeawayDropdown] = useState([]);
  const [facilityDropdown, setFacilityDropdown] = useState([]);
  const [timezoneDropdown, setTimezoneDropdown] = useState([]);
  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [submitForm, setSubmitForm] = useState(false);

  // Extra Charges Dropdown
  const chargesDropdown = [
    {
      label: "None",
      value: "0",
    },
    {
      label: "Participant",
      value: "1",
    },
    {
      label: "Organizer",
      value: "2",
    },
  ];
  // Validation schema
  const validationSchema = Yup.object({
    Event_Name: Yup.string().required("Event Name is required"),
    EventType_Id: Yup.object().required("Event Type is required"),
    RaceDay_Takeaways: Yup.array().min(1, "At least one takeaway is required"),
    RaceDay_Facilities: Yup.array().min(1, "At least one facility is required"),
    Pincode: Yup.object().required("Pincode is required"),
    Country: Yup.object().required("Country is required"),
    State: Yup.string().required("State is required"),
    City: Yup.string().required("City is required"),
    Event_Venue: Yup.string().required("Event Venue is required"),
    Timezone: Yup.object().required("Timezone is required"),
    PGCharges_Flag: Yup.object().required("PG Charges is required"),
    PlatformFee_Flag: Yup.object().required("Platform Fee is required"),
    Is_Gst: Yup.object().required("GST is required"),
  });
  const fetchOptions = async (inputValue) => {
    if (inputValue.length !== 6) {
      return [];
    }

    try {
      const reqdata = {
        Method_Name: "pincode",
        Session_User_Id: user?.User_Id,
        Org_Id: user?.Org_Id,
        ParentField_Id: inputValue,
        SearchText: "",
      };
      const response = await RestfullApiService(reqdata, "master/Getdropdown");

      return response.data.Result.Table1.map((option) => ({
        label: option.label,
        value: option.value,
      }));
    } catch (error) {
      return [];
    }
  };
  const fetchLocation = async (inputValue, setFieldValue, setFieldTouched) => {
    try {
      const reqdata = {
        Method_Name: "plocation",
        Session_User_Id: user?.User_Id,
        Org_Id: user?.Org_Id,
        ParentField_Id: String(inputValue),
        SearchText: "",
      };
      const response = await RestfullApiService(reqdata, "master/Getdropdown");

      const data = response?.data?.Result?.Table1[0];

      setFieldValue("State", data?.StateName);
      setFieldValue("City", data?.District);
      setFieldValue("Event_Venue", data?.OfficeName);
      setTimeout(() => {
        setFieldTouched("State", true);
        setFieldTouched("City", true);
        setFieldTouched("Event_Venue", true);
      });
    } catch (error) {
      console.error("Error fetching options:", error);
      return [];
    }
  };
  const convertToXMLData = (values) => {
    let XMLData = "";

    XMLData +=
      "<R><FN>Organizer_Id</FN><FV>" +
      user?.Organizer_Id +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Display_Name</FN><FV>" +
      values?.Event_Name +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>EventType_Id</FN><FV>" +
      values?.EventType_Id.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Pincode_Id</FN><FV>" +
      values?.Pincode.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Pincode</FN><FV>" +
      values?.Pincode.label +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>State</FN><FV>" + values?.State + "</FV><FT>Text</FT></R>";
    XMLData += "<R><FN>City</FN><FV>" + values?.City + "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>TimeZone_Id</FN><FV>" +
      values?.Timezone.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Event_Venue</FN><FV>" +
      values?.Event_Venue +
      "</FV><FT>Text</FT></R>";

    XMLData +=
      "<R><FN>Is_Gst</FN><FV>" +
      values?.Is_Gst.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PlatformFee_Flag</FN><FV>" +
      values?.PlatformFee_Flag.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PGCharges_Flag</FN><FV>" +
      values?.PGCharges_Flag.value +
      "</FV><FT>Text</FT></R>";

    XMLData = "<D>" + XMLData + "</D>";

    return XMLData;
  };
  const convertToTakeawayXML = (values) => {
    let TakeAwayXMLData = "";
    for (var i = 0; i < values?.RaceDay_Takeaways.length; i++) {
      TakeAwayXMLData +=
        "<R><TAN>" + values?.RaceDay_Takeaways[i]?.value + "</TAN></R>";
    }
    TakeAwayXMLData = "<D>" + TakeAwayXMLData + "</D>";

    return TakeAwayXMLData;
  };
  const convertToFacilityXML = (values) => {
    let FacilityXMLData = "";
    for (var i = 0; i < values?.RaceDay_Facilities.length; i++) {
      FacilityXMLData +=
        "<R><FN>" + values?.RaceDay_Facilities[i]?.value + "</FN></R>";
    }
    FacilityXMLData = "<D>" + FacilityXMLData + "</D>";

    return FacilityXMLData;
  };
  const submitDetailsForm = async (values) => {
    const reqdata = {
      Method_Name: "Update",
      Event_Id: decryptData(event_id),
      Event_Name: values?.Event_Name,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      XMLData: convertToXMLData(values),
      TakeAwayXMLData: convertToTakeawayXML(values),
      FacilityXMLData: convertToFacilityXML(values),
      QuestionXMLData: "",
      Event_Description: "",
      Rules_Regulations: "",
      Refund_Cancellation: "",
    };

    try {
      setSubmitForm(true);

      const result = await RestfullApiService(reqdata, "organizer/SaveEvent");
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
  async function LoadDetails() {
    const reqdata = {
      Method_Name: "Get_One",
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
      setFetchingDetails(true);
      const result = await RestfullApiService(reqdata, "organizer/GetEvent");
      if (result) {
        const result1 = result?.data?.Result?.Table1[0];

        setTimezoneDropdown(result?.data?.Result?.Table2);
        setEventTypeDropdown(result?.data?.Result?.Table3);
        setTakeawayDropdown(result?.data?.Result?.Table6);
        setFacilityDropdown(result?.data?.Result?.Table7);
        setInitialValues({
          Event_Name: result1?.Event_Name,
          EventType_Id: result?.data?.Result?.Table3?.filter(
            (type) => type.value === result1?.EventType_Id
          )[0],
          RaceDay_Takeaways: result?.data?.Result?.Table4,
          RaceDay_Facilities: result?.data?.Result?.Table5,
          Pincode: {
            label: result1?.Pincode,
            value: result1?.Pincode_Id,
          },
          Country: { label: "India", value: "India" },
          State: result1?.State,
          City: result1?.City,
          Event_Venue: result1?.Event_Venue,
          Timezone: result?.data?.Result?.Table2?.filter(
            (type) => type.value === result1?.TimeZone_Id
          )[0],
          PGCharges_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.PGCharges_Flag
          )[0],
          PlatformFee_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.PlatformFee_Flag
          )[0],
          Is_Gst: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.Is_Gst
          )[0],
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingDetails(false);
    }
  }
  useEffect(() => {
    if (event_id) {
      LoadDetails();
    }
  }, [event_id]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {fetchingDetails ? (
        <div
          className="col-xl-12"
          style={{ position: "relative", height: "300px" }}
        >
          <Backdrop
            sx={{
              color: "#f05736",
              backgroundColor: "#fff",
              position: "absolute", // Make Backdrop absolute to the row div
              top: "50%", // Set the top position to 50%
              left: "50%", // Set the left position to 50%
              transform: "translate(-50%, -50%)", // Translate to center
              width: "100%",
              height: "100%",
              zIndex: 1, // Ensure it's above the content inside the row div
            }}
            open={fetchingDetails}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitDetailsForm(values);
          }}
        >
          {({ setFieldValue, setFieldTouched, values }) => (
            <Form>
              <div className="row y-gap-30 py-20">
                <div className="col-12 d-flex justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
                  >
                    <i className="far fa-edit text-16"></i>
                    Edit Details
                  </button>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event Name <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add event name"
                        name="Event_Name"
                      />
                    </div>
                    <ErrorMessage
                      name="Event_Name"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Event Type <sup className="asc">*</sup>
                    </label>
                    <Select
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={eventTypeDropdown}
                      value={values.EventType_Id}
                      onChange={(value) => setFieldValue("EventType_Id", value)}
                    />
                    <ErrorMessage
                      name="EventType_Id"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Time Zone <sup className="asc">*</sup>
                    </label>
                    <Select
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={timezoneDropdown}
                      value={values.Timezone}
                      onChange={(value) => setFieldValue("Timezone", value)}
                    />
                    <ErrorMessage
                      name="Timezone"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Race Day takeaways <sup className="asc">*</sup>
                    </label>
                    <CreatableSelect
                      isMulti
                      styles={{
                        ...selectCustomStyle,
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "4px",
                          backgroundColor: "#fff9e1",
                          color: "#000",
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          padding: "0px 8px 0px 8px",
                        }),
                      }}
                      options={takeawayDropdown}
                      value={values.RaceDay_Takeaways}
                      onChange={(value) =>
                        setFieldValue("RaceDay_Takeaways", value)
                      }
                    />
                    <ErrorMessage
                      name="RaceDay_Takeaways"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Race Day facilities <sup className="asc">*</sup>
                    </label>
                    <CreatableSelect
                      isMulti
                      styles={{
                        ...selectCustomStyle,
                        multiValue: (base) => ({
                          ...base,
                          borderRadius: "4px",
                          backgroundColor: "#fff9e1",
                          color: "#000",
                        }),
                      }}
                      options={facilityDropdown}
                      value={values.RaceDay_Facilities}
                      onChange={(value) => {
                        console.log(value);
                        setFieldValue("RaceDay_Facilities", value);
                      }}
                    />
                    <ErrorMessage
                      name="RaceDay_Facilities"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Pincode <sup className="asc">*</sup>
                    </label>
                    <AsyncSelect
                      name="Pincode"
                      className="select-color"
                      placeholder="Pincode"
                      cacheOptions
                      loadOptions={fetchOptions}
                      styles={selectCustomStyle}
                      onChange={(e) => {
                        setFieldValue("Pincode", e);
                        if (e === null || e === undefined) {
                          // Run your custom function here
                          setFieldValue("State", "");
                          setFieldValue("City", "");
                          setFieldValue("Event_Venue", "");
                          setTimeout(() => {
                            setFieldTouched("State", true);
                            setFieldTouched("City", true);
                            setFieldTouched("Event_Venue", true);
                          });
                        } else {
                          console.log(e);
                          if (e) {
                            fetchLocation(
                              e.value,
                              setFieldValue,
                              setFieldTouched
                            );
                          }
                        }
                      }}
                      value={values?.Pincode}
                      isClearable
                    />
                    <ErrorMessage
                      name="Pincode"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Country <sup className="asc">*</sup>
                    </label>
                    <Select
                      isSearchable={false}
                      isDisabled={true}
                      styles={selectCustomStyle}
                      options={[
                        {
                          value: "India",
                          label: "India",
                        },
                      ]}
                      value={{
                        value: "India",
                        label: "India",
                      }}
                      onChange={(value) => setFieldValue("Country", value)}
                    />
                    <ErrorMessage
                      name="Country"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event State <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="State"
                        name="State"
                      />
                    </div>
                    <ErrorMessage
                      name="State"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event City <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="City"
                      />
                    </div>
                    <ErrorMessage
                      name="City"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event Venue <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add full address"
                        name="Event_Venue"
                      />
                    </div>
                    <ErrorMessage
                      name="Event_Venue"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-12">
                  <div
                    style={{
                      border: "1.5px dashed #E9E9E9",
                    }}
                  ></div>
                </div>

                <div className="col-md-4">
                  <div className="y-gap-10">
                    <label className="text-13 fw-600">GST Payable by?</label>

                    <Select
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={chargesDropdown}
                      value={values.Is_Gst}
                      onChange={(value) => setFieldValue("Is_Gst", value)}
                    />

                    <ErrorMessage
                      name="Is_Gst"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                {/* <div className="col-md-4">
                  <div className="single-field y-gap-20">
                    <label className="text-14 text-primary fw-600">
                      View Details
                    </label>
                  </div>
                </div> */}

                {/* <div className="col-md-8"></div> */}

                <div className="col-md-4">
                  <div className="y-gap-10">
                    <label className="text-13 fw-600">
                      Platform Fees Payable by?
                    </label>

                    <Select
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={chargesDropdown}
                      value={values.PlatformFee_Flag}
                      onChange={(value) =>
                        setFieldValue("PlatformFee_Flag", value)
                      }
                    />

                    <ErrorMessage
                      name="PlatformFee_Flag"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="y-gap-10">
                    <label className="text-13 fw-600">
                      Gateway Fees Payable by?
                    </label>

                    <Select
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={chargesDropdown}
                      value={values.PGCharges_Flag}
                      onChange={(value) =>
                        setFieldValue("PGCharges_Flag", value)
                      }
                    />

                    <ErrorMessage
                      name="PlatformFee_Flag"
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

export default EventDetails;
