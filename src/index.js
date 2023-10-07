import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import Icon from "react-native-vector-icons/Feather";
import {
  loadModel,
  preprocessImage,
  getLabel,
} from "./services/chipRecognition";

async function getCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return false;
  }
  return true;
}

export default function Main() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [model, setModel] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const hasCameraPermission = await getCameraPermission();
      setHasPermission(hasCameraPermission);
      const modelLoad = await loadModel();
      setModel(modelLoad);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      console.log("Photo taken!");
      if (model) {
        let imageTensor = await preprocessImage(photo.uri);
        const predictions = model.predict(imageTensor);
        await getLabel(predictions);
      }
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
