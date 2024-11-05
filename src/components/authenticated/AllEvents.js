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

function AllEvents() {
  const user = useSelector((state) => state.user.userProfile);
  const navigate = useNavigate();

  const [fetchingDashboard, setFetchingDashboard] = useState(false);
  const [cloneModal, setCloneModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [cloneEventDetails, setCloneEventDetails] = useState(null);
  const [submitModalForm, setSubmitModalForm] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const eventFilter = [
    {
      label: "Past Events",
      value: "Past",
    },
    {
      label: "Future Events",
      value: "Future",
    },
  ];
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
      Method_Name: "HomePage",
      SearchBy: "",
      TypeEvent: "",
      EventId: "",
      FromDate: "",
      ToDate: "",
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
  }
  const handleDateFilter = async (eventTimeline) => {
    let From_Date = "";
    let To_Date = "";

    const today = dayjs().format("YYYY-MM-DD"); // Current date
    if (eventTimeline === "Past") {
      From_Date = dayjs().subtract(2, "year").format("YYYY-MM-DD");
      To_Date = today;
      // setFromDate(dayjs().subtract(2, "year").format("YYYY-MM-DD"));
      // setToDate(today);
    } else if (eventTimeline === "Future") {
      From_Date = today;
      To_Date = dayjs().add(2, "year").format("YYYY-MM-DD");
      // setFromDate(today);
      // setToDate(dayjs().add(2, "year").format("YYYY-MM-DD"));
    }

    const reqdata = {
      Method_Name: "HomePage",
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
  const handleSearch = async (eventValue) => {
    const today = dayjs().format("YYYY-MM-DD");
    const reqdata = {
      Method_Name: "HomePage",
      SearchBy: eventValue, // Pass the search term here
      TypeEvent: "",
      EventId: "",
      FromDate:
        selectedTimeline?.value === "Past"
          ? dayjs().subtract(2, "year").format("YYYY-MM-DD")
          : selectedTimeline?.value === "Future"
          ? today
          : "",
      ToDate:
        selectedTimeline?.value === "Past"
          ? today
          : selectedTimeline?.value === "Future"
          ? dayjs().add(2, "year").format("YYYY-MM-DD")
          : "",
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
  // Create a debounced version of handleSearch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value), 500), // Adjust delay as needed
    []
  );

  // Update searchTerm on input change and call debounced search
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
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
      setFetchingDashboard(true);
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
        // console.log(isActive ? "Event deactivated successfully!" : "Event activated successfully!");
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
      setFetchingDashboard(false);
    }
  };
  const shareContent = async (eventId, displayName) => {
    const encryptedParam = encryptData(eventId);
    // const url1 = window.location.href;
    // const url = `${url1}event-details/${removeSpace(
    //   displayName
    // )}/${encryptedParam}`;
    const url = `http://localhost:3000/event/dashboard/${encryptedParam}`;
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
                    // menuIsOpen={true}
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
            <Modal
              open={cloneModal}
              onClose={() => {
                setCloneModal(false);
              }}
            >
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
                <Stack direction="column" alignItems="center" spacing={4}>
                  <div className="text-16 lh-16 fw-600 mt-5 text-primary">
                    CLONE EVENT
                  </div>
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

                                    const regex = /^[^\s].*$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 200)
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
                                  if (errors.Event_Name) {
                                    toast.error(errors.Event_Name); // Show error for eventName
                                  }
                                  if (errors.checkboxes) {
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
              ) : (
                events?.map((ev, index) => {
                  const encryptedParam = encryptData(ev?.Event_Id);
                  return (
                    <div className="col-xl-4 col-lg-4 col-sm-6">
                      <div className="border-light rounded-16 px-15 py-15 -hover-shadow h-full">
                        <div className="eventsCard -type-1">
                          <div className="eventsCard__image">
                            <div className="cardImage ratio ratio-2:1">
                              <div className="cardImage__content">
                                <img
                                  className="rounded-16 col-12"
                                  src={`${MEDIA_URL}${ev?.Image_Path}`}
                                  alt="card"
                                />
                              </div>

                              <div className="cardImage__wishlist d-flex">
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
                              </div>
                            </div>
                          </div>
                          <div className="eventsCard__content mt-10">
                            <a href={`/event/dashboard/${encryptedParam}`}>
                              <h4 className="eventsCard__title text-dark-1 text-15 lh-13 fw-600">
                                <span className="trim-2">
                                  {ev?.Display_Name}
                                </span>
                              </h4>
                            </a>
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
                              {/* <div className="bg-light-2 rounded-16 text-10 fw-500 text-dark-1 py-5 px-15 lh-1 uppercase mr-5">
                              HALF MARATHON
                            </div>
                            <div className="bg-light-2 rounded-16 text-10 fw-500 text-dark-1 py-5 px-15 lh-1 uppercase">
                              10KM RUN
                            </div> */}
                            </div>
                            <div className="mt-15 pb-5 d-flex gap-15 border-bottom-light">
                              <p className="text-11">
                                Date :{" "}
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
                                  {ev?.TicketSaleAmount}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
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
