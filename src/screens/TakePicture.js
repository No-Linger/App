import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { getCameraPermission } from "../services/camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  classifyGrid,
  loadModel,
  sliceImage,
} from "../services/chipRecognition";

export default function TakePicture() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoCaptured, setphotoCaptured] = useState(false);
  const [photoAccepted, setPhotoAccepted] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [model, setModel] = useState();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      setphotoCaptured(true);
    }
  };

  const processImage = async () => {
    if (model) {
      setPhotoAccepted(true);
      setProcessingImage(true);
      const slices = await sliceImage(capturedPhoto);
      setProcessedImages(slices);
      const predicitons = await classifyGrid(model, slices);
      console.log(predicitons);
      setProcessingImage(false);
    }
  };

  const resetProcess = async () => {
    setphotoCaptured(false);
    setPhotoAccepted(false);
    setProcessingImage(false);
    setProcessedImages([]);
    setCapturedPhoto(null);
  };

  useEffect(() => {
    (async () => {
      const hasCameraPermission = await getCameraPermission();
      setHasPermission(hasCameraPermission);
      let loadedModel = await loadModel();
      setModel(loadedModel);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!photoCaptured && !photoAccepted && (
        <>
          <Camera
            style={{ flex: 5, marginTop: "15%" }}
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
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              onPress={takePicture}
              style={{
                padding: 10,
                borderWidth: 2,
                borderRadius: 15,
              }}
            >
              <Icon name="camera-iris" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
      {photoCaptured && !photoAccepted && (
        <>
          <View
            style={{ flex: 6, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={{ uri: capturedPhoto }}
              style={{ marginHorizontal: "5%", marginVertical: "10%" }}
              width={200}
              height={100}
            />
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={resetProcess}
              style={{
                padding: 10,
                borderWidth: 2,
                borderRadius: 15,
                marginHorizontal: 30,
                borderColor: "#FF3F16",
              }}
            >
              <Icon name="cancel" size={50} color="#FF3F16" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={processImage}
              style={{
                padding: 10,
                borderWidth: 2,
                borderRadius: 15,
                marginHorizontal: 30,
                borderColor: "#1BE878",
              }}
            >
              <Icon name="check-circle-outline" size={50} color="#1BE878" />
            </TouchableOpacity>
          </View>
        </>
      )}
      {photoCaptured && processingImage && photoAccepted && (
        <>
          <View
            style={{
              flex: 9,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10%",
            }}
          >
            <ActivityIndicator size="large" color="#000000" />
          </View>
        </>
      )}
      {photoCaptured && !processingImage && photoAccepted && (
        <>
          <View
            style={{
              flex: 1,
              marginTop: "15%",
              justifyContent: "left",
              alignItems: "flex-start",
            }}
          >
            <TouchableOpacity
              onPress={resetProcess}
              style={{
                padding: 14,
                borderWidth: 2,
                borderRadius: 15,
              }}
            >
              <Icon name="replay" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 9, alignItems: "center", justifyContent: "center" }}
          >
            <ScrollView style={styles.container}>
              <View style={styles.imageGrid}>
                {processedImages.map((url, index) => (
                  <View key={url} style={styles.imageContainer}>
                    <Image source={{ uri: url }} style={styles.image} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "48%", // Considering some space between images
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 150, // Or any desired height
    resizeMode: "cover",
  },
});
