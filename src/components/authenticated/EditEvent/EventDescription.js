import { CheckBoxOutlineBlank } from "@mui/icons-material";
import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";
import React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EventDescription() {
  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      <div className="row y-gap-20 py-20">
        <div className="col-12 d-flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
          >
            <i className="far fa-edit text-16"></i>
            Edit Description
          </button>
        </div>

        <div className="col-12">
          <div className="single-field w-full">
            <label className="text-13 fw-500">
              Enter Description <sup className="asc">*</sup>
            </label>
            <ReactQuill
              theme="snow"
              value={null}
              onChange={(content) => {}}
              placeholder="Add more about event"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="y-gap-10">
            <label className="text-13 fw-500">
              Race Day Facilities <sup className="asc">*</sup>
            </label>
            <div className="py-30 px-30 border-light rounded-8">
              <div className="row y-gap-20">
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox
                    // checked={true}
                    // onChange={(e) =>
                    //   setFieldValue(
                    //     `menuIds[${index}].edit_flag`,
                    //     e.target.checked ? 1 : 0
                    //   )
                    // }
                    />
                    <label className="text-15 text-reading fw-500">
                      Parking
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox />
                    <label className="text-15 text-reading fw-500">
                      Shuttle Services
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox />
                    <label className="text-15 text-reading fw-500">
                      Post Race Survey
                    </label>
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="d-flex items-center gap-5">
                    <Checkbox disabled />
                    <label className="text-15 text-reading fw-500">
                      Pacing Bus
                    </label>
                  </div>
                </div>
                <div className="col-xl-12">
                  <div className="d-flex justify-end items-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="button rounded-24 py-10 px-15 text-primary border-primary -primary-1 fw-500 text-13 d-flex gap-10"
                    >
                      <i className="fas fa-plus text-12"></i>
                      Add Others
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="y-gap-10">
            <label className="text-13 fw-500">
              Race Day takeaways <sup className="asc">*</sup>
            </label>
            <Autocomplete
              multiple
              disableClearable
              disableCloseOnSelect
              disableListWrap
              options={[]}
              getOptionLabel={(option) => option.label}
              value={[]} // Bind selected options to the filter state
              onChange={() => {}}
              renderOption={(props, option, { selected }) => (
                <li
                  {...props}
                  key={option.value}
                  style={{
                    backgroundColor: selected ? "white" : "transparent",
                  }}
                >
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<Checkbox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    // Set checkbox color to primary color when selected
                    // color={selected ? "orange" : "default"}
                    sx={{
                      color: selected ? "#f05736" : undefined, // Checkbox color when selected
                      "&.Mui-checked": {
                        color: "#f05736", // Checkbox color when selected
                      },
                    }}
                  />
                  {option.label}
                </li>
              )}
              renderTags={(tagValue) => {
                const numSelected = [].length;
                return (
                  <Chip
                    label={
                      numSelected > 0 ? `${numSelected} Selected` : "Filter"
                    }
                    size="small"
                  />
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled
                  placeholder="Add Race Day Takeaways"
                  className="multi-select-field"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "12px",
                      left: "-5px",
                      top: "-5px",
                    },
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "14px", // Adjust font size
                      color: "gray", // Adjust color
                    },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Disable typing
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: "38px", // Custom height for the TextField
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                />
              )}
              ListboxProps={{
                sx: {
                  fontSize: "12px",
                  "& .MuiAutocomplete-option": {
                    paddingLeft: "0px",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="single-field w-full">
            <label className="text-13 fw-500">
              Refund & Cancellation Policy <sup className="asc">*</sup>
            </label>
            <ReactQuill
              theme="snow"
              value={null}
              onChange={(content) => {}}
              placeholder="Add Refund and Cancellation Policy"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="single-field w-full">
            <label className="text-13 fw-500">
              Rules & Regulations <sup className="asc">*</sup>
            </label>
            <ReactQuill
              theme="snow"
              value={null}
              onChange={(content) => {}}
              placeholder="Add Rules and Regulations"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDescription;
