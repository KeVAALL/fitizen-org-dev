import { URL_KEY } from "../config/url";

const secretKey = URL_KEY;
console.log(secretKey);

// Encode data to Base64
export function encryptData(data) {
  return window.btoa(data);
}

// Decode data from Base64
export function decryptData(base64Data) {
  return window.atob(base64Data);
}
