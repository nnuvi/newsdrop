import { Header } from "@/components/shared/header";
import { Screen } from "@/components/core/screen";

import { ProfileContent } from "@/features/users/components/profile-content";

export default function ProfileScreen() {
  return (
    <Screen>
      <ProfileContent />
    </Screen>
  );
}
