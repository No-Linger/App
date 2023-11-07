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

import * as ImagePicker from "expo-image-picker";
import ImageEditor from "../components/ImageEditor";

import {
  getLocalPlanograms,
  getLocalPlanogramsMatrix,
} from "../services/planograms";

import PagerView from "react-native-pager-view";
import ResultImageDisplay from "../components/ResultImageDisplay";

import * as Haptics from "expo-haptics";

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

  const [comparationError, setComparationError] = useState(0);
  const [comparationResults, setComparationResults] = useState(null);
  const [falseCount, setFalseCount] = useState(0);
  const processImage = async () => {
    if (model) {
      setPhotoAccepted(true);
      setIsProcessing(true);
      const slices = await sliceImage(
        capturedPhoto.uri,
        selectedPlanogram.rows,
        selectedPlanogram.cols
      );
      setProcessedImages(slices);
      const predicitons = await classifyGrid(
        model,
        slices,
        selectedPlanogram.rows,
        selectedPlanogram.cols
      );
      let planogramMatrix = await getLocalPlanogramsMatrix();
      planogramMatrix = planogramMatrix[selectedPlanogram.id];
      const { compareMatrix, errorPercentage, falseCount } =
        await comparePlanogram(
          planogramMatrix,
          predicitons,
          selectedPlanogram.rows,
          selectedPlanogram.cols
        );
      setComparationResults(compareMatrix);
      setComparationError(errorPercentage);
      setFalseCount(falseCount);
      setIsProcessing(false);
    }
  };

  const resetProcess = async () => {
    setPhotoAccepted(false);
    setIsProcessing(false);
    setProcessedImages([]);
    setCapturedPhoto(null);
    setSelectedPlanogram(null);
    setImageEdited(false);
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
      setCameraKey(Date.now());
      (async () => {
        await handleGetLocalPlanograms();
      })();
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
  const [containerConfrimHeight, setContainerConfirmHeight] = useState(null);

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
    setPlanograms(dataArray);
  };

  const currentPageHelper = (e) => {
    const pageIndex = e.nativeEvent.position;
    setCurrentPage(pageIndex);
    Haptics.selectionAsync();
  };

  const handlePlanogramSelect = async () => {
    if (currentPage != undefined && planograms[currentPage]) {
      if (!planograms[currentPage].processed) {
        console.log("Procesar planograma para usarlo!");
        return;
      }
      setSelectedPlanogram(planograms[currentPage]);
      await pickImage();
    }
  };

  useEffect(() => {
    (async () => {
      await handleGetLocalPlanograms();
    })();
  }, []);

  const pickImage = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedPhoto(result.assets[0]);
    } else {
      resetProcess();
    }
  };

  const [imageEdited, setImageEdited] = useState(false);

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
          <View
            style={{
              flex: 2,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "600", paddingLeft: 20 }}>
              Selecciona un planograma!
            </Text>
          </View>
          <PagerView
            style={{
              flex: 3,
              justifyContent: "center",
            }}
            initialPage={0}
            ref={pagerRef}
            onPageSelected={currentPageHelper}
          >
            {planograms.map((item) => (
              <View
                key={item.id}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  opacity: item.processed ? 1 : 0.4,
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View
                    style={{
                      height: "70%",
                    }}
                    onLayout={(event) => {
                      const { height } = event.nativeEvent.layout;
                      setContainerSelectHeight(height);
                    }}
                  >
                    <Image
                      source={{ uri: item.localUri }}
                      style={{
                        width:
                          containerSelectHeight * (item.width / item.height),
                        height: containerSelectHeight,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: "5%",
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
                    <Text style={{ fontWeight: "300", fontSize: 18 }}>
                      Mesh : {item.cols} x {item.rows}
                    </Text>
                  </View>
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
              <Text style={{ fontSize: 18 }}>Comparar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {capturedPhoto &&
        !imageEdited &&
        !photoAccepted &&
        model &&
        selectedPlanogram && (
          <>
            <View style={{ flex: 1, marginTop: "15%" }}>
              <ImageEditor
                image={capturedPhoto}
                onCancel={() => resetProcess()}
                onComplete={(newPhoto) => {
                  setCapturedPhoto(newPhoto);
                  setImageEdited(true);
                }}
              />
            </View>
          </>
        )}
      {capturedPhoto && imageEdited && !photoAccepted && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 3 }}>
            <View style={{ flex: 3, justifyContent: "flex-end" }}>
              <View style={{ marginBottom: "15%", marginLeft: "5%" }}>
                <Text style={{ fontWeight: "700", fontSize: 22 }}>
                  Comparando con : {selectedPlanogram.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 3,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                console.log(height);
                setContainerConfirmHeight(height);
              }}
            >
              <Image
                source={{ uri: capturedPhoto.uri }}
                style={{
                  width:
                    containerConfrimHeight *
                    (capturedPhoto.width / capturedPhoto.height),
                  height: containerConfrimHeight,
                  borderRadius: 10,
                }}
              />
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={resetProcess}
                style={{
                  padding: 15,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 10,
                  flexDirection: "row",
                }}
              >
                <Icon name="undo-variant" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={processImage}
                style={{
                  padding: 15,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 10,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
              marginTop: "18%",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: "600", marginLeft: "3%" }}
              >
                Resultados :{" "}
              </Text>
            </View>
            <View
              style={{
                flex: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResultImageDisplay
                image={capturedPhoto}
                rows={selectedPlanogram.rows}
                cols={selectedPlanogram.cols}
                results={comparationResults}
              />
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "500" }}>
                {`Comparando con : ${selectedPlanogram.name}  \nError en el acomodo : ${comparationError}%  \nMal colocados : ${falseCount}`}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: "4%",
                }}
                onPress={resetProcess}
              >
                <Icon name="check-decagram-outline" size={50} color="#414CF8" />
              </TouchableOpacity>
            </View>
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
