import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import { Screen } from "@/components/core/screen";
import { QueryState } from "@/components/shared/query-state";

import { ProfileHeader } from "@/features/users/components/profile-header";
import { useGetMe } from "@/features/users/queries";

import { ProfileSkeleton } from "@/features/users/skeletons/profile-skeleton";

import { ProfileForm } from "@/features/users/components/profile-form";

export default function ViewProfileScreen() {
  const userQuery = useGetMe();

  return (
    <Screen>
      <QueryState
        {...userQuery}
        loading={<ProfileSkeleton />}
        loadingMessage="Loading profile..."
        emptyTitle="Profile unavailable"
        emptyMessage="Your profile information could not be loaded."
        refetch={userQuery.refetch}
      >
        {(user) => (
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={userQuery.isRefetching}
                onRefresh={() => {
                  void userQuery.refetch();
                }}
              />
            }
          >
            <ProfileHeader fullName={user.full_name} username={user.username} />
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
          </ScrollView>
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
