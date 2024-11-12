import React, { useEffect, useState } from "react";

// Asset imports
import UploadIcon from "../../../assets/img/icons/upload.png";

// Form and validation imports
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Third-party imports
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Utility imports
import Loader from "../../../utils/BackdropLoader";
import { setOrgProfile } from "../../../redux/slices/profileSlice";
import { RestfulApiService } from "../../../config/service";
import { MEDIA_URL } from "../../../config/url";

function Personal({ updateTab, nextIndex, generateXML, UpdateProfile }) {
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [addingPersonal, setAddingPersonal] = useState(false);
  const user = useSelector((state) => state.user.userProfile);
  const orgProfile = useSelector((state) => state.orgProfile.profile);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    Organizer_Name: Yup.string().required("Organizer Name is required"),
    Mobile_Number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Phone number is not valid")
      //   .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Contact Number is required"),
    Email_Id: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    Logo_Path: Yup.mixed().required("Profile image is required"),
    PAN_No: Yup.string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, "Invalid PAN format")
      .required("Pan Number is required"),
    Has_GST_No: Yup.string().required("Please select"),
    GST_No: Yup.string().when("Has_GST_No", {
      is: (value) => value === "yes", // When Has_GST_No is '1' (i.e., "yes")
      then: (schema) =>
        schema
          .matches(
            /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
            "Invalid GST"
          )
          .required("GST Number is required"),
      otherwise: (schema) => schema.nullable(), // Make it nullable when Has_GST_No is not '1'
    }),
  });

  async function LoadProfile() {
    const reqdata = {
      Method_Name: "Get_One",
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
        console.log(result);
        const formResult = result?.data?.Result?.Table1[0];
        const apiResponse = {
          orgProfile: {
            ...formResult,
            Has_GST_No: formResult.Has_GST_No === -1 ? "no" : "yes",
          },
        };
        dispatch(setOrgProfile(apiResponse));
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
          //   initialValues={{
          //     Contact_Name: "",
          //     Mobile_Number: "",
          //     Email_Id: "",
          //     Logo_Path: null,
          //     PAN_No: "",
          //     Has_GST_No: "",
          //     GST_No: "",
          //   }}
          initialValues={orgProfile}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            // updateTab(nextIndex);
            console.log(generateXML(values));
            UpdateProfile(values, 1, nextIndex, setAddingPersonal);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row y-gap-30 pt-20">
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
                            name="Organizer_Name"
                            className="form-control"
                            placeholder="Full name"
                            onChange={(e) => {
                              e.preventDefault();
                              const { value } = e.target;

                              const regex = /^[^\s].*$/;

                              if (
                                !value ||
                                (regex.test(value.toString()) &&
                                  value.length <= 100)
                              ) {
                                setFieldValue("Organizer_Name", value);
                              } else {
                                return;
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="Organizer_Name"
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
                            name="Mobile_Number"
                            className="form-control"
                            placeholder="000 000 0000"
                            maxLength="10"
                            onChange={(e) => {
                              const { value } = e.target;
                              const regex = /^[0-9\b]+$/; // Only numbers allowed

                              if (!value || regex.test(value)) {
                                setFieldValue("Mobile_Number", value);
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="Mobile_Number"
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
                            name="Email_Id"
                            className="form-control"
                            placeholder="info@yourgmail.com"
                          />
                        </div>
                        <ErrorMessage
                          name="Email_Id"
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
                            name="PAN_No"
                            className="form-control"
                            placeholder="Pan Number"
                            onChange={(e) => {
                              e.preventDefault();
                              const { value } = e.target;

                              const regex = /^[A-Za-z0-9]+$/;

                              if (
                                !value ||
                                (regex.test(value.toString()) &&
                                  value.length <= 10)
                              ) {
                                setFieldValue("PAN_No", value);
                              } else {
                                return;
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="PAN_No"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="row justify-center pt-50 y-gap-10 text-center">
                    {/* <div className="d-flex w-150 overflow-hidden profile-img"> */}
                    <div className="d-flex w-150 h-140 rounded-full border-primary overflow-hidden profile-img">
                      <img
                        src={
                          values?.Logo_Path
                            ? `${MEDIA_URL}${values?.Logo_Path}`
                            : UploadIcon
                        }
                        alt="image-upload"
                        className=""
                      />
                      <input
                        type="file"
                        name="Logo_Path"
                        className="upload-pf"
                        // onChange={(event) => {
                        //   setFieldValue(
                        //     "Logo_Path",
                        //     event.currentTarget.files[0]
                        //   );
                        //                           }}
                        onChange={async (event) => {
                          const file = event.currentTarget.files[0];

                          // Check if the file size is above 2MB (2 * 1024 * 1024 bytes)
                          const maxSize = 2 * 1024 * 1024;
                          if (file && file.size > maxSize) {
                            toast.error("File size should not exceed 2MB.");
                            event.target.value = ""; // Reset the input value
                            return;
                          }

                          const reqdata = new FormData();
                          reqdata.append("ModuleName", "OrganizationProfile");
                          reqdata.append("File", file);

                          // Start uploading

                          try {
                            await toast.promise(
                              RestfulApiService(reqdata, "master/uploadfile"),
                              {
                                loading: "Uploading...",
                                success: (result) => {
                                  if (result) {
                                    setFieldValue(
                                      "Logo_Path",
                                      result?.data?.Result
                                    );
                                    // setFieldTouched("Image_Name", true);
                                    setFieldValue(
                                      "Logo_Path",
                                      result?.data?.Description
                                    );
                                    // setFieldTouched("ImagePath", true);
                                  }
                                  return "Uploaded successfully!";
                                },
                                error: (err) => {
                                  const errorMessage =
                                    err?.Result?.Table1[0]
                                      ?.Result_Description || "Upload failed";
                                  return errorMessage;
                                },
                              },
                              {
                                success: {
                                  duration: 2000,
                                },
                              }
                            );
                          } catch (error) {
                            console.error("Upload failed:", error);
                          } finally {
                            // End uploading
                            event.target.value = "";
                          }
                        }}
                      />
                    </div>
                    {!values?.Logo_Path && (
                      <p className="text-light-1 text-10 mt-20 text-center">
                        Upload Square image at least 200px by 200px
                      </p>
                    )}
                    {values?.Logo_Path && (
                      <p className="text-light-1 text-10 mt-20 text-center">
                        {values?.Logo_Path?.split("/")[3]}
                      </p>
                    )}
                    <ErrorMessage
                      name="Logo_Path"
                      component="div"
                      className="text-error-2 text-13 "
                    />
                  </div>
                </div>
              </div>
              <div className="row pt-10">
                <div
                  className={`${
                    values?.Has_GST_No === "yes" ? "col-lg-4 " : "col-lg-8 "
                  }d-flex justify-start`}
                >
                  <div className="single-field py-10 y-gap-10">
                    <label className="text-13 fw-500">GST Applicable</label>
                    <div className="d-flex gap-15 mt-10">
                      <div className="form-radio d-flex items-center">
                        <Field type="radio" name="Has_GST_No" value="yes" />
                        <div className="text-14 lh-1 ml-10">Yes</div>
                      </div>
                      <div className="form-radio d-flex items-center">
                        <Field type="radio" name="Has_GST_No" value="no" />
                        <div className="text-14 lh-1 ml-10">No</div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="Has_GST_No"
                      component="div"
                      className="text-error-2 text-13 mt-10"
                    />
                  </div>
                </div>

                {values?.Has_GST_No === "yes" && (
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
                          onChange={(e) => {
                            e.preventDefault();
                            const { value } = e.target;

                            const regex = /^[A-Za-z0-9]+$/;

                            if (
                              !value ||
                              (regex.test(value.toString()) &&
                                value.length <= 15)
                            ) {
                              setFieldValue("GST_No", value);
                            } else {
                              return;
                            }
                          }}
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

                <div className="col-12 d-flex justify-end">
                  <div className="row">
                    <div className="col-auto relative">
                      <button
                        disabled={addingPersonal}
                        type="submit"
                        className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light load-button"
                      >
                        {!addingPersonal ? (
                          `Next`
                        ) : (
                          <span className="btn-spinner"></span>
                        )}
                      </button>
                    </div>
                  </div>
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
