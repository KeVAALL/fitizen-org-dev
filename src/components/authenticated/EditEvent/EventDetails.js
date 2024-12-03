// React imports
import React, { useEffect, useState } from "react";

// Third-party imports
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// Project imports
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import { setSelectedCategory } from "../../../redux/slices/categorySlice";
import {
  EventDetailTableCell,
  StyledTableCell,
} from "../../../utils/ReactTable";
import { decryptData } from "../../../utils/DataEncryption";
import { HtmlLightTooltip } from "../../../utils/Tooltip";
import { RestfulApiService } from "../../../config/service";

// MUI imports
import Loader from "../../../utils/BackdropLoader";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";

function EventDetails() {
  const { event_id } = useParams();
  const [newEventName, setNewEventName] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [eventTypeDropdown, setEventTypeDropdown] = useState([]);
  const [takeawayDropdown, setTakeawayDropdown] = useState([]);
  const [contactUserDropdown, setContactUserDropdown] = useState([]);
  const [facilityDropdown, setFacilityDropdown] = useState([]);
  const [timezoneDropdown, setTimezoneDropdown] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const initialFormValues = {
    Event_Name: "",
    EventType_Id: null,
    RaceDay_Takeaways: [],
    RaceDay_Facilities: [],
    Pincode: null,
    Country: null,
    Contact_User_Id: null,
    State: "",
    City: "",
    Event_Venue: "",
    Is_External_Event: 0,
    Is_Private_Event: 0,
    External_Event_Url: "",
    Timezone: null,
    Is_Gst: {
      label: "None",
      value: "0",
    },
    GSTCalc_Type: {
      label: "Percent Based",
      value: "Percent",
    },
    GSTCalc_Amount: 0,
    PGCharges_Flag: {
      label: "None",
      value: "0",
    },
    PlatformFee_Type: {
      label: "Percent Based",
      value: "Percent",
    },
    PlatformFee_Value: 0,
    PlatformFee_Flag: {
      label: "None",
      value: "0",
    },
    PGCharges_Type: {
      label: "Percent Based",
      value: "Percent",
    },
    PGCharges_Value: 0,
    ConvenienceFee1_Flag: {
      label: "None",
      value: "0",
    },
    ConvenienceFee1_Type: {
      label: "Percent Based",
      value: "Percent",
    },
    ConvenienceFee1_Value: 0,
    ConvenienceFee2_Flag: {
      label: "None",
      value: "0",
    },
    ConvenienceFee2_Type: {
      label: "Percent Based",
      value: "Percent",
    },
    ConvenienceFee2_Value: 0,
  };
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
  const calculationTypeDropdown = [
    {
      label: "Amount Based",
      value: "Amount",
    },
    {
      label: "Percent Based",
      value: "Percent",
    },
  ];
  // Validation schema
  const validationSchema = Yup.object({
    Event_Name: Yup.string().required("Event Name is required"),
    EventType_Id: Yup.object().required("Event Type is required"),
    RaceDay_Takeaways: Yup.array(),
    RaceDay_Facilities: Yup.array(),
    Pincode: Yup.object().required("Pincode is required"),
    Contact_User_Id: Yup.object().required("Contact Person is required"),
    Country: Yup.object().required("Country is required"),
    State: Yup.string().required("State is required"),
    City: Yup.string().required("City is required"),
    Event_Venue: Yup.string().required("Event Venue is required"),
    Is_External_Event: Yup.number(),
    Is_Private_Event: Yup.number(),
    External_Event_Url: Yup.string().when("Is_External_Event", {
      is: (value) => value === 1,
      then: () =>
        Yup.string()
          .url("Enter a valid URL")
          .required("External URL is required"),
      otherwise: () => Yup.string().notRequired().nullable(),
    }),
    Timezone: Yup.object().required("Timezone is required"),
    Is_Gst: Yup.object().required("GST is required"),
    GSTCalc_Type: Yup.object().required("Please select calculation type"),
    GSTCalc_Amount: Yup.number().required("GST Amount is required"),
    PlatformFee_Flag: Yup.object().required("Platform Fee is required"),
    PlatformFee_Type: Yup.object().required("Please select calculation type"),
    PlatformFee_Value: Yup.number().required("Platform Fee Amount is required"),
    PGCharges_Flag: Yup.object().required("PG Charges is required"),
    PGCharges_Type: Yup.object().required("Please select calculation type"),
    PGCharges_Value: Yup.number().required("PG Amount is required"),
    ConvenienceFee1_Flag: Yup.object().required("Convenience Fee is required"),
    ConvenienceFee1_Type: Yup.object().required(
      "Please select calculation type"
    ),
    ConvenienceFee1_Value: Yup.number().required(
      "Participant Convenience Fee is required"
    ),
    ConvenienceFee2_Flag: Yup.object().required("Convenience Fee is required"),
    ConvenienceFee2_Type: Yup.object().required(
      "Please select calculation type"
    ),
    ConvenienceFee2_Value: Yup.number().required(
      "Organizer Convenience Fee is required"
    ),
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
      const response = await RestfulApiService(reqdata, "master/Getdropdown");

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
      const response = await RestfulApiService(reqdata, "master/Getdropdown");

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
      values?.Pincode.label.split("-")[0] +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>State</FN><FV>" + values?.State + "</FV><FT>Text</FT></R>";
    XMLData += "<R><FN>City</FN><FV>" + values?.City + "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>TimeZone_Id</FN><FV>" +
      values?.Timezone.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Contact_User_Id</FN><FV>" +
      values?.Contact_User_Id.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Event_Venue</FN><FV>" +
      values?.Event_Venue +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Is_External_Event</FN><FV>" +
      values?.Is_External_Event +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>External_Event_Url</FN><FV>" +
      values?.External_Event_Url +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Is_Private_Event</FN><FV>" +
      values?.Is_Private_Event +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>Is_Gst</FN><FV>" +
      values?.Is_Gst.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>GSTCalc_Type</FN><FV>" +
      values?.GSTCalc_Type.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>GSTCalc_Amount</FN><FV>" +
      values?.GSTCalc_Amount +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PlatformFee_Flag</FN><FV>" +
      values?.PlatformFee_Flag.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PlatformFee_Type</FN><FV>" +
      values?.PlatformFee_Type.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PlatformFee_Value</FN><FV>" +
      values?.PlatformFee_Value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PGCharges_Flag</FN><FV>" +
      values?.PGCharges_Flag.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PGCharges_Type</FN><FV>" +
      values?.PGCharges_Type.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>PGCharges_Value</FN><FV>" +
      values?.PGCharges_Value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee1_Flag</FN><FV>" +
      values?.ConvenienceFee1_Flag.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee1_Type</FN><FV>" +
      values?.ConvenienceFee1_Type.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee1_Value</FN><FV>" +
      values?.ConvenienceFee1_Value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee2_Flag</FN><FV>" +
      values?.ConvenienceFee2_Flag.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee2_Type</FN><FV>" +
      values?.ConvenienceFee2_Type.value +
      "</FV><FT>Text</FT></R>";
    XMLData +=
      "<R><FN>ConvenienceFee2_Value</FN><FV>" +
      values?.ConvenienceFee2_Value +
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
      TakeAwayXMLData:
        values?.RaceDay_Takeaways?.length > 0
          ? convertToTakeawayXML(values)
          : "",
      FacilityXMLData:
        values?.RaceDay_Facilities?.length > 0
          ? convertToFacilityXML(values)
          : "",
      QuestionXMLData: "",
      Event_Description: "",
      Rules_Regulations: "",
      Refund_Cancellation: "",
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
        const apiResponse = {
          categorySelected: values?.EventType_Id,
        };
        dispatch(setSelectedCategory(apiResponse));
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
      const result = await RestfulApiService(reqdata, "organizer/GetEvent");
      if (result) {
        const result1 = result?.data?.Result?.Table1[0];
        const apiResponse = {
          categorySelected: result?.data?.Result?.Table3?.filter(
            (type) => type.value === result1?.EventType_Id
          )[0],
        };
        dispatch(setSelectedCategory(apiResponse));
        setTimezoneDropdown(result?.data?.Result?.Table2);
        setEventTypeDropdown(result?.data?.Result?.Table3);
        setTakeawayDropdown(result?.data?.Result?.Table6);
        setFacilityDropdown(result?.data?.Result?.Table7);
        setContactUserDropdown(result?.data?.Result?.Table8);
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
          Contact_User_Id: result?.data?.Result?.Table8?.filter(
            (type) => type.value === result1?.Contact_User_Id
          )[0],
          Country: { label: "India", value: "India" },
          State: result1?.State,
          City: result1?.City,
          Event_Venue: result1?.Event_Venue,
          Is_External_Event: result1?.Is_External_Event,
          External_Event_Url: result1?.External_Event_Url,
          Is_Private_Event: result1?.Is_Private_Event,
          Timezone: result?.data?.Result?.Table2?.filter(
            (type) => type.value === result1?.TimeZone_Id
          )[0],
          Is_Gst: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.Is_Gst
          )[0],
          GSTCalc_Type: calculationTypeDropdown?.filter(
            (c) => c.value === result1?.GSTCalc_Type
          )[0],
          PlatformFee_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.PlatformFee_Flag
          )[0],
          PlatformFee_Type: calculationTypeDropdown?.filter(
            (c) => c.value === result1?.PlatformFee_Type
          )[0],
          PGCharges_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.PGCharges_Flag
          )[0],
          PGCharges_Type: calculationTypeDropdown?.filter(
            (c) => c.value === result1?.PGCharges_Type
          )[0],
          ConvenienceFee1_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.ConvenienceFee1_Flag
          )[0],
          ConvenienceFee1_Type: calculationTypeDropdown?.filter(
            (c) => c.value === result1?.ConvenienceFee1_Type
          )[0],
          ConvenienceFee2_Flag: chargesDropdown?.filter(
            (c) => Number(c.value) === result1?.ConvenienceFee2_Flag
          )[0],
          ConvenienceFee2_Type: calculationTypeDropdown?.filter(
            (c) => c.value === result1?.ConvenienceFee2_Type
          )[0],
          GSTCalc_Amount: result1?.GSTCalc_Amount ? result1?.GSTCalc_Amount : 0,
          PlatformFee_Value: result1?.PlatformFee_Value
            ? result1?.PlatformFee_Value
            : 0,
          PGCharges_Value: result1?.PGCharges_Value
            ? result1?.PGCharges_Value
            : 0,
          ConvenienceFee1_Value: result1?.ConvenienceFee1_Value
            ? result1?.ConvenienceFee1_Value
            : 0,
          ConvenienceFee2_Value: result1?.ConvenienceFee2_Value
            ? result1?.ConvenienceFee2_Value
            : 0,
        });
        setNewEventName(result1.Event_Name);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingDetails(false);
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    if (event_id) {
      LoadDetails();
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
            Edit Details
          </button>
        </div>
      ) : (
        <></>
      )}
      {fetchingDetails ? (
        <Loader fetching={fetchingDetails} />
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitDetailsForm(values);
          }}
        >
          {({ setFieldValue, setFieldTouched, values }) => (
            <Form>
              <div className="row y-gap-30 py-20">
                <div className="col-lg-12 col-md-12">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event Name <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        disabled={!isEditing}
                        type="text"
                        className="form-control"
                        placeholder="Add event name"
                        name="Event_Name"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          const regex = /^[^\s].*$/;

                          if (
                            !value ||
                            (regex.test(value.toString()) && value.length <= 50)
                          ) {
                            setFieldValue("Event_Name", value);
                          } else {
                            return;
                          }
                        }}
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
                      isDisabled={!isEditing}
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
                      isDisabled={!isEditing}
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
                      Race Day Takeaways{" "}
                      <HtmlLightTooltip
                        arrow
                        title="You can create new takeaways and select multiple options"
                        placement="right"
                      >
                        <InfoOutlinedIcon
                          style={{
                            fontSize: "20px",
                            marginLeft: "4px",
                            marginBottom: "4px",
                          }}
                        />
                      </HtmlLightTooltip>
                    </label>
                    <CreatableSelect
                      isMulti
                      isDisabled={!isEditing}
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
                          fontSize: "80%",
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
                      Race Day facilities
                    </label>
                    <CreatableSelect
                      isDisabled={!isEditing}
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
                          fontSize: "80%",
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

                <div className="col-lg-12 col-md-12">
                  <div className="single-field y-gap-10">
                    <label className="text-13 fw-500">
                      Event Venue <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        disabled={!isEditing}
                        type="text"
                        className="form-control"
                        placeholder="Add full address"
                        name="Event_Venue"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          const regex = /^[^\s].*$/;

                          if (
                            !value ||
                            (regex.test(value.toString()) &&
                              value.length <= 500)
                          ) {
                            setFieldValue("Event_Venue", value);
                          } else {
                            return;
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="Event_Venue"
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
                      isDisabled={!isEditing}
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
                        disabled={!isEditing}
                        type="text"
                        className="form-control"
                        placeholder="State"
                        name="State"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          const regex = /^[^\s].*$/;

                          if (
                            !value ||
                            (regex.test(value.toString()) &&
                              value.length <= 100)
                          ) {
                            setFieldValue("State", value);
                          } else {
                            return;
                          }
                        }}
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
                        disabled={!isEditing}
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="City"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          const regex = /^[^\s].*$/;

                          if (
                            !value ||
                            (regex.test(value.toString()) &&
                              value.length <= 100)
                          ) {
                            setFieldValue("City", value);
                          } else {
                            return;
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="City"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Contact Person <sup className="asc">*</sup>
                    </label>
                    <Select
                      isDisabled={!isEditing}
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={contactUserDropdown}
                      value={values.Contact_User_Id}
                      onChange={(value) =>
                        setFieldValue("Contact_User_Id", value)
                      }
                    />
                    <ErrorMessage
                      name="Contact_User_Id"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6"></div>

                <div className="col-lg-3 col-md-3 d-flex items-center">
                  <div className="d-flex items-center gap-15">
                    <Checkbox
                      disabled={!isEditing}
                      checked={values.Is_External_Event}
                      onChange={(e) => {
                        e.stopPropagation();
                        setFieldValue(
                          "Is_External_Event",
                          Number(e.target.checked)
                        );
                        if (!e.target.checked) {
                          setFieldValue("External_Event_Url", "");
                          setFieldTouched("External_Event_Url", false, false);
                        }
                      }}
                    />
                    <label className="text-14 fw-500">External Event</label>
                  </div>
                </div>

                <div className="col-lg-3 col-md-3 d-flex items-center">
                  <div className="d-flex items-center gap-15">
                    <Checkbox
                      disabled={!isEditing}
                      checked={values.Is_Private_Event}
                      onChange={(e) => {
                        e.stopPropagation();
                        setFieldValue(
                          "Is_Private_Event",
                          Number(e.target.checked)
                        );
                      }}
                    />
                    <label className="text-14 fw-500">Is Private event?</label>
                  </div>
                </div>

                {values.Is_External_Event ? (
                  <div className="col-lg-6 col-md-6">
                    <div className="single-field y-gap-10">
                      <label className="text-13 fw-500">
                        External URL <sup className="asc">*</sup>
                      </label>
                      <div className="form-control">
                        <Field
                          disabled={!isEditing}
                          type="text"
                          className="form-control"
                          placeholder="External URL"
                          name="External_Event_Url"
                          onChange={(e) => {
                            e.preventDefault();
                            const { value } = e.target;

                            const regex = /^[^\s].*$/;

                            if (
                              !value ||
                              (regex.test(value.toString()) &&
                                value.length <= 300)
                            ) {
                              setFieldValue("External_Event_Url", value);
                            } else {
                              return;
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="External_Event_Url"
                        component="div"
                        className="text-error-2 text-13"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div class="col-12">
                  <div
                    style={{
                      border: "1.5px dashed #E9E9E9",
                    }}
                  ></div>
                </div>

                <div className="col-12">
                  <Box
                    sx={{
                      width: "100%",
                      overflow: "visible",
                      display: "block",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>
                            Pricing Element Name
                          </StyledTableCell>
                          <StyledTableCell>To be paid by</StyledTableCell>
                          <StyledTableCell>Calculation Type</StyledTableCell>
                          <StyledTableCell>Value</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="table_body_main">
                        <TableRow>
                          <EventDetailTableCell className="text-14 text-black">
                            GST
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <Box className="h-full">
                              <div>
                                <Select
                                  isDisabled={!isEditing}
                                  isSearchable={false}
                                  styles={selectCustomStyle}
                                  options={chargesDropdown}
                                  value={values.Is_Gst}
                                  onChange={(value) =>
                                    setFieldValue("Is_Gst", value)
                                  }
                                />

                                <ErrorMessage
                                  name="Is_Gst"
                                  component="div"
                                  className="text-error-2 text-13 mt-10"
                                />
                              </div>
                            </Box>
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                // isDisabled={!isEditing}
                                isDisabled={true}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={calculationTypeDropdown}
                                value={values.GSTCalc_Type}
                                onChange={(value) =>
                                  setFieldValue("GSTCalc_Type", value)
                                }
                              />
                              <ErrorMessage
                                name="GSTCalc_Type"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>

                          <EventDetailTableCell>
                            <div class="single-field">
                              <div class="form-control">
                                <Field
                                  // disabled={!isEditing}
                                  disabled={true}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Value"
                                  name="GSTCalc_Amount"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "GSTCalc_Amount",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="GSTCalc_Amount"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                        </TableRow>
                        <TableRow>
                          <EventDetailTableCell className="text-14 text-black">
                            Platform Fees
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <Box className="h-full">
                              <div>
                                <Select
                                  isDisabled={!isEditing}
                                  isSearchable={false}
                                  styles={selectCustomStyle}
                                  options={chargesDropdown}
                                  value={values.PlatformFee_Flag}
                                  onChange={(value) => {
                                    setFieldValue("PlatformFee_Flag", value);
                                    if (value.value === "0") {
                                      setFieldValue("PlatformFee_Value", 0);
                                    }
                                  }}
                                />

                                <ErrorMessage
                                  name="PlatformFee_Flag"
                                  component="div"
                                  className="text-error-2 text-13 mt-10"
                                />
                              </div>
                            </Box>
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={calculationTypeDropdown}
                                value={values.PlatformFee_Type}
                                onChange={(value) =>
                                  setFieldValue("PlatformFee_Type", value)
                                }
                              />
                              <ErrorMessage
                                name="PlatformFee_Type"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>

                          <EventDetailTableCell>
                            <div class="single-field">
                              <div class="form-control">
                                <Field
                                  disabled={!isEditing}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Value"
                                  name="PlatformFee_Value"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "PlatformFee_Value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="PlatformFee_Value"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                        </TableRow>
                        <TableRow>
                          <EventDetailTableCell className="text-14 text-black">
                            Convenience Fees (Participant)
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={chargesDropdown}
                                value={values.ConvenienceFee1_Flag}
                                onChange={(value) => {
                                  setFieldValue("ConvenienceFee1_Flag", value);
                                  if (value.value === "0") {
                                    setFieldValue("ConvenienceFee1_Value", 0);
                                  }
                                }}
                              />

                              <ErrorMessage
                                name="ConvenienceFee1_Flag"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={calculationTypeDropdown}
                                value={values.ConvenienceFee1_Type}
                                onChange={(value) =>
                                  setFieldValue("ConvenienceFee1_Type", value)
                                }
                              />
                              <ErrorMessage
                                name="ConvenienceFee1_Type"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>

                          <EventDetailTableCell>
                            <div class="single-field">
                              <div class="form-control">
                                <Field
                                  disabled={!isEditing}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Value"
                                  name="ConvenienceFee1_Value"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "ConvenienceFee1_Value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="ConvenienceFee1_Value"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                        </TableRow>
                        <TableRow>
                          <EventDetailTableCell className="text-14 text-black">
                            Convenience Fees (Organizer)
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={chargesDropdown}
                                value={values.ConvenienceFee2_Flag}
                                onChange={(value) => {
                                  setFieldValue("ConvenienceFee2_Flag", value);
                                  if (value.value === "0") {
                                    setFieldValue("ConvenienceFee2_Value", 0);
                                  }
                                }}
                              />

                              <ErrorMessage
                                name="ConvenienceFee2_Flag"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={calculationTypeDropdown}
                                value={values.ConvenienceFee2_Type}
                                onChange={(value) =>
                                  setFieldValue("ConvenienceFee2_Type", value)
                                }
                              />
                              <ErrorMessage
                                name="ConvenienceFee2_Type"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>

                          <EventDetailTableCell>
                            <div class="single-field">
                              <div class="form-control">
                                <Field
                                  disabled={!isEditing}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Value"
                                  name="ConvenienceFee2_Value"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "ConvenienceFee2_Value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="ConvenienceFee2_Value"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                        </TableRow>
                        <TableRow>
                          <EventDetailTableCell className="text-14 text-black">
                            Payment Gateway Charges
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={chargesDropdown}
                                value={values.PGCharges_Flag}
                                onChange={(value) => {
                                  setFieldValue("PGCharges_Flag", value);
                                  if (value.value === "0") {
                                    setFieldValue("PGCharges_Value", 0);
                                  }
                                }}
                              />

                              <ErrorMessage
                                name="PGCharges_Flag"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                          <EventDetailTableCell>
                            <div>
                              <Select
                                isDisabled={!isEditing}
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={calculationTypeDropdown}
                                value={values.PGCharges_Type}
                                onChange={(value) =>
                                  setFieldValue("PGCharges_Type", value)
                                }
                              />
                              <ErrorMessage
                                name="PGCharges_Type"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>

                          <EventDetailTableCell>
                            <div class="single-field">
                              <div class="form-control">
                                <Field
                                  disabled={!isEditing}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Value"
                                  name="PGCharges_Value"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "PGCharges_Value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="PGCharges_Value"
                                component="div"
                                className="text-error-2 text-13 mt-10"
                              />
                            </div>
                          </EventDetailTableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </div>

                <div className="col-12 d-flex justify-end">
                  <div className="row">
                    <div className="col-auto relative">
                      <button
                        disabled={submitForm}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const baseUrl = window.location.href.includes(
                              "uatorganizer"
                            )
                              ? "https://uat.fitizenindia.com"
                              : "https://fitizenindia.com";

                            const formattedEventName = newEventName
                              .split(" ")
                              .join("-");
                            const eventUrl = `${baseUrl}/event-details/${formattedEventName}/${event_id}`;

                            await navigator.clipboard.writeText(eventUrl);
                            toast.success("Link copied to clipboard!");
                          } catch (error) {
                            toast.error("Failed to copy link.");
                          }
                        }}
                        className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary text-12"
                      >
                        Copy Link
                      </button>
                    </div>
                    {isEditing && (
                      <>
                        <div className="col-auto relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditing(false);
                              LoadDetails();
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
                      </>
                    )}
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

export default EventDetails;
