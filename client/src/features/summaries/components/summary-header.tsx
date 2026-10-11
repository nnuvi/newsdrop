// import {
//   Pressable,
//   StyleSheet,
//   type StyleProp,
//   type TextStyle,
// } from "react-native";

// import { Image } from "@/components/ui/image";
// import { ThemedText } from "@/components/ui/themed-text";
// import { ThemedView } from "@/components/ui/themed-view";
// import { ThemeColor } from "@/constants/theme";
// import { Icons } from "@/constants/images";
// import { summaryService } from "../service";
// import { topicService } from "@/features/topics/service";
// import { useGenerateSummaries } from "../queries";
// import { capitalizeFirst } from "@/lib/format-value";

// type PageHeaderProps = {
//   title: string;
//   topicId?: string;
//   size?: number;
//   color?: ThemeColor;
//   style?: StyleProp<TextStyle>;
//   onPress?: () => void;
// };

// export function SummaryHeader({
//   title,
//   topicId,
//   size = 28,
//   color = "foreground",
//   style,
//   onPress,
// }: PageHeaderProps) {
//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText
//         type="title"
//         themeColor={color}
//         style={[
//           styles.title,
//           {
//             fontSize: size,
//           },
//           style,
//         ]}
//       >
//         {capitalizeFirst(title)}
//       </ThemedText>

//       {topicId ? (
//         <Pressable onPress={onPress} hitSlop={8} style={styles.refreshButton}>
//           <Image source={Icons.refresh} tintColor="foreground" size={22} />
//         </Pressable>
//       ) : null}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   title: {
//     fontWeight: "500",
//   },

//   refreshButton: {
//     padding: 4,
//   },
// });
