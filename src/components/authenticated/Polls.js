import React, { useEffect, useState } from "react";

import Event5 from "../../assets/img/events/event5.png";
import { RestfulApiService } from "../../config/service";
import { useParams } from "react-router-dom";
import { decryptData } from "../../utils/DataEncryption";
import { useSelector } from "react-redux";
import { Backdrop, Box, CircularProgress, Modal, Stack } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import { selectCustomStyle } from "../../utils/ReactSelectStyles";
import toast from "react-hot-toast";
import EventTitle from "./EventTitle";

function Polls() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingPolls, setFetchingPolls] = useState(false);
  const [allPolls, setAllPolls] = useState([]);
  const [addingPoll, setAddingPoll] = useState(false);
  const [isEditingPoll, setIsEditingPoll] = useState(false);
  const [pollModal, setPollModal] = useState(false);
  const [pollInitialValues, setPollInitialValues] = useState({
    Poll_Name: "",
    Question: "", // This will be controlled by ReactQuill
    Poll_Type: null,
    Mini_Rating: 0,
    Max_Rating: 0,
  });
  const pollType = [
    { value: "Star", label: "Star Rating" },
    { value: "Slider", label: "Slider Rating" },
  ];
  async function LoadPolls() {
    const reqdata = {
      Method_Name: "Get",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Poll_Name: "",
      Poll_Id: "",
    };
    try {
      setFetchingPolls(true);
      const result = await RestfulApiService(reqdata, "organizer/pollget");
      if (result) {
        console.log(result?.data?.Result?.Table1);

        setAllPolls(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingPolls(false);
    }
  }
  useEffect(() => {
    if (event_id) {
      LoadPolls();
    }
  }, [event_id]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {fetchingPolls ? (
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
                    open={fetchingPolls}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
              ) : (
                <>
                  <Modal open={pollModal}>
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
                      <Stack direction="column" alignItems="center" spacing={1}>
                        <Stack
                          style={{ width: "100%" }}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <div className="text-16 lh-16 fw-600 text-primary">
                            Add Poll
                          </div>
                          <i
                            onClick={() => {
                              setPollModal(false);
                              setPollInitialValues({
                                Poll_Name: "",
                                Question: "", // This will be controlled by ReactQuill
                                Poll_Type: null,
                                Mini_Rating: 0,
                                Max_Rating: 0,
                              });
                            }}
                            class="fas fa-times text-16 text-primary cursor-pointer"
                          ></i>
                        </Stack>

                        <Formik
                          initialValues={pollInitialValues}
                          validationSchema={Yup.object(
                            {
                              Poll_Name: Yup.string().required(
                                "Poll Name is required"
                              ),
                              Question: Yup.string().required(
                                "Question is required"
                              ),
                              Poll_Type: Yup.object().required("Please select"),
                              Mini_Rating: Yup.number()
                                .required("Min Rating is required")
                                .min(
                                  1,
                                  "Rating must be greater than or equal to 1"
                                )
                                .max(
                                  Yup.ref("Max_Rating"),
                                  "Minimum rating cannot be greater than maximum rating"
                                ),
                              // .when("Max_Rating", (Max_Rating, schema) => {
                              //   return schema.test({
                              //     test: (Mini_Rating) =>
                              //       Mini_Rating <= Max_Rating,
                              //     message:
                              //       "Minimum Rating must be less than Maximum Rating",
                              //   });
                              // }),
                              Max_Rating: Yup.number()
                                .required("Max Rating is required")
                                .min(
                                  1,
                                  "Rating must be greater than or equal to 1"
                                )
                                .min(
                                  Yup.ref("Mini_Rating"),
                                  "Maximum rating cannot be less than minimum rating"
                                )
                                .test({
                                  name: "max",
                                  exclusive: false,
                                  // message:
                                  //   "Max Rating cannot exceed 5 for Star Rating", // Custom message
                                  message:
                                    "Max Rating cannot exceed the allowed maximum", // General error message
                                  test: function (value) {
                                    const { Poll_Type } = this.parent; // Access Poll_Type
                                    // Check if Poll_Type is "Star Rating" and ensure Max_Rating is <= 5
                                    // if (Poll_Type?.value === "Star") {
                                    //   return value <= 5;
                                    // }
                                    if (Poll_Type?.value === "Star Rating") {
                                      return (
                                        value <= 5 ||
                                        this.createError({
                                          message: `Max Rating cannot exceed 5 for Star Rating`,
                                        })
                                      );
                                    } else if (Poll_Type?.value === "Slider") {
                                      return (
                                        value <= 10 ||
                                        this.createError({
                                          message: `Max Rating cannot exceed 10 for Slider Rating`,
                                        })
                                      );
                                    }
                                    return true; // If Poll_Type is not "Star Rating", skip the condition
                                  },
                                }),

                              // .test(
                              //   "max-rating-limit", // Test name
                              //   "For Star Rating, Max Rating cannot exceed 5", // Validation message
                              //   function (value) {
                              //     const { Poll_Type } = this.parent;
                              //     if (
                              //       Poll_Type?.value === "Star" &&
                              //       value > 5
                              //     ) {
                              //       return false; // Fail the validation if max rating exceeds 5
                              //     }
                              //     return true; // Otherwise, pass the validation
                              //   }
                              // ),
                            },
                            [["Max_Rating", "Mini_Rating"]]
                          )}
                          onSubmit={async (values) => {
                            console.log(values);

                            const reqdata = {
                              ...values,
                              Method_Name: isEditingPoll ? "Update" : "Create",
                              Event_Id: decryptData(event_id),
                              Session_User_Id: user?.User_Id,
                              Session_User_Name: user?.User_Display_Name,
                              Session_Organzier_Id: user?.Organizer_Id,
                              Org_Id: user?.Org_Id,
                              Poll_Id: isEditingPoll ? values?.Poll_Id : " ",
                              Poll_Type: values?.Poll_Type?.value,
                              Is_Active: 1,
                            };
                            try {
                              setAddingPoll(true);

                              const result = await RestfulApiService(
                                reqdata,
                                "organizer/pollset"
                              );
                              if (
                                result?.data?.Result?.Table1[0]?.Result_Id ===
                                -1
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
                                setPollModal(false);
                                setPollInitialValues({
                                  Poll_Name: "",
                                  Question: "", // This will be controlled by ReactQuill
                                  Poll_Type: null,
                                  Mini_Rating: 0,
                                  Max_Rating: 0,
                                });
                                LoadPolls();
                              }
                            } catch (err) {
                              console.log(err);
                            } finally {
                              setAddingPoll(false);
                            }
                          }}
                        >
                          {({ setFieldValue, values }) => (
                            <Form
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                              }}
                            >
                              <div className="single-field w-full">
                                <label className="text-13 text-reading fw-500">
                                  Poll Name
                                </label>
                                <div className="form-control">
                                  <Field
                                    name="Poll_Name"
                                    className="form-control"
                                    placeholder="Add Poll Name"
                                    onChange={(e) => {
                                      e.preventDefault();
                                      const { value } = e.target;

                                      const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                      if (
                                        !value ||
                                        (regex.test(value.toString()) &&
                                          value.length <= 50)
                                      ) {
                                        setFieldValue("Poll_Name", value);
                                      } else {
                                        return;
                                      }
                                    }}
                                  />
                                </div>
                                <ErrorMessage
                                  name="Poll_Name"
                                  component="div"
                                  className="text-error-2 text-13 mt-5"
                                />
                              </div>

                              <div className="single-field w-full">
                                <label className="text-13 text-reading fw-500">
                                  Add Question
                                </label>
                                <div className="form-control">
                                  <Field
                                    name="Question"
                                    className="form-control"
                                    placeholder="Add Question"
                                    onChange={(e) => {
                                      e.preventDefault();
                                      const { value } = e.target;

                                      const regex = /^[a-zA-Z][a-zA-Z\s?]*$/;

                                      if (
                                        !value ||
                                        (regex.test(value.toString()) &&
                                          value.length <= 50)
                                      ) {
                                        setFieldValue("Question", value);
                                      } else {
                                        return;
                                      }
                                    }}
                                  />
                                </div>
                                <ErrorMessage
                                  name="Question"
                                  component="div"
                                  className="text-error-2 text-13 mt-5"
                                />
                              </div>

                              <div className="y-gap-10">
                                <label className="text-13 text-reading fw-500">
                                  Select Type
                                </label>
                                <div className="p-0">
                                  <Select
                                    placeholder="Select Poll Type"
                                    styles={selectCustomStyle}
                                    onChange={(e) => {
                                      setFieldValue("Poll_Type", e);
                                    }}
                                    isSearchable={false}
                                    options={pollType}
                                    value={values.Poll_Type}
                                  />
                                </div>
                                <ErrorMessage
                                  name="Poll_Type"
                                  component="div"
                                  className="text-error-2 text-13 mt-5"
                                />
                              </div>

                              {/* Mini Rating Field */}

                              <div className="single-field w-full">
                                <label className="text-13 text-reading fw-500">
                                  Minimum Rating
                                </label>
                                <div className="form-control">
                                  <Field
                                    name="Mini_Rating"
                                    type="number"
                                    className="form-control"
                                    placeholder="Minimum Rating"
                                  />
                                </div>
                                <ErrorMessage
                                  name="Mini_Rating"
                                  component="div"
                                  className="text-error-2 text-13 mt-5"
                                />
                              </div>

                              {/* Max Rating Field */}
                              <div className="single-field w-full">
                                <label className="text-13 text-reading fw-500">
                                  Maximum Rating
                                </label>
                                <div className="form-control">
                                  <Field
                                    name="Max_Rating"
                                    type="number"
                                    className="form-control"
                                    placeholder="Maximum Rating"
                                  />
                                </div>
                                <ErrorMessage
                                  name="Max_Rating"
                                  component="div"
                                  className="text-error-2 text-13 mt-5"
                                />
                              </div>

                              <Stack
                                style={{ width: "100%" }}
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                className="mt-20"
                              >
                                <div className="col-auto relative">
                                  <button
                                    disabled={addingPoll}
                                    type="submit"
                                    className="button bg-primary w-200 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                                  >
                                    {!addingPoll ? (
                                      `Save`
                                    ) : (
                                      <span className="btn-spinner"></span>
                                    )}
                                  </button>
                                </div>
                              </Stack>
                            </Form>
                          )}
                        </Formik>
                      </Stack>
                    </Box>
                  </Modal>

                  <EventTitle />

                  <div className="py-20 px-20">
                    <div className="row y-gap-20 justify-between items-center">
                      <div className="col-auto col-auto">
                        <h6 className="text-18 fw-500 text-primary">
                          Create Polls for the participants
                        </h6>
                      </div>
                      <div className="col-auto">
                        <button
                          onClick={() => {
                            setPollModal(true);
                          }}
                          className="button border-primary rounded-22 px-30 py-10 text-primary text-12 -primary-1"
                        >
                          <span className="text-16 mr-5">+</span> Create Polls
                        </button>
                      </div>

                      {allPolls?.length > 0 &&
                        allPolls?.map((poll) => {
                          return (
                            <div className="col-xl-12 col-md-12">
                              <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                                <div className="row y-gap-20 justify-between items-center">
                                  <div className="col-lg-10 col-md-10">
                                    <div className="text-16 lh-16 fw-500">
                                      {poll?.Poll_Name}
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-2">
                                    <div className="d-flex gap-20 items-center">
                                      <div className="form-switch d-flex items-center">
                                        <div className="switch">
                                          <input type="checkbox" />
                                          <span className="switch__slider"></span>
                                        </div>
                                      </div>
                                      <a
                                        href="#0"
                                        className="text-20"
                                        style={{ color: "#aeaeae" }}
                                      >
                                        <i className="fas fa-eye"></i>
                                      </a>
                                      <button
                                        className="text-20"
                                        style={{ color: "#aeaeae" }}
                                        onClick={() => {
                                          setIsEditingPoll(true);
                                          setPollInitialValues({
                                            ...poll,
                                            Poll_Type: pollType?.filter(
                                              (p) => p.value === poll.Poll_Type
                                            )[0],
                                          });
                                          setPollModal(true);
                                        }}
                                      >
                                        <i className="fas fa-pencil-alt"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Polls;
