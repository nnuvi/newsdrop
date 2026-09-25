import axios from "axios";
import { Platform } from "react-native";

import { getAccessToken } from "@/features/auth/storage";

const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL_LOCAL
    : process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined for this platform.");
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

function decodeJwtPayload(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const payload = parts[1];

  const base64 = payload
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");

  return JSON.parse(atob(base64));
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  console.log("[API] Auth:", {
    hasToken: !!token,
    tokenLength: token?.length ?? 0,
  });

  if (token) {
    const payload = decodeJwtPayload(token);

    console.log("[API] JWT details:", {
      header: {
        algorithm: token.split(".")[0],
      },
      subject: payload.sub,
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
      expiresAt: payload.exp
        ? new Date(payload.exp * 1000).toISOString()
        : null,
      expired: payload.exp ? Date.now() >= payload.exp * 1000 : null,
      claims: payload,
    });

    console.log("[API] JWT token:", token);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("[API] Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL ?? ""}${config.url ?? ""}`,
    hasAuthorizationHeader: !!config.headers.Authorization,
  });

  return config;
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
