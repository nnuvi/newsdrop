import { getAccessToken } from "@/features/auth/storage";

import axios from "axios";
import { Platform } from "react-native";

// const API_URL = process.env.EXPO_PUBLIC_API_URL_LOCAL;
const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL_LOCAL
    : process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL_LOCAL is not defined");
}

console.log("[API] Base URL:", API_URL);
console.log("[API] Platform:", Platform.OS);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

api.interceptors.response.use(
  (response) => {
    console.log("[API] Response:", {
      status: response.status,
      url: response.config.url,
    });

    return response;
  },
  (error) => {
    console.log("[API] Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    return Promise.reject(error);
  },
);

export default api;
