import React from "react";
import Select from "react-select";
import { selectCustomStyle } from "../../../utils/selectCustomStyle";

function EventDetails() {
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
            Edit Details
          </button>
        </div>
        <div class="col-lg-12 col-md-12">
          <div class="single-field">
            <label class="text-13 fw-500">
              Event Name <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="Add event name"
                name="discountname"
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="y-gap-10">
            <label className="text-13 fw-500">
              Event Type <sup className="asc">*</sup>
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

        <div className="col-lg-6"></div>

        <div class="col-lg-6 col-md-6">
          <div class="single-field">
            <label class="text-13 fw-500">
              Pincode <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="Pincode"
                name="pincode"
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="y-gap-10">
            <label className="text-13 fw-500">
              Country <sup className="asc">*</sup>
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

        <div class="col-lg-6 col-md-6">
          <div class="single-field">
            <label class="text-13 fw-500">
              Event State <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="State"
                name="state"
              />
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-md-6">
          <div class="single-field">
            <label class="text-13 fw-500">
              Event City <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="City"
                name="city"
              />
            </div>
          </div>
        </div>

        <div class="col-lg-12 col-md-12">
          <div class="single-field">
            <label class="text-13 fw-500">
              Event Venue <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="Add full address"
                name="discountname"
              />
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-md-6">
          <div class="single-field">
            <label class="text-13 fw-500">
              Time Zone <sup className="asc">*</sup>
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                placeholder="Add time zone"
                name="discountname"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
