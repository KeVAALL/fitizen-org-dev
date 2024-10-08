import React from "react";
import Event5 from "../../../assets/img/events/event5.png";
// import Bank from "../../assets/img/icons/bank.png";

function BankDetails() {
  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              <div className="col-xl-12 col-md-12">
                <div className="py-10 px-15 rounded-8 border-light bg-white">
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
              <div className="col-lg-12 text-right pb-5">
                <a
                  href="#"
                  className="w-150 button -primary-1 rounded-22 px-20 py-10 text-primary border-primary bg-white text-12 d-inline-block"
                >
                  <span className="text-16 mr-5">+</span> Add Bank
                </a>
              </div>
              <div className="col-xl-12 col-lg-12">
                <div className="overflow-scroll scroll-bar-1">
                  <table className="table-3 -border-bottom col-12 text-12 fw-500">
                    <thead className="bg-light-2">
                      <tr>
                        <th>Bank Name</th>
                        <th>Account Holder</th>
                        <th>Account Number</th>
                        <th>IFSC Code</th>
                        <th>Account Type</th>
                        <th>Branch Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="">ICICI BANK</td>
                        <td className="">Michal Jackson</td>
                        <td className="">8894549878799</td>
                        <td className="">ICIC0078</td>
                        <td className="">Saving</td>
                        <td className="lh-14">Western Express Highway</td>

                        <td className="" style={{ color: "#aeaeae" }}>
                          <a href="#" className="px-10">
                            <i className="far fa-trash-alt text-18"></i>
                          </a>
                          <a href="#" className="px-10">
                            <i className="far fa-edit text-18"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        {/* <td>
                          <div className="w-48 h-48 rounded-full overflow-hidden">
                            <img
                              src={Bank}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td> */}
                        <td className="">AXIS BANK</td>
                        <td className="">John Doe</td>
                        <td className="">8894549878799</td>
                        <td className="">ICIC0078</td>
                        <td className="">Saving</td>
                        <td className="lh-14">Western Express Highway</td>

                        <td className="" style={{ color: "#aeaeae" }}>
                          <a href="#" className="px-10">
                            <i className="far fa-trash-alt text-18"></i>
                          </a>
                          <a href="#" className="px-10">
                            <i className="far fa-edit text-18"></i>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        {/* <td>
                          <div className="w-48 h-48 rounded-full overflow-hidden">
                            <img
                              src={Bank}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </td> */}
                        <td className="">SBI BANK</td>
                        <td className="">David Dsouja</td>
                        <td className="">8894549878799</td>
                        <td className="">ICIC0078</td>
                        <td className="">Saving</td>
                        <td className="lh-14">Western Express Highway</td>

                        <td className="" style={{ color: "#aeaeae" }}>
                          <a href="#" className="px-10">
                            <i className="far fa-trash-alt text-18"></i>
                          </a>
                          <a href="#" className="px-10">
                            <i className="far fa-edit text-18"></i>
                          </a>
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

export default BankDetails;
