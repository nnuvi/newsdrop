// import { Colors } from "@/constants/colors";
import { Images } from "@/constants/images";
import { FlatList, StyleSheet, Text, View } from "react-native";
import LogoText from "../../../assets/images/text-logo-light.svg";

const DATA = [
  { id: "1", label: "Box 1" },
  { id: "2", label: "Box 2" },
  { id: "3", label: "Box 3" },
  { id: "4", label: "Box 4" },
  { id: "5", label: "Box 5" },
  { id: "6", label: "Box 6" },
];

const NUM_COLUMNS = 2;

export default function Home() {
  console.log(Images.textLogoLight);
  return (
    <View style={styles.container}>
      {/* <Image source={Images.textLogoLight} style={styles.logo} /> */}
      <LogoText width={160} height={40} />

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.box}>
            <Text style={styles.boxText}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#222",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 40,
    resizeMode: "contain",
  },
  gridContent: {
    gap: 12,
  },
  row: {
    gap: 12,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#eee",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
