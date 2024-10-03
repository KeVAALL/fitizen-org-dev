import React, { useEffect, useState } from "react";

import Event5 from "../../assets/img/events/event5.png";
import { RestfullApiService } from "../../config/service";
import { useParams } from "react-router-dom";
import { decryptData } from "../../utils/storage";
import { useSelector } from "react-redux";
import { Backdrop, Box, CircularProgress, Modal, Stack } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import { selectCustomStyle } from "../../utils/selectCustomStyle";

function Polls() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingPolls, setFetchingPolls] = useState(false);
  const [addingPoll, setAddingPoll] = useState(false);
  const [pollModal, setPollModal] = useState(false);
  const pollType = [
    { value: "Star Rating", label: "Star Rating" },
    { value: "Slider Rating", label: "Slider Rating" },
  ];
  useEffect(() => {
    async function LoadParticipants() {
      const reqdata = {
        Method_Name: "Get",
        Event_Id: decryptData(event_id),
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
        Org_Id: "",
        Poll_Name: "",
        Poll_Id: "",
      };
      try {
        setFetchingPolls(true);
        const result = await RestfullApiService(reqdata, "organizer/pollget");
        if (result) {
          console.log(result?.data?.Result?.Table1);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingPolls(false);
      }
    }

    if (event_id) {
      LoadParticipants();
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
                            }}
                            class="fas fa-times text-16 text-primary cursor-pointer"
                          ></i>
                        </Stack>

                        <Formik
                          initialValues={{
                            Poll_Name: "",
                            Question: "", // This will be controlled by ReactQuill
                            Poll_Type: null,
                            Mini_Rating: 0,
                            Max_Rating: 0,
                          }}
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
                                ),
                              // .when("Mini_Rating", (Mini_Rating, schema) => {
                              //   return schema.test({
                              //     test: (Max_Rating) =>
                              //       Max_Rating >= Mini_Rating,
                              //     message:
                              //       "Maximum Rating must be greater than Minimum Rating",
                              //   });
                              // }),
                            },
                            [["Max_Rating", "Mini_Rating"]]
                          )}
                          onSubmit={async (values) => {
                            console.log(values);
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

                                      const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

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
                      <div className="col-xl-12 col-md-12">
                        <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-10 col-md-10">
                              <div className="text-16 lh-16 fw-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
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
                                <a
                                  href="#0"
                                  className="text-20"
                                  style={{ color: "#aeaeae" }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12">
                        <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-10 col-md-10">
                              <div className="text-16 lh-16 fw-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting.
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
                                <a
                                  href="#0"
                                  className="text-20"
                                  style={{ color: "#aeaeae" }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12">
                        <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-10 col-md-10">
                              <div className="text-16 lh-16 fw-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
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
                                <a
                                  href="#0"
                                  className="text-20"
                                  style={{ color: "#aeaeae" }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12">
                        <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-10 col-md-10">
                              <div className="text-16 lh-16 fw-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting.
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
                                <a
                                  href="#0"
                                  className="text-20"
                                  style={{ color: "#aeaeae" }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-md-12">
                        <div className="py-10 px-30 lg:px-10 rounded-16 bg-white shadow-4">
                          <div className="row y-gap-20 justify-between items-center">
                            <div className="col-lg-10 col-md-10">
                              <div className="text-16 lh-16 fw-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
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
                                <a
                                  href="#0"
                                  className="text-20"
                                  style={{ color: "#aeaeae" }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
