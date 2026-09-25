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

/** Masks a token for logging so full bearer tokens never end up in log output. */
function maskToken(token: string): string {
  if (token.length <= 12) return "***";
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  logger.debug("API auth check", {
    hasToken: !!token,
    tokenLength: token?.length ?? 0,
  });

  if (token) {
    try {
      const payload = decodeJwtPayload(token);

      logger.debug("API JWT details", {
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
        token: maskToken(token),
      });
    } catch (err) {
      logger.warn("API failed to decode JWT for logging", { error: err });
    }

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