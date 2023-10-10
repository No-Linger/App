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
import Icon from "react-native-vector-icons/Feather";
import {
  classifyGrid,
  loadModel,
  sliceImage,
} from "../services/chipRecognition";

export default function TakePicture() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoCaptured, setphotoCaptured] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [model, setModel] = useState();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      if (model) {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri);
        setphotoCaptured(true);
        setProcessingImage(true);
        const slices = await sliceImage(photo.uri);
        setProcessedImages(slices);
        const predicitons = await classifyGrid(model, slices);
        console.log(predicitons);
        setProcessingImage(false);
      }
    }
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
      {!photoCaptured && !processingImage && (
        <>
          <Camera
            style={{ flex: 1, marginTop: "15%" }}
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
                padding: 14,
                borderWidth: 2,
                borderRadius: 15,
              }}
            >
              <Icon name="camera" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
      {photoCaptured && processingImage && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      {photoCaptured && !processingImage && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "15%",
    marginHorizontal: "2%",
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
