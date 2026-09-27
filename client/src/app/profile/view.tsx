import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { QueryState } from "@/components/shared/query-state";
import { Header } from "@/components/shared/header";
import { Screen } from "@/components/core/screen";

import { ThemedText } from "@/components/ui/themed-text";

import { useMe } from "@/features/users/queries";
import { ProfileHeader } from "@/features/users/components/profile-header";
import { ProfileInfo } from "@/features/users/components/profile-info";
import { ProfileSection } from "@/features/users/components/profile-section";

import { ProfileSkeleton } from "@/features/users/skeletons/profile-skeleton";

import { formatDate } from "@/lib/format-date";
import { ProfileForm } from "@/features/users/components/profile-form";

export default function ViewProfileScreen() {
  const userQuery = useMe();

  return (
    <Screen>
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

            <ProfileForm user={user} />

            {/* <Pressable
              onPress={() => router.push("/profile/edit")}
              style={styles.editButton}
            >
              <ThemedText type="smallBold" themeColor="primary">
                Edit
              </ThemedText>
            </Pressable> */}

            {/* <ProfileSection title="ACCOUNT">
              <ProfileInfo label="Name" value={user.fullName} />

              <ProfileInfo label="Username" value={`@${user.username}`} />

              <ProfileInfo label="Email" value={user.email} />
            </ProfileSection>

            <ProfileSection title="INFO">
              <ProfileInfo label="Joined" value={formatDate(user.createdAt)} />
            </ProfileSection> */}
          </View>
        )}
      </QueryState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  editButton: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
});
