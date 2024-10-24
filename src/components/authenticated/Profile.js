import React, { useState } from "react";

import UploadIcon from "../../assets/img/icons/upload.png";
import FaceBookIcon from "../../assets/img/icons/facebook.png";
import InstagramIcon from "../../assets/img/icons/instagram.png";
import LinkedinIcon from "../../assets/img/icons/linkedin.png";
import YoutubeIcon from "../../assets/img/icons/youtube.png";
import TwitterIcon from "../../assets/img/icons/twitter.png";

function Profile() {
  const [activeTab, setActiveTab] = useState(1);

  const updateTab = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="tabs -pills-2 js-tabs">
              <div className="row x-gap-40 y-gap-30 items-center tabs__controls js-tabs-controls">
                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 1 ||
                        activeTab - 1 === 1 ||
                        activeTab - 2 === 1
                          ? "bg-primary"
                          : "bg-blue-1-05"
                      } tabs__button js-tabs-button is-tab-el-active`}
                      data-tab-target=".-tab-item-1"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 1</p>
                      <p className="text-12 fw-400 ml-10">
                        Personal Information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="w-full h-1 bg-border"></div>
                </div>

                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 2 || activeTab - 1 === 2
                          ? "bg-primary"
                          : "bg-blue-1-05"
                      } text-white fw-500 tabs__button js-tabs-button`}
                      data-tab-target=".-tab-item-2"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 2</p>
                      <p className="text-12 fw-400 ml-10">Bank Details</p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="w-full h-1 bg-border"></div>
                </div>

                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 3 ? "bg-primary" : "bg-blue-1-05"
                      } text-white fw-500 tabs__button js-tabs-button`}
                      data-tab-target=".-tab-item-3"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 3</p>
                      <p className="text-12 fw-400 ml-10">
                        Social Media Handles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tabs__content pt-20 js-tabs-content">
                {activeTab === 1 && (
                  <div
                    className={`tabs__pane${
                      activeTab === 1 ? " is-tab-el-active -tab-item-1" : ""
                    } px-40 rounded-8 border-light pb-20`}
                  >
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="row justify-between pt-20">
                          <div className="col-lg-6">
                            <div className="single-field py-10">
                              <label className="text-13 fw-500">
                                Organizer Name <sup className="asc">*</sup>
                              </label>
                              <div className="form-control">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Full name"
                                  name="name"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="single-field py-10">
                              <label className="text-13 fw-500">
                                Name of Organization
                                <sup className="asc">*</sup>
                              </label>
                              <div className="form-control">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Full name"
                                  name="name"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="single-field py-10">
                              <label className="text-13 fw-500">
                                Contact Number <sup className="asc">*</sup>
                              </label>
                              <div className="form-control">
                                <input
                                  type="tel"
                                  className="form-control"
                                  placeholder="000 000 0000"
                                  name="phone"
                                  maxlength="10"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="single-field py-10">
                              <label className="text-13 fw-500">
                                Email Id<sup className="asc">*</sup>
                              </label>
                              <div className="form-control">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="info@yourgmail.com"
                                  name="email"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="row justify-center pt-40">
                          <div className="d-flex w-150 overflow-hidden profile-img">
                            <img
                              src={UploadIcon}
                              alt="image-upload"
                              className=""
                            />
                            <input
                              type="file"
                              name="profile"
                              className="upload-pf"
                            />
                          </div>
                          <p className="text-light-1 text-10 mt-20 text-center">
                            Upload Square image atleast 200px by 200px
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-between pt-10">
                      <div className="col-lg-12 d-flex items-center">
                        <div className="form-checkbox">
                          <input type="checkbox" name="name" />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon fas fa-check"></div>
                          </div>
                        </div>
                        <div className="text-13 fw-500 ml-5">
                          Use the same email and phone number for the contact
                          person. <sup className="asc">*</sup>
                        </div>
                      </div>
                      <div className="row hidden-fields">
                        <div className="col-lg-4">
                          <div className="single-field py-10">
                            <label className="text-13 fw-500">
                              Contact Person Name
                              <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Person Name"
                                name="cp-name"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="single-field py-10">
                            <label className="text-13 fw-500">
                              Contact Person Number
                              <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Person Number"
                                name="cp-number"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="single-field py-10">
                            <label className="text-13 fw-500">
                              Contact Person Email Id
                              <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Person Email"
                                name="cp-email"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Pan Card Number <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Pan Number"
                              name="PAN"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">GST Number</label>
                          <div className="d-flex gap-15 mt-10">
                            <div className="form-radio d-flex items-center">
                              <div className="radio">
                                <input type="radio" name="name" />
                                <div className="radio__mark">
                                  <div className="radio__icon"></div>
                                </div>
                              </div>
                              <div className="text-14 lh-1 ml-10">Yes</div>
                            </div>
                            <div className="form-radio d-flex items-center">
                              <div className="radio">
                                <input type="radio" name="name" />
                                <div className="radio__mark">
                                  <div className="radio__icon"></div>
                                </div>
                              </div>
                              <div className="text-14 lh-1 ml-10">No</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 py-10">
                        <button
                          className="button w-full px-30 py-10 mt-20 lg:mt-0 text-white text-12 rounded-22 bg-primary -grey-1 js-next"
                          onClick={() => {
                            updateTab(2);
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 2 && (
                  <div
                    className={`tabs__pane${
                      activeTab === 2 ? " is-tab-el-active -tab-item-2" : ""
                    } border-light px-40 rounded-8 pb-20`}
                  >
                    <div className="row justify-between pt-20">
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Name of Account Holder
                            <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Account Holder Name"
                              name="ah-name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Bank Name <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Bank Name"
                              name="bname"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Account Number <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Account Number"
                              name="ac-number"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Account Type <sup className="asc">*</sup>
                          </label>
                          <select
                            name="actype"
                            id="actype"
                            className="form-control"
                          >
                            <option value="" disabled selected>
                              Select Type
                            </option>
                            <option value="Current">Current</option>
                            <option value="Saving">Saving</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            IFSC Code <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="IFSC Code"
                              name="ifscode"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="single-field py-10">
                          <label className="text-13 fw-500">
                            Branch Name <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Branch Name"
                              name="brname"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-between">
                      <div className="col-lg-4">
                        <div className="single-field py-10 upload">
                          <label className="text-13 fw-500">
                            Upload Cancelled Cheque Image
                          </label>
                          <div className="form-control mt-10">
                            <button className="upload__btn">
                              Upload Image
                            </button>
                            <input
                              type="file"
                              className="form-control upload__input"
                              placeholder="Upload"
                              name="idproof"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 d-flex pt-20 justify-end">
                        <button
                          className="button w-full px-30 py-10 text-12 h-40 border-primary text-primary rounded-22 -primary-1 js-prev"
                          onClick={() => {
                            updateTab(1);
                          }}
                        >
                          Previous
                        </button>
                        <button
                          className="button w-full px-30 py-10 text-12 h-40 text-white rounded-22 bg-primary -dark-1 ml-20 js-next"
                          onClick={() => {
                            updateTab(3);
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 3 && (
                  <div
                    className={`tabs__pane${
                      activeTab === 3 ? " is-tab-el-active -tab-item-3" : ""
                    } border-light px-40 rounded-8 pb-20`}
                  >
                    <div className="row pt-20">
                      <p className="text-13 fw-600 text-dark-1">
                        Add Social Media Accounts
                      </p>
                      <div className="col-lg-6">
                        <div className="single-field d-flex items-center gap-20 py-10">
                          <img
                            src={FaceBookIcon}
                            alt="facebook"
                            style={{ width: "35px" }}
                          />
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Url"
                              name="facebook"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="single-field d-flex items-center gap-20 py-10">
                          <img
                            src={InstagramIcon}
                            alt="instagram"
                            style={{ width: "35px" }}
                          />
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Url"
                              name="instagram"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-field d-flex items-center gap-20 py-10">
                          <img
                            src={LinkedinIcon}
                            alt="linkedin"
                            style={{ width: "35px" }}
                          />
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Url"
                              name="linkedin"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-field d-flex items-center gap-20 py-10">
                          <img
                            src={YoutubeIcon}
                            alt="youtube"
                            style={{ width: "40px" }}
                          />
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Url"
                              name="youtube"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-field d-flex items-center gap-20 py-10">
                          <img
                            src={TwitterIcon}
                            alt="twitter"
                            style={{ width: "35px" }}
                          />
                          <div className="form-control">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add Url"
                              name="twitter"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-end pt-20">
                      <div className="col-auto d-flex">
                        <button
                          className="button px-30 py-10 border-primary text-primary text-12 rounded-22 -primary-1 js-prev"
                          onClick={() => {
                            updateTab(2);
                          }}
                        >
                          Previous
                        </button>
                        <button className="button w-full px-30 py-10 text-white text-12 rounded-22 bg-primary ml-20 -dark-1">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
