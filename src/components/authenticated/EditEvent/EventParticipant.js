import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import React from "react";

function EventParticipant() {
  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      <div className="row y-gap-30 py-20">
        <div className="col-12 d-flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
          >
            <i className="far fa-edit text-16"></i>
            Edit Participant Form
          </button>
        </div>
        <div className="col-12">
          <Stack spacing={3}>
            <Accordion
              sx={{
                borderRadius: 0, // Remove border radius
                "&:before": {
                  display: "none", // Remove default MUI border line
                },
                boxShadow: "none", // Remove default box shadow
              }}
            >
              <AccordionSummary
                style={{
                  backgroundColor: "#FFF3C7", // Set the background color
                }}
                sx={{
                  pointerEvents: "none",
                }}
                expandIcon={
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
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="text-14 fw-600">
                  Personal Information <sup className="asc">*</sup>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <div className="row y-gap-30 py-20">
                  <div class="col-lg-12 col-md-12">
                    <div
                      className="py-15 px-15 border-light rounded-8"
                      style={{
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <div className="row">
                        <div className="col-1 d-flex">
                          <Checkbox />
                        </div>
                        <div className="col-3">
                          <div class="y-gap-5">
                            <label class="text-13 fw-500">
                              Participant Name <sup className="asc">*</sup>
                            </label>
                            <div class="d-flex gap-20">
                              <label class="text-error-2 text-13">
                                Mandatory Field
                              </label>
                              <div className="form-switch d-flex ">
                                <div className="switch">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      console.log(e);
                                    }}
                                  />
                                  <span className="switch__slider"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 d-flex items-center">
                          <div class="single-field w-full">
                            <div class="form-control">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Add Name"
                                name="name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                borderRadius: 0, // Remove border radius
                "&:before": {
                  display: "none", // Remove default MUI border line
                },
                boxShadow: "none", // Remove default box shadow
              }}
            >
              <AccordionSummary
                style={{
                  backgroundColor: "#FFF3C7", // Set the background color
                }}
                sx={{
                  pointerEvents: "none",
                }}
                expandIcon={
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
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="text-14 fw-600">
                  Address Information <sup className="asc">*</sup>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <div className="row y-gap-30 py-20">
                  <div class="col-lg-12 col-md-12">
                    <div
                      className="py-15 px-15 border-light rounded-8"
                      style={{
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <div className="row">
                        <div className="col-1 d-flex">
                          <Checkbox />
                        </div>
                        <div className="col-3">
                          <div class="y-gap-5">
                            <label class="text-13 fw-500">
                              Pincode <sup className="asc">*</sup>
                            </label>
                            <div class="d-flex gap-20">
                              <label class="text-error-2 text-13">
                                Mandatory Field
                              </label>
                              <div className="form-switch d-flex ">
                                <div className="switch">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      console.log(e);
                                    }}
                                  />
                                  <span className="switch__slider"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 d-flex items-center">
                          <div class="single-field w-full">
                            <div class="form-control">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Add Name"
                                name="name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                borderRadius: 0, // Remove border radius
                "&:before": {
                  display: "none", // Remove default MUI border line
                },
                boxShadow: "none", // Remove default box shadow
              }}
            >
              <AccordionSummary
                style={{
                  backgroundColor: "#FFF3C7", // Set the background color
                }}
                sx={{
                  pointerEvents: "none",
                }}
                expandIcon={
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
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="text-14 fw-600">
                  Other Information <sup className="asc">*</sup>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <div className="row y-gap-30 py-20">
                  <div class="col-lg-12 col-md-12">
                    <div
                      className="py-15 px-15 border-light rounded-8"
                      style={{
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <div className="row">
                        <div className="col-1 d-flex">
                          <Checkbox />
                        </div>
                        <div className="col-3">
                          <div class="y-gap-5">
                            <label class="text-13 fw-500">
                              Pincode <sup className="asc">*</sup>
                            </label>
                            <div class="d-flex gap-20">
                              <label class="text-error-2 text-13">
                                Mandatory Field
                              </label>
                              <div className="form-switch d-flex ">
                                <div className="switch">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      console.log(e);
                                    }}
                                  />
                                  <span className="switch__slider"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 d-flex items-center">
                          <div class="single-field w-full">
                            <div class="form-control">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Add Name"
                                name="name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </div>

        <div className="col-12">
          <div className="y-gap-10">
            <label className="text-14 fw-500">
              Would you like to make this a public event or a private event?
            </label>
            <div className="d-flex items-center gap-15">
              <div className="d-flex items-center gap-5">
                <Checkbox />
                <label className="text-15 text-reading fw-500">Public</label>
              </div>
              <div className="d-flex items-center gap-5">
                <Checkbox />
                <label className="text-15 text-reading fw-500">Private</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventParticipant;
