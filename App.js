import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import Icon from "react-native-vector-icons/Feather";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

async function getCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return false;
  }
  return true;
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  const load = async () => {
    try {
      await tf.ready();
      console.log("Tensorflow Ready!");
      const modelJson = require("./assets/model/model.json");
      const modelWeights1 = require("./assets/model/group1-shard1of9.bin");
      const modelWeights2 = require("./assets/model/group1-shard2of9.bin");
      const modelWeights3 = require("./assets/model/group1-shard3of9.bin");
      const modelWeights4 = require("./assets/model/group1-shard4of9.bin");
      const modelWeights5 = require("./assets/model/group1-shard5of9.bin");
      const modelWeights6 = require("./assets/model/group1-shard6of9.bin");
      const modelWeights7 = require("./assets/model/group1-shard7of9.bin");
      const modelWeights8 = require("./assets/model/group1-shard8of9.bin");
      const modelWeights9 = require("./assets/model/group1-shard9of9.bin");

      console.log("Starting model load:", new Date().toISOString());
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, [
          modelWeights1,
          modelWeights2,
          modelWeights3,
          modelWeights4,
          modelWeights5,
          modelWeights6,
          modelWeights7,
          modelWeights8,
          modelWeights9,
        ])
      );
      console.log("Finished model load:", new Date().toISOString());
      console.log(model.summary());
    } catch (err) {
      console.log(err);
      console.log("Something failed :c");
    }
  };

  useEffect(() => {
    (async () => {
      const hasCameraPermission = await getCameraPermission();
      setHasPermission(hasCameraPermission);
      await load();
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      console.log("Photo taken!");
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F6F3" }} className="text-2xl">
      <Camera
        style={{
          flex: 6,
          marginTop: "15%",
          borderColor: "black",
          borderWidth: 2,
          borderTopLeftRadius: 20,
        }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            borderTopLeftRadius: 20,
          }}
        ></View>
      </Camera>
      <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={takePicture}
          style={{
            padding: 14,
            borderWidth: 2,
            borderRadius: 15,
          }}
        >
          <Icon name="camera" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 2, backgroundColor: "fff", flexDirection: "row" }}>
        {capturedPhoto && (
          <Image
            source={{ uri: capturedPhoto }}
            style={{
              width: "60%",
              height: "70%",
              flex: 1,
              marginHorizontal: 10,
              borderRadius: 10,
            }}
          />
        )}
        <Text style={{ flex: 3 }}></Text>
      </View>
    </View>
  );
}
