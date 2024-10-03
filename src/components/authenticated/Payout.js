import React from "react";
import Event5 from "../../assets/img/events/event5.png";

function Payout({ setShowPayout }) {
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
              <div class="col-xl-9 col-md-9">
                <div class="py-20 px-20 border-light rounded-8">
                  <div class="row y-gap-20 justify-between items-center">
                    <div class="col-6">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          I would like to receive payment{" "}
                          <sup class="asc">*</sup>
                        </label>
                        <select
                          name="dctype"
                          id="dctype"
                          class="form-control mt-5"
                        >
                          <option value="" disabled selected>
                            Select Type
                          </option>
                          <option value="Current">Every Week</option>
                          <option value="Saving">Every Month</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="single-field y-gap-20">
                        <label class="text-13 fw-600">Select Day</label>
                        <div class="d-flex gap-20">
                          <div class="form-radio d-flex items-center ">
                            <div class="radio">
                              <input type="radio" name="name" />
                              <div class="radio__mark">
                                <div class="radio__icon"></div>
                              </div>
                            </div>
                            <div class="text-14 lh-1 ml-10">Wednesday</div>
                          </div>
                          <div class="form-radio d-flex items-center ">
                            <div class="radio">
                              <input type="radio" name="name" />
                              <div class="radio__mark">
                                <div class="radio__icon"></div>
                              </div>
                            </div>
                            <div class="text-14 lh-1 ml-10">Thursday</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Select Default Bank <sup class="asc">*</sup>
                        </label>
                        <select
                          name="dctype"
                          id="dctype"
                          class="form-control mt-5"
                        >
                          <option value="" disabled selected>
                            Select Bank
                          </option>
                          <option value="Current">AXIS BANK ••••4752</option>
                          <option value="Saving">ICICI BANK ••••8993</option>
                          <option value="Saving">SBI BANK ••••4448</option>
                        </select>
                      </div>
                    </div>

                    <div class="row col-12 mt-15">
                      <div class="col-2">
                        <a
                          onClick={(e) => {
                            e.preventDefault();

                            setShowPayout(false);
                          }}
                          class="button border-primary rounded-22 px-30 py-10 text-primary text-12 -primary-1"
                        >
                          Back
                        </a>
                      </div>
                      <div class="col-3">
                        <a
                          href="#0"
                          class="button bg-primary rounded-22 px-20 py-10 text-white text-12 -grey-1"
                        >
                          Save & Confirm
                        </a>
                      </div>
                    </div>
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

export default Payout;
