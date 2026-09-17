import * as SplashScreen from "expo-splash-screen";

import AppTabs from "@/components/nav/app-tabs";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return <AppTabs />;
}
