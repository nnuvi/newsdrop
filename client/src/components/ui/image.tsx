import {
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageSourcePropType,
} from "react-native";
import { useState } from "react";
import { Icons } from "@/constants/images";

type ImageProps = Omit<RNImageProps, "source"> & {
  source?: ImageSourcePropType | null;
  fallback?: ImageSourcePropType;
  size?: number;
};

export function Image({
  source,
  fallback = Icons.placeholder,
  size,
  style,
  onError,
  ...props
}: ImageProps) {
  const imageSource = !source ? fallback : source;

  return (
    <RNImage
      {...props}
      source={imageSource}
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
