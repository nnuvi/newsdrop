import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>
        Profile
      </ThemedText>

      {/* Profile */}
      <ThemedView style={styles.profile}>
        <View style={styles.avatarPlaceholder} />

        <View style={styles.profileInfo}>
          <ThemedText type="smallBold">
            User Name
          </ThemedText>

          <ThemedText type="small" style={styles.email}>
            user@example.com
          </ThemedText>
        </View>
      </ThemedView>

      {/* Account */}
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        ACCOUNT
      </ThemedText>

      <ThemedView style={styles.section}>
        <ProfileItem title="Edit Profile" />
        <ProfileItem title="Notifications" />
      </ThemedView>

      {/* App */}
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        APP
      </ThemedText>

      <ThemedView style={styles.section}>
        <ProfileItem title="About NewsDrop" />
        <ProfileItem title="Log Out" danger />
      </ThemedView>
    </ThemedView>
  );
}

type ProfileItemProps = {
  title: string;
  danger?: boolean;
};

function ProfileItem({
  title,
  danger = false,
}: ProfileItemProps) {
  return (
    <ThemedView style={styles.item}>
      <View style={styles.iconSpace} />

      <ThemedText
        type="default"
        style={[
          styles.itemText,
          danger && styles.dangerText,
        ]}
      >
        {title}
      </ThemedText>

      <View style={styles.chevronSpace} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  header: {
    marginBottom: 24,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
  },

  profileInfo: {
    marginLeft: 16,
  },

  email: {
    color: '#687280',
    marginTop: 2,
  },

  sectionTitle: {
    color: '#687280',
    marginBottom: 8,
  },

  section: {
    marginBottom: 28,
  },

  item: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  iconSpace: {
    width: 24,
  },

  itemText: {
    flex: 1,
    marginLeft: 14,
  },

  chevronSpace: {
    width: 20,
  },

  dangerText: {
    color: '#EF4444',
  },
});