import { getThemeMode, setThemeMode } from "@/features/settings/storages/theme";
import type { PropsWithChildren } from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(
    systemScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    async function restoreTheme() {
      const savedMode = await getThemeMode();

      if (savedMode) {
        setModeState(savedMode);
      }
    }

    restoreTheme();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await setThemeMode(nextMode);
  };

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside AppThemeProvider.");
  }

  return context;
}
