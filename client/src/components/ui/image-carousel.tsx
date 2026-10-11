import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { Image } from "@/components/ui/image";
import { Images } from "@/constants/images";
import { Colors } from "@/constants/colors";
// import { useTheme } from "@/constants/theme";

type ImageCarouselProps = {
  images: (string | null | undefined)[];
  height?: number;
};

export function ImageCarousel({ images, height = 200 }: ImageCarouselProps) {
  //   const { theme } = useTheme();
  const listRef = useRef<FlatList<string>>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images.filter((image): image is string => Boolean(image));

  if (validImages.length === 0) return null;

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!containerWidth) return;

    const index = Math.round(
      event.nativeEvent.contentOffset.x / containerWidth,
    );

    setActiveIndex(Math.min(index, validImages.length - 1));
  };

  const goToImage = (index: number) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <FlatList
          ref={listRef}
          data={validImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          keyExtractor={(image, index) => `${image}-${index}`}
          getItemLayout={(_, index) => ({
            length: containerWidth,
            offset: containerWidth * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={{ width: containerWidth }}>
              <Image
                source={{ uri: item }}
                style={[styles.image, { height }]}
              />
            </View>
          )}
        />
      )}

      {validImages.length > 1 && (
        <View style={styles.pagination}>
          {validImages.map((image, index) => (
            <Pressable
              key={`${image}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`Go to image ${index + 1}`}
              onPress={() => goToImage(index)}
              hitSlop={6}
              style={[
                styles.dot,
                {
                  width: activeIndex === index ? 18 : 6,
                  backgroundColor:
                    activeIndex === index
                      ? Colors.dark.primary
                      : Colors.dark.textSecondary,
                  opacity: activeIndex === index ? 1 : 0.35,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  image: {
    width: "100%",
    borderRadius: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
