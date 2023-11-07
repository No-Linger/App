import React, { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";

export default function ResultImageDisplay({ image, rows, cols, results }) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [imageFixedWidth, setImageFixedWidth] = useState(0);
  const [imageFixedHeight, setImageFixedHeight] = useState(0);

  const renderGrid = () => {
    const quadrantWidth = imageFixedWidth / cols;
    const quadrantHeight = imageFixedHeight / rows;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: imageFixedWidth,
          height: imageFixedHeight,
        }}
      >
        {results.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={{
                position: "absolute",
                borderColor: value ? "transparent" : "red",
                borderWidth: 2,
                borderRadius: 5,
                width: quadrantWidth,
                height: quadrantHeight,
                top: rowIndex * quadrantHeight,
                left: colIndex * quadrantWidth,
              }}
            />
          ))
        )}
      </View>
    );
  };
  return (
    <View
      style={{
        height: "80%",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
      }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
        setImageFixedHeight(height);
        setImageFixedWidth(height * (image.width / image.height));
      }}
    >
      <Image
        source={{ uri: image.uri }}
        style={{
          width: imageFixedWidth,
          height: imageFixedHeight,
          position: "relative",
          borderRadius: 7,
        }}
      />
      {renderGrid()}
    </View>
  );
}
