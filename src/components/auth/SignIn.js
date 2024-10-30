// React imports
import React, { useEffect, useState } from "react";

// Asset imports
import SignInBanner from "../../assets/img/masthead/h-banner.png";
import DarkLogo from "../../assets/img/general/logo-dark.png";
import Org1 from "../../assets/img/masthead/org-1.gif";
import Org2 from "../../assets/img/masthead/org-2.gif";
import Org3 from "../../assets/img/masthead/org-3.gif";

// React Router imports
import { useNavigate } from "react-router-dom";

// Third-party imports
import { Formik } from "formik";
import * as Yup from "yup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import toast from "react-hot-toast";

// Project-specific imports
import { RestfulApiService } from "../../config/service";
import OtpInput from "../../utils/OtpInput";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfile,
  setLoginAttempt,
  setProfile,
} from "../../redux/slices/userSlice";
import Email from "./Email";
import { verifyToken } from "../../utils/UtilityFunctions";

function SignIn() {
  const token = useSelector((state) => state.user.token);
  const [otpOwner, setOTPOwner] = useState();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[6-9]\d{9}$/, "Phone number is not valid"),
  });
  const handlePhoneChange = (phone, formik) => {
    // Remove the country code (+91)
    const phoneWithoutCountryCode = phone.replace(/^\+91/, "");
    formik.setFieldValue("phone", phoneWithoutCountryCode);
  };
  const handleSendOtp = async (phone_no) => {
    const phoneWithoutCountryCode = phone_no.replace(/^\+91/, "");
    const reqdata = {
      Method_Name: "Send",
      Otp_Send_On: phoneWithoutCountryCode,
      Send_On_Type: "MOB",
      Module: "ORG",
      Opt_Type: "LOGIN",
    };
    try {
      setVerifyingMobile(true);

      const result = await RestfulApiService(reqdata, "master/Send_Otp");
      if (result) {
        console.log(result?.data?.Result);

        setOTPOwner(phone_no);

        setShowOtpInput(true);

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error("Internal Server Error");
    } finally {
      setVerifyingMobile(false);
    }
  };
  const handleResendOTP = async (phone_no) => {
    const phoneWithoutCountryCode = phone_no.replace(/^\+91/, "");
    const reqdata = {
      Method_Name: "Resend",
      Otp_Send_On: phoneWithoutCountryCode,
      Send_On_Type: "MOB",
      Module: "ORG",
      Opt_Type: "LOGIN",
    };
    try {
      setVerifyingMobile(true);

      const result = await RestfulApiService(reqdata, "master/Send_Otp");

      if (result) {
        const otp = result?.data?.Result?.Table1[0]?.Result_Extra_Key;

        // toast.success(<CustomSuccessToast otp={otp} />, {
        //   duration: 30000, // Set duration to 0 to keep the toast until manually dismissed
        // });

        setOTPOwner(phone_no);

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error("Internal Server Error");
    } finally {
      setVerifyingMobile(false);
    }
  };
  const handleVerifyOtp = async (phone_no, otp) => {
    const phoneWithoutCountryCode = phone_no.replace(/^\+91/, "");
    const reqdata = {
      Otp_Send_On: phoneWithoutCountryCode,
      Send_On_Type: "MOB",
      Module: "ORG",
      Opt_Type: "LOGIN",
      Otp: otp,
    };
    try {
      setVerifyingOtp(true);

      const result = await RestfulApiService(
        reqdata,
        "organizer/signinwithmobileotp"
      );
      console.log(result?.data);
      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }

      const apiResponse = {
        userProfile: result?.data?.Result?.Table1[0],
        token: result?.data?.Description,
        we3_key: result?.data?.Key,
      };

      if (!result?.data?.Result?.Table1[0]?.Is_Email_Verified) {
        dispatch(setLoginAttempt(apiResponse));

        setShowEmailForm(true);
      } else {
        toast.success("OTP Verified");
        dispatch(setProfile(apiResponse));

        setShowEmailForm(false);
        setShowLoginForm(false);

        navigate("/dashboard/all-events");
      }
      setShowOtpInput(false);
      return result;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.Result?.Table1[0]?.Result_Description);
    } finally {
      setVerifyingOtp(false);
    }
  };
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    const verifyAndRedirect = () => {
      if (!verifyToken(token)) {
        dispatch(clearProfile());
        navigate("/sign-in", { replace: true });
        // window.location.reload();
      }
    };

    verifyAndRedirect();
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <section className="masthead -type-1 z-5 lg:pb-50 lg:pt-100">
        <div className="masthead__bg">
          <img src={SignInBanner} alt="image-mast" className="js-lazy" />
        </div>
        <div className="container">
          <div className="row justify-between">
            <div className="col-lg-7">
              <div className="d-flex items-end h-full">
                <h1 className="text-40 lg:text-20 md:text-30 text-white font-inter italic">
                  Marathon and Sports Event Management Platform
                </h1>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5 col-md-5 px-30 lg:px-0">
              <div></div>
              {showEmailForm ? (
                <Email
                  setShowEmailForm={setShowEmailForm}
                  setShowLoginForm={setShowLoginForm}
                />
              ) : (
                <div
                  className={`px-50 py-40 sm:px-20 sm:py-20 bg-white bg-shadow rounded-16${
                    scrolled ? " fixed-card" : ""
                  }`}
                >
                  <div className="relative">
                    {showOtpInput && (
                      <div
                        className="fas fa-arrow-left border-primary text-12 text-primary fw-600 rounded-full px-10 py-10 text-center cursor-pointer h-30 w-30 button otp-back-btn"
                        onClick={() => {
                          setShowOtpInput(false);
                        }}
                      ></div>
                    )}
                    <div className="row y-gap-20">
                      <div class="col-12 text-center">
                        <img
                          src={DarkLogo}
                          alt="logo-icon"
                          style={{ width: "150px" }}
                        />
                      </div>
                      {!showOtpInput ? (
                        <>
                          <Formik
                            initialValues={{ phone: otpOwner ? otpOwner : "" }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                              console.log("Form values:", values);

                              handleSendOtp(values.phone);
                            }}
                          >
                            {(formik) => (
                              <form onSubmit={formik.handleSubmit}>
                                <div className="col-12 mt-20 y-gap-10">
                                  <div className="col-12 mt-20">
                                    <div className="single-field y-gap-20">
                                      <label className="text-13 fw-500">
                                        Phone Number
                                      </label>
                                      <div className="form-control">
                                        <PhoneInput
                                          disableDialCodePrefill
                                          disableDialCodeAndPrefix
                                          showDisabledDialCodeAndPrefix
                                          placeholder="00000-00000"
                                          defaultCountry="in"
                                          value={formik.values.phone}
                                          onChange={(phone, e) => {
                                            // formik.setFieldValue("phone", phone);
                                            handlePhoneChange(phone, formik);
                                          }}
                                          inputStyle={{
                                            borderLeft: "0px",
                                          }}
                                          countrySelectorStyleProps={{
                                            paddingRight: "8px",
                                            paddingLeft: "8px",
                                          }}
                                        />
                                      </div>
                                      {formik.touched.phone &&
                                      formik.errors.phone ? (
                                        <div className="text-red-1 text-13">
                                          {formik.errors.phone}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>

                                  <div className="col-12 mt-20 relative">
                                    <button
                                      disabled={verifyingMobile}
                                      type="submit"
                                      className="button w-full h-50 px-20 -grey-1 bg-grey text-white rounded-100 load-button"
                                    >
                                      {!verifyingMobile && "Send OTP"}
                                      {verifyingMobile && (
                                        <span class="btn-spinner"></span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </form>
                            )}
                          </Formik>
                        </>
                      ) : (
                        <OtpInput
                          verifyingDevice={verifyingMobile}
                          verifyingOtp={verifyingOtp}
                          otpSentMessage={`Verification Code sent on +91 ${otpOwner}`}
                          onOtpSubmit={handleVerifyOtp}
                          resendOtp={handleResendOTP}
                          detail={otpOwner}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="row y-gap-20 pt-10">
                    <div className="col-12">
                      <div className="text-center text-10 lh-12 fw-500">
                        By creating an account you agree with our{" "}
                        <a
                          href="#"
                          target="_blank"
                          className="text-primary underline"
                        >
                          {" "}
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          target="_blank"
                          className="text-primary underline"
                        >
                          {" "}
                          Privacy Policy.
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="layout-pt-md layout-pb-md relative">
        <div className="container">
          <div className="row mb-80 lg:mb-20">
            <div className="col-lg-7 col-md-12">
              <div className="row y-gap-30 justify-between items-center">
                <div className="col-lg-6">
                  <img src={Org1} alt="image-gif" className="rounded-8" />
                </div>
                <div className="col-lg-6">
                  <h4 className="text-20 fw-700 font-inter">
                    Get Started Quickly with Your Organizer Account
                  </h4>
                  <p className="text-light-1 text-14 fw-500 mt-10 lg:mt-10 md:mt-10 font-inter">
                    Provide your basic information to get started!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-80 lg:mb-20">
            <div className="col-lg-7 col-md-12">
              <div className="row y-gap-30 justify-between items-center">
                <div className="col-lg-6">
                  <img src={Org2} alt="image-gif" className="rounded-8" />
                </div>
                <div className="col-lg-6">
                  <h4 className="text-20 fw-700 font-inter">
                    Streamlined Process for Hassle-Free Transfer
                  </h4>
                  <p className="text-light-1 text-14 fw-500 mt-10 lg:mt-10 md:mt-10 font-inter">
                    Low Fees and Competitive Rates
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-7 col-md-12">
              <div className="row y-gap-30 justify-between items-center">
                <div className="col-lg-6">
                  <img src={Org3} alt="image-gif" className="rounded-8" />
                </div>
                <div className="col-lg-6">
                  <h4 className="text-20 fw-700 font-inter">
                    Track Events in Real-Time with Instant Notifications
                  </h4>
                  <p className="text-light-1 text-14 fw-500 mt-10 lg:mt-10 md:mt-10 font-inter">
                    Real-Time Tracking and Alerts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
