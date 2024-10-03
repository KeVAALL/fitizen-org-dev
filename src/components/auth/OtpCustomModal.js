import React, { useState } from "react";
import OtpInput from "../../utils/OtpInput";

import { Formik } from "formik";
import * as Yup from "yup";
import { PhoneInput } from "react-international-phone";
import { RestfullApiService } from "../../config/service";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../../redux/slices/userSlice";

function OtpCustomModal({
  showModal,
  setShowModal,
  setShowLoginForm,
  setGoogleSignInSuccess,
}) {
  const [otpOwner, setOTPOwner] = useState();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userProfile);

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number is not valid"),
  });
  const handlePhoneChange = (phone, formik) => {
    const phoneWithoutCountryCode = phone.replace(/^\+91/, "");
    formik.setFieldValue("phone", phoneWithoutCountryCode);
  };
  const handleSendOtp = async (phone_no) => {
    const phoneWithoutCountryCode = phone_no.replace(/^\+91/, "");

    const reqdata = {
      Method_Name: "Mobile",
      Email_Id: user?.Email_Id,
      Mobile_Number: phoneWithoutCountryCode,
      Participant_Id: user?.Participant_Id,
    };
    try {
      setVerifyingMobile(true);

      const result = await RestfullApiService(
        reqdata,
        "participant/validateemailmobile"
      );
      console.log(result?.data);
      if (result?.data?.Result[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result[0]?.Result_Description);
        return;
      }
      if (result) {
        console.log(result?.data?.Result);
        sessionStorage.setItem(
          "GmailOtpType",
          result?.data?.Result[0]?.Opt_Type
        );
        sessionStorage.setItem(
          "GmailModuleType",
          result?.data?.Result[0]?.Module
        );

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
  const handleVerifyEmailOtp = async (detail, otp) => {
    // const user = JSON.parse(localStorage.getItem("userProf"));
    const OtpType = sessionStorage.getItem("GmailOtpType");
    const ModuleType = sessionStorage.getItem("GmailModuleType");

    const reqdata = {
      Otp_Send_On: detail,
      Send_On_Type: "MOB",
      Module: ModuleType ?? "PAR",
      Opt_Type: OtpType ?? "VAL",
      Otp: Number(otp),
      Participant_Id: user.Participant_Id,
      Method_Name: "UpdateMobile",
      Email_Id: user.Email_Id,
      Mobile_Number: detail,
      First_Name: user.First_Name,
      Last_Name: user.Last_Name,
    };
    try {
      setVerifyingMobileOtp(true);

      const result = await RestfullApiService(
        reqdata,
        "participant/validateemailmobileotp"
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

        setShowModal(false);

        if (setGoogleSignInSuccess) {
          setGoogleSignInSuccess(true);
        }
        if (setShowLoginForm) {
          setShowLoginForm(false);
        }

        setShowOtpInput(false);

        return result;
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.Result?.Table1[0]?.Result_Description);
    } finally {
      setVerifyingMobileOtp(false);
    }
  };
  const handleResendOTP = async (phone_no) => {
    const phoneWithoutCountryCode = phone_no.replace(/^\+91/, "");
    const reqdata = {
      Method_Name: "Resend",
      Otp_Send_On: phoneWithoutCountryCode,
      Send_On_Type: "MOB",
      Module: "PAR",
      Opt_Type: "VAL",
    };
    try {
      setVerifyingMobile(true);

      const result = await RestfullApiService(reqdata, "master/Send_Otp");

      if (result) {
        const otp = result?.data?.Result?.Table1[0]?.Result_Extra_Key;

        // toast.success(<CustomSuccessToast otp={otp} />, {
        //   duration: 30000, // Set duration to 0 to keep the toast until manually dismissed
        // });

        sessionStorage.removeItem("GmailOtpType");

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

  return (
    <div className={`custom-modal${showModal ? " show-custom-modal" : ""}`}>
      <div className="custom-modal-content">
        <div className="d-flex flex-column gap-20 relative">
          {showOtpInput && (
            <div
              className="fas fa-arrow-left border-primary text-12 text-primary fw-600 rounded-full px-10 py-10 text-center cursor-pointer h-30 w-30 button otp-modal-back-btn"
              onClick={() => {
                setShowOtpInput(false);
              }}
            ></div>
          )}
          <div className="row y-gap-10">
            <div className="col-12 text-center">
              <p className="text-18 fw-700 text-primary">Never miss a race!</p>
              <p className="text-13 fw-500">
                Sign up to track all your sports & running events in one place.
              </p>
            </div>
            {!showOtpInput ? (
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
                            Enter Phone Number
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
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-red-1 text-13">
                              {formik.errors.phone}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div class="col-12 mt-20 relative">
                        <button
                          disabled={verifyingMobile}
                          type="submit"
                          class="button w-full h-50 px-20 -dark-1 bg-grey text-white rounded-100 load-button"
                        >
                          {!verifyingMobile && "Send OTP"}
                          {verifyingMobile && <span class="btn-spinner"></span>}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            ) : (
              <OtpInput
                verifyingDevice={verifyingMobile}
                verifyingOtp={verifyingMobileOtp}
                otpSentMessage={`Verification Code sent on +91 ${otpOwner}`}
                onOtpSubmit={handleVerifyEmailOtp}
                resendOtp={handleResendOTP}
                detail={otpOwner}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpCustomModal;
