import { Images } from "@/constants/images";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import LogoText from "../../../assets/images/text-logo-light.svg";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { TopicCard } from "@/features/topics/components/topic-card";

const DATA = [
  { id: "1", label: "Box 1" },
  { id: "2", label: "Box 2" },
  { id: "3", label: "Box 3" },
  { id: "4", label: "Box 4" },
  { id: "5", label: "Box 5" },
  { id: "6", label: "Box 6" },
];

const GRID = {
  minItemWidth: 160,
  gap: 12,
  horizontalPadding: 16,
};

const getItemWidth = (screenWidth: number, numColumns: number) => {
  const availableWidth = screenWidth - GRID.horizontalPadding * 2;

  return (availableWidth - GRID.gap * (numColumns - 1)) / numColumns;
};

function getColumnCount(width: number) {
  const availableWidth = width - GRID.horizontalPadding * 2;

  return Math.max(
    2,
    Math.floor((availableWidth + GRID.gap) / (GRID.minItemWidth + GRID.gap)),
  );
}

export default function Home() {
  const { width } = useWindowDimensions();

  const numColumns = getColumnCount(width);
  const itemWidth = getItemWidth(width, numColumns);
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <LogoText width={160} height={40} style={styles.logo} />

      <FlatList
        key={numColumns}
        data={DATA}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item, index }) => (
          <TopicCard title={item.label} width={itemWidth} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: GRID.horizontalPadding,
  },

  logo: {
    marginBottom: 16,
  },

  gridContent: {
    gap: GRID.gap,
    alignItems: "flex-start",
  },

  row: {
    gap: GRID.gap,
  },

  box: {
    aspectRatio: 3 / 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 17, 21, 0.4)",
  },

  boxText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
