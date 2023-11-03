import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

export const cropImage = async (
  uri,
  originX,
  originY,
  width,
  height,
  scaleFactorWidth
) => {
  let scaledOriginX = originX * scaleFactorWidth;
  let scaledOriginY = originY * scaleFactorWidth;
  let scaledWidth = width * scaleFactorWidth;
  let scaledHeight = height * scaleFactorWidth;

  const result = await ImageManipulator.manipulateAsync(uri, [
    {
      crop: {
        originX: scaledOriginX,
        originY: scaledOriginY,
        width: scaledWidth,
        height: scaledHeight,
      },
    },
  ]);
  return result;
};
