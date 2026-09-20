import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Icons } from "@/constants/images";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "@/components/ui/image";

// type Props = {};

export default function TopicHeader() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="heading" themeColor="foreground">
        Topics
      </ThemedText>
      {/* <Pressable onPress={() => {}}> */}
      <Image source={Icons.add} tintColor="foreground" size={28} />
      {/* </Pressable> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 6,
  },
});
