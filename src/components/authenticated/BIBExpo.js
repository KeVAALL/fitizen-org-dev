import React, { useEffect, useState } from "react";

import Event5 from "../../assets/img/events/event5.png";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RestfulApiService } from "../../config/service";
import { decryptData } from "../../utils/storage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin for working with UTC
import timezone from "dayjs/plugin/timezone";
import toast from "react-hot-toast";

dayjs.extend(utc);
dayjs.extend(timezone);
// const convertToIST = (time) => {
//   return dayjs(time)
//     .tz("Asia/Kolkata") // Convert to IST
//     .format("hh:mm A"); // Format as 12-hour time with AM/PM
// };

function BIBExpo() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [showAddForm, setShowAddForm] = useState(true);
  const [fetchingBib, setFetchingBib] = useState(false);
  const [addingBib, setAddingBib] = useState(false);
  const [allBib, setAllBib] = useState([]);
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

  const convertToExpoDetailsXml = (timesArray) => {
    let xmlString = "<ExpoDetails>\n";

    timesArray.forEach((time) => {
      xmlString += "    <ExpoDatesTag>\n";
      xmlString += `        <ExpoDate>${dayjs(time.dayOne).format(
        "YYYY-MM-DD"
      )}</ExpoDate>\n`;
      xmlString += `        <TimeSolt1starttime>${dayjs(
        time.expoStartTime1
      ).format("HH:mm:ss")}</TimeSolt1starttime>\n`;
      xmlString += `        <TimeSolt1endtime>${dayjs(time.expoEndTime1).format(
        "HH:mm:ss"
      )}</TimeSolt1endtime>\n`;
      xmlString += `        <TimeSolt2starttime>${dayjs(
        time.expoStartTime2
      ).format("HH:mm:ss")}</TimeSolt2starttime>\n`;
      xmlString += `        <TimeSolt2endtime>${dayjs(time.expoEndTime2).format(
        "HH:mm:ss"
      )}</TimeSolt2endtime>\n`;
      xmlString += "    </ExpoDatesTag>\n";
    });

    xmlString += "</ExpoDetails>";
    return xmlString;
  };
  const combineDateAndTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null; // Return null if either value is missing

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

        // setAllBib(result?.data?.Result?.Table1);
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
                    open={fetchingBib}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
              ) : (
                <>
                  <div className="col-xl-12 col-md-12">
                    <div className="py-10 px-15 rounded-8 bg-white border-light">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-1">
                          <div className="w-50 h-50 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </div>
                        <div className="col-10">
                          <div className="text-16 lh-16 fw-500">
                            Golden Triangle Challenge: Run through India's Rich
                            Heritage
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="form-switch d-flex items-center">
                            <div className="switch">
                              <input type="checkbox" />
                              <span className="switch__slider"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                            dayOne: Yup.date().required("Required"),
                            expoStartTime1: Yup.date().required("Required"),
                            expoEndTime1: Yup.date().required("Required"),
                            expoStartTime2: Yup.date().required("Required"),
                            expoEndTime2: Yup.date().required("Required"),
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
                                            value.length <= 50)
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
                                                  disableFuture
                                                  value={time.dayOne}
                                                  onChange={(newValue) =>
                                                    setFieldValue(
                                                      `times[${index}].dayOne`,
                                                      newValue
                                                    )
                                                  }
                                                  // maxDate={dayjs().subtract(8, "year")}
                                                  // value={
                                                  //   values.Date_Of_Birth
                                                  //     ? dayjs(values.Date_Of_Birth)
                                                  //     : null
                                                  // }
                                                  // onChange={(newValue) => {
                                                  //   setFieldValue("Date_Of_Birth", newValue);
                                                  // }}
                                                  // open={open}
                                                  // onOpen={() => setOpen(true)}
                                                  // onClose={() => setOpen(false)}
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
                                              >
                                                <TimePicker
                                                  className="form-control"
                                                  placeholder="--/--"
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
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    // textField: {
                                                    //   onClick: () => setOpen(true),
                                                    // },
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
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    // textField: {
                                                    //   onClick: () => setOpen(true),
                                                    // },
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
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    // textField: {
                                                    //   onClick: () => setOpen(true),
                                                    // },
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
                                                  slotProps={{
                                                    inputAdornment: {
                                                      position: "end",
                                                    },
                                                    // textField: {
                                                    //   onClick: () => setOpen(true),
                                                    // },
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
                                      {/* <div className="single-field"> */}
                                      {/* <label className="text-13 fw-500">&nbsp; </label> */}
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
                                      {/* </div> */}
                                    </div>
                                  </>
                                )}
                              </FieldArray>
                              {/* <div className="col-12 mt-10">
                                <button
                                  type="submit"
                                  className="button bg-primary rounded-22 px-30 py-10 text-white text-12 -grey-1 w-100"
                                >
                                  Save
                                </button>
                              </div> */}
                              <div className="col-auto relative">
                                <button
                                  disabled={addingBib}
                                  type="submit"
                                  className="button bg-primary w-100 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
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
