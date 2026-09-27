import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ThemeMode } from "@/providers/theme-provider";

const THEME_MODE_KEY = "newsdrop_theme_mode";

export async function getThemeMode(): Promise<ThemeMode | null> {
  if (Platform.OS === "web") {
    const value = localStorage.getItem(THEME_MODE_KEY);

    return value === "light" || value === "dark" ? value : null;
  }

  const value = await SecureStore.getItemAsync(THEME_MODE_KEY);

  return value === "light" || value === "dark" ? value : null;
}

export async function setThemeMode(mode: ThemeMode): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(THEME_MODE_KEY, mode);
    return;
  }

  await SecureStore.setItemAsync(THEME_MODE_KEY, mode);
}
