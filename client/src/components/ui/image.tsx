import {
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageSourcePropType,
} from "react-native";
import { Icons } from "@/constants/images";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColor } from "@/constants/theme";

type ImageProps = Omit<RNImageProps, "source" | "tintColor"> & {
  source?: ImageSourcePropType | null;
  fallback?: ImageSourcePropType;
  size?: number;
  tintColor?: ThemeColor;
};

export function Image({
  source,
  fallback = Icons.placeholder,
  size,
  tintColor,
  style,
  ...props
}: ImageProps) {
  const theme = useTheme();

  const imageSource = !source ? fallback : source;

  return (
    <RNImage
      {...props}
      source={imageSource}
      tintColor={tintColor ? theme[tintColor] : undefined}
      style={[
        size !== undefined && {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}