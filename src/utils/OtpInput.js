import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomIcon } from "./UtilityFunctions";

const OtpInput = ({
  verifyingDevice = "false",
  verifyingOtp = "false",
  length = 4,
  otpSentMessage = "Verification Code",
  onOtpSubmit = () => {},
  resendOtp = () => {},
  detail,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60); // 60 seconds countdown
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    startOtpTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startOtpTimer = (resend = false) => {
    setOtp(new Array(length).fill(""));
    inputRefs.current[0].focus();
    setIsOtpExpired(false);
    setRemainingTime(60);

    if (resend) {
      resendOtp(detail);
    }

    // Countdown logic
    countdownRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // OTP expiration logic
    timerRef.current = setTimeout(() => {
      setIsOtpExpired(true);
      clearInterval(countdownRef.current);
      toast.dismiss();
      toast.error("OTP has expired");
    }, 60000); // 1 minute
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    // if (isNaN(value) || isOtpExpired) return;
    if (isNaN(value) || value === " ") return;

    const newOtp = [...otp];
    // Allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Submit trigger
    // const combinedOtp = newOtp.join("");
    // if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // Optional
    if (index > 0 && !otp[index] && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  function handlePaste(e, index) {
    e.preventDefault();

    const pastedOtp = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedOtp)) {
      if (pastedOtp.length === length) {
        const otpDigits = pastedOtp.split("");

        setOtp(otpDigits);

        if (index < length - 1) {
          inputRefs.current[length - 1].focus();
        }
      } else {
        toast("Please enter exactly 6 digits for the OTP", {
          icon: <CustomIcon />,
          iconTheme: {
            primary: "#FFA500",
            secondary: "#000000",
          },
          style: {
            borderRadius: "10px",
            background: "#FFA500",
            color: "#fff",
          },
        });
      }
    } else {
      toast("Please enter only numeric characters for the OTP", {
        icon: <CustomIcon />,
        iconTheme: {
          primary: "#FFA500",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#FFA500",
          color: "#fff",
        },
      });
    }
  }

  return (
    <>
      {/* <div className="row y-gap-20"> */}
      <div className="col-12 mt-20 text-center font-inter">
        <div className="y-gap-10 text-center mb-15">
          <h3 className="text-18 fw-700 text-center mb-20">OTP Verification</h3>
          <label className="text-13 text-light-1 fw-500 y-gap-10 mr-20">
            {otpSentMessage}
          </label>
        </div>
        <div className="single-field y-gap-10 text-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOtpSubmit(detail, otp.join(""));
            }}
          >
            <div className="d-flex x-gap-30 justify-center">
              {otp.map((value, index) => (
                <div className="form-control mr-20 w-50">
                  <input
                    key={index}
                    type="tel"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onPaste={(e) => handlePaste(e, index)}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    //   className="otpInput"
                    className="form-control"
                  />
                </div>
              ))}
            </div>

            {/* {isOtpExpired ? (
              <div className="col-12 mt-20 relative mt-30">
                <button
                  onClick={() => startOtpTimer(true)}
                  className="button w-full h-50 px-20 -dark-1 bg-grey text-white rounded-100 load-button"
                >
                  {!verifyingDevice && "Resend OTP"}
                  {verifyingDevice && <span className="btn-spinner"></span>}
                </button>
              </div>
            ) : ( */}
            <div className="col-12 mt-20 relative mt-30">
              <button
                disabled={
                  otp.some((field) => field === "") ||
                  verifyingOtp ||
                  verifyingDevice
                }
                type="submit"
                className={`w-full h-50 px-20 -dark-1 text-white rounded-100 load-button ${
                  otp.some((field) => field === "") ? "bg-grey" : "bg-primary"
                }`}
              >
                {!verifyingOtp ? (
                  otp.some((field) => field === "") ? (
                    "Enter OTP"
                  ) : (
                    "Submit"
                  )
                ) : (
                  <span className="btn-spinner"></span>
                )}
              </button>
            </div>
            {/* )} */}
            {/* {remainingTime > 0 && ( */}
            <div className="text-14 fw-500 text-center mt-30">
              {!isOtpExpired && `Resend OTP in ${remainingTime} seconds`}
              {isOtpExpired && (
                <span
                  className="text-14 text-primary fw-500 text-center cursor-pointer"
                  onClick={() => startOtpTimer(true)}
                >
                  Resend OTP
                </span>
              )}
            </div>
            {/* )} */}
          </form>
        </div>
      </div>
    </>
  );
};

// const OtpToast = ({ remainingTime }) => {
//   const progress = (remainingTime / 60) * 100;

//   return (
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <div style={{ width: 50, height: 50, marginRight: 10 }}>
//         <CircularProgressbar
//           value={progress}
//           text={`${remainingTime}s`}
//           styles={buildStyles({
//             textSize: "24px",
//             pathColor: `rgba(62, 152, 199, ${progress / 100})`,
//             textColor: "#f88",
//             trailColor: "#d6d6d6",
//           })}
//         />
//       </div>
//       <div>OTP is valid for {remainingTime} seconds</div>
//     </div>
//   );
// };

export default OtpInput;
