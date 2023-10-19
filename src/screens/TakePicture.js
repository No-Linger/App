import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
} from "react-native";
import { Camera } from "expo-camera";
import { getCameraPermission } from "../services/camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  classifyGrid,
  loadModel,
  sliceImage,
  comparePlanogram,
} from "../services/chipRecognition";
import { LottieAnimation } from "../components";
import LottieView from "lottie-react-native";
const deviceWidth = Dimensions.get("window").width;
import { Accelerometer } from "expo-sensors";

export default function TakePicture() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoAccepted, setPhotoAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  const [model, setModel] = useState();

  const lastOrientationRef = React.useRef();
  const [orientation, setOrientation] = useState("PORTRAIT");

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true; // To track if component is still mounted during asynchronous operations

    if (orientation === "PORTRAIT") {
      const controller = new Animated.Value(1);

      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.95,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      if (isMounted) anim.start();

      // Cleanup function
      return () => {
        isMounted = false;
        controller.stopAnimation();
        anim.reset();
      };
    }

    return () => {}; // Empty cleanup function for when the orientation is not 'PORTRAIT'
  }, [orientation]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000);
    let subscription;
    subscription = Accelerometer.addListener((accelerometerData) => {
      const newOrientation = determineOrientation(accelerometerData);
      if (newOrientation !== lastOrientationRef.current) {
        lastOrientationRef.current = newOrientation;
        setOrientation(lastOrientationRef.current);
      }
    });

    return () => subscription && subscription.remove();
  }, []);

  const determineOrientation = ({ x, y }) => {
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? "LANDSCAPE-RIGHT" : "LANDSCAPE-LEFT";
    } else {
      return "PORTRAIT";
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      Vibration.vibrate(1);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo);
    }
  };

  const processImage = async () => {
    if (model) {
      setPhotoAccepted(true);
      setIsProcessing(true);
      const slices = await sliceImage(capturedPhoto.uri);
      setProcessedImages(slices);
      const predicitons = await classifyGrid(model, slices);
      console.log(predicitons);
      // const result = await comparePlanogram("testPlanogram", predicitons);
      setIsProcessing(false);
    }
  };

  const resetProcess = async () => {
    setPhotoAccepted(false);
    setIsProcessing(false);
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

  let lottieViewRef = useRef(null);

  return (
    <View style={{ flex: 1 }}>
      {!model && (
        <>
          <View
            style={{
              flex: 9,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10%",
            }}
          >
            <LottieAnimation
              source={require("../../assets/lotties/cube.json")}
              width={40}
              height={40}
            />
            <Text style={{ fontSize: 15, marginTop: 5 }}>
              Cargando modelo ...
            </Text>
          </View>
        </>
      )}
      {!capturedPhoto && !photoAccepted && model && (
        <>
          <View style={{ flex: 5, marginTop: "15%", position: "relative" }}>
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              ref={cameraRef}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  flexDirection: "row",
                }}
              ></View>
              {"PORTRAIT" == orientation && (
                <>
                  <Animated.View
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 150,
                      height: 150,
                      backgroundColor: "black",
                      opacity: 0.65,
                      transform: [
                        { translateX: -75 },
                        { translateY: -75 },
                        { scale: scale },
                      ],
                      borderRadius: 20,
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="phone-rotate-landscape"
                      color={"#ffffff"}
                      size={60}
                    />
                    <Text style={{ color: "white", marginTop: 5 }}>
                      ¡Gira el dispositivo!{" "}
                    </Text>
                  </Animated.View>
                </>
              )}
            </Camera>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              disabled={"PORTRAIT" == orientation}
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
      {capturedPhoto && !photoAccepted && (
        <>
          <View
            style={{ flex: 6, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={{ uri: capturedPhoto.uri }}
              style={{}}
              width={deviceWidth}
              height={
                deviceWidth / (capturedPhoto.width / capturedPhoto.height)
              }
            />
          </View>
          <View style={{ marginHorizontal: "15%" }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Esta es la imagen que vas a clasificar, ¿es correcta ?
            </Text>
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
      {capturedPhoto && isProcessing && photoAccepted && (
        <>
          <View
            style={{
              flex: 9,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10%",
            }}
          >
            <View>
              <LottieView
                autoPlay
                loop
                source={require("../../assets/lotties/chips.json")}
                style={{ width: 200, height: 200 }}
              />
            </View>
            <Text style={{ fontSize: 15, marginTop: 5 }}>
              Pocesando imagen ...
            </Text>
          </View>
        </>
      )}
      {capturedPhoto && !isProcessing && photoAccepted && (
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

// Temporal styles for temporal image division grid

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
