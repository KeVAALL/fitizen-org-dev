// React imports
import React, { useEffect, useState } from "react";

// MUI imports
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

// Third-party imports
// React Router and Redux imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Formik and Yup imports
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin for working with UTC
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import toast from "react-hot-toast";

// Project imports
import { RestfulApiService } from "../../config/service";
import { decryptData } from "../../utils/DataEncryption";
import EventTitle from "./EventTitle";
import Loader from "../../utils/BackdropLoader";
import { timePlaceholder } from "../../utils/UtilityFunctions";
import { LightTooltip } from "../../utils/Tooltip";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function BIBExpo() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [showAddForm, setShowAddForm] = useState(true);
  const [fetchingBib, setFetchingBib] = useState(false);
  const [addingBib, setAddingBib] = useState(false);
  const [initialValues, setInitialValues] = useState({
    Expo_Venue: "",
    Expo_Remarks: "",
    times: [
      {
        dayOne: null,
        expoStartTime1: null,
        expoEndTime1: null,
        expoStartTime2: null,
        expoEndTime2: null,
      },
    ],
    Is_BIB_Expo_Available: false,
  });
  const [Start_Date, setStart_Date] = useState(null);
  const [End_Date, setEnd_Date] = useState(null);

  const convertToExpoDetailsXml = (timesArray) => {
    let xmlString = "<ExpoDetails>\n";

    timesArray.forEach((time) => {
      xmlString += "    <ExpoDatesTag>\n";
      xmlString += `        <ExpoDate>${
        time.dayOne ? dayjs(time.dayOne).format("YYYY-MM-DD") : ""
      }</ExpoDate>\n`;
      xmlString += `        <TimeSolt1starttime>${
        time.expoStartTime1 ? dayjs(time.expoStartTime1).format("HH:mm:ss") : ""
      }</TimeSolt1starttime>\n`;
      xmlString += `        <TimeSolt1endtime>${
        time.expoEndTime1 ? dayjs(time.expoEndTime1).format("HH:mm:ss") : ""
      }</TimeSolt1endtime>\n`;
      xmlString += `        <TimeSolt2starttime>${
        time.expoStartTime2 ? dayjs(time.expoStartTime2).format("HH:mm:ss") : ""
      }</TimeSolt2starttime>\n`;
      xmlString += `        <TimeSolt2endtime>${
        time.expoEndTime2 ? dayjs(time.expoEndTime2).format("HH:mm:ss") : ""
      }</TimeSolt2endtime>\n`;
      xmlString += "    </ExpoDatesTag>\n";
    });

    xmlString += "</ExpoDetails>";
    return xmlString;
  };
  const combineDateAndTime = (dateString, timeString) => {
    // if (!dateString || !timeString) return null; // Return null if either value is missing
    if (!dateString || !timeString || timeString === "00:00:00") return null;

    const date = dayjs(dateString); // Parse the date
    const [hours, minutes, seconds] = timeString.split(":").map(Number); // Split time into components

    return date
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", seconds); // Combine date and time
  };
  async function LoadBib() {
    const reqdata = {
      Method_Name: "GetOne",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingBib(true);
      const result = await RestfulApiService(
        reqdata,
        "organizer/getbibexpodetails"
      );
      if (result) {
        console.log(result?.data?.Result?.Table1);

        setStart_Date(result?.data?.Result?.Table1[0]?.Start_Date);
        setEnd_Date(result?.data?.Result?.Table1[0]?.End_Date);
        setInitialValues({
          Expo_Venue: result?.data?.Result?.Table1[0]?.BIB_Expo_Venue,
          Expo_Remarks: result?.data?.Result?.Table1[0]?.BIB_Expo_Comments,
          Is_BIB_Expo_Available: Boolean(
            result?.data?.Result?.Table1[0]?.Is_BIB_Expo_Available
          ),
          times: result?.data?.Result?.Table2?.map((t) => {
            return {
              dayOne: dayjs(t?.BIB_Date),
              expoStartTime1: combineDateAndTime(t?.BIB_Date, t?.BIB_StartTime),
              expoEndTime1: combineDateAndTime(t?.BIB_Date, t?.BIB_EndTime),
              expoStartTime2: combineDateAndTime(
                t?.BIB_Date,
                t?.BIB_StartTime_S2
              ),
              expoEndTime2: combineDateAndTime(t?.BIB_Date, t?.BIB_EndTime_S2),
            };
          }),
          // times: [
          //   {
          //     dayOne: null,
          //     expoStartTime1: null,
          //     expoEndTime1: null,
          //     expoStartTime2: null,
          //     expoEndTime2: null,
          //   },
          // ],
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingBib(false);
    }
  }
  useEffect(() => {
    if (event_id) {
      LoadBib();
    }
  }, [event_id]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20 px-30">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {fetchingBib ? (
                <Loader fetching={fetchingBib} />
              ) : (
                <>
                  <EventTitle />

                  {showAddForm ? (
                    <Formik
                      enableReinitialize
                      initialValues={initialValues}
                      validationSchema={Yup.object({
                        Expo_Venue: Yup.string().required(
                          "BIB Expo Venue is required"
                        ),
                        Expo_Remarks: Yup.string().required(
                          "Add Instructions is required"
                        ),
                        times: Yup.array().of(
                          Yup.object().shape({
                            dayOne: Yup.date()
                              .required("Please select a date")
                              .test(
                                "dayOne-range",
                                `The date must be between ${dayjs(
                                  Start_Date
                                ).format("DD-MM-YYYY")} and ${dayjs(
                                  End_Date
                                ).format("DD-MM-YYYY")}`,
                                (value) => {
                                  if (!value) return false;
                                  const start = dayjs(Start_Date);
                                  const end = dayjs(End_Date);
                                  const current = dayjs(value);
                                  // Check if the current date is within the range (inclusive)
                                  return (
                                    current.isSameOrAfter(start, "date") &&
                                    current.isSameOrBefore(end, "date")
                                  );
                                }
                              ),
                            expoStartTime1: Yup.date().nullable(),
                            //   .required(
                            //   "Please enter the Expo Start Time 1"
                            // ),
                            expoEndTime1: Yup.date().nullable(),
                            //   .required(
                            //   "Please enter the Expo End Time 1"
                            // ),
                            expoStartTime2: Yup.date().nullable(),
                            //   .required(
                            //   "Please enter the Expo Start Time 2"
                            // ),
                            expoEndTime2: Yup.date().nullable(),
                            //   .required(
                            //   "Please enter the Expo End Time 2"
                            // ),
                          })
                        ),
                        Is_BIB_Expo_Available: Yup.boolean().required(
                          "BIB Expo availability status is required"
                        ),
                      })}
                      onSubmit={async (values) => {
                        console.log(values);

                        const expoDetailsXml = convertToExpoDetailsXml(
                          values.times
                        );
                        const reqdata = {
                          Method_Name: "Create",
                          Event_Id: decryptData(event_id),
                          Session_User_Id: user?.User_Id,
                          Session_User_Name: user?.User_Display_Name,
                          Session_Organzier_Id: user?.Organizer_Id,
                          Org_Id: user?.Org_Id,
                          Is_BIB_Expo_Available: values.Is_BIB_Expo_Available
                            ? 1
                            : 0,
                          Expo_Venue: values.Expo_Venue,
                          Expo_Remarks: values.Expo_Remarks,
                          XMLDate: convertToExpoDetailsXml(values.times),
                        };

                        try {
                          setAddingBib(true);

                          const result = await RestfulApiService(
                            reqdata,
                            "organizer/addbibexpodetails"
                          );
                          if (
                            result?.data?.Result?.Table1[0]?.Result_Id === -1
                          ) {
                            toast.error(
                              result?.data?.Result?.Table1[0]
                                ?.Result_Description
                            );
                            return;
                          }
                          if (result) {
                            toast.success(
                              result?.data?.Result?.Table1[0]
                                ?.Result_Description
                            );
                            LoadBib();
                            // setShowAddForm(false);
                          }
                        } catch (err) {
                          toast.error(
                            err?.Result?.Table1[0]?.Result_Description
                          );
                        } finally {
                          setAddingBib(false);
                        }

                        console.log(expoDetailsXml);
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="col-xl-12 col-md-12">
                            <div className="row y-gap-20">
                              <div className="col-10">
                                <div className="single-field">
                                  <label className="text-13 fw-500">
                                    BIB Expo Venue
                                  </label>
                                  <div className="form-control">
                                    <Field
                                      name="Expo_Venue"
                                      placeholder="BIB Expo Venue"
                                      className="form-control"
                                      onChange={(e) => {
                                        e.preventDefault();
                                        const { value } = e.target;

                                        const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                        if (
                                          !value ||
                                          (regex.test(value.toString()) &&
                                            value.length <= 500)
                                        ) {
                                          setFieldValue("Expo_Venue", value);
                                        } else {
                                          return;
                                        }
                                      }}
                                    />
                                  </div>
                                  <ErrorMessage
                                    name="Expo_Venue"
                                    component="div"
                                    className="text-error-2 text-13 mt-5"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-2 col-md-2">
                                <div className="single-field">
                                  <label className="text-13 fw-500">
                                    BIB Expo Available?
                                  </label>
                                  <div className="form-switch d-flex mt-5">
                                    <div className="switch">
                                      <input
                                        type="checkbox"
                                        checked={values?.Is_BIB_Expo_Available}
                                        onChange={(e) => {
                                          console.log(e);

                                          setFieldValue(
                                            "Is_BIB_Expo_Available",
                                            e.target.checked
                                          );
                                        }}
                                      />
                                      <span className="switch__slider"></span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="single-field">
                                  <label className="text-13 fw-500">
                                    Add Instructions{" "}
                                  </label>
                                  <div className="form-control">
                                    {/* <textarea
                                  rows="3"
                                  placeholder="Add Instructions "
                                  name="addins"
                                ></textarea> */}
                                    <Field
                                      name="Expo_Remarks"
                                      as="textarea"
                                      rows="3"
                                      placeholder="Add Instructions"
                                      // onChange={(e) => {
                                      //   e.preventDefault();
                                      //   const { value } = e.target;

                                      //   const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                      //   if (
                                      //     !value ||
                                      //     (regex.test(value.toString()) &&
                                      //       value.length <= 300)
                                      //   ) {
                                      //     setFieldValue("Expo_Remarks", value);
                                      //   } else {
                                      //     return;
                                      //   }
                                      // }}
                                    />
                                  </div>
                                  <ErrorMessage
                                    name="Expo_Remarks"
                                    component="div"
                                    className="text-error-2 text-13 mt-5"
                                  />
                                </div>
                              </div>

                              <FieldArray name="times">
                                {({ push, remove }) => (
                                  <>
                                    {values.times.map((time, index) => (
                                      <>
                                        <div className="col-3">
                                          <div className="single-field">
                                            <label className="text-13 fw-600">
                                              Day One{" "}
                                              <sup className="asc">*</sup>
                                            </label>
                                            <div className="form-control">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                              >
                                                <DesktopDatePicker
                                                  className="form-control"
                                                  name="Date_Of_Birth"
                                                  format="DD/MM/YYYY"
                                                  inputFormat="DD/MM/YYYY"
                                                  value={time.dayOne}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].dayOne`,
                                                      newValue
                                                    )
                                                  }
                                                  minDate={dayjs()}
                                                  maxDate={dayjs(End_Date)}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      sx={{
                                                        fontFamily:
                                                          "Montserrat, sans-serif !important",
                                                        "& .MuiButtonBase-root":
                                                          {
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
                                                    // textField: {
                                                    //   onClick: () => setOpen(true),
                                                    // },
                                                    field: {
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
                                              name={`times[${index}].dayOne`}
                                              component="div"
                                              className="text-error-2 text-13 mt-5"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="single-field">
                                            <label className="text-13 fw-500">
                                              Expo Start Time 1
                                            </label>
                                            <div className="form-control">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={timePlaceholder}
                                              >
                                                <TimePicker
                                                  className="form-control"
                                                  placeholder="--:--"
                                                  value={time.expoStartTime1}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].expoStartTime1`,
                                                      newValue
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="--:--"
                                                      sx={{
                                                        fontFamily:
                                                          "Montserrat, sans-serif !important",
                                                        "& .MuiButtonBase-root":
                                                          {
                                                            color: "orange",
                                                          },
                                                        paddingRight: "5px",
                                                      }}
                                                      fullWidth
                                                      className="form-control"
                                                    />
                                                  )}
                                                  timeSteps={{ minutes: 1 }}
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    field: {
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
                                              name={`times[${index}].expoStartTime1`}
                                              component="div"
                                              className="text-error-2 text-13 mt-5"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-2">
                                          <div className="single-field">
                                            <label className="text-13 fw-500">
                                              Expo End Time 1
                                            </label>
                                            <div className="form-control">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={timePlaceholder}
                                              >
                                                <TimePicker
                                                  className="form-control"
                                                  placeholder="--/--"
                                                  value={time.expoEndTime1}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].expoEndTime1`,
                                                      newValue
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="--/--"
                                                      sx={{
                                                        fontFamily:
                                                          "Montserrat, sans-serif !important",
                                                        "& .MuiButtonBase-root":
                                                          {
                                                            color: "orange",
                                                          },
                                                      }}
                                                      fullWidth
                                                      className="form-control"
                                                    />
                                                  )}
                                                  timeSteps={{ minutes: 1 }}
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    field: {
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
                                              name={`times[${index}].expoEndTime1`}
                                              component="div"
                                              className="text-error-2 text-13 mt-5"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-2">
                                          <div className="single-field">
                                            <label className="text-13 fw-500">
                                              Expo Start Time 2
                                            </label>
                                            <div className="form-control">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={timePlaceholder}
                                              >
                                                <TimePicker
                                                  className="form-control"
                                                  placeholder="--/--"
                                                  value={time.expoStartTime2}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].expoStartTime2`,
                                                      newValue
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="--/--"
                                                      sx={{
                                                        fontFamily:
                                                          "Montserrat, sans-serif !important",
                                                        "& .MuiButtonBase-root":
                                                          {
                                                            color: "orange",
                                                          },
                                                      }}
                                                      fullWidth
                                                      className="form-control"
                                                    />
                                                  )}
                                                  timeSteps={{ minutes: 1 }}
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    field: {
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
                                              name={`times[${index}].expoStartTime2`}
                                              component="div"
                                              className="text-error-2 text-13 mt-5"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-2">
                                          <div className="single-field">
                                            <label className="text-13 fw-500">
                                              Expo End Time 2
                                            </label>
                                            <div className="form-control">
                                              <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={timePlaceholder}
                                              >
                                                <TimePicker
                                                  className="form-control"
                                                  placeholder="--/--"
                                                  value={time.expoEndTime2}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].expoEndTime2`,
                                                      newValue
                                                    )
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="--/--"
                                                      sx={{
                                                        fontFamily:
                                                          "Montserrat, sans-serif !important",
                                                        "& .MuiButtonBase-root":
                                                          {
                                                            color: "orange",
                                                          },
                                                      }}
                                                      fullWidth
                                                      className="form-control"
                                                    />
                                                  )}
                                                  timeSteps={{ minutes: 1 }}
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    field: {
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
                                              name={`times[${index}].expoEndTime2`}
                                              component="div"
                                              className="text-error-2 text-13 mt-5"
                                            />
                                          </div>
                                        </div>

                                        {index !== 0 && (
                                          <div className="col-1 relative">
                                            <label className="text-13 text-white fw-500">
                                              __
                                            </label>
                                            <button
                                              onClick={() => remove(index)}
                                              className="button w-45 h-45 border-primary-bold text-20 fw-600 rounded-full"
                                              // style={{ top: 0 }}
                                            >
                                              -
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    ))}

                                    <div className="col-12 d-flex">
                                      <div className="d-flex gap-10 items-center">
                                        {/* <LightTooltip
                                          arrow
                                          title="Add more BIB Expo Dates"
                                          placement="right"
                                        > */}
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            push({
                                              dayOne: null,
                                              expoStartTime1: null,
                                              expoEndTime1: null,
                                              expoStartTime2: null,
                                              expoEndTime2: null,
                                            });
                                          }}
                                          className="button w-45 h-45 border-primary-bold text-20 fw-600 rounded-full"
                                        >
                                          +
                                        </button>
                                        {/* </LightTooltip> */}
                                        <div className="text-11 text-reading fw-400">
                                          Add more BIB Expo Dates
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </FieldArray>
                              <div className="col-12 d-flex">
                                <div className="row">
                                  <div className="col-auto relative">
                                    <button
                                      disabled={addingBib}
                                      type="submit"
                                      className="button bg-primary w-150 h-50 rounded-24 px-15 text-white border-light load-button"
                                    >
                                      {!addingBib ? (
                                        `Save`
                                      ) : (
                                        <span className="btn-spinner"></span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <>
                      <div className="col-xl-12 col-md-12">
                        <div
                          className="py-20 px-30 lg:px-10 rounded-16 bg-white"
                          style={{
                            boxShadow: "2.46px 2.46px 15.99px 0px #00000021",
                          }}
                        >
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-4 col-md-4 text-center">
                              <div className="text-13 text-primary lh-16 fw-600">
                                BIB Expo Venue
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 text-center">
                              <div className="text-13 text-primary lh-16 fw-600">
                                Start Date
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 text-center">
                              <div className="text-13 text-primary lh-16 fw-600">
                                Expo Time
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 text-center">
                              <div className="text-13 lh-16 fw-600">
                                Make BIB Expo Live
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 text-center">
                              <div className="text-14 text-reading lh-16 fw-500">
                                The St. Regis Mumbai, Senapati Bapat Marg, Lower
                                Parel, Mumbai, Maharashtra, India
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 text-center pt-0">
                              <div className="text-14 text-reading lh-16 fw-500">
                                12/12/2024
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 text-center pt-0">
                              <div className="text-14 text-reading lh-16 fw-500">
                                1:00 PM to 3:00 PM
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 items-center pt-0">
                              <div className="form-switch d-flex justify-center items-center">
                                <div className="switch">
                                  <input type="checkbox" />
                                  <span className="switch__slider"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12 d-flex justify-end">
                        <button
                          onClick={() => {
                            setShowAddForm(true);
                          }}
                          className="button bg-primary rounded-22 px-30 py-10 text-white text-16 -grey-1 w-100 d-flex gap-10"
                        >
                          ADD
                          <i className="fas fa-plus text-16"></i>
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BIBExpo;

// To change Icon
// slots={{
//   openPickerIcon: () => (
//     <img
//       src={DateIcon}
//       alt="date-icon"
//       style={{ cursor: "pointer" }}
//       onClick={() => setOpen(true)}
//     />
//   ),
// }}
