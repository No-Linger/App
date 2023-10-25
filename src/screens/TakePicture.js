import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { ModelContext } from "../contexts/model";
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
  RefreshControl,
} from "react-native";
import { Camera } from "expo-camera";
import { getCameraPermission } from "../services/camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  classifyGrid,
  sliceImage,
  comparePlanogram,
} from "../services/chipRecognition";
import { LottieAnimation } from "../components";
import LottieView from "lottie-react-native";
const deviceWidth = Dimensions.get("window").width;
import { Accelerometer } from "expo-sensors";

import { useIsFocused } from "@react-navigation/native";

import { getLocalPlanograms } from "../services/planograms";

import PagerView from "react-native-pager-view";

export default function TakePicture() {
  const { model } = useContext(ModelContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraKey, setCameraKey] = useState(Date.now());
  const cameraRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoAccepted, setPhotoAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

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
      //const result = await comparePlanogram("id-1698198902397", predicitons);
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
    })();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setCameraKey(Date.now()); // set a new key to force remount
    }
  }, [isFocused]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let newPlanograms = await getLocalPlanograms();
    console.log(newPlanograms);
    setPlanograms(newPlanograms);
    setRefreshing(false);
  }, []);

  const [planograms, setPlanograms] = useState(null);
  const [selectedPlanogram, setSelectedPlanogram] = useState(null);
  const [containerSelectHeight, setContainerSelectHeight] = useState(null);
  const [currentPage, setCurrentPage] = useState();
  const pagerRef = useRef(null);

  const handleGetLocalPlanograms = async () => {
    let actualPlanograms = await getLocalPlanograms();
    const filteredData = Object.entries(actualPlanograms)
      .filter(([_, value]) => value.downloaded === true)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    const dataArray = Object.entries(filteredData).map(([id, value]) => ({
      id,
      ...value,
    }));
    console.log("Data Array :", dataArray);
    setPlanograms(dataArray);
  };

  const currentPageHelper = (e) => {
    const pageIndex = e.nativeEvent.position;
    setCurrentPage(pageIndex);
  };

  const handlePlanogramSelect = async () => {
    if (currentPage != undefined && planograms[currentPage]) {
      console.log(planograms[currentPage]);
      setSelectedPlanogram(planograms[currentPage]);
    }
  };

  useEffect(() => {
    (async () => {
      await handleGetLocalPlanograms();
    })();
  }, []);

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
      {model && !selectedPlanogram && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 30, fontWeight: "600", paddingLeft: 20 }}>
              Selecciona un planograma!
            </Text>
          </View>
          <PagerView
            style={{ flex: 6 }}
            initialPage={0}
            ref={pagerRef}
            onPageSelected={currentPageHelper}
          >
            {planograms.map((item) => (
              <View
                key={item.id}
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flex: 1,
                  opacity: item.processed ? 1 : 0.4,
                }}
              >
                <View
                  style={{
                    flex: 3,
                    justifyContent: "flex-start",
                    marginTop: "30%",
                  }}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    console.log(height);
                    setContainerSelectHeight(height);
                  }}
                >
                  <Image
                    source={{ uri: item.localUri }}
                    style={{
                      width: containerSelectHeight * (item.width / item.height),
                      height: containerSelectHeight,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "500", fontSize: 18 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontWeight: "400", fontSize: 18 }}>
                    {item.fecha}
                  </Text>
                </View>
              </View>
            ))}
          </PagerView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 15,
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 15,
              }}
              onPress={handlePlanogramSelect}
            >
              <Text style={{ fontSize: 18 }}>Seleccionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!capturedPhoto && !photoAccepted && model && selectedPlanogram && (
        <>
          <View style={{ flex: 5, marginTop: "15%", position: "relative" }}>
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              ref={cameraRef}
              key={cameraKey}
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
                source={require("../../assets/lotties/processingImage.json")}
                style={{ width: 400, height: 400 }}
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
