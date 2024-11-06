import React, { useState } from "react";

// Third-party component imports
import { useSelector } from "react-redux";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Icon imports
import FaceBookIcon from "../../../assets/img/icons/facebook.png";
import InstagramIcon from "../../../assets/img/icons/instagram.png";
import LinkedinIcon from "../../../assets/img/icons/linkedin.png";
import YoutubeIcon from "../../../assets/img/icons/youtube.png";
import GlobeIcon from "../../../assets/img/icons/globe.png";

const validationSchema = Yup.object().shape({
  Org_Facebook: Yup.string().url("Enter a valid URL"),
  Org_Instagram: Yup.string().url("Enter a valid URL"),
  Org_LinkedIn: Yup.string().url("Enter a valid URL"),
  Org_Youtube: Yup.string().url("Enter a valid URL"),
  Org_Website: Yup.string().url("Enter a valid URL"),
});

function Social({ updateTab, prevIndex, UpdateProfile }) {
  const orgProfile = useSelector((state) => state.orgProfile.profile);
  const [addingSocial, setAddingSocial] = useState(false);

  return (
    <>
      <Formik
        initialValues={orgProfile}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form data", values);

          UpdateProfile(values, 3, 0, setAddingSocial);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="row pt-20">
              <p className="text-13 fw-600 text-dark-1">
                Add Social Media Accounts
              </p>

              <div className="col-lg-6">
                <div className="single-field d-flex items-start gap-20 py-10">
                  <img
                    src={FaceBookIcon}
                    alt="facebook"
                    style={{ width: "35px" }}
                  />
                  <div className="d-flex flex-column gap-5 w-full">
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add Url"
                        name="Org_Facebook"
                        // onChange={(e) => {
                        //   e.preventDefault();
                        //   const { value } = e.target;

                        //   const regex = /^[A-Za-z]+$/;

                        //   if (
                        //     !value ||
                        //     (regex.test(value.toString()) &&
                        //       value.length <= 500)
                        //   ) {
                        //     setFieldValue("Org_Facebook", value);
                        //   } else {
                        //     return;
                        //   }
                        // }}
                      />
                    </div>
                    <ErrorMessage
                      name="Org_Facebook"
                      component="div"
                      className="text-error-2 text-13"
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
                  <div className="d-flex flex-column gap-5 w-full">
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add Url"
                        name="Org_Instagram"
                      />
                    </div>
                    <ErrorMessage
                      name="Org_Instagram"
                      component="div"
                      className="text-error-2 text-13"
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
                  <div className="d-flex flex-column gap-5 w-full">
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add Url"
                        name="Org_LinkedIn"
                      />
                    </div>
                    <ErrorMessage
                      name="Org_LinkedIn"
                      component="div"
                      className="text-error-2 text-13"
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
                  <div className="d-flex flex-column gap-5 w-full">
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add Url"
                        name="Org_Youtube"
                      />
                    </div>
                    <ErrorMessage
                      name="Org_Youtube"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="single-field d-flex items-center gap-20 py-10">
                  <img src={GlobeIcon} alt="globe" style={{ width: "35px" }} />
                  <div className="d-flex flex-column gap-5 w-full">
                    <div className="form-control">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Add Url"
                        name="Org_Website"
                      />
                    </div>
                    <ErrorMessage
                      name="Org_Website"
                      component="div"
                      className="text-error-2 text-13"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-end pt-20">
              <div className="col-auto relative">
                <button
                  type="button"
                  className="button w-150 h-40 text-12 px-15 border-primary text-primary rounded-22 -primary-1"
                  onClick={() => updateTab(prevIndex)}
                >
                  Previous
                </button>
              </div>
              <div className="col-auto relative">
                <button
                  disabled={addingSocial}
                  type="submit"
                  className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light load-button"
                >
                  {!addingSocial ? (
                    `Submit`
                  ) : (
                    <span className="btn-spinner"></span>
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Social;
