import { StyleSheet } from "react-native";

import { AnimatedIcon } from "@/components/ui/animated-icon";
// import { HintRow } from '@/components/hint-row';
import { Screen } from "@/components/app/screen";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <Screen>
      <ThemedView style={styles.heroSection}>
        <AnimatedIcon />
        <ThemedText type="title" style={styles.title}>
          Welcome to&nbsp;NewsDrop
        </ThemedText>
        <Button title="Get Started" />
      </ThemedView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: Spacing.three,
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
