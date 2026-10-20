import { Screen } from "@/components/core/screen";

import { ProfileContent } from "@/features/users/components/profile-content";
import { router } from "expo-router";
import { useEffect } from "react";

export default function ProfileScreen() {
  return (
    <Screen>
      <ProfileContent />
    </Screen>
  );
}
