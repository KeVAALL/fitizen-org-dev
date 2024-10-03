import React from "react";

import Event5 from "../../assets/img/events/event5.png";

function BIBExpo() {
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

              <div class="col-xl-8 col-md-8">
                <div class="row y-gap-20 justify-between items-center">
                  <div class="col-10">
                    <div class="single-field">
                      <label class="text-13 fw-500">BIB Expo Venue </label>
                      <div class="form-control">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="BIB Expo Venue"
                          name="bibvenue"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-10">
                    <div class="single-field">
                      <label class="text-13 fw-500">Add Instructions </label>
                      <div class="form-control">
                        <textarea
                          rows="3"
                          placeholder="Add Instructions "
                          name="addins"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="single-field">
                      <label class="text-13 fw-500">Day One </label>
                      <div class="form-control">
                        <input
                          type="date"
                          class="form-control"
                          placeholder="Day one"
                          name="dayone"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Expo Start Time </label>
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
                  <div class="col-3">
                    <div class="single-field">
                      <label class="text-13 fw-500">Expo End Time </label>
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
                  <div class="col-2">
                    <div class="single-field">
                      <label class="text-13 fw-500">&nbsp; </label>
                      <a
                        href="#0"
                        class="button w-45 h-45 border-primary text-primary text-20 fw-600 rounded-full"
                      >
                        +
                      </a>
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

export default BIBExpo;
