import React from "react";

import Event5 from "../../assets/img/events/event5.png";

function Discount() {
  return (
    <div class="dashboard__main">
      <div class="dashboard__content pt-20">
        <section class="layout-pb-md">
          <div class="container">
            <div class="row y-gap-30">
              <div class="col-xl-12 col-md-12">
                <div class="py-10 px-15 rounded-8 bg-white border-light">
                  <div class="row y-gap-20 justify-between items-center">
                    <div class="col-1">
                      <div class="w-50 h-50 rounded-full overflow-hidden">
                        <img
                          src={Event5}
                          class="w-full h-full object-cover"
                          alt="icon"
                        />
                      </div>
                    </div>
                    <div class="col-10">
                      <div class="text-16 lh-16 fw-500">
                        Golden Triangle Challenge: Run through India's Rich
                        Heritage
                      </div>
                    </div>
                    <div class="col-1">
                      <div class="form-switch d-flex items-center">
                        <div class="switch">
                          <input type="checkbox" />
                          <span class="switch__slider"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-12 col-md-12">
                <div class="row y-gap-20 justify-between items-center">
                  <div class="col-lg-6 col-md-6">
                    <div class="single-field">
                      <label class="text-13 fw-500">Discount Name </label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Discount Name"
                          name="discountname"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6">
                    <div class="single-field">
                      <label class="text-13 fw-500">
                        Discount Type <sup class="asc">*</sup>
                      </label>
                      <select name="dctype" id="dctype" class="form-control">
                        <option value="" disabled selected>
                          Select Type
                        </option>
                        <option value="Current">Flat Discount</option>
                        <option value="Saving">Coupon Discount</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4">
                    <div class="single-field">
                      <label class="text-13 fw-500">
                        Enter Discount Percentage (%) <sup class="asc">*</sup>
                      </label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Add Percentage"
                          name="discpercent"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4">
                    <div class="single-field">
                      <label class="text-13 fw-500">
                        Enter Discount Amount (₹) <sup class="asc">*</sup>
                      </label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Enter Discount Amount"
                          name="discamount"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4">
                    <div class="single-field">
                      <label class="text-13 fw-500">
                        Max Counts For Discount <sup class="asc">*</sup>
                      </label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="40"
                          name="disccount"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Discount Start Date </label>
                      <div class="form-control">
                        <input
                          type="date"
                          class="form-control"
                          placeholder=""
                          name="dsdate"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Discount Start Time </label>
                      <div class="form-control">
                        <input
                          type="time"
                          class="form-control"
                          placeholder="Day one"
                          name="dstime"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Discount End Date </label>
                      <div class="form-control">
                        <input
                          type="date"
                          class="form-control"
                          placeholder="Day one"
                          name="dedate"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Discount End Time </label>
                      <div class="form-control">
                        <input
                          type="time"
                          class="form-control"
                          placeholder="Day one"
                          name="dayone"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-12">
                    <div class="single-field">
                      <label class="text-13 fw-500">
                        Event Categories <sup class="asc">*</sup>
                      </label>
                      <select name="dctype" id="dctype" class="form-control">
                        <option value="" disabled selected>
                          Select Categories
                        </option>
                        <option value="Current">Marathon</option>
                        <option value="Saving">Half Marathon</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 mt-10">
                    <a
                      href="#0"
                      class="button bg-primary rounded-22 px-30 py-10 text-white text-12 -grey-1 w-100"
                    >
                      Save
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Discount;
