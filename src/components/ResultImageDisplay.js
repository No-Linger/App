import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { indexToString } from "../services/chipRecognition";

export default function ResultImageDisplay({
  image,
  rows,
  cols,
  results,
  expected,
  real,
}) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [imageFixedWidth, setImageFixedWidth] = useState(0);
  const [imageFixedHeight, setImageFixedHeight] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const renderGrid = () => {
    const quadrantWidth = imageFixedWidth / cols;
    const quadrantHeight = imageFixedHeight / rows;

    const [focueRealValue, setFocueRealValue] = useState("");
    const [focueExpectedValue, setFocueExpectedValue] = useState("");
    const [focusCorrect, setFocusCorrect] = useState(false);

    const handleFocusQuadrant = async (row, col) => {
      let realValue = indexToString(real[row][col]);
      let expectedValue = indexToString(expected[row][col]);
      if (realValue !== expectedValue) {
        setFocueRealValue(realValue);
        setFocueExpectedValue(expectedValue);
        setFocusCorrect(realValue === expectedValue);
        setModalVisible(!modalVisible);
      }
    };

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
            <TouchableOpacity
              onPress={() => handleFocusQuadrant(rowIndex, colIndex)}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "85%",
                height: "20%",
                backgroundColor: "white",
                borderWidth: 3,
                borderRadius: 12,
                borderColor: "black",
                position: "relative",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 25, fontWeight: "600", marginLeft: "8%" }}
                >
                  Cambiar :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {focueRealValue}
                </Text>
                <Icon name="chevron-right" size={45} color="#4B6CFE" />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {focueExpectedValue}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Icon name="close-circle-outline" size={40} color="#4B6CFE" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
