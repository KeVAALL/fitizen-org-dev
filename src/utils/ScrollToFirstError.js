import { useEffect, useState } from "react";
import { getFieldErrorNames } from "./FormikHelpers";
import toast from "react-hot-toast";

export const ScrollToFieldError = ({ errors, submitCount }) => {
  useEffect(() => {
    if (submitCount === 0) return; // Only execute after a form submission

    const fieldErrorNames = getFieldErrorNames(errors);
    if (fieldErrorNames.length === 0) return;

    console.log(fieldErrorNames);
    const element = document.querySelector(
      `input[name='${fieldErrorNames[0]}']`
    );
    if (!element) return;

    // Scroll to the first known error field
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors, submitCount]);

  return null;
};

// export const ShowFormErrorsToast = ({ errors, submitCount }) => {
//   useEffect(() => {
//     if (submitCount > 0 && Object.keys(errors).length > 0) {
//       // Customize the error message as per your need
//       toast.error("Please resolve all errors in the form before submitting.", {
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   }, [errors, submitCount]);

//   return null;
// };

export const ShowFormErrorsToast = ({ errors, submitCount }) => {
  const [lastSubmitCount, setLastSubmitCount] = useState(0);

  useEffect(() => {
    if (submitCount > lastSubmitCount && Object.keys(errors).length > 0) {
      // Show toast when submit button is clicked and there are more than 3 errors
      toast.error("Please resolve all errors in the form before submitting.", {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Update last submit count to prevent repeated toasts until submit is clicked again
      setLastSubmitCount(submitCount);
    }
  }, [errors, submitCount, lastSubmitCount]);

  return null;
};

// const useFocusOnError = ({fieldRef, name}) => {
//   const formik = useFormikContext();
//   const prevSubmitCountRef = React.useRef(formik.submitCount);
//   const firstErrorKey = Object.keys(formik.errors)[0];
//   React.useEffect(() => {
//     if (prevSubmitCountRef.current !== formik.submitCount && !formik.isValid) {
//       if (fieldRef.current && firstErrorKey === name) fieldRef.current.focus();
//     }
//     prevSubmitCountRef.current = formik.submitCount;
//   }, [formik.submitCount, formik.isValid, firstErrorKey]);
// };
