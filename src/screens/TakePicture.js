import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { ModelContext } from "../contexts/model";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  classifyGrid,
  sliceImage,
  comparePlanogram,
} from "../services/chipRecognition";
import { LottieAnimation } from "../components";
import LottieView from "lottie-react-native";

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
import { handleCapturar } from "../services/StatService";

export default function TakePicture() {
  const { model } = useContext(ModelContext);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoAccepted, setPhotoAccepted] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [comparationError, setComparationError] = useState(0);
  const [comparationResults, setComparationResults] = useState(null);
  const [planogramValues, setPlanogramValues] = useState(null);
  const [realValues, setRealValues] = useState(null);

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

      const fecha = new Date().toLocaleDateString();
      const hora = new Date().toLocaleTimeString();
      const captureJson = {
        planograma: selectedPlanogram.name,
        fecha,
        hora,
        precision: errorPercentage,
        sucursal: 69,
      };

      await handleCapturar(captureJson);

      setPlanogramValues(planogramMatrix);
      setRealValues(predicitons);
      setComparationResults(compareMatrix);
      setComparationError(errorPercentage);
      setFalseCount(falseCount);
      setIsProcessing(false);
    }
  };

  const resetProcess = async () => {
    setPhotoAccepted(false);
    setIsProcessing(false);
    setCapturedPhoto(null);
    setSelectedPlanogram(null);
    setImageEdited(false);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      (async () => {
        await handleGetLocalPlanograms();
      })();
    }
  }, [isFocused]);

  const [planograms, setPlanograms] = useState([]);
  const [anyPlanograms, setAnyPlanograms] = useState(false);
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
    setAnyPlanograms(dataArray.length > 0);
  };

  const currentPageHelper = (e) => {
    const pageIndex = e.nativeEvent.position;
    setCurrentPage(pageIndex);
    Haptics.selectionAsync();
  };

  const handlePlanogramSelect = async () => {
    if (anyPlanograms) {
      if (currentPage != undefined && planograms[currentPage]) {
        if (!planograms[currentPage].processed) {
          console.log("Procesar planograma para usarlo!");
          return;
        }
        setSelectedPlanogram(planograms[currentPage]);
        await pickImage();
      }
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

  const generateLines = (count, isRow, imageWidth, imageHeight) => {
    const lines = [];
    for (let i = 1; i < count; i++) {
      const position = isRow
        ? (imageHeight / count) * i
        : (imageWidth / count) * i;
      lines.push(
        <View
          key={i}
          style={[
            isRow ? styles.rowLine : styles.colLine,
            isRow ? { top: position } : { left: position },
          ]}
        />
      );
    }
    return lines;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFBFF" }}>
      {!model && (
        <>
          <View
            style={{
              flex: 9,
              alignItems: "center",
              justifyContent: "center",
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
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 30, fontWeight: "600", paddingLeft: "5%" }}
            >
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
            {anyPlanograms ? (
              planograms.map((item) => (
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
              ))
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <LottieView
                  source={require("../../assets/lotties/ghost.json")}
                  style={{ width: 250, height: 250 }}
                  autoPlay
                />
                <Text
                  style={{
                    width: "60%",
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  ¡Aún no has descargado ningún planograma!
                </Text>
              </View>
            )}
          </PagerView>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 15,
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 12,
              }}
              onPress={handlePlanogramSelect}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Comparar</Text>
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
            <View style={{ flex: 1 }}>
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
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 28,
                width: "60%",
                fontWeight: "600",
                paddingLeft: "5%",
              }}
            >
              Así se dividirá tu imagen.{" "}
            </Text>
            <Text
              style={{
                fontSize: 15,
                width: "85%",
                fontWeight: "500",
                paddingLeft: "5%",
              }}
            >
              Comparando con : {selectedPlanogram.name}
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: "70%",
                position: "relative",
                justifyContent: "flex-start",
                alignItems: "flex-start",
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
                  borderColor: "#4B6CFE",
                  borderWidth: 2,
                }}
              />
              {generateLines(
                selectedPlanogram.rows,
                true,
                containerConfrimHeight *
                  (capturedPhoto.width / capturedPhoto.height),
                containerConfrimHeight
              )}
              {generateLines(
                selectedPlanogram.cols,
                false,
                containerConfrimHeight *
                  (capturedPhoto.width / capturedPhoto.height),
                containerConfrimHeight
              )}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 8,
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 12,
              }}
              onPress={() => setImageEdited(false)}
            >
              <Icon name="image-edit-outline" size={35} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 15,
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 12,
              }}
              onPress={processImage}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {capturedPhoto && isProcessing && photoAccepted && (
        <>
          <View
            style={{
              flex: 1,
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
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  width: "60%",
                  fontWeight: "600",
                  paddingLeft: "5%",
                }}
              >
                Resultados :{" "}
              </Text>
            </View>
            <View
              style={{
                flex: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResultImageDisplay
                image={capturedPhoto}
                rows={selectedPlanogram.rows}
                cols={selectedPlanogram.cols}
                results={comparationResults}
                expected={planogramValues}
                real={realValues}
              />
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  borderColor: "#4B6CFE",
                  borderWidth: 2,
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                {`Comparado con : ${selectedPlanogram.name}  \nError en el acomodo : ${comparationError}%  \nMal colocados : ${falseCount}`}
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
                <Icon name="check-decagram-outline" size={50} color="#4B6CFE" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rowLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#4B6CFE",
  },
  colLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#4B6CFE",
  },
});
