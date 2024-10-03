import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CustomSuccessToast = ({ otp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(otp)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          toast.dismiss(); // Dismiss the toast after 1 second
        }, 1000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard: ", error);
        toast.error("Failed to copy OTP.");
      });
  };

  return (
    <div className="d-flex items-center x-gap-30">
      <p className="text-14 fw-600">Your OTP: {otp}</p>
      <button
        className="py-10 bg-white text-black text-12 rounded-8 fw-600"
        style={{
          border: "1px solid",
          display: "flex",
          justifyContent: "center",
        }}
        onClick={handleCopyToClipboard}
      >
        {!copied ? (
          "Copy"
        ) : (
          <i
            className="fas fa-check text-green"
            style={{ margin: "2px 9px" }}
          ></i>
        )}
      </button>
    </div>
  );
};

export const CustomErrorToast = ({ errorMessage }) => {
  return (
    <div
      className="d-flex items-center x-gap-30"
      style={{
        backgroundColor: "red",
        color: "white !important",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <p className="text-14 fw-600">{errorMessage}</p>
    </div>
  );
};
