import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

function EventTicket() {
  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
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
            backgroundColor: "#FFF3C787", // Set the background color
          }}
          expandIcon={
            <IconButton
              size="small"
              style={{
                backgroundColor: "#e0e0e0",
                padding: "4px",
                borderRadius: "4px",
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
          <Typography className="text-14 text-reading fw-500">
            Event 1
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row y-gap-20 py-20">
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
            <div class="col-lg-4 col-md-4">
              <div class="single-field">
                <label class="text-13 fw-500">
                  Race Category Display Name <sup className="asc">*</sup>
                </label>
                <div class="form-control">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Add your ticket name"
                    name="discountname"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-4"></div>

            <div className="col-lg-4"></div>

            <div class="col-lg-6 col-md-6">
              <div class="single-field">
                <label class="text-13 fw-500">
                  Number of Tickets <sup className="asc">*</sup>
                </label>
                <div class="form-control">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Max Number you want to sell"
                    name="discountname"
                  />
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-md-6">
              <div class="single-field">
                <label class="text-13 fw-500">
                  BIB Number Sequence <sup className="asc">*</sup>
                </label>
                <div class="form-control">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="5656"
                    name="discountname"
                  />
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-md-6">
              <div class="single-field">
                <label class="text-13 fw-500">
                  Age Criteria for Participant (in years){" "}
                  <sup className="asc">*</sup>
                </label>
                <div class="form-control">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Min Age"
                    name="discountname"
                  />
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-md-6">
              <div class="single-field">
                <label class="text-13 text-white fw-500">
                  Age Criteria for Participant (in years){" "}
                </label>
                <div class="form-control">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Max Age"
                    name="discountname"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="single-field y-gap-20">
                <label className="text-13 fw-600">
                  Is there any Cash Prize? <sup className="asc">*</sup>
                </label>

                <div className="d-flex gap-15">
                  <div className="form-radio d-flex items-center">
                    <div className="radio">
                      <input type="radio" name="Gender" value="Male" />
                      <div className="radio__mark">
                        <div className="radio__icon"></div>
                      </div>
                    </div>
                    <div className="text-14 lh-1 ml-10">Yes</div>
                  </div>
                  <div className="form-radio d-flex items-center">
                    <div className="radio">
                      <input type="radio" name="Gender" value="Female" />
                      <div className="radio__mark">
                        <div className="radio__icon"></div>
                      </div>
                    </div>
                    <div className="text-14 lh-1 ml-10">No</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default EventTicket;
