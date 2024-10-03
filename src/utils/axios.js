import axios from "axios";
import { BASE_URL } from "../config/url";
import { store } from "../redux/store";

let AxiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:3000/",
});

AxiosInstance.interceptors.request.use(function (config) {
  const state = store.getState();
  const token = state.user.token;
  const we3Key = state.user.we3key;
  // const token = localStorage.getItem("authToken");
  // const we3Key = localStorage.getItem("we3key");

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  if (we3Key) {
    config.headers["we3-key"] = we3Key;
  }

  return config;
});

export default AxiosInstance;
