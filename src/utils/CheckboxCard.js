import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import { selectCustomStyle } from "./ReactSelectStyles";

function CheckboxCard({
  fieldName,
  fieldPlaceholder,
  fieldType,
  isMandatory,
  onToggleMandatory,
}) {
  return (
    <div class="col-lg-12 col-md-12">
      <div
        className="py-15 px-15 border-light rounded-8"
        style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        }}
      >
        <div className="row">
          <div className="col-1 d-flex">
            <Checkbox disabled checked />
          </div>
          <div className="col-3">
            <div class="y-gap-5">
              <label class="text-13 fw-500">{fieldName}</label>
              <div class="d-flex gap-20">
                <label class="text-error-2 text-13">Mandatory Field</label>
                <div className="form-switch d-flex ">
                  <div className="switch">
                    <input
                      type="checkbox"
                      checked={isMandatory}
                      onChange={onToggleMandatory}
                    />
                    <span className="switch__slider"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 d-flex items-center">
            {fieldType === "select" ? (
              <Select
                isSearchable={false}
                isDisabled={true}
                styles={selectCustomStyle}
                options={[]}
                value={null}
              />
            ) : (
              <div class="single-field w-full">
                <div class="form-control">
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    placeholder={fieldPlaceholder}
                    name="name"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckboxCard;
