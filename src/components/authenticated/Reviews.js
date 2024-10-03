import React from "react";

import Event5 from "../../assets/img/events/event5.png";

function Reviews() {
  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              <div className="col-xl-12 col-md-12">
                <div className="py-10 px-15 rounded-8 border-light bg-white ">
                  <div className="row y-gap-20 justify-between items-center">
                    <div className="col-1">
                      <div className="w-50 h-50 rounded-full overflow-hidden">
                        <img
                          src={Event5}
                          className="w-full h-full object-cover"
                          alt="icon"
                        />
                      </div>
                    </div>
                    <div className="col-10">
                      <div className="text-16 lh-16 fw-500">
                        Golden Triangle Challenge: Run through India's Rich
                        Heritage
                      </div>
                    </div>
                    <div className="col-1">
                      <div className="form-switch d-flex items-center">
                        <div className="switch">
                          <input type="checkbox" />
                          <span className="switch__slider"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-20">
                <div className="col-xl-12 col-md-12">
                  <div className="py-20 px-15 rounded-8 bg-white border-light">
                    <div className="row y-gap-20 justify-between items-center">
                      <div className="col-lg-3 text-center">
                        <div className="text-16 lh-16 fw-500">Event Rating</div>
                        <div className="text-18 lh-16 fw-600 text-primary mt-10">
                          4.5
                        </div>
                      </div>
                      <div className="col-lg-3 text-center">
                        <div className="text-16 lh-16 fw-500">
                          Total Reviews
                        </div>
                        <div className="text-18 lh-16 fw-600 text-primary mt-10">
                          400 Reviews
                        </div>
                      </div>
                      <div className="col-lg-3 text-center">
                        <div className="text-16 lh-16 fw-500">
                          Average Rating
                        </div>
                        <div className="text-20 lh-16 fw-500 text-green mt-10">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star-half-alt"></i>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="progressBar">
                          <div className="">
                            <div className="progressBar__bg bg-blue-2"></div>
                            <div
                              className="progressBar__bar"
                              style={{
                                width: "80%",
                                backgroundColor: "#15682C",
                              }}
                            >
                              <span className="text-12 fw-600">80%</span>
                            </div>
                          </div>
                        </div>
                        <div className="progressBar mt-10">
                          <div className="mt-20">
                            <div className="progressBar__bg bg-blue-2"></div>
                            <div
                              className="progressBar__bar"
                              style={{
                                width: "70%",
                                backgroundColor: "#FF986F",
                              }}
                            >
                              <span className="text-12 fw-600">70%</span>
                            </div>
                          </div>
                        </div>
                        <div className="progressBar mt-10">
                          <div className="mt-20">
                            <div className="progressBar__bg bg-blue-2"></div>
                            <div
                              className="progressBar__bar"
                              style={{
                                width: "30%",
                                backgroundColor: "#E9BA4F",
                              }}
                            >
                              <span className="text-12 fw-600">30%</span>
                            </div>
                          </div>
                        </div>
                        <div className="progressBar mt-10">
                          <div className="mt-20">
                            <div className="progressBar__bg bg-blue-2"></div>
                            <div
                              className="progressBar__bar"
                              style={{
                                width: "10%",
                                backgroundColor: "#FF986F",
                              }}
                            >
                              <span className="text-12 fw-600">10%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-lg-12">
                <div className="overflow-scroll scroll-bar-1">
                  <table className="table-3 -border-bottom col-12 text-12 fw-500">
                    <thead className="bg-light-2">
                      <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Description</th>
                        <th>Comment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="w-30 h-30 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td>
                        <td className="">Michal Jackson</td>
                        <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td>
                        <td className="text-10">
                          <p className="trim-3 text-10 lh-12">
                            Golden Triangle Challenge Run through India's Rich
                            Heritage Golden Triangle Challenge: Run through
                            India's Rich Heritage Golden Triangle Challenge: Run
                            through India's Rich Heritage Golden Triangle
                            Challenge Run through India's Rich Heritage Golden
                            Triangle Challenge Run through India's Rich Heritage
                            Golden Triangle Challenge Run through India's Rich
                            Heritage
                          </p>
                        </td>
                        <td className="">
                          <button className="button rounded-16 py-4 px-10 text-primary border-primary -primary-1 fw-400 text-12">
                            Comment{" "}
                          </button>
                        </td>
                        <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reviews;
