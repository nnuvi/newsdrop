import { router } from "expo-router";

import { StyleSheet, View } from "react-native";

import { QueryState } from "@/components/shared/query-state";
import { Loading } from "@/components/shared/loading-state";

import { useMe } from "../queries";

import { ProfileHeader } from "./profile-header";
import { ProfileItem } from "./profile-item";
import { ProfileSection } from "./profile-section";
import { ThemeSelector } from "./theme-selector";
import { ProfileSkeleton } from "../skeletons/profile-skeleton";

export function ProfileContent() {
  const userQuery = useMe();

  return (
    <QueryState
      {...userQuery}
      loading={<ProfileSkeleton />}
      emptyTitle="Profile unavailable"
      emptyMessage="Your profile information could not be loaded."
    >
      {(user) => (
        <View style={styles.container}>
          <ProfileHeader name={user.username} email={user.email} />

          <ProfileSection title="ACCOUNT">
            <ProfileItem
              title="Edit Profile"
              onPress={() => router.push("/profile/edit")}
            />

            <ProfileItem title="Notifications" onPress={() => {}} />
          </ProfileSection>

          <ProfileSection title="APP">
            <ThemeSelector />

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
