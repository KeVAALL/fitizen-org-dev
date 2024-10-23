import React, { useState } from "react";
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
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CustomAccordion = ({ category, raceDistanceCategory }) => {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingRoute, setUploadingRoute] = useState(false);
  const [eventCategoryName, setEventCategoryName] = useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const genderDropdown = [
    {
      label: "Male",
      value: "Male",
    },
    {
      label: "Female",
      value: "Female",
    },
  ];
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
  const initialValues = {
    EventCategory_Name: "",
    EventCategory_Id: null,
    Race_Distance: "",
    Race_Distance_Unit: "",
    Timed_Event: null,
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
    Event_Prize: [
      //   {
      //     Gender: null,
      //     Max_Age: "",
      //     Min_Age: "",
      //     First_Prize: "",
      //     Second_Prize: "",
      //     Third_Prize: "",
      //     EventPrizeEntry_Id: "",
      //   },
    ],
    // Image_Path: "",
    Image_Name: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const validationSchema = Yup.object(
    {
      BIB_Number: Yup.number()
        .required("BIB Number is required")
        .typeError("BIB Number must be a valid number"),
      EventCategory_Name: Yup.string().required(
        "Event Category Name is required"
      ),
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
      Number_Of_Tickets: Yup.number()
        .min(0, "Number of Tickets should not be less than 0")
        .required("Required"),
      Eligibility_Criteria_MinYear: Yup.number()
        .min(0, "Minimum eligibility year should not be less than 0")
        .required("Required"),
      Eligibility_Criteria_MaxYear: Yup.number()
        .min(0, "Maximum eligibility year should not be less than 0")
        .moreThan(
          Yup.ref("Eligibility_Criteria_MinYear"),
          "Max year should be greater than min year"
        )
        .required("Required"),
      Event_Start_Date: Yup.date()
        .required("Required")
        .test(
          "startDateBeforeEndDate",
          "Date must be before end date",
          function (value) {
            const { Event_End_Date } = this.parent;
            return dayjs(value).isSameOrBefore(Event_End_Date);
          }
        ),
      Event_Start_Time: Yup.date().required("Required"),
      Event_End_Date: Yup.date()
        .required("Required")
        .test(
          "endDateAfterStartDate",
          "Date must be after start date",
          function (value) {
            const { Event_Start_Date } = this.parent;
            return dayjs(value).isSameOrAfter(Event_Start_Date);
          }
        ),
      Event_End_Time: Yup.date().required("Required"),
      Is_PriceMoneyAwarded: Yup.string().required("Please select Yes or No"),
      Event_Prize: Yup.array().when("Is_PriceMoneyAwarded", {
        is: (value) => value === "Yes",
        then: () =>
          Yup.array()
            .of(
              Yup.object().shape({
                Gender: Yup.object().required("Required"),
                Max_Age: Yup.number().required("Required"),
                Min_Age: Yup.number().required("Required"),
                First_Prize: Yup.string().required("Required"),
                Second_Prize: Yup.string().required("Required"),
                Third_Prize: Yup.string().required("Required"),
                EventPrizeEntry_Id: Yup.string(),
              })
            )
            .min(1, "At least one prize entry is required"),
        otherwise: () => Yup.array().notRequired(),
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
        .required("Required")
        .test(
          "saleStartBeforeEnd",
          "Date must be before sale end date",
          function (value) {
            const { Ticket_Sale_End_Date } = this.parent;
            return dayjs(value).isSameOrBefore(Ticket_Sale_End_Date);
          }
        ),
      Ticket_Sale_Start_Time: Yup.date().required("Required"),
      Ticket_Sale_End_Date: Yup.date()
        .required("Required")
        .test(
          "saleEndAfterStart",
          "Date must be after sale start date",
          function (value) {
            const { Ticket_Sale_Start_Date } = this.parent;
            return dayjs(value).isSameOrAfter(Ticket_Sale_Start_Date);
          }
        ),
      Ticket_Sale_End_Time: Yup.date().required("Required"),
      Image_Name: Yup.string().required("Please upload Category Route"),
      ImagePath: Yup.string(),
      //   Image_Path: Yup.mixed().test("fileType", "Invalid file format", (value) =>
      //     /\.(jpg|jpeg|png)$/i.test(value)
      //   ),
    },
    [
      ["Is_Paid_Event", "Event_Price"],
      ["Is_PriceMoneyAwarded", "Event_Prize"],
      ["EventCategory_Id", "Race_Distance"],
      ["EventCategory_Id", "Race_Distance_Unit"],
    ]
  );
  const handleEditClick = async (event, eventCategoryId) => {
    event.stopPropagation(); // Prevent accordion from toggling

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
        console.log(result?.data?.Result?.Table1);

        const result1 = result?.data?.Result?.Table1?.[0];
        console.log(result1);
        setFormValues({
          ...result1,
          EventCategory_Name: result1?.EventCategory_Name,
          EventCategory_Id: raceDistanceCategory?.filter(
            (cat) => cat.value === result1?.EventCategory_Id
          )[0],
          //   Race_Distance: result1?.Race_Distance,
          Race_Distance_Unit: raceDistanceUnitDropdown?.filter(
            (unit) => unit.value === result1?.Race_Distance_Unit
          )[0],
          Timed_Event: timedEventDropdown?.filter(
            (t) => t.value === result1?.Timed_Event
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
          Event_Prize: JSON.parse(result1?.Event_Prize)?.map((prize) => {
            return {
              ...prize,
              Gender: genderDropdown?.filter(
                (g) => g.value === prize.Gender
              )[0],
            };
          }),
          ImagePath: result1?.Image_Path,
          Image_Name: result1?.Image_Name,
        });

        setAccordionOpen(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  function formatRaceTiming(data) {
    const startDate = dayjs(data.Event_Start_Date).format("DD MMM YYYY");
    const startTime = dayjs(data.Event_Start_Time).format("HH:mm");
    const endDate = dayjs(data.Event_End_Date).format("DD MMM YYYY");
    const endTime = dayjs(data.Event_End_Time).format("HH:mm");

    // Combine into the desired format
    return `${startDate} ${startTime} to ${endDate} ${endTime}`;
  }
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
      data.Race_Distance_Unit?.value || data.Race_Distance_Unit
    );
    addRow("Eligibility_Criteria_MinYear", data.Eligibility_Criteria_MinYear);
    addRow("Eligibility_Criteria_MaxYear", data.Eligibility_Criteria_MaxYear);
    addRow(
      "Eligibility_Criteria",
      `${data.Eligibility_Criteria_MinYear} to ${data.Eligibility_Criteria_MaxYear} Years`
    );
    addRow("Time_Limit", data.Time_Limit);
    addRow("Time_Limit_Unit", data.Time_Limit_Unit);
    addRow("Race_Timing", formatRaceTiming(data));
    addRow(
      "Event_Start_Date",
      `${dayjs(data.Event_Start_Date).format("YYYY-MM-DD")}T${dayjs(
        data.Event_Start_Time
      ).format("HH:mm")}`
    );
    addRow(
      "Event_End_Date",
      `${dayjs(data.Event_End_Date).format("YYYY-MM-DD")}T${dayjs(
        data.Event_End_Time
      ).format("HH:mm")}`
    );
    addRow("Is_Paid_Event", data.Is_Paid_Event === "Paid" ? 1 : 0);
    addRow("Number_Of_Tickets", data.Number_Of_Tickets);
    addRow("BIB_Number", data.BIB_Number);
    addRow("Event_Price", data.Event_Price);
    addRow(
      "Ticket_Sale_Start_Date",
      `${dayjs(data.Ticket_Sale_Start_Date).format("YYYY-MM-DD")}T${dayjs(
        data.Ticket_Sale_Start_Time
      ).format("HH:mm")}`
    );
    addRow(
      "Ticket_Sale_End_Date",
      `${dayjs(data.Ticket_Sale_End_Date).format("YYYY-MM-DD")}T${dayjs(
        data.Ticket_Sale_End_Time
      ).format("HH:mm")}`
    );
    addRow("Is_PriceMoneyAwarded", data.Is_PriceMoneyAwarded === "Yes" ? 1 : 0);
    addRow("Is_Active", data.Is_Active);
    addRow("Timed_Event", data.Timed_Event?.value || data.Timed_Event);

    // Handle Pills_Name field
    const pillData = data.Timed_Event?.value || data.Timed_Event;
    addRow(
      "Pills_Name",
      `${data.Race_Distance} ${
        data.Race_Distance_Unit?.value || data.Race_Distance_Unit
      } ${pillData}`
    );

    // Add the Is_Deleted field
    addRow("Is_Deleted", 0);

    // Wrap all the XML data in a root element
    XMLData = `<D>${XMLData}</D>`;

    return XMLData;
  }
  function convertPrizesToXML(eventPrizes) {
    let prizeXMLData = "";

    eventPrizes.forEach((prize) => {
      const {
        EventPrizeEntry_Id,
        Gender: { value: Gender },
        Min_Age,
        Max_Age,
        First_Prize,
        Second_Prize,
        Third_Prize,
      } = prize;

      prizeXMLData += "<R>";
      prizeXMLData += `<EID>${
        EventPrizeEntry_Id ? EventPrizeEntry_Id : "New"
      }</EID>`;
      prizeXMLData += `<G>${Gender}</G>`;
      prizeXMLData += `<MIN>${Min_Age}</MIN>`;
      prizeXMLData += `<MAX>${Max_Age}</MAX>`;
      prizeXMLData += `<FP>${First_Prize}</FP>`;
      prizeXMLData += `<SP>${Second_Prize}</SP>`;
      prizeXMLData += `<TP>${Third_Prize}</TP>`;
      prizeXMLData += "</R>";
    });

    return `<D>${prizeXMLData}</D>`;
  }
  const submitCategoryForm = async (values) => {
    console.log(values);
    console.log(convertToXML(values));
    console.log(convertPrizesToXML(values.Event_Prize));
    const reqdata = {
      Method_Name: "Update",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Id: decryptData(event_id),
      EventCategoryEntry_Id: values?.EventCategoryEntry_Id,
      EventCategory_Id: values?.EventCategory_Id.value,
      EventCategory_Name: values?.EventCategory_Name,
      ImagePath: values?.ImagePath,
      ImageName: values?.Image_Name,
      XMLData: convertToXML(values),
      PrizeXMLData: convertPrizesToXML(values.Event_Prize),
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
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        // setEventCategoryName(
        //   `${values.EventCategory_Id.value === "C007003" ? values.Race_Distance : values.EventCategory_Id.label} ${
        //     values.Race_Distance_Unit?.value || values.Race_Distance_Unit
        //   } ${values.Timed_Event?.value} ${values.EventCategory_Name}`
        // );
        setAccordionOpen(false);
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitForm(false);
    }
  };
  const handleDelete = (prize, index, remove) => {
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

        const reqdata = {
          Method_Name: "PrizeDelete",
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Org_Id: user?.Org_Id,
          Event_Id: decryptData(event_id),
          EventCategoryEntry_Id: prize.EventPrizeEntry_Id,
          EventCategory_Id: "",
          EventCategory_Name: "",
          ImagePath: "",
          ImageName: "",
          XMLData: "",
          PrizeXMLData: "",
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
            remove(index);
            return true;
          } else {
            // If the API response indicates failure, show a validation message
            Swal.showValidationMessage("Failed to delete the prize.");
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
          text: "Prize has been deleted.",
          icon: "success",
        });
      }
    });
  };
  const combineDateAndTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null; // Return null if either value is missing

    const date = dayjs(dateString); // Parse the date
    const [hours, minutes, seconds = 0] = timeString.split(":").map(Number); // Split time into components, default seconds to 0

    return date
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", seconds); // Combine date and time
  };
  const handleCancelClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    setAccordionOpen(false); // Close the accordion
    setFormValues(initialValues);
  };
  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    // Perform delete action
  };

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
      expanded={isAccordionOpen}
      onChange={() => setAccordionOpen(!isAccordionOpen)}
    >
      <AccordionSummary
        style={{
          backgroundColor: "#FFF5F3", // Set the background color
        }}
        sx={{
          pointerEvents: "none",
        }}
        expandIcon={
          <div style={{ display: "flex", gap: "8px" }}>
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
              onClick={handleDeleteClick}
            >
              <DeleteOutlinedIcon
                fontSize="inherit"
                style={{
                  color: "#fff",
                }}
              />
            </IconButton>
          </div>
        }
        IconButtonProps={{
          style: { transform: "none" }, // Prevent rotation of expand icon
        }}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="text-14 fw-500">
          {eventCategoryName
            ? eventCategoryName
            : category?.EventCategory_Display_Name}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitCategoryForm(values);
          }}
        >
          {({ values, setFieldValue, handleChange }) => (
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
                    Edit Ticket
                  </button>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="single-field y-gap-20">
                    <label class="text-13 fw-500">
                      Event Category Name <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add your category name"
                        name="EventCategory_Name"
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
                      isSearchable={false}
                      styles={selectCustomStyle}
                      options={raceDistanceCategory}
                      value={values.EventCategory_Id}
                      onChange={(value) => {
                        setFieldValue("EventCategory_Id", value);
                        if (value?.value !== "C007003") {
                          setFieldValue("Race_Distance", "");
                          setFieldValue("Race_Distance_Unit", null);
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
                        disabled={values.EventCategory_Id?.value !== "C007003"}
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
                      isDisabled={values.EventCategory_Id?.value !== "C007003"}
                      isSearchable={false}
                      placeholder="Select Unit"
                      styles={
                        values.EventCategory_Id?.value !== "C007003"
                          ? selectCustomStyle
                          : disabledCustomStyle
                      }
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

                <div className="col-3">
                  <div className="single-field y-gap-20">
                    <label className="text-13 fw-500">
                      Category Start Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          className="form-control"
                          name="Event_Start_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Event_Start_Date}
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
                    <label className="text-13 fw-500">
                      Category Start Time <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
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
                      Category End Date <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          className="form-control"
                          name="Event_End_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          value={values.Event_End_Date}
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
                    <label className="text-13 fw-500">
                      Category End Time <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
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
                        type="number"
                        className="form-control"
                        placeholder="Max Number you want to sell"
                        name="Number_Of_Tickets"
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
                    <label class="text-13 fw-500">
                      BIB Number Sequence <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        type="number"
                        className="form-control"
                        placeholder="5656"
                        name="BIB_Number"
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
                        type="number"
                        className="form-control"
                        placeholder="Min Age"
                        name="Eligibility_Criteria_MinYear"
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
                        type="number"
                        className="form-control"
                        placeholder="Max Age"
                        name="Eligibility_Criteria_MaxYear"
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

                <FieldArray name="Event_Prize">
                  {({ insert, remove, push, replace }) => {
                    return (
                      <>
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
                                    type="radio"
                                    name="Is_PriceMoneyAwarded"
                                    value="Yes"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "Is_PriceMoneyAwarded",
                                        e.target.value
                                      );
                                      if (
                                        e.target.value === "Yes"
                                        //   &&
                                        // values.Event_Prize.length < 1
                                      ) {
                                        push({
                                          Gender: null,
                                          Max_Age: "",
                                          Min_Age: "",
                                          First_Prize: "",
                                          Second_Prize: "",
                                          Third_Prize: "",
                                          EventPrizeEntry_Id: "New",
                                        });
                                      }
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
                                    type="radio"
                                    name="Is_PriceMoneyAwarded"
                                    value="No"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "Is_PriceMoneyAwarded",
                                        e.target.value
                                      );
                                      if (e.target.value === "No") {
                                        setFieldValue("Event_Prize", []);
                                        // replace([]); // Replace the Event_Prize array with an empty array
                                      }
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
                          <>
                            <div className="col-md-12">
                              <div className="row y-gap-20">
                                {values.Event_Prize.length > 0 ? (
                                  values.Event_Prize.map((prize, index) => (
                                    <div className="row" key={index}>
                                      <div className="col-md-11">
                                        <div className="row">
                                          <div className="col-lg-2">
                                            <div className="y-gap-10">
                                              <label className="text-13 fw-500">
                                                Gender{" "}
                                                <sup className="asc">*</sup>
                                              </label>
                                              <Select
                                                isSearchable={false}
                                                styles={selectCustomStyle}
                                                options={genderDropdown}
                                                value={prize.Gender}
                                                onChange={async (e) => {
                                                  console.log(e);
                                                  setFieldValue(
                                                    `Event_Prize.${index}.Gender`,
                                                    e
                                                  );
                                                }}
                                              />
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.Gender`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-lg-2">
                                            <div class="single-field y-gap-20">
                                              <label class="text-13 fw-500">
                                                Age Criteria
                                              </label>
                                              <div class="form-control">
                                                <Field
                                                  type="text"
                                                  name={`Event_Prize.${index}.Min_Age`}
                                                  placeholder="Min Age"
                                                  className="form-control"
                                                />
                                              </div>
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.Min_Age`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>

                                          <div class="col-lg-2">
                                            <div class="single-field y-gap-20">
                                              <label class="text-13 text-white fw-500">
                                                Age Criteria
                                              </label>
                                              <div class="form-control">
                                                <Field
                                                  type="text"
                                                  name={`Event_Prize.${index}.Max_Age`}
                                                  placeholder="Max Age"
                                                  className="form-control"
                                                />
                                              </div>
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.Max_Age`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>

                                          <div class="col-lg-2">
                                            <div class="single-field y-gap-20">
                                              <label class="text-13 fw-500">
                                                Winner
                                              </label>
                                              <div class="form-control">
                                                <Field
                                                  type="text"
                                                  name={`Event_Prize.${index}.First_Prize`}
                                                  placeholder="Winner"
                                                  className="form-control"
                                                />
                                              </div>
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.First_Prize`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-lg-2">
                                            <div class="single-field y-gap-20">
                                              <label class="text-13 fw-500">
                                                1st Runner Up
                                              </label>
                                              <div class="form-control">
                                                <Field
                                                  type="text"
                                                  name={`Event_Prize.${index}.Second_Prize`}
                                                  placeholder="1st Runner Up"
                                                  className="form-control"
                                                />
                                              </div>
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.Second_Prize`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-lg-2">
                                            <div class="single-field y-gap-20">
                                              <label class="text-13 fw-500">
                                                3rd Runner Up
                                              </label>
                                              <div class="form-control">
                                                <Field
                                                  type="text"
                                                  name={`Event_Prize.${index}.Third_Prize`}
                                                  placeholder="3rd Runner Up"
                                                  className="form-control"
                                                />
                                              </div>
                                              <ErrorMessage
                                                name={`Event_Prize.${index}.Third_Prize`}
                                                component="div"
                                                className="text-error-2 text-13"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* {index !== 0 && ( */}
                                      <div className="col-1 relative">
                                        <label className="text-13 text-white fw-500">
                                          __
                                        </label>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (
                                              prize.EventPrizeEntry_Id === "New"
                                            ) {
                                              remove(index);
                                            } else {
                                              handleDelete(
                                                prize,
                                                index,
                                                remove
                                              );
                                            }
                                          }}
                                          className="button w-45 h-45 border-primary-bold text-20 fw-600 rounded-full"
                                        >
                                          -
                                        </button>
                                      </div>
                                      {/* )} */}
                                    </div>
                                  ))
                                ) : (
                                  <>
                                    <ErrorMessage
                                      name="Event_Prize"
                                      component="div"
                                      className="text-error-2 text-13"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="d-flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    push({
                                      Gender: null,
                                      Max_Age: "",
                                      Min_Age: "",
                                      First_Prize: "",
                                      Second_Prize: "",
                                      Third_Prize: "",
                                      EventPrizeEntry_Id: "New",
                                    });
                                  }}
                                  className="button w-full rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  }}
                </FieldArray>

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
                                  type="number"
                                  className="form-control"
                                  placeholder="Add Price"
                                  name="Event_Price"
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
                          className="form-control"
                          name="Ticket_Sale_Start_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          disableFuture
                          value={values.Ticket_Sale_Start_Date}
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
                      Ticket Sale Start Time <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
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
                          className="form-control"
                          name="Ticket_Sale_End_Date"
                          format="DD/MM/YYYY"
                          inputFormat="DD/MM/YYYY"
                          disableFuture
                          value={values.Ticket_Sale_End_Date}
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
                      Ticket Sale End Time <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
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
                                      setFieldValue(
                                        "ImagePath",
                                        result?.data?.Description
                                      );
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

                <div className="col-12">
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
            </Form>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;

// Mock API function
const fetchYourData = async () => {
  // Simulate an API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};
