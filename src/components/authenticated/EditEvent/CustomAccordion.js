import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Select from "react-select";
import {
  disabledCustomStyle,
  selectCustomStyle,
} from "../../../utils/ReactSelectStyles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import * as Yup from "yup";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { timePlaceholder } from "../../../utils/UtilityFunctions";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CustomAccordion = ({
  id,
  category,
  raceDistanceCategory,
  LoadCategory,
  isOneAccordionOpen,
  setIsOneAccordionOpen,
  handleNewItemDelete,
  handleNewItemSubmit,
}) => {
  console.log(category);
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const accordionRef = useRef(null);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingRoute, setUploadingRoute] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventCategoryName, setEventCategoryName] = useState("");
  const [submitForm, setSubmitForm] = useState(false);

  const raceDistanceUnitDropdown = [
    {
      label: "KM",
      value: "KM",
    },
    {
      label: "Meter",
      value: "Meter",
    },
    {
      label: "Miles",
      value: "Miles",
    },
  ];
  const timedEventDropdown = [
    {
      label: "Timed",
      value: "Timed",
    },
    {
      label: "Non-Timed",
      value: "Non-Timed",
    },
  ];
  const timedLimitDropdown = [
    {
      label: "Sec",
      value: "Sec",
    },
    {
      label: "Mins",
      value: "Mins",
    },
    {
      label: "Hours",
      value: "Hours",
    },
  ];
  const initialValues = {
    EventCategory_Name: "",
    EventCategory_Id: null,
    Race_Distance: "",
    Race_Distance_Unit: {
      label: "KM",
      value: "KM",
    },
    Timed_Event: {
      label: "Timed",
      value: "Timed",
    },
    Time_Limit: "",
    Time_Limit_Unit: {
      label: "Mins",
      value: "Mins",
    },
    Ticket_Sale_Start_Date: null,
    Ticket_Sale_Start_Time: null,
    Ticket_Sale_End_Date: null,
    Ticket_Sale_End_Time: null,
    Is_PriceMoneyAwarded: "", // Assuming 0 for boolean fields
    Eligibility_Criteria_MinYear: "",
    Eligibility_Criteria_MaxYear: "",
    Is_Paid_Event: "", // Assuming 0 for boolean fields
    Number_Of_Tickets: "",
    BIB_Number: "",
    Event_Price: 0,
    Event_Start_Date: null,
    Event_Start_Time: null,
    Event_End_Date: null,
    Event_End_Time: null,
    Event_Prize: "",
    // Image_Path: "",
    Image_Name: "",
    isNew: category.isNew,
  };
  const [formValues, setFormValues] = useState(initialValues);
  const validationSchema = Yup.object(
    {
      BIB_Number: Yup.number()
        .typeError("BIB Number must be a valid number")
        .nullable(),
      // .required("BIB Number is required")
      EventCategory_Name: Yup.string().nullable(),
      //   .required(
      //   "Event Category Name is required"
      // ),
      EventCategory_Id: Yup.object().required("Event Category is required"),
      Race_Distance: Yup.string().when("EventCategory_Id", {
        is: (value) => value?.value === "C007003",
        then: () => Yup.string().required("Race Distance is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      Race_Distance_Unit: Yup.object().when("EventCategory_Id", {
        is: (value) => value?.value === "C007003",
        then: () => Yup.object().required("Unit is required"),
        otherwise: () => Yup.object().nullable(),
      }),
      Timed_Event: Yup.object().required("Timing is required"),
      Time_Limit: Yup.string().required("Cut off time is required"),
      Time_Limit_Unit: Yup.object().required("Time Limit Unit is required"),
      Number_Of_Tickets: Yup.number()
        .min(0, "Number of Tickets should not be less than 0")
        .required("Number of Tickets is required"),
      Eligibility_Criteria_MinYear: Yup.number()
        .min(0, "Minimum eligibility year should not be less than 0")
        .required("Minimum eligibility year is required"),
      Eligibility_Criteria_MaxYear: Yup.number()
        .min(0, "Maximum eligibility year should not be less than 0")
        .moreThan(
          Yup.ref("Eligibility_Criteria_MinYear"),
          "Maximum eligibility year should be greater than minimum eligibility year"
        )
        .required("Maximum eligibility year is required"),
      Event_Start_Date: Yup.date()
        .required("Race start date is required")
        .test(
          "startDateBeforeEndDate",
          "Date must be before end date",
          function (value) {
            const { Event_End_Date } = this.parent;
            return dayjs(value).isSameOrBefore(Event_End_Date);
          }
        )
        .nullable(),
      Event_Start_Time: Yup.date().nullable(),
      // .required("Race start time is required")
      Event_End_Date: Yup.date()
        .required("Race end date is required")
        .test(
          "endDateAfterStartDate",
          "Date must be after start date",
          function (value) {
            const { Event_Start_Date } = this.parent;
            return dayjs(value).isSameOrAfter(Event_Start_Date);
          }
        )
        .nullable(),
      Event_End_Time: Yup.date().nullable(),
      // .required("Race end time is required")
      Is_PriceMoneyAwarded: Yup.string().required("Please select Yes or No"),
      Event_Prize: Yup.string().when("Is_PriceMoneyAwarded", {
        is: (value) => value === "Yes",
        then: () => Yup.string().required("Event Prize is required"),
        otherwise: () => Yup.string().notRequired().nullable(),
      }),
      Is_Paid_Event: Yup.string().required("Please select Paid or Free"),
      Event_Price: Yup.number().when("Is_Paid_Event", {
        is: (value) => value === "Paid",
        then: () =>
          Yup.number()
            .required("Event price is required")
            .min(1, "Price limit is not valid"),
        otherwise: () => Yup.number().nullable(),
      }),
      Ticket_Sale_Start_Date: Yup.date()
        .required("Ticket sale start date is required")
        .test(
          "saleStartBeforeEnd",
          "Date must be before sale end date",
          function (value) {
            const { Ticket_Sale_End_Date } = this.parent;
            return dayjs(value).isSameOrBefore(Ticket_Sale_End_Date);
          }
        )
        .test(
          "is-valid-sale-start-date",
          "Ticket Sale Start Date must be between today and Event start date",
          function (value) {
            const { Event_Start_Date } = this.parent;
            const currentDate = dayjs().startOf("day");
            const eventStartDate = dayjs(Event_Start_Date);

            return (
              value &&
              dayjs(value).isSameOrAfter(currentDate) &&
              dayjs(value).isSameOrBefore(eventStartDate)
            );
          }
        ),
      Ticket_Sale_Start_Time: Yup.date().nullable(),
      //   .required(
      //   "Ticket sale start time is required"
      // ),
      Ticket_Sale_End_Date: Yup.date()
        .required("Ticket sale end date is required")
        .test(
          "saleEndAfterStart",
          "Date must be after sale start date",
          function (value) {
            const { Ticket_Sale_Start_Date } = this.parent;
            return dayjs(value).isSameOrAfter(Ticket_Sale_Start_Date);
          }
        )
        .test(
          "is-valid-sale-start-date",
          "Ticket Sale End Date must be before Event start date",
          function (value) {
            const { Event_Start_Date } = this.parent;
            const currentDate = dayjs().startOf("day");
            const eventStartDate = dayjs(Event_Start_Date);

            return (
              value &&
              dayjs(value).isSameOrAfter(currentDate) &&
              dayjs(value).isSameOrBefore(eventStartDate)
            );
          }
        ),
      Ticket_Sale_End_Time: Yup.date().nullable(),
      //   .required(
      //   "Ticket sale end time is required"
      // ),
      Image_Name: Yup.string().nullable(),
      ImagePath: Yup.string().nullable(),
    },
    [
      ["Is_Paid_Event", "Event_Price"],
      ["Is_PriceMoneyAwarded", "Event_Prize"],
      ["EventCategory_Id", "Race_Distance"],
      ["EventCategory_Id", "Race_Distance_Unit"],
    ]
  );

  function formatRaceTiming(data) {
    const startDate = dayjs(data.Event_Start_Date).format("DD MMM YYYY");
    const startTime = data.Event_Start_Time
      ? dayjs(data.Event_Start_Time).format("HH:mm")
      : "00:00:00";
    const endDate = dayjs(data.Event_End_Date).format("DD MMM YYYY");
    const endTime = data.Event_End_Time
      ? dayjs(data.Event_End_Time).format("HH:mm")
      : "00:00:00";

    // Combine into the desired format
    return `${startDate} ${startTime} to ${endDate} ${endTime}`;
  }
  const combineDateAndTime = (dateString, timeString) => {
    if (!dateString || !timeString || timeString === "00:00") return null; // Return null if either value is missing

    const date = dayjs(dateString); // Parse the date
    const [hours, minutes, seconds = 0] = timeString.split(":").map(Number); // Split time into components, default seconds to 0

    return date
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", seconds); // Combine date and time
  };
  function convertToXML(data) {
    let XMLData = "";

    // Helper function to add an XML row
    const addRow = (fieldName, fieldValue, fieldType = "Text") => {
      XMLData += `<R><FN>${fieldName}</FN><FV>${fieldValue}</FV><FT>${fieldType}</FT></R>`;
    };

    // Adding rows based on the data
    addRow("Race_Distance", data.Race_Distance);
    addRow(
      "Race_Distance_Unit",
      data.EventCategory_Id.value === "C007003"
        ? data.Race_Distance_Unit?.value || data.Race_Distance_Unit
        : ""
    );
    addRow("Eligibility_Criteria_MinYear", data.Eligibility_Criteria_MinYear);
    addRow("Eligibility_Criteria_MaxYear", data.Eligibility_Criteria_MaxYear);
    addRow(
      "Eligibility_Criteria",
      `${data.Eligibility_Criteria_MinYear} to ${data.Eligibility_Criteria_MaxYear} Years`
    );
    addRow("Time_Limit", data.Time_Limit);
    addRow("Time_Limit_Unit", data.Time_Limit_Unit.value);
    addRow("Race_Timing", formatRaceTiming(data));
    addRow(
      "Event_Start_Date",
      `${dayjs(data.Event_Start_Date).format("YYYY-MM-DD")}T${
        data.Event_Start_Time
          ? dayjs(data.Event_Start_Time).format("HH:mm")
          : "00:00:00"
      }`
    );
    addRow(
      "Event_End_Date",
      `${dayjs(data.Event_End_Date).format("YYYY-MM-DD")}T${
        data.Event_End_Time
          ? dayjs(data.Event_End_Time).format("HH:mm")
          : "00:00:00"
      }`
    );
    addRow("Is_Paid_Event", data.Is_Paid_Event === "Paid" ? 1 : 0);
    addRow("Number_Of_Tickets", data.Number_Of_Tickets);
    addRow("BIB_Number", data.BIB_Number ? data.BIB_Number : 0);
    addRow("Event_Price", data.Event_Price);
    addRow(
      "Ticket_Sale_Start_Date",
      `${dayjs(data.Ticket_Sale_Start_Date).format("YYYY-MM-DD")}T${
        data.Ticket_Sale_Start_Time
          ? dayjs(data.Ticket_Sale_Start_Time).format("HH:mm")
          : "00:00:00"
      }`
    );
    addRow(
      "Ticket_Sale_End_Date",
      `${dayjs(data.Ticket_Sale_End_Date).format("YYYY-MM-DD")}T${
        data.Ticket_Sale_End_Time
          ? dayjs(data.Ticket_Sale_End_Time).format("HH:mm")
          : "00:00:00"
      }`
    );
    addRow("Is_PriceMoneyAwarded", data.Is_PriceMoneyAwarded === "Yes" ? 1 : 0);
    addRow("Is_Active", data.Is_Active ? data.Is_Active : 1);
    addRow("Timed_Event", data.Timed_Event?.value || data.Timed_Event);

    // Handle Pills_Name field
    const pillData = data.Timed_Event?.value || data.Timed_Event;
    addRow(
      "Pills_Name",
      `${
        data.EventCategory_Id.value === "C007003"
          ? `${data.Race_Distance}`
          : data.EventCategory_Id.label
      }${
        data.EventCategory_Id.value === "C007003" &&
        data.Race_Distance_Unit?.value
          ? ` ${data.Race_Distance_Unit?.value}`
          : data.EventCategory_Id.value === "C007003" && data.Race_Distance_Unit
          ? ` ${data.Race_Distance_Unit}`
          : ""
      } ${pillData}`
    );

    // Add the Is_Deleted field
    addRow("Is_Deleted", 0);

    // Wrap all the XML data in a root element
    XMLData = `<D>${XMLData}</D>`;

    return XMLData;
  }

  const submitCategoryForm = async (values) => {
    console.log(values);
    console.log(convertToXML(values));
    const reqdata = {
      Method_Name: values.isNew ? "Create" : "Update",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Id: decryptData(event_id),
      EventCategoryEntry_Id: values?.EventCategoryEntry_Id
        ? values?.EventCategoryEntry_Id
        : "",
      EventCategory_Id: values?.EventCategory_Id.value,
      EventCategory_Name: values?.EventCategory_Name,
      ImagePath: values?.ImagePath,
      ImageName: values?.Image_Name,
      XMLData: convertToXML(values),
      PrizeXMLData: values.Event_Prize,
      // PrizeXMLData:
      //   values.Event_Prize.length > 0
      //     ? convertPrizesToXML(values.Event_Prize)
      //     : "",
    };

    try {
      setSubmitForm(true);

      const result = await RestfulApiService(
        reqdata,
        "organizer/addupdatecategory"
      );
      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }
      if (result) {
        toast.dismiss();
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        console.log(values.isNew);
        // if (values.isNew) {
        //   handleNewItemSubmit(id);
        // }
        setAccordionOpen(false);
        setIsOneAccordionOpen("");
        LoadCategory();
        // setEventCategoryName(
        //   `${values.EventCategory_Id.value === "C007003" ? values.Race_Distance : values.EventCategory_Id.label} ${
        //     values.Race_Distance_Unit?.value || values.Race_Distance_Unit
        //   } ${values.Timed_Event?.value} ${values.EventCategory_Name}`
        // );
        // setAccordionOpen(false);
        // if (values.isNew) {
        //   setAccordionOpen(false)
        // }
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitForm(false);
    }
  };
  const handleEditClick = async (event, eventCategoryId) => {
    event.stopPropagation(); // Prevent accordion from toggling
    if (category.isNew) {
      setAccordionOpen(true);
      // scrollToAccordion();
      return;
    }

    const reqdata = {
      Method_Name: "Get_CategoryOne",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventCategoryEntry_Id: eventCategoryId,
    };
    try {
      setLoading(true);
      const result = await RestfulApiService(
        reqdata,
        "organizer/geteventcategory"
      );
      if (result) {
        const result1 = result?.data?.Result?.Table1?.[0];

        setFormValues({
          ...result1,
          EventCategory_Name: result1?.EventCategory_Name,
          EventCategory_Id: raceDistanceCategory?.filter(
            (cat) => cat.value === result1?.EventCategory_Id
          )[0],
          //   Race_Distance: result1?.Race_Distance,
          Race_Distance_Unit: result1?.Race_Distance_Unit
            ? raceDistanceUnitDropdown?.filter(
                (unit) => unit.value === result1?.Race_Distance_Unit
              )[0]
            : raceDistanceUnitDropdown[0],
          Timed_Event: timedEventDropdown?.filter(
            (t) => t.value === result1?.Timed_Event
          )[0],
          Time_Limit: result1.Time_Limit_Part,
          Time_Limit_Unit: timedLimitDropdown?.filter(
            (t) => t.value === result1?.Time_Limit_Unit
          )[0],
          Ticket_Sale_Start_Date: dayjs(result1?.Ticket_Sale_Start_Date),
          Ticket_Sale_Start_Time: combineDateAndTime(
            result1?.Ticket_Sale_Start_Date,
            result1?.Ticket_Sale_Start_Time
          ),
          Ticket_Sale_End_Date: dayjs(result1?.Ticket_Sale_End_Date),
          Ticket_Sale_End_Time: combineDateAndTime(
            result1?.Ticket_Sale_End_Date,
            result1?.Ticket_Sale_End_Time
          ),
          Is_PriceMoneyAwarded: result1?.Is_PriceMoneyAwarded ? "Yes" : "No", // Assuming 0 for boolean fields
          //   Eligibility_Criteria_MinYear: "",
          //   Eligibility_Criteria_MaxYear: "",
          Is_Paid_Event: result1?.Is_Paid_Event ? "Paid" : "Free", // Assuming 0 for boolean fields
          //   Number_Of_Tickets: "",
          //   BIB_Number: "",
          //   Event_Price: 0,
          Event_Start_Date: dayjs(result1?.Event_Start_Date),
          Event_Start_Time: combineDateAndTime(
            result1?.Event_Start_Date,
            result1?.Event_Start_Time
          ),
          Event_End_Date: dayjs(result1?.Event_End_Date),
          Event_End_Time: combineDateAndTime(
            result1?.Event_End_Date,
            result1?.Event_End_Time
          ),
          Event_Prize: result1?.Event_Prize,
          // Event_Prize: JSON.parse(result1?.Event_Prize)?.map((prize) => {
          //   return {
          //     ...prize,
          //     Gender: genderDropdown?.filter(
          //       (g) => g.value === prize.Gender
          //     )[0],
          //   };
          // }),
          ImagePath: result1?.Image_Path,
          Image_Name: result1?.Image_Name,
        });

        // setAccordionOpen(true);
        // scrollToAccordion();
        setIsOneAccordionOpen(eventCategoryId);
        setTimeout(() => {
          window.scrollBy(-500, -500);
          // window.scrollBy({
          //   top: -50, // Negative value to scroll up by 50px
          //   behavior: "smooth", // Optional: for smooth scrolling effect
          // });
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    if (category.isNew) {
      setAccordionOpen(false);
    } else {
      setIsEditing(false);
      setIsOneAccordionOpen("");
    }
    setFormValues(initialValues);
  };
  const handleDeleteClick = (event, eventCategoryId = "") => {
    event.stopPropagation(); // Prevent accordion from toggling
    // Perform delete action
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      preConfirm: async () => {
        // Show loading on the "Yes, delete it!" button
        Swal.showLoading();

        if (category.isNew) {
          handleNewItemDelete(id);
          return true;
        }

        const reqdata = {
          Method_Name: "Delete",
          Event_Id: decryptData(event_id),
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Org_Id: user?.Org_Id,
          EventCategoryEntry_Id: eventCategoryId,
        };

        try {
          // Make the API call
          const result = await RestfulApiService(
            reqdata,
            "organizer/addupdatecategory"
          );

          if (result) {
            // Assuming the API response includes a 'success' field
            // Return true if the API call is successful
            return true;
          } else {
            // If the API response indicates failure, show a validation message
            Swal.showValidationMessage("Failed to delete the review.");
            return false;
          }
        } catch (error) {
          // If an error occurs, show an error message
          Swal.showValidationMessage("Request failed: " + error);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Show the success message after the deletion is confirmed
        Swal.fire({
          title: "Deleted!",
          text: "Category has been deleted.",
          icon: "success",
        });
        LoadCategory();
        // if (category.isNew) {
        //   return;
        // }
      }
    });
  };
  useEffect(() => {
    if (category.isNew) {
      console.log(category);
      setAccordionOpen(true);
    }
  }, [category]);

  return (
    <Accordion
      className="event-category-accordion"
      sx={{
        borderRadius: 0, // Remove border radius
        "&:before": {
          display: "none", // Remove default MUI border line
        },
        boxShadow: "none", // Remove default box shadow
      }}
      // expanded={isAccordionOpen}
      expanded={
        category.isNew
          ? isAccordionOpen
          : isOneAccordionOpen === category?.EventCategoryEntry_Id
      }
      // onChange={() => setAccordionOpen(!isAccordionOpen)}
      // onChange={() => setAccordionOpen(!isAccordionOpen)}
    >
      <AccordionSummary
        style={{
          backgroundColor: "#FFF5F3", // Set the background color
          borderRight: "1px solid #FFF5F3",
          borderLeft: "1px solid #FFF5F3",
          borderBottom: "1px solid #FFF5F3",
        }}
        sx={{
          pointerEvents: "none",
        }}
        expandIcon={
          <div style={{ display: "flex", gap: "8px" }}>
            {category?.isNew ? (
              <>
                {isAccordionOpen ? (
                  <IconButton
                    size="small"
                    style={{
                      backgroundColor: "#949494",
                      padding: "4px",
                      borderRadius: 0,
                      pointerEvents: "auto",
                      "&:hover": {
                        backgroundColor: "#f05736",
                      },
                    }}
                    onClick={handleCancelClick}
                  >
                    <ClearOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#949494",
                      padding: "4px",
                      borderRadius: 0,
                      pointerEvents: "auto",
                      "&:hover": {
                        backgroundColor: "#f05736",
                      },
                    }}
                    onClick={(e) => {
                      handleEditClick(e, "");
                    }}
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "#949494",
                    padding: "4px",
                    borderRadius: 0,
                    pointerEvents: "auto",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f05736",
                    },
                  }}
                  onClick={(e) => handleDeleteClick(e, "")}
                >
                  <DeleteOutlinedIcon
                    fontSize="inherit"
                    style={{
                      color: "#fff",
                    }}
                  />
                </IconButton>
              </>
            ) : (
              <>
                {isOneAccordionOpen === category.EventCategoryEntry_Id ? (
                  <IconButton
                    size="small"
                    style={{
                      backgroundColor: "#949494",
                      padding: "4px",
                      borderRadius: 0,
                      pointerEvents: "auto",
                      "&:hover": {
                        backgroundColor: "#f05736",
                      },
                    }}
                    onClick={handleCancelClick}
                  >
                    <ClearOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#949494",
                      padding: "4px",
                      borderRadius: 0,
                      pointerEvents: "auto",
                      "&:hover": {
                        backgroundColor: "#f05736",
                      },
                    }}
                    // onClick={handleEditClick}
                    // disabled={loading}
                    onClick={(e) => {
                      handleEditClick(e, category?.EventCategoryEntry_Id);
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        style={{ color: "#fff", height: "1em", width: "1em" }}
                      />
                    ) : (
                      <EditOutlinedIcon
                        fontSize="inherit"
                        style={{
                          color: "#fff",
                        }}
                      />
                    )}
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "#949494",
                    padding: "4px",
                    borderRadius: 0,
                    pointerEvents: "auto",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f05736",
                    },
                  }}
                  onClick={(e) =>
                    handleDeleteClick(e, category?.EventCategoryEntry_Id)
                  }
                >
                  <DeleteOutlinedIcon
                    fontSize="inherit"
                    style={{
                      color: "#fff",
                    }}
                  />
                </IconButton>
              </>
            )}
          </div>
        }
        IconButtonProps={{
          style: { transform: "none" }, // Prevent rotation of expand icon
        }}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="text-14 fw-500">
          {category?.EventCategory_Display_Name
            ? category?.EventCategory_Display_Name
            : "New Ticket"}
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderRight: "1px solid #dddddd",
          borderLeft: "1px solid #dddddd",
          borderBottom: "1px solid #dddddd",
        }}
      >
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitCategoryForm(values);
          }}
        >
          {({ values, setFieldValue, setFieldTouched, handleChange }) => (
            <Form>
              <div className="row y-gap-30 py-20">
                {!category.isNew &&
                  (!isEditing ? (
                    <div className="col-12 d-flex justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditing(true);
                          // if (isEditing) {
                          //   handleEditClick(e, values?.EventCategoryEntry_Id);
                          // }
                        }}
                        className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
                      >
                        <i className="far fa-edit text-16"></i>
                        {category.isNew ? "Add" : "Edit"} Ticket
                      </button>
                    </div>
                  ) : (
                    <></>
                  ))}
                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 fw-500">Event Category Name</label>
                    <div class="form-control">
                      <Field
                        ref={accordionRef}
                        disabled={category.isNew ? false : !isEditing}
                        type="text"
                        className="form-control"
                        placeholder="Add your category name"
                        name="EventCategory_Name"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          const regex = /^[^\s].*$/;

                          if (
                            !value ||
                            (regex.test(value.toString()) &&
                              value.length <= 200)
                          ) {
                            setFieldValue("EventCategory_Name", value);
                          } else {
                            return;
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="EventCategory_Name"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-6"></div>

                <div className="col-lg-3">
                  <div className="y-gap-10">
                    <label className="text-13 fw-500">
                      Race Distance <sup className="asc">*</sup>
                    </label>
                    <Select
                      isDisabled={category.isNew ? false : !isEditing}
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={raceDistanceCategory}
                      value={values.EventCategory_Id}
                      onChange={(value) => {
                        setFieldValue("EventCategory_Id", value);
                        if (value?.value !== "C007003") {
                          setFieldValue("Race_Distance", "");
                          // setFieldValue("Race_Distance_Unit", null);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="EventCategory_Id"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 text-white fw-500">
                      Race Distance 1
                    </label>
                    <div class="form-control">
                      <Field
                        disabled={
                          values.EventCategory_Id?.value !== "C007003" ||
                          !isEditing
                        }
                        type="text"
                        className="form-control"
                        placeholder="Enter Distance"
                        name="Race_Distance"
                      />
                    </div>
                    <ErrorMessage
                      name="Race_Distance"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="y-gap-10">
                    <label className="text-13 text-white fw-500">
                      Race Distance Unit
                    </label>
                    <Select
                      isDisabled={
                        values.EventCategory_Id?.value !== "C007003" ||
                        !isEditing
                      }
                      isSearchable={false}
                      placeholder="Select Unit"
                      styles={selectCustomStyle}
                      options={raceDistanceUnitDropdown}
                      value={values.Race_Distance_Unit}
                      onChange={(value) =>
                        setFieldValue("Race_Distance_Unit", value)
                      }
                    />
                    <ErrorMessage
                      name="Race_Distance_Unit"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="y-gap-10">
                    <label className="text-13 text-white fw-500">
                      Race Distance
                    </label>
                    <Select
                      isDisabled={category.isNew ? false : !isEditing}
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={timedEventDropdown}
                      value={values.Timed_Event}
                      onChange={(value) => setFieldValue("Timed_Event", value)}
                    />
                    <ErrorMessage
                      name="Timed_Event"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Cut off time <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        disabled={category.isNew ? false : !isEditing}
                        type="text"
                        className="form-control"
                        placeholder="Enter Time"
                        name="Time_Limit"
                        // onChange={(e) => {
                        //   e.preventDefault();
                        //   const { value } = e.target;

                        //   // const regex = /^\d+$/;
                        //   const regex = /^\S*$/;

                        //   if (
                        //     !value ||
                        //     (regex.test(value.toString()) &&
                        //       value.length <= 100)
                        //   ) {
                        //     setFieldValue("Time_Limit", value);
                        //   } else {
                        //     return;
                        //   }
                        // }}
                      />
                    </div>
                    <ErrorMessage
                      name="Time_Limit"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="y-gap-10">
                    <label className="text-13 text-white fw-500">
                      Cut off time
                    </label>
                    <Select
                      isDisabled={category.isNew ? false : !isEditing}
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={timedLimitDropdown}
                      value={values.Time_Limit_Unit}
                      onChange={(value) =>
                        setFieldValue("Time_Limit_Unit", value)
                      }
                    />
                    <ErrorMessage
                      name="Time_Limit_Unit"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-6"></div>

                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Race Start Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          name="Event_Start_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Event_Start_Date}
                          disablePast
                          onChange={(newValue) =>
                            setFieldValue("Event_Start_Date", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              readOnly: true,
                            },
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Event_Start_Date"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">Race Start Time</label>
                    <div className="form-control">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={timePlaceholder}
                      >
                        <TimePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          placeholder="--/--"
                          value={values.Event_Start_Time}
                          onChange={(newValue) =>
                            setFieldValue("Event_Start_Time", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="--/--"
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              readOnly: true,
                            },
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Event_Start_Time"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Race End Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          name="Event_End_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Event_End_Date}
                          disablePast
                          onChange={(newValue) =>
                            setFieldValue("Event_End_Date", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              readOnly: true,
                            },
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Event_End_Date"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">Race End Time</label>
                    <div className="form-control">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={timePlaceholder}
                      >
                        <TimePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          placeholder="--/--"
                          value={values.Event_End_Time}
                          onChange={(newValue) =>
                            setFieldValue("Event_End_Time", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="--/--"
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              readOnly: true,
                            },
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Event_End_Time"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 fw-500">
                      Number of Tickets <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        disabled={category.isNew ? false : !isEditing}
                        type="number"
                        className="form-control"
                        placeholder="Max Number you want to sell"
                        name="Number_Of_Tickets"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;
                          if (e.key === "E" || e.key === "e") {
                            return;
                          }

                          const regex = /^\d+$/;

                          if (!value || regex.test(value.toString())) {
                            setFieldValue("Number_Of_Tickets", value);
                          } else {
                            return;
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="Number_Of_Tickets"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 fw-500">BIB Number Sequence</label>
                    <div class="form-control">
                      <Field
                        disabled={category.isNew ? false : !isEditing}
                        type="number"
                        className="form-control"
                        placeholder="5656"
                        name="BIB_Number"
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          if (
                            e.target.value < 0 ||
                            e.target.value === "e" ||
                            e.target.value === "E"
                          ) {
                            return;
                          }
                          setFieldValue("BIB_Number", e.target.value);
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="BIB_Number"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 fw-500">
                      Age Criteria for Participant (in years)
                      <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        disabled={category.isNew ? false : !isEditing}
                        type="number"
                        className="form-control"
                        placeholder="Min Age"
                        name="Eligibility_Criteria_MinYear"
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
                            "Eligibility_Criteria_MinYear",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="Eligibility_Criteria_MinYear"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 text-white fw-500">
                      Age Criteria for Participant (in years)
                    </label>
                    <div class="form-control">
                      <Field
                        disabled={category.isNew ? false : !isEditing}
                        type="number"
                        className="form-control"
                        placeholder="Max Age"
                        name="Eligibility_Criteria_MaxYear"
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
                            "Eligibility_Criteria_MaxYear",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="Eligibility_Criteria_MaxYear"
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

                <div className="col-md-6">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Is there any Cash Prize/ Medal?
                      <sup className="asc">*</sup>
                    </label>

                    <div className="d-flex gap-15">
                      <div className="form-radio d-flex items-center">
                        <div className="radio">
                          <Field
                            disabled={category.isNew ? false : !isEditing}
                            type="radio"
                            name="Is_PriceMoneyAwarded"
                            value="Yes"
                            onChange={(e) => {
                              setFieldValue(
                                "Is_PriceMoneyAwarded",
                                e.target.value
                              );
                              // setFieldTouched(
                              //   "Is_PriceMoneyAwarded",
                              //   true
                              // );
                              // if (
                              //   e.target.value === "Yes"
                              //   //   &&
                              //   // values.Event_Prize.length < 1
                              // ) {
                              //   push({
                              //     Gender: null,
                              //     Max_Age: "",
                              //     Min_Age: "",
                              //     First_Prize: "",
                              //     Second_Prize: "",
                              //     Third_Prize: "",
                              //     EventPrizeEntry_Id: "New",
                              //   });
                              // }
                            }}
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                        <div className="text-14 lh-1 ml-10">Yes</div>
                      </div>
                      <div className="form-radio d-flex items-center">
                        <div className="radio">
                          <Field
                            disabled={category.isNew ? false : !isEditing}
                            type="radio"
                            name="Is_PriceMoneyAwarded"
                            value="No"
                            onChange={(e) => {
                              setFieldValue(
                                "Is_PriceMoneyAwarded",
                                e.target.value
                              );
                              setFieldValue("Event_Prize", "");
                              // setFieldTouched(
                              //   "Is_PriceMoneyAwarded",
                              //   true
                              // );
                              // if (e.target.value === "No") {
                              //   setFieldValue("Event_Prize", []);
                              //   // replace([]); // Replace the Event_Prize array with an empty array
                              // }
                            }}
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                        <div className="text-14 lh-1 ml-10">No</div>
                      </div>
                    </div>

                    <ErrorMessage
                      name="Is_PriceMoneyAwarded"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                {values.Is_PriceMoneyAwarded === "Yes" ? (
                  <div className="col-12">
                    <div className="single-field w-full y-gap-10">
                      <label className="text-13 fw-500">
                        Enter Prizes <sup className="asc">*</sup>
                      </label>
                      <Field name="Event_Prize">
                        {({ field, form }) => (
                          <ReactQuill
                            readOnly={!isEditing}
                            theme="snow"
                            value={field.value}
                            onChange={(content) =>
                              setFieldValue("Event_Prize", content)
                            }
                            placeholder="Add Prizes"
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="Event_Prize"
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

                <div class="col-lg-6">
                  <div class="y-gap-10">
                    <label class="text-13 fw-500">
                      Type of Ticket <sup className="asc">*</sup>
                    </label>
                    <div className="d-flex gap-10">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          if (category.isNew) {
                            setFieldValue("Is_Paid_Event", "Paid");
                          }
                          if (!isEditing) return;
                          setFieldValue("Is_Paid_Event", "Paid");
                        }}
                        className={`button w-150 rounded-24 py-12 px-15 border-primary-bold cursor-pointer fw-500 text-16 d-flex gap-10${
                          values.Is_Paid_Event === "Paid"
                            ? " bg-primary text-white"
                            : " text-reading"
                        }`}
                      >
                        Paid
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          if (category.isNew) {
                            setFieldValue("Is_Paid_Event", "Free");
                          }
                          if (!isEditing) return;
                          setFieldValue("Is_Paid_Event", "Free");
                        }}
                        className={`button w-150 rounded-24 py-12 px-15 border-primary-bold cursor-pointer fw-500 text-16 d-flex gap-10${
                          values.Is_Paid_Event === "Free"
                            ? " bg-primary text-white"
                            : " text-reading"
                        }`}
                      >
                        Free
                      </div>
                    </div>
                    <ErrorMessage
                      name="Is_Paid_Event"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div class="col-lg-6"></div>

                {values.Is_Paid_Event === "Paid" ? (
                  <>
                    <div class="col-lg-6">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Cost of Ticket <sup className="asc">*</sup>
                        </label>
                        <div className="row">
                          <div className="col-3">
                            <Select
                              placeholder="INR"
                              isDisabled={true}
                              isSearchable={false}
                              styles={selectCustomStyle}
                              options={[]}
                              value={null}
                              onChange={async (e) => {
                                console.log(e);
                              }}
                            />
                          </div>
                          <div className="col-9 pl-0">
                            <div class="single-field">
                              <div class="form-control mb-10">
                                <Field
                                  disabled={category.isNew ? false : !isEditing}
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Price"
                                  name="Event_Price"
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
                                      "Event_Price",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="Event_Price"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6"></div>
                  </>
                ) : (
                  <></>
                )}

                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Ticket Sale Start Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          name="Ticket_Sale_Start_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Ticket_Sale_Start_Date}
                          disablePast
                          maxDate={dayjs(values.Event_Start_Date).subtract(
                            1,
                            "day"
                          )}
                          onChange={(newValue) =>
                            setFieldValue("Ticket_Sale_Start_Date", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              // disabled: true,
                              readOnly: true,
                            },
                            // To change styles
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Ticket_Sale_Start_Date"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Ticket Sale Start Time
                    </label>
                    <div className="form-control">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={timePlaceholder}
                      >
                        <TimePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          placeholder="--/--"
                          value={values.Ticket_Sale_Start_Time}
                          onChange={(newValue) =>
                            setFieldValue("Ticket_Sale_Start_Time", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="--/--"
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },

                            field: {
                              // disabled: true,
                              readOnly: true,
                            },
                            // To change styles
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Ticket_Sale_Start_Time"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Ticket Sale End Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          name="Ticket_Sale_End_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Ticket_Sale_End_Date}
                          disablePast
                          maxDate={dayjs(values.Event_Start_Date).subtract(
                            1,
                            "day"
                          )}
                          onChange={(newValue) =>
                            setFieldValue("Ticket_Sale_End_Date", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },

                            field: {
                              // disabled: true,
                              readOnly: true,
                            },
                            // To change styles
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Ticket_Sale_End_Date"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Ticket Sale End Time
                    </label>
                    <div className="form-control">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={timePlaceholder}
                      >
                        <TimePicker
                          disabled={category.isNew ? false : !isEditing}
                          className="form-control"
                          placeholder="--/--"
                          value={values.Ticket_Sale_End_Time}
                          onChange={(newValue) =>
                            setFieldValue("Ticket_Sale_End_Time", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="--/--"
                              sx={{
                                fontFamily: "Montserrat, sans-serif !important",
                                "& .MuiButtonBase-root": {
                                  color: "orange",
                                },
                              }}
                              fullWidth
                              className="form-control"
                            />
                          )}
                          slotProps={{
                            inputAdornment: {
                              position: "end",
                            },
                            field: {
                              readOnly: true,
                            },
                            openPickerIcon: {
                              sx: {
                                color: "#f05736",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <ErrorMessage
                      name="Ticket_Sale_End_Time"
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
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Upload Event Category Route
                    </label>
                    <div class="form-control">
                      <Field
                        disabled
                        type="text"
                        className="form-control"
                        name="Image_Name"
                      />
                    </div>
                    <ErrorMessage
                      name="Image_Name"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mt-5">
                    <label className="text-13 text-white fw-500 p-0">
                      Upload Event Category Routes
                    </label>
                    {/* <div className="d-flex"> */}
                    <div className="parent">
                      <div className="file-upload-ticket">
                        <i className="fas fa-upload text-20 text-primary"></i>

                        <p className="text-reading mt-0">jpg, png, gif</p>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingRoute}
                          onChange={async (event) => {
                            if (!isEditing && !category.isNew) return;
                            const file = event.currentTarget.files[0];

                            // Check if the file size is above 2MB (2 * 1024 * 1024 bytes)
                            const maxSize = 2 * 1024 * 1024;
                            if (file && file.size > maxSize) {
                              toast.error("File size should not exceed 2MB.");
                              event.target.value = ""; // Reset the input value
                              return;
                            }

                            const reqdata = new FormData();
                            reqdata.append("ModuleName", "CategoryRoute");
                            reqdata.append("File", file);

                            // Start uploading
                            setUploadingRoute(true);

                            try {
                              await toast.promise(
                                RestfulApiService(reqdata, "master/uploadfile"),
                                {
                                  loading: "Uploading...",
                                  success: (result) => {
                                    if (result) {
                                      setFieldValue(
                                        "Image_Name",
                                        result?.data?.Result
                                      );
                                      // setFieldTouched("Image_Name", true);
                                      setFieldValue(
                                        "ImagePath",
                                        result?.data?.Description
                                      );
                                      // setFieldTouched("ImagePath", true);
                                    }
                                    return "Uploaded successfully!";
                                  },
                                  error: (err) => {
                                    const errorMessage =
                                      err?.Result?.Table1[0]
                                        ?.Result_Description || "Upload failed";
                                    return errorMessage;
                                  },
                                },
                                {
                                  success: {
                                    duration: 2000,
                                  },
                                }
                              );
                            } catch (error) {
                              console.error("Upload failed:", error);
                            } finally {
                              // End uploading
                              setUploadingRoute(false);
                              event.target.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </div>

                {category.isNew || isEditing ? (
                  <div className="col-12 d-flex justify-end">
                    <div className="row">
                      {/* <div className="col-auto relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(false);
                            if (category.isNew) {
                              setAccordionOpen(false);
                            }
                            if (!category.isNew && isEditing) {
                              handleEditClick(e, values?.EventCategoryEntry_Id);
                            }
                          }}
                          className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                        >
                          Cancel
                        </button>
                      </div> */}
                      <div className="col-auto relative">
                        <button
                          disabled={submitForm}
                          type="submit"
                          className="button bg-primary w-150 h-40 rounded-24 px-15 text-white text-12 border-light load-button"
                        >
                          {!submitForm ? (
                            `Save Ticket`
                          ) : (
                            <span className="btn-spinner"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;

// Event_Prize: Yup.array().when("Is_PriceMoneyAwarded", {
//   is: (value) => value === "Yes",
//   then: () =>
//     Yup.array()
//       .of(
//         Yup.object().shape({
//           Gender: Yup.object().required("Required"),
//           Max_Age: Yup.number().required("Required"),
//           Min_Age: Yup.number().required("Required"),
//           First_Prize: Yup.string().required("Required"),
//           Second_Prize: Yup.string().required("Required"),
//           Third_Prize: Yup.string().required("Required"),
//           EventPrizeEntry_Id: Yup.string(),
//         })
//       )
//       .min(1, "At least one prize entry is required"),
//   otherwise: () => Yup.array().notRequired(),
// }),
