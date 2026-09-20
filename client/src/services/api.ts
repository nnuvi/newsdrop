import axios from "axios";
import { Platform } from "react-native";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL_LOCAL
    : process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});
