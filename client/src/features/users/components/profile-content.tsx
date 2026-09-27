import { router } from "expo-router";

import { StyleSheet, View } from "react-native";

import { QueryState } from "@/components/shared/query-state";

import { useMe } from "../queries";

import { ProfileHeader } from "./profile-header";
import { ProfileItem } from "./profile-item";
import { ProfileSection } from "./profile-section";
import { ThemeSwitch } from "@/features/settings/components/theme-switch";

import { ProfileSkeleton } from "../skeletons/profile-skeleton";

export function ProfileContent() {
  const userQuery = useMe();

  return (
    <QueryState
      {...userQuery}
      loading={<ProfileSkeleton />}
      loadingMessage="Loading profile..."
      emptyTitle="Profile unavailable"
      emptyMessage="Your profile information could not be loaded."
    >
      {(user) => (
        <View style={styles.container}>
          <ProfileHeader fullName={user.fullName} username={user.username} />

          <ProfileSection title="ACCOUNT">
            <ProfileItem
              title="View Profile"
              onPress={() => router.push("/profile/view")}
            />

            <ProfileItem title="Notifications" onPress={() => {}} />
          </ProfileSection>

          <ProfileSection title="APP">
            <ProfileItem title="Dark Mode" right={<ThemeSwitch />} />

            <ProfileItem title="About NewsDrop" onPress={() => {}} />

            <ProfileItem title="Log Out" danger />
          </ProfileSection>
        </View>
      )}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
