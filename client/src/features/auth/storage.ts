// import * as SecureStore from "expo-secure-store";

// const ACCESS_TOKEN_KEY = "access_token";

// export async function getAccessToken() {
//   return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
// }

// export async function setAccessToken(token: string) {
//   await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
// }

// export async function removeAccessToken() {
//   await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
// }

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "newsdrop_access_token";

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function setAccessToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function removeAccessToken(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
