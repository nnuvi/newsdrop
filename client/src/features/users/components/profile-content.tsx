import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { QueryState } from "@/components/shared/query-state";


import { ThemeSwitch } from "@/features/settings/components/theme-switch";
import { ProfileHeader } from "./profile-header";
import { ProfileItem } from "./profile-item";
import { ProfileSection } from "./profile-section";

import { ProfileSkeleton } from "../skeletons/profile-skeleton";

import { useLogout } from "@/features/auth/mutations";

import logger from "@/lib/logger";
import { useGetMe } from "../queries";

export function ProfileContent() {
  const userQuery = useGetMe();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  logger.debug("FETCHED USER: ", {
    user: userQuery.data,
  });

  return (
    <QueryState
      {...userQuery}
      loading={<ProfileSkeleton />}
      loadingMessage="Loading profile..."
      emptyTitle="Profile unavailable"
      emptyMessage="Your profile information could not be loaded."
      refetch={userQuery.refetch}
    >
      {(user) => (
        <View style={styles.container}>
          <ProfileHeader fullName={user.full_name} username={user.username} />

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

            <ProfileItem title="Log Out" danger onPress={handleLogout} />
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
