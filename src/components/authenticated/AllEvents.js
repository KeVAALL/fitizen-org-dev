// React imports
import React, { useCallback, useEffect, useState } from "react";

// Redux imports
import { useSelector } from "react-redux";

// Project-specific imports
import { RestfulApiService } from "../../config/service";
import { MEDIA_URL } from "../../config/url";
import { encryptData } from "../../utils/DataEncryption";
import { customRoundedStyles } from "../../utils/ReactSelectStyles";
import Loader from "../../utils/BackdropLoader";
import noResultFound from "../../assets/img/general/not-found.png";
import defaultImg from "../../assets/img/masthead/default-event.png";

// MUI imports (separated)
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

// Third-party imports
import toast from "react-hot-toast";
import * as Yup from "yup";
import Select from "react-select";
import { ErrorMessage, Field, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { CustomIcon } from "../../utils/UtilityFunctions";

function AllEvents() {
  const user = useSelector((state) => state.user.userProfile);
  const navigate = useNavigate();

  const [fetchingDashboard, setFetchingDashboard] = useState(false);
  const [cloneModal, setCloneModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [cloneEventDetails, setCloneEventDetails] = useState(null);
  const [submitModalForm, setSubmitModalForm] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  // {
  //   label: "All Events",
  //   value: "All",
  // }
  const [timelineCounts, setTimelineCounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const eventFilter = [
    {
      label: `All Events: ${
        timelineCounts["AllEvents"] ? timelineCounts["AllEvents"] : 0
      }`,
      value: "All",
    },
    {
      label: `Past Events: ${
        timelineCounts["Past"] ? timelineCounts["Past"] : 0
      }`,
      value: "Past",
    },
    {
      label: `Future Events: ${
        timelineCounts["Future"] ? timelineCounts["Future"] : 0
      }`,
      value: "Future",
    },
    {
      label: `In-active Events: ${
        timelineCounts["InactiveEvent"] ? timelineCounts["InactiveEvent"] : 0
      }`,
      value: 0,
    },
    {
      label: `Draft Events: ${
        timelineCounts["Draft"] ? timelineCounts["Draft"] : 0
      }`,
      value: "Draft",
    },
  ];
  const returnEventFilter = (result, selectedTimeline, setSelectedTimeline) => {
    handleDateFilter(selectedTimeline.value);
    if (!selectedTimeline?.value) {
      return setSelectedTimeline({
        label: `In-active Events: ${
          result?.data?.Result?.Table2[0]["InactiveEvent"]
            ? result?.data?.Result?.Table2[0]["InactiveEvent"]
            : 0
        }`,
        value: 0,
      });
    } else if (selectedTimeline?.value === "All") {
      return setSelectedTimeline({
        label: `All Events: ${
          result?.data?.Result?.Table2[0]["AllEvents"]
            ? result?.data?.Result?.Table2[0]["AllEvents"]
            : 0
        }`,
        value: "All",
      });
    } else if (selectedTimeline?.value === "Past") {
      return setSelectedTimeline({
        label: `Past Events: ${
          result?.data?.Result?.Table2[0]["Past"]
            ? result?.data?.Result?.Table2[0]["Past"]
            : 0
        }`,
        value: "Past",
      });
    } else if (selectedTimeline?.value === "Future") {
      return setSelectedTimeline({
        label: `Future Events: ${
          result?.data?.Result?.Table2[0]["Future"]
            ? result?.data?.Result?.Table2[0]["Future"]
            : 0
        }`,
        value: "Future",
      });
    } else {
      return setSelectedTimeline({
        label: `Draft Events: ${
          result?.data?.Result?.Table2[0]["Draft"]
            ? result?.data?.Result?.Table2[0]["Draft"]
            : 0
        }`,
        value: "Draft",
      });
    }
  };
  const initialValues = {
    Event_Name: "",
    checkboxes: {
      Ticket_Price_Setting: false,
      Event_Category: false,
      Discount_Details: false,
      Assets: false,
      RaceDay_Takeaway: false,
      Participant_Form: false,
      BIB_Expo_Details: false,
    },
  };
  const [cloneEventValues, setCloneEventValues] = useState(initialValues);
  const validationSchema = Yup.object().shape({
    Event_Name: Yup.string().required("Event name is required"),
    checkboxes: Yup.object().test(
      "at-least-one-checked",
      "You must check at least one checkbox",
      (value) => Object.values(value).some((v) => v === true)
    ),
  });
  async function CloneEvent(values) {
    const reqdata = {
      Method_Name: "Create",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Event_Id: cloneEventDetails?.Event_Id,
      Event_Name: values?.Event_Name,
      Ticket_Price_Setting: values?.checkboxes?.Ticket_Price_Setting ? 1 : 0,
      Event_Category: values?.checkboxes?.Event_Category ? 1 : 0,
      Discount_Details: values?.checkboxes?.Discount_Details ? 1 : 0,
      Assets: values?.checkboxes?.Assets ? 1 : 0,
      RaceDay_Takeaway: values?.checkboxes?.RaceDay_Takeaway ? 1 : 0,
      Participant_Form: values?.checkboxes?.Participant_Form ? 1 : 0,
      BIB_Expo_Details: values?.checkboxes?.BIB_Expo_Details ? 1 : 0,
    };
    try {
      setSubmitModalForm(true);
      const result = await RestfulApiService(reqdata, "organizer/cloneevent");
      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }
      if (result) {
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        setCloneModal(false);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitModalForm(false);
    }
  }
  async function LoadDashboard() {
    const reqdata = {
      Method_Name: "All",
      SearchBy: "",
      TypeEvent: "",
      EventId: "",
      FromDate: dayjs().format("YYYY-MM-DD"),
      ToDate: dayjs().add(2, "year").format("YYYY-MM-DD"),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingDashboard(true);
      const result = await RestfulApiService(reqdata, "organizer/dashboard");
      if (result) {
        console.log(result?.data?.Result);

        if (selectedTimeline) {
          setTimelineCounts(result?.data?.Result?.Table2[0]);
          returnEventFilter(result, selectedTimeline, setSelectedTimeline);
        } else {
          setEvents(result?.data?.Result?.Table1);
          setTimelineCounts(result?.data?.Result?.Table2[0]);
          setSelectedTimeline({
            label: `All Events: ${
              result?.data?.Result?.Table2[0]["AllEvents"]
                ? result?.data?.Result?.Table2[0]["AllEvents"]
                : 0
            }`,
            value: "All",
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingDashboard(false);
    }
  }
  const handleDateFilter = async (eventTimeline) => {
    let From_Date = "";
    let To_Date = "";

    const today = dayjs().format("YYYY-MM-DD"); // Current date
    if (eventTimeline === "Past") {
      From_Date = dayjs().subtract(2, "year").format("YYYY-MM-DD");
      To_Date = today;
      setFromDate(dayjs().subtract(2, "year").format("YYYY-MM-DD"));
      setToDate(today);
    } else if (eventTimeline === "Future") {
      From_Date = today;
      To_Date = dayjs().add(2, "year").format("YYYY-MM-DD");
      setFromDate(today);
      setToDate(dayjs().add(2, "year").format("YYYY-MM-DD"));
    }

    const reqdata = {
      Method_Name:
        eventTimeline === 0
          ? "Status"
          : eventTimeline === "Draft"
          ? "Draft"
          : eventTimeline === "Past"
          ? "Past"
          : eventTimeline === "Future"
          ? "Future"
          : "All",
      SearchBy: "",
      TypeEvent: "",
      EventId: "",
      FromDate: From_Date,
      ToDate: To_Date,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingDashboard(true);
      const result = await RestfulApiService(reqdata, "organizer/dashboard");
      if (result) {
        console.log(result?.data?.Result?.Table1);
        setEvents(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingDashboard(false);
    }
  };
  const handleSearch = async (eventValue, selectedTimeline) => {
    const today = dayjs().format("YYYY-MM-DD");
    const reqdata = {
      Method_Name: "Search",
      SearchBy: eventValue, // Pass the search term here
      TypeEvent: "",
      EventId: "",
      FromDate:
        selectedTimeline?.value === "Past"
          ? dayjs().subtract(2, "year").format("YYYY-MM-DD")
          : selectedTimeline?.value === "Future"
          ? today
          : "",
      // FromDate: fromDate,
      ToDate:
        selectedTimeline?.value === "Past"
          ? today
          : selectedTimeline?.value === "Future"
          ? dayjs().add(2, "year").format("YYYY-MM-DD")
          : "",
      // ToDate: toDate,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };

    try {
      // setFetchingDashboard(true);
      const result = await RestfulApiService(reqdata, "organizer/dashboard");
      if (result) {
        console.log(result?.data?.Result?.Table1);
        setEvents(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setFetchingDashboard(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(
      (value, selectedTimeline) => handleSearch(value, selectedTimeline),
      500
    ), // Adjust delay as needed
    []
  );
  // Update searchTerm on input change and call debounced search
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value, selectedTimeline);
  };
  const toggleSwitch = async (index, isActive, EventId) => {
    const reqdata = {
      Method_Name: isActive ? "InActive" : "Active",
      SearchBy: "",
      TypeEvent: "",
      EventId: EventId,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      // setFetchingDashboard(true);
      const result = await RestfulApiService(reqdata, "organizer/dashboard");

      // Check if result is successful and update state
      if (result) {
        setEvents((prevEvents) =>
          prevEvents.map((event, i) =>
            i === index
              ? { ...event, Is_Active: event.Is_Active === 1 ? 0 : 1 }
              : event
          )
        );
        setTimeout(() => {
          LoadDashboard();
        });
      } else {
        console.log("Action completed!");
      }
      // Remove Toast
      // await toast.promise(
      //   RestfulApiService(reqdata, "organizer/dashboard"),
      //   {
      //     loading: isActive ? "Deactivating event..." : "Activating event...",
      //     success: (result) => {
      //       if (result) {
      //         // Update the event state only if the API request is successful
      //         setEvents((prevEvents) =>
      //           prevEvents.map((event, i) =>
      //             i === index
      //               ? { ...event, Is_Active: event.Is_Active === 1 ? 0 : 1 }
      //               : event
      //           )
      //         );
      //         return isActive
      //           ? "Event deactivated successfully!"
      //           : "Event activated successfully!";
      //       }
      //       return "Action completed!";
      //     },
      //     error: (err) => {
      //       const errorMessage =
      //         err?.Result?.Table1[0]?.Result_Description ||
      //         "Event update failed";
      //       return errorMessage;
      //     },
      //   },
      //   {
      //     success: {
      //       duration: 3000,
      //     },
      //   }
      // );
    } catch (error) {
      const errorMessage =
        error?.Result?.Table1[0]?.Result_Description || "Event update failed";
      console.error(errorMessage);
    } finally {
      // setFetchingDashboard(false);
    }
  };
  const shareContent = async (isActive, eventId, displayName) => {
    if (!isActive) {
      toast.dismiss();
      toast(
        "Event sharing is disabled at the moment. Please ensure the event is active.",
        {
          // icon: "⚠️",
          icon: <CustomIcon />,
          style: {
            width: "500px", // Custom width for the toast
            maxWidth: "500px", // Ensures the toast does not grow beyond this
            whiteSpace: "normal", // Allows text wrapping if needed
          },
        }
      );
      return;
    }
    const encryptedParam = encryptData(eventId);

    const baseUrl = window.location.href.includes("uatorganizer")
      ? "https://uatorganizer.fitizenindia.com"
      : "https://organizer.fitizenindia.com";
    const url = `${baseUrl}/event/dashboard/${encryptedParam}`;
    const message = `${displayName}\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this awesome content!",
          text: message, // Full message including the URL
          // Omitting url property
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Share API not supported");
      // Optionally provide a fallback here
    }
  };
  useEffect(() => {
    LoadDashboard();
  }, []);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row justify-between items-center relative mb-20">
              <div className="col-lg-2">
                <div className="py-10">
                  <Select
                    isSearchable={false}
                    styles={customRoundedStyles}
                    options={eventFilter}
                    value={selectedTimeline}
                    onChange={async (e) => {
                      console.log(e);
                      setSelectedTimeline(e);
                      handleDateFilter(e.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="searchMenu-loc lg:py-20 lg:px-0 d-inline text-center">
                  <div
                    className="single-field relative search-bar"
                    data-x-dd-click="searchMenu-loc"
                  >
                    <input
                      className="border-dark-1 text-dark-1 rounded-8 search-input fw-600"
                      type="text"
                      name="search-input"
                      placeholder="Search Events, City, Sports, etc..."
                      value={searchTerm}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard/add-event");
                  }}
                  className="button w-full border-dark-1 rounded-22 px-20 py-10 text-dark-1 text-12 -primary-1"
                >
                  Create Event <span className="text-16 ml-5">+</span>
                </button>
              </div>
            </div>
            <Modal open={cloneModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 600,
                  bgcolor: "background.paper",
                  border: "none",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 3,
                }}
              >
                <Stack direction="column" alignItems="center" spacing={2}>
                  <Stack
                    style={{ width: "100%" }}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <div className="text-16 lh-16 fw-600 text-primary">
                      Clone Event
                    </div>
                    <i
                      onClick={() => {
                        setCloneModal(false);
                      }}
                      class="fas fa-times text-16 text-primary cursor-pointer"
                    ></i>
                  </Stack>
                  <Formik
                    enableReinitialize
                    initialValues={cloneEventValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      console.log(values);
                      CloneEvent(values);
                    }}
                  >
                    {({
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      validateForm,
                      setFieldValue,
                      submitForm,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="row y-gap-15">
                          <div className="col-lg-12">
                            <div className="single-field">
                              <label className="text-13 text-reading fw-500">
                                Event Name
                              </label>
                              <div className="form-control">
                                <Field
                                  name="Event_Name"
                                  className="form-control"
                                  placeholder="Event Name"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    // const regex = /^[^\s].*$/;
                                    const regex = /^[^\s.](?!.*\.$)(?!.*\.).*$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 50 &&
                                        value !== ".")
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
                                className="text-error-2 text-13 mt-5"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.Ticket_Price_Setting" // Bind the name to Formik field
                                  checked={
                                    values.checkboxes.Ticket_Price_Setting
                                  }
                                />
                              </div>
                              <p className="text-14 fw-500">Ticket Price</p>
                            </Stack>
                            {/* <ErrorMessage
                              name="Ticket_Price_Setting"
                              component="div"
                              className="text-error-2 text-13"
                            /> */}
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.Event_Category"
                                  checked={values.checkboxes.Event_Category}
                                />
                              </div>
                              <p className="text-14 fw-500">Event Category</p>
                            </Stack>
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.Discount_Details"
                                  checked={values.checkboxes.Discount_Details}
                                />
                              </div>
                              <p className="text-14 fw-500">Discount Details</p>
                            </Stack>
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.Assets"
                                  checked={values.checkboxes.Assets}
                                />
                              </div>
                              <p className="text-14 fw-500">Assets</p>
                            </Stack>
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.RaceDay_Takeaway"
                                  checked={values.checkboxes.RaceDay_Takeaway}
                                />
                              </div>
                              <p className="text-14 fw-500">
                                Race Day Takeaways
                              </p>
                            </Stack>
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.Participant_Form"
                                  checked={values.checkboxes.Participant_Form}
                                />
                              </div>
                              <p className="text-14 fw-500">Participant Form</p>
                            </Stack>
                          </div>

                          <div className="col-lg-6">
                            <Stack direction="row" gap={1}>
                              <div
                                class="d-flex items-center"
                                style={{ width: "5%" }}
                              >
                                <Field
                                  className="w-full p-0"
                                  type="checkbox"
                                  name="checkboxes.BIB_Expo_Details"
                                  checked={values.checkboxes.BIB_Expo_Details}
                                />
                              </div>
                              <p className="text-14 fw-500">BIB Expo Details</p>
                            </Stack>
                          </div>

                          {/* Add other checkboxes similarly */}

                          <div className="col-12 relative d-flex justify-center mt-10">
                            <button
                              type="button"
                              onClick={async () => {
                                const errors = await validateForm();
                                if (Object.keys(errors).length === 0) {
                                  submitForm();
                                } else {
                                  // if (errors.Event_Name) {
                                  //   toast.error(errors.Event_Name); // Show error for eventName
                                  // }
                                  if (errors.checkboxes) {
                                    toast.dismiss();
                                    toast.error(
                                      "Please check at least one checkbox!"
                                    ); // Show error for checkboxes
                                  }
                                }
                              }}
                              className="button bg-primary w-150 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                            >
                              {!submitModalForm ? (
                                "Save"
                              ) : (
                                <span className="btn-spinner"></span>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                </Stack>
              </Box>
            </Modal>
            <div className="row y-gap-40" style={{ position: "relative" }}>
              {fetchingDashboard ? (
                <Loader fetching={fetchingDashboard} />
              ) : events.length > 0 ? (
                events?.map((ev, index) => {
                  const encryptedParam = encryptData(ev?.Event_Id);
                  return (
                    <div className="col-xl-4 col-lg-4 col-sm-6">
                      <div className="border-light rounded-16 px-15 py-15 -hover-shadow h-full">
                        <div className="eventsCard -type-1">
                          <div className="eventsCard__image mb-10">
                            <div className="cardImage ratio ratio-2:1">
                              <div className="cardImage__content">
                                <img
                                  className={`rounded-16 col-12${
                                    ev.Approved === "Not Approved"
                                      ? " img-approval-opacity"
                                      : ""
                                  }`}
                                  src={
                                    ev?.Image_Path
                                      ? `${MEDIA_URL}${ev?.Image_Path}`
                                      : defaultImg
                                  }
                                  alt="card"
                                />
                              </div>

                              <div className="cardImage__wishlist d-flex">
                                <div className="form-switch d-flex items-center">
                                  <div className="switch">
                                    <input
                                      type="checkbox"
                                      checked={ev?.Is_Active}
                                      onChange={(e) => {
                                        console.log(e.target.value);

                                        toggleSwitch(
                                          index,
                                          ev?.Is_Active,
                                          ev?.Event_Id
                                        );
                                      }}
                                    />
                                    <span className="switch__slider"></span>
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCloneEventDetails(ev);
                                    setCloneEventValues({
                                      Event_Name: `${ev?.Display_Name} Copy`,
                                      checkboxes: {
                                        Ticket_Price_Setting: false,
                                        Event_Category: false,
                                        Discount_Details: false,
                                        Assets: false,
                                        RaceDay_Takeaway: false,
                                        Participant_Form: false,
                                        BIB_Expo_Details: false,
                                      },
                                    });
                                    setTimeout(() => {
                                      setCloneModal(true);
                                    });
                                  }}
                                  className="button -primary-1 bg-white size-30 rounded-full shadow-2 text-primary"
                                >
                                  <i className="fas fa-solid fa-copy text-12"></i>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    shareContent(
                                      ev?.Is_Active,
                                      ev?.Event_Id,
                                      ev?.Display_Name
                                    );
                                  }}
                                  className="button -primary-1 bg-white size-30 rounded-full shadow-2 text-primary"
                                >
                                  <i className="fas fa-share text-12"></i>
                                </button>
                              </div>
                              <div className="cardImage__leftBadge">
                                <div className="px-20 rounded-right-4 text-14 lh-16 fw-700 uppercase bg-white text-dark">
                                  {ev?.Start_Date === ev?.End_Date
                                    ? ev?.Start_Date
                                    : ev?.Start_Date + " - " + ev?.End_Date}
                                </div>
                              </div>
                              {ev?.Approved === "Not Approved" ? (
                                <div className="cardImage__middleBadge w-full">
                                  <div
                                    className="px-20 text-13 lh-16 fw-500 uppercase bg-white text-primary d-flex justify-center"
                                    style={{
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                    }}
                                  >
                                    Approval Pending
                                  </div>
                                </div>
                              ) : (
                                <></>
                              )}
                              {/* <div className="cardImage__leftBadge">
                                <div className="form-switch d-flex items-center">
                                  <div className="switch">
                                    <input
                                      type="checkbox"
                                      checked={ev?.Is_Active}
                                      onChange={(e) => {
                                        console.log(e.target.value);

                                        toggleSwitch(
                                          index,
                                          ev?.Is_Active,
                                          ev?.Event_Id
                                        );
                                      }}
                                    />
                                    <span className="switch__slider"></span>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <a
                            className="eventsCard__content mt-10"
                            href={`/event/dashboard/${encryptedParam}`}
                            // onClick={(e) => {
                            //   // e.preventDefault();
                            //   // navigate(`/event/dashboard/${encryptedParam}`);
                            // }}
                          >
                            <div>
                              <h4 className="eventsCard__title text-dark-1 text-15 lh-13 fw-600">
                                <span className="trim-2">
                                  {ev?.Display_Name}
                                </span>
                              </h4>
                            </div>
                            <div className="mt-10">
                              <span className="text-light-1 lh-14 text-13 fw-500 mt-5">
                                <i className="fas fa-map-marker-alt text-primary text-12 fw-600"></i>{" "}
                                {ev?.City_Name}
                              </span>
                              <span className="text-light-1 lh-14 text-13 fw-500 mt-5 ml-10">
                                <i className="fas fa-running text-primary text-12 fw-600"></i>{" "}
                                {ev?.EventType_Name}
                              </span>
                            </div>
                            <div className="d-flex items-center mt-10">
                              {ev?.Event_Category_List?.split(",")?.map(
                                (category) => {
                                  return (
                                    <div className="bg-light-2 rounded-16 text-10 fw-500 text-dark-1 py-5 px-15 lh-1 uppercase mr-5">
                                      {category}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div className="mt-15 pb-5 d-flex gap-15 border-bottom-light">
                              <p className="text-11">
                                Registrations{" "}
                                {selectedTimeline.value === "Past"
                                  ? "Closed"
                                  : "Closing"}{" "}
                                on{" "}
                                <span className="text-primary">
                                  {ev?.Registration_Date}
                                </span>
                              </p>
                              <p className="text-11">
                                Time :{" "}
                                <span className="text-primary">
                                  {ev?.Registration_Time}
                                </span>
                              </p>
                            </div>
                            <div className="row mt-10">
                              <div className="col-4">
                                <p className="text-10 text-light-1 fw-500">
                                  Ticket sold
                                </p>
                                <div className="fw-600 text-13">
                                  <span className="text-primary mr-5 text-12">
                                    <i className="fas fa-ticket-alt"></i>
                                  </span>{" "}
                                  {ev?.TicketSaleCount}
                                </div>
                              </div>
                              <div className="col-4">
                                <p className="text-10 text-light-1 fw-500">
                                  Sales Value
                                </p>
                                <div className="fw-600 text-13">
                                  <span className="text-primary mr-5 text-12">
                                    <i className="fas fa-rupee-sign"></i>
                                  </span>{" "}
                                  {ev?.TicketSaleAmount
                                    ? ev?.TicketSaleAmount
                                    : 0}
                                </div>
                              </div>
                              <div className="col-4">
                                <p className="text-10 text-light-1 fw-500">
                                  Page Views
                                </p>
                                <div className="fw-600 text-13">
                                  <span className="text-primary mr-5 text-12">
                                    <i className="far fa-eye"></i>
                                  </span>{" "}
                                  {ev?.PageCount}
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center">
                  <img
                    src={noResultFound}
                    alt="not-found"
                    style={{ height: "400px", width: "auto" }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AllEvents;

// Ticket_Price_Setting: Yup.boolean().oneOf(
//   [true],
//   "You must agree to Ticket Price Setting"
// ),
// Event_Category: Yup.boolean().oneOf(
//   [true],
//   "You must agree to Event Category"
// ),
// Discount_Details: Yup.boolean().oneOf(
//   [true],
//   "You must agree to Discount Details"
// ),
// Assets: Yup.boolean().oneOf([true], "You must agree to Assets"),
// RaceDay_Takeaway: Yup.boolean().oneOf(
//   [true],
//   "You must agree to RaceDay Takeaway"
// ),
// Participant_Form: Yup.boolean().oneOf(
//   [true],
//   "You must agree to Participant Form"
// ),
// BIB_Expo_Details: Yup.boolean().oneOf(
//   [true],
//   "You must agree to BIB Expo Details"
// ),
