import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Select from "react-select";
import { selectCustomStyle } from "../../../utils/selectCustomStyle";

const CustomAccordion = ({ category }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditClick = async (event) => {
    event.stopPropagation(); // Prevent accordion from toggling

    setLoading(true);
    try {
      // Make the API call
      const response = await fetchYourData();
      if (response.success) {
        setAccordionOpen(true); // Open the accordion only on successful API response
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    setAccordionOpen(false); // Close the accordion
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
                onClick={handleEditClick}
                // disabled={loading}
                // onClick={(e) => {
                // }}
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
        <div className="text-14 fw-600">
          {category?.EventCategory_Display_Name}
        </div>
      </AccordionSummary>
      <AccordionDetails>
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

          <div className="col-lg-6"></div>

          {/* <div className="col-md-6">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Is there a cut-off time? <sup className="asc">*</sup>
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
          </div> */}

          {/* <div className="col-lg-6"></div> */}

          <div className="col-3">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Category Start Date <sup className="asc">*</sup>
              </label>
              <div className="form-control">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    className="form-control"
                    name="Date_Of_Birth"
                    format="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disableFuture
                    //   value={time.dayOne}
                    onChange={(newValue) => console.log(newValue)}
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
                    //   value={time.expoStartTime1}
                    onChange={
                      (newValue) => console.log(newValue)
                      // setFieldValue(
                      //   `times[${index}].expoStartTime1`,
                      //   newValue
                      // )
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
            </div>
          </div>
          <div className="col-3">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Category End Date <sup className="asc">*</sup>
              </label>
              <div className="form-control">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    className="form-control"
                    name="Date_Of_Birth"
                    format="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disableFuture
                    //   value={time.dayOne}
                    onChange={(newValue) => console.log(newValue)}
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
                    //   value={time.expoStartTime1}
                    onChange={
                      (newValue) => console.log(newValue)
                      // setFieldValue(
                      //   `times[${index}].expoStartTime1`,
                      //   newValue
                      // )
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
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="single-field y-gap-20">
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
            <div class="single-field y-gap-20">
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
            <div class="single-field y-gap-20">
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
            <div class="single-field y-gap-20">
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

          <div class="col-12">
            <div
              style={{
                border: "1.5px dashed #E9E9E9",
              }}
            ></div>
          </div>

          <div className="col-md-6">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Is there any Cash Prize/ Medal? <sup className="asc">*</sup>
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

          <div className="col-md-12">
            <div className="row">
              <div className="col-md-10">
                <div className="row">
                  <div className="col-lg-2">
                    <div className="">
                      <label className="text-13 fw-500">
                        Gender <sup className="asc">*</sup>
                      </label>
                      <Select
                        isSearchable={false}
                        styles={selectCustomStyle}
                        options={[]}
                        value={null}
                        onChange={async (e) => {
                          console.log(e);
                        }}
                      />
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="single-field y-gap-20">
                      <label class="text-13 fw-500">Age Criteria</label>
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

                  <div class="col-lg-2">
                    <div class="single-field y-gap-20">
                      <label class="text-13 text-white fw-500">
                        Age Criteria
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

                  <div class="col-lg-2">
                    <div class="single-field y-gap-20">
                      <label class="text-13 fw-500">Winner</label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Winner"
                          name="discountname"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="single-field y-gap-20">
                      <label class="text-13 fw-500">1st Runner Up</label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Winner"
                          name="discountname"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="single-field y-gap-20">
                      <label class="text-13 fw-500">3rd Runner Up</label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Winner"
                          name="discountname"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-10">
            <div className="d-flex justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="button w-100 rounded-24 py-5 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
              >
                Add
              </button>
            </div>
          </div>

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
                  }}
                  className="button w-150 rounded-24 py-12 px-15 text-reading border-primary-bold cursor-pointer fw-500 text-16 d-flex gap-10"
                >
                  Paid
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="button w-150 rounded-24 py-12 px-30 text-reading border-primary-bold cursor-pointer fw-500 text-16 d-flex gap-10"
                >
                  Free
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6"></div>

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
                    <div class="form-control">
                      <input
                        type="text"
                        class="form-control"
                        name="discountname"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6"></div>

          <div className="col-3">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Ticket Sale Start Date <sup className="asc">*</sup>
              </label>
              <div className="form-control">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    className="form-control"
                    name="Date_Of_Birth"
                    format="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disableFuture
                    //   value={time.dayOne}
                    onChange={(newValue) => console.log(newValue)}
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
                    //   value={time.expoStartTime1}
                    onChange={
                      (newValue) => console.log(newValue)
                      // setFieldValue(
                      //   `times[${index}].expoStartTime1`,
                      //   newValue
                      // )
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
            </div>
          </div>
          <div className="col-3">
            <div className="single-field y-gap-20">
              <label className="text-13 fw-600">
                Ticket Sale End Date <sup className="asc">*</sup>
              </label>
              <div className="form-control">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    className="form-control"
                    name="Date_Of_Birth"
                    format="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disableFuture
                    //   value={time.dayOne}
                    onChange={(newValue) => console.log(newValue)}
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
                    //   value={time.expoStartTime1}
                    onChange={
                      (newValue) => console.log(newValue)
                      // setFieldValue(
                      //   `times[${index}].expoStartTime1`,
                      //   newValue
                      // )
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
              <label className="text-13 fw-600">
                Upload Event Category Routes
              </label>
              <div class="form-control">
                <input
                  type="text"
                  class="form-control"
                  value="5k Marathon"
                  // placeholder="Winner"
                  name="discountname"
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="mt-5">
              <label className="text-13 text-white fw-600 p-0">
                Upload Event Category Routes
              </label>
              {/* <div className="d-flex"> */}
              <div className="parent">
                <div className="file-upload-ticket">
                  <i className="fas fa-upload text-20 text-primary"></i>

                  <p className="text-reading mt-0">jpg, png, gif</p>
                  <input type="file" />
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
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
