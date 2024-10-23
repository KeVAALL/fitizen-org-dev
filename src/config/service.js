import AxiosInstance from "../utils/AxiosBaseUrl";

//API call
export async function RestfulApiService(data, endPoint) {
  try {
    const response = await AxiosInstance.post(`${endPoint}`, data);
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      alert(error?.response?.data?.message);

      localStorage.clear();
      sessionStorage.clear();
      // Dispatch the clearProfile action to reset the state

      window.location.replace("/");
    }
    throw error;
  }
}

export async function RestfulApiServiceGet(data, endPoint) {
  try {
    const response = await AxiosInstance.get(`${endPoint}`, data);
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      alert(error?.response?.data?.message);

      localStorage.clear();
      sessionStorage.clear();
      // Dispatch the clearProfile action to reset the state

      window.location.replace("/");
    }
    throw error;
  }
}
export async function RestfulApiServiceDownload(endPoint) {
  try {
    const response = await AxiosInstance.get(`${endPoint}`);
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      alert(error?.response?.data?.message);

      localStorage.clear();
      sessionStorage.clear();
      // Dispatch the clearProfile action to reset the state

      window.location.replace("/");
    }
    throw error;
  }
}
export function clearStepValues() {
  // localStorage.removeItem("selectedCategories");
  localStorage.removeItem("eventId");
  localStorage.removeItem("Booking_Id");
  localStorage.removeItem("Step1");
  localStorage.removeItem("Step2");
  localStorage.removeItem("Step3");
  localStorage.removeItem("registeredParticipants");
  localStorage.removeItem("paymentDetails");
  sessionStorage.removeItem("editing");
  sessionStorage.removeItem("activetab");
  sessionStorage.removeItem("formDone");
}
export function clearFormValues() {
  localStorage.removeItem("selectedCategories");
  localStorage.removeItem("eventId");
  localStorage.removeItem("Booking_Id");
  localStorage.removeItem("Step1");
  localStorage.removeItem("Step2");
  localStorage.removeItem("Step3");
  localStorage.removeItem("registeredParticipants");
  localStorage.removeItem("paymentDetails");
  // localStorage.removeItem("Order_Details");
  // localStorage.removeItem("Event_ID");
  // localStorage.removeItem("Date_Time");
  sessionStorage.removeItem("editing");
  sessionStorage.removeItem("activetab");
  sessionStorage.removeItem("formDone");
}
export function clearActiveTab() {
  localStorage.removeItem("dashboardTab");
}

// let token;
// if (isUserAuthenticated()) {
//   token = getToken();
// }
// const respose = await fetch(BASE_URL + `${endPoint}`, {
//   method: "POST",
//   body: EncryptionCode(JSON.stringify(data)),
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// });
// const result = await respose.json();
// return result;
// export function getToken() {
//   let token = "";
//   if (sessionStorage.getItem("userData") || localStorage.getItem("userData")) {
//     if (!sessionStorage.getItem("userData")) {
//       const encryptedUserData = JSON.parse(localStorage.getItem("userData"));
//       const decryptedUserData = decryptData(encryptedUserData, secret_key);
//       token = decryptedUserData.Token;
//     } else {
//       const encryptedUserData = JSON.parse(sessionStorage.getItem("userData"));
//       const decryptedUserData = decryptData(encryptedUserData, secret_key);
//       // const userData= JSON.parse(sessionStorage.getItem('userData'))
//       token = decryptedUserData.Token;
//     }
//   }
//   return token;
// }

// export function getUserDataFromStorage() {
//   let userData = {};
//   if (sessionStorage.getItem("userData") || localStorage.getItem("userData")) {
//     let encryptedUserData = null;
//     if (!sessionStorage.getItem("userData")) {
//       encryptedUserData = JSON.parse(
//         localStorage.getItem("localStorage.removeItem(keyname)")
//       );
//     } else {
//       encryptedUserData = JSON.parse(sessionStorage.getItem("userData"));
//     }
//     userData = decryptData(encryptedUserData, secret_key);
//   }
//   return userData;
// }

// export function encryptData(data, secret_key) {
//   return AES.encrypt(JSON.stringify(data), secret_key).toString();
// }

// export function decryptData(encryptedData, secretKey) {
//   const bytes = AES.decrypt(encryptedData, secretKey);
//   return JSON.parse(bytes.toString(enc.Utf8));
// }

// export function removeDataFromStorage() {
//   if (sessionStorage.getItem("userData") || localStorage.getItem("userData")) {
//     if (!sessionStorage.getItem("userData")) {
//       localStorage.removeItem("userData");
//       localStorage.removeItem("menuList");
//     } else {
//       sessionStorage.removeItem("userData");
//       sessionStorage.removeItem("menuList");
//     }
//   }
// }
