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
      </div>
    </div>
  );
}

export default EventDescription;
