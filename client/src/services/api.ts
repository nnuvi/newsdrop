import axios from "axios";
import { Platform } from "react-native";

import { getAccessToken } from "@/features/auth/storage";
import { logger } from "@/lib/logger";

const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL_LOCAL
    : process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined for this platform.");
}

logger.info("API client initialized", {
  baseURL: API_URL,
  platform: Platform.OS,
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  logger.debug("API auth check", {
    hasToken: !!token,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  logger.debug("API request", {
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
    logger.debug("API response", {
      status: response.status,
      url: response.config.url,
    });

    return response;
  },
  (error) => {
    logger.error("API request failed", error, {
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
    });

    if (
      axios.isAxiosError(error) &&
      typeof error.response?.data?.detail?.message === "string"
    ) {
      error.message = error.response.data.detail.message;
    }

    return Promise.reject(error);
  },
);

export default api;
