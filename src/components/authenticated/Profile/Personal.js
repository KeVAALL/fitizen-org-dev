import React, { useEffect, useState } from "react";

import UploadIcon from "../../../assets/img/icons/upload.png";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RestfulApiService } from "../../../config/service";
import { useSelector } from "react-redux";
import Loader from "../../../utils/BackdropLoader";

function Personal() {
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const user = useSelector((state) => state.user.userProfile);

  const validationSchema = Yup.object({
    Contact_Name: Yup.string().required("Organizer Name is required"),
    mobile_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Contact Number is required"),
    email_id: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    profile: Yup.mixed().required("Profile image is required"),
    pan: Yup.string().required("Pan Card Number is required"),
    has_gst_no: Yup.string().required("Please select"),
    GST_No: Yup.string().when("has_gst_no", {
      is: (value) => value === "yes", // When has_gst_no is '1' (i.e., "yes")
      then: (schema) => schema.required("GST Number is required"),
      otherwise: (schema) => schema.nullable(), // Make it nullable when has_gst_no is not '1'
    }),
  });

  async function LoadProfile() {
    const reqdata = {
      Method_Name: "Get",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Organizer_Name: "",
    };
    try {
      setFetchingProfile(true);
      const result = await RestfulApiService(
        reqdata,
        "organizer/getorganierdetails"
      );
      if (result) {
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingProfile(false);
    }
  }
  useEffect(() => {
    LoadProfile();
  }, []);

  return (
    <>
      {fetchingProfile ? (
        <Loader fetching={fetchingProfile} />
      ) : (
        <Formik
          initialValues={{
            Contact_Name: "",
            mobile_number: "",
            email_id: "",
            profile: null,
            pan: "",
            has_gst_no: "",
            GST_No: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // handle form submission
            console.log(values);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className="col-lg-8">
                  <div className="row justify-between pt-20">
                    <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Organizer Name <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="text"
                            name="Contact_Name"
                            className="form-control"
                            placeholder="Full name"
                          />
                        </div>
                        <ErrorMessage
                          name="Contact_Name"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Name of Organization <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="text"
                            name="organization"
                            className="form-control"
                            placeholder="Full name"
                          />
                        </div>
                        <ErrorMessage
                          name="organization"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Contact Number <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="tel"
                            name="mobile_number"
                            className="form-control"
                            placeholder="000 000 0000"
                            maxLength="10"
                          />
                        </div>
                        <ErrorMessage
                          name="mobile_number"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Email Id <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="email"
                            name="email_id"
                            className="form-control"
                            placeholder="info@yourgmail.com"
                          />
                        </div>
                        <ErrorMessage
                          name="email_id"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Pan Number <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="text"
                            name="pan"
                            className="form-control"
                            placeholder="Pan Number"
                          />
                        </div>
                        <ErrorMessage
                          name="pan"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="row justify-center pt-40 y-gap-10 text-center">
                    <div className="d-flex w-150 overflow-hidden profile-img">
                      <img src={UploadIcon} alt="image-upload" className="" />
                      <input
                        type="file"
                        name="profile"
                        className="upload-pf"
                        onChange={(event) => {
                          setFieldValue(
                            "profile",
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                    </div>
                    <p className="text-light-1 text-10 mt-20 text-center">
                      Upload Square image at least 200px by 200px
                    </p>
                    <ErrorMessage
                      name="profile"
                      component="div"
                      className="text-error-2 text-13 "
                    />
                  </div>
                </div>
              </div>
              <div className="row pt-10">
                {/* <div className="row hidden-fields">
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
              </div> */}

                {/* <div className="col-lg-4">
                  <div className="single-field py-10 y-gap-10">
                    <label className="text-13 fw-500">
                      Pan Card Number <sup className="asc">*</sup>
                    </label>
                    <div className="form-control">
                      <Field
                        type="text"
                        name="pan"
                        className="form-control"
                        placeholder="Pan Number"
                      />
                    </div>
                    <ErrorMessage
                      name="pan"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div> */}

                <div
                  className={`${
                    values?.has_gst_no === "yes" ? "col-lg-4 " : "col-lg-8 "
                  }d-flex justify-start`}
                >
                  <div className="single-field py-10 y-gap-10">
                    <label className="text-13 fw-500">GST Applicable</label>
                    <div className="d-flex gap-15 mt-10">
                      <div className="form-radio d-flex items-center">
                        <Field type="radio" name="has_gst_no" value="yes" />
                        <div className="text-14 lh-1 ml-10">Yes</div>
                      </div>
                      <div className="form-radio d-flex items-center">
                        <Field type="radio" name="has_gst_no" value="no" />
                        <div className="text-14 lh-1 ml-10">No</div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="has_gst_no"
                      component="div"
                      className="text-error-2 text-13 mt-10"
                    />
                  </div>
                </div>

                {values?.has_gst_no === "yes" && (
                  <div className="col-lg-4">
                    <div className="single-field py-10 y-gap-10">
                      <label className="text-13 fw-500">
                        Add GST Number <sup className="asc">*</sup>
                      </label>
                      <div className="form-control">
                        <Field
                          type="text"
                          name="GST_No"
                          className="form-control"
                          placeholder="GST Number"
                        />
                      </div>
                      <ErrorMessage
                        name="GST_No"
                        component="div"
                        className="text-error-2 text-13"
                      />
                    </div>
                  </div>
                )}

                <div className="col-lg-12 d-flex justify-end">
                  <button
                    className="button w-200 px-30 py-10 mt-20 lg:mt-0 text-white text-12 rounded-22 bg-primary -grey-1 js-next"
                    onClick={() => {
                      // updateTab(2);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

export default Personal;
