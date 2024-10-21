import React, { useState } from "react";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { RestfulApiService } from "../../config/service";
import toast from "react-hot-toast";
import OtpInput from "../../utils/OtpInput";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../../redux/slices/userSlice";
import DarkLogo from "../../assets/img/general/logo-dark.png";
import { useNavigate } from "react-router-dom";

function Email({ setShowEmailForm, setShowLoginForm }) {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [otpOwner, setOTPOwner] = useState();
  const user = useSelector((state) => state.user.userProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validationSchema = Yup.object({
    email: Yup.string()
      // .email("Invalid email address")
      .matches(emailRegex, "Invalid email address")
      .required("Email is required"),
    full_name: Yup.string()
      .matches(/^[a-zA-Z][a-zA-Z\s]*$/, "Invalid name format")
      .required("Full name is required"),
  });
  const handleResendOTP = async (detail) => {
    const reqdata = {
      Method_Name: "Resend",
      Otp_Send_On: detail?.email,
      Send_On_Type: "EMAIL",
      Module: "ORG",
      Opt_Type: "LOGIN",
    };
    try {
      setVerifyingEmail(true);

      const result = await RestfulApiService(reqdata, "master/Send_Otp");

      if (result) {
        const otp = result?.data?.Result?.Table1[0]?.Result_Extra_Key;

        // toast.success(<CustomSuccessToast otp={otp} />, {
        //   duration: 30000, // Set duration to 0 to keep the toast until manually dismissed
        //   position: "top-right",
        // });

        sessionStorage.removeItem("EmailOtpType");

        setOTPOwner(detail);

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error("Internal Server Error");
    } finally {
      setVerifyingEmail(false);
    }
  };
  const handleVerifyEmail = async (values) => {
    // const user = JSON.parse(localStorage.getItem("userProf"));
    const reqdata = {
      Method_Name: "Email",
      Email_Id: values.email,
      Mobile_Number: user.Mobile_Number,
      Organizer_Id: user.Organizer_Id,
      User_Id: user.User_Id,
    };
    setOTPOwner(values);
    try {
      setVerifyingEmail(true);

      const result = await RestfulApiService(
        reqdata,
        "organizer/validateemailmobile"
      );

      console.log(result?.data?.Result[0]);

      if (result?.data?.Result[0]?.Result_Id === -1) {
        console.log("here");
        toast.error(result?.data?.Result[0]?.Result_Description);
        return;
      }

      sessionStorage.setItem("EmailOtpType", result?.data?.Result[0]?.Opt_Type);
      sessionStorage.setItem("ModuleType", result?.data?.Result[0]?.Module);

      if (result) {
        console.log(result?.data?.Result);

        setShowOtpInput(true);

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setVerifyingEmail(false);
    }
  };
  const handleVerifyEmailOtp = async (values, otp) => {
    const OtpType = sessionStorage.getItem("EmailOtpType");
    const ModuleType = sessionStorage.getItem("ModuleType");
    const reqdata = {
      Otp_Send_On: values.email,
      Send_On_Type: "EMAIL",
      Module: ModuleType,
      Opt_Type: OtpType ?? "LOGIN",
      Otp: otp,
      Method_Name: "UpdateEmail",
      Email_Id: values.email,
      Mobile_Number: user.Mobile_Number,
      User_Id: user.User_Id,
      Organizer_Id: user.Organizer_Id,
      First_Name: values?.full_name ?? "",
      Last_Name: "",
    };
    try {
      setVerifyingEmailOtp(true);

      const result = await RestfulApiService(
        reqdata,
        "organizer/validateemailmobileotp"
      );

      if (result) {
        console.log(result?.data?.Result);

        if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
          console.log("here");
          toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
          return;
        }

        const apiResponse = {
          userProfile: result?.data?.Result?.Table1[0],
          token: result?.data?.Description,
          we3_key: result?.data?.Key,
        };
        dispatch(setProfile(apiResponse));

        toast.success("OTP Verified");

        setShowEmailForm(false);
        setShowLoginForm(false);
        setShowOtpInput(false);

        navigate("/dashboard/profile");

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.Result?.Table1[0]?.Result_Description);
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  return (
    // <div className="d-flex flex-column gap-20">
    <div class="px-50 py-40 sm:px-20 sm:py-20 bg-white bg-shadow rounded-16 relative">
      {showOtpInput && (
        <div
          className="fas fa-arrow-left border-primary text-12 text-primary fw-600 rounded-full px-10 py-10 text-center cursor-pointer h-30 w-30 button otp-back-btn"
          onClick={() => {
            setShowOtpInput(false);
          }}
        ></div>
      )}
      <div class="row y-gap-20">
        <div class="col-12 text-center">
          <img src={DarkLogo} alt="logo-icon" style={{ width: "150px" }} />
        </div>
        {!showOtpInput ? (
          <Formik
            initialValues={{
              full_name: otpOwner?.full_name ? otpOwner?.full_name : "",
              email: otpOwner?.email ? otpOwner?.email : "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form values", values);
              handleVerifyEmail(values);
            }}
          >
            {({ errors, touched, isValid, dirty, setFieldValue }) => (
              <Form>
                <div className="col-12 mt-20">
                  <div className="single-field">
                    <label className="text-13 fw-600">
                      Full Name <sup className="asc">*</sup>
                    </label>
                    <div className="form-control relative">
                      <Field
                        type="text"
                        className="form-control"
                        placeholder="Carel Jones"
                        name="full_name"
                        maxLength="50"
                        onChange={(e) => {
                          e.preventDefault();
                          const { value } = e.target;

                          // const regex = /^[a-zA-Z][a-zA-Z\s!-\/:-@[-`{-~]*$/;
                          const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                          if (!value || regex.test(value.toString())) {
                            setFieldValue("full_name", value);
                          } else {
                            return;
                          }
                        }}
                      />
                    </div>
                    {errors.full_name && touched.full_name ? (
                      <div className="text-error-2 text-13">
                        {errors.full_name}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div class="col-12 mt-20">
                  <div class="single-field">
                    <label class="text-13 fw-600">
                      Email ID <sup className="asc">*</sup>
                    </label>
                    <div class="form-control">
                      <Field
                        type="email"
                        className="form-control"
                        placeholder="info@fitizenindia.com"
                        name="email"
                        maxLength="50"
                      />
                    </div>
                    {errors.email && touched.email ? (
                      <div className="text-error-2 text-13">{errors.email}</div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12 mt-40 relative">
                  <button
                    type="submit"
                    disabled={verifyingEmail}
                    className="button w-full h-50 px-20 -dark-1 bg-grey text-white rounded-100 load-button"
                  >
                    {!verifyingEmail && "Send Email Verification"}
                    {verifyingEmail && <span className="btn-spinner"></span>}
                  </button>
                </div>

                {/* <div class="row y-gap-20 pt-10">
                  <div class="col-12">
                    <div className="text-center text-12 lh-12 fw-400">
                      By creating an account you agree with our{" "}
                      <a
                        href="/term-condition"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                </div> */}
              </Form>
            )}
          </Formik>
        ) : (
          <OtpInput
            verifyingDevice={verifyingEmail}
            verifyingOtp={verifyingEmailOtp}
            otpSentMessage={`Verification Code sent on ${otpOwner?.email}`}
            onOtpSubmit={handleVerifyEmailOtp}
            resendOtp={handleResendOTP}
            detail={otpOwner}
          />
        )}
      </div>
    </div>
    // </div>
  );
}

export default Email;
