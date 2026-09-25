import { Images } from "@/constants/images";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import LogoText from "@/assets/images/logo-text-light.svg";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { TopicCard } from "@/features/topics/components/topic-card";
import TopicList from "@/features/topics/components/topic-list";
import TopicHeader from "@/features/topics/components/topic-header";
import { ThemedView } from "@/components/ui/themed-view";
import { Screen } from "@/components/core/screen";

export default function Home() {
  return (
    <Screen noHorizontalPadding>
      <ThemedView style={styles.container}>
        <LogoText width={160} height={40} style={styles.logo} />
        <TopicHeader />
        <TopicList />
      </ThemedView>
    </Screen>
    // </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    marginBottom: 8,
  },
});
