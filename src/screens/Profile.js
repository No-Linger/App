import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  PanResponder,
  Animated,
  TextInput,
  Button,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addCustomePlanogram,
  getLocalPlanograms,
  getLocalPlanogramsMatrix,
  processPlanogram,
  resetPlanogramTracker,
  updatePlanogramRecord,
} from "../services/planograms";

import * as ImagePicker from "expo-image-picker";
import PlanogramRow from "../components/PlanogramRow";
import Slider from "react-native-a11y-slider";
import { ModelContext } from "../contexts/model";
import * as Haptics from "expo-haptics";

import Notification from "../components/Notification";
import NetInfo from "@react-native-community/netinfo";

export default function Profile() {
  const { model } = useContext(ModelContext);
  const [planograms, setPlanograms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          setModalVisible(false);
        }
        Animated.timing(panY, { toValue: 0, useNativeDriver: false }).start();
      },
    })
  ).current;

  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [planogramName, setPlanogramName] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [containerHeight, setContainerHeight] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    return dd + "-" + mm + "-" + yyyy;
  }

  const handlePlanogramSaveAndProcess = async () => {
    if(rows === 0 || cols === 0 || planogramName === ""){
      console.log("Hello");
      return 0;
      
    }
    setModalVisible(false);
    const { id, localUri } = await addCustomePlanogram(selectedImage.uri, {
      name: planogramName,
      fecha: currentDate,
      url: null,
      tienda: 0,
      width: selectedImage.width,
      height: selectedImage.height,
    });
    const newPlanograms = await processPlanogram(
      model,
      id,
      localUri,
      cols[0],
      rows[0]
    );
    setPlanograms(newPlanograms);
    await resetAddPlanogram();
    
  };

  const resetAddPlanogram = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(false);
    setPlanogramName("");
    setSelectedImage(null);
    setCols(0);
    setRows(0);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let newPlanograms = await updatePlanogramRecord();
    if (Object.keys(newPlanograms).length !== 0) {
      setPlanograms(newPlanograms);
    } else {
      setCoudPlanogramError(true);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadPlanograms = async () => {
      const response = await getLocalPlanograms();
      setPlanograms(response);
    };
    loadPlanograms();
    const dateString = getCurrentDate();
    setCurrentDate(dateString);
  }, []);

  const pickImage = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const [cloudPlanogramError, setCoudPlanogramError] = useState(false);

  const [isConnected, setIsConnected] = useState(null);
  const [isConnectedNoti, setIsConnectedNoti] = useState(false);
  const [isNotConnectedNoti, setIsNotConnectedNoti] = useState(false);
  useEffect(() => {
    let subscription = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected);
      setIsNotConnectedNoti(!state.isConnected);
    });
    return () => {
      subscription();
    };
  }, [isConnected]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFBFF" }}>
      <Notification
        title="OMG!"
        message="Planogrmas de la nube no disponibles"
        isVisible={cloudPlanogramError}
        onClose={() => setCoudPlanogramError(false)}
        icon="content-save-alert-outline"
      />
      <Notification
        title="Modo Offline"
        message="Se ha activado el modo sin internet"
        isVisible={isNotConnectedNoti}
        onClose={() => setIsNotConnectedNoti(false)}
        icon="wifi-cancel"
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: 15,
          marginVertical: 15,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              padding: 10,
              borderColor: "black",
              borderWidth: 2,
              flex: 1,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              width: "5%",
              height: "100%",
              flexDirection: "row",
            }}
          >
            <Icon name="file-image-plus-outline" size={20} />
            <Text style={{ fontSize: 18, fontWeight: "400" }}> Añadir</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                flex: 1,
                flexDirection: "column-reverse",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "87%",
                  backgroundColor: "white",
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "#4B6CFE",
                }}
              >
                <View style={{ flex: 1, marginTop: 30, marginLeft: 16 }}>
                  <TextInput
                    value={planogramName}
                    onChangeText={setPlanogramName}
                    style={{
                      fontWeight: "600",
                      fontSize: 30,
                      color: "black",
                    }}
                    placeholder="Nombre"
                    placeholderTextColor={"#777777"}
                  />
                  <Text style={{ fontSize: 18 }}>{currentDate}</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {!selectedImage && (
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        margin: 2,
                        borderWidth: 2,
                        borderColor: "#4B6CFE",
                        padding: 45,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon name="selection-drag" size={80} color="#4B6CFE" />
                      <Text
                        style={{
                          marginTop: 10,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        Abrir galeria de imagenes
                      </Text>
                    </TouchableOpacity>
                  )}
                  {selectedImage && (
                    <>
                      <View
                        style={styles.container}
                        onLayout={(event) => {
                          const { height } = event.nativeEvent.layout;
                          setContainerHeight(height);
                        }}
                      >
                        <Image
                          source={{ uri: selectedImage.uri, flex: 1 }}
                          style={{
                            width:
                              containerHeight *
                              (selectedImage.width / selectedImage.height),
                            height: containerHeight,
                            borderRadius: 10,
                            borderColor: "#4B6CFE",
                            borderWidth: 2,
                          }}
                        />
                        {generateLines(
                          rows,
                          true,
                          containerHeight *
                            (selectedImage.width / selectedImage.height),
                          containerHeight
                        )}
                        {generateLines(
                          cols,
                          false,
                          containerHeight *
                            (selectedImage.width / selectedImage.height),
                          containerHeight
                        )}
                      </View>
                      <View
                        style={{ position: "absolute", bottom: 10, right: 20 }}
                      >
                        <TouchableOpacity
                          onPress={pickImage}
                          style={{
                            backgroundColor: "white",
                            borderColor: "black",
                            padding: 5,
                            borderWidth: 2,
                            borderRadius: 10,
                          }}
                        >
                          <Icon name="camera-retake-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
                <View style={{ flex: 4, alignItems: "center" }}>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: "600",
                    }}
                  >
                    Columnas :
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Slider
                      min={1}
                      max={24}
                      values={[]}
                      onChange={setCols}
                      style={{ width: "70%", marginTop: 10 }}
                      showLabel={false}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 30,
                      }}
                    >
                      {cols}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: "600",
                    }}
                  >
                    Renglones :
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Slider
                      min={1}
                      max={12}
                      values={[]}
                      onChange={setRows}
                      style={{ width: "70%", marginTop: 10 }}
                      showLabel={false}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 30,
                      }}
                    >
                      {rows}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={resetAddPlanogram}
                      style={{
                        borderColor: "red",
                        borderRadius: 10,
                        borderWidth: 2,
                        padding: 15,
                        width: "40%",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 20,
                          color: "red",
                        }}
                      >
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePlanogramSaveAndProcess}
                      style={{
                        borderColor: "black",
                        borderRadius: 10,
                        borderWidth: 2,
                        padding: 15,
                        width: "40%",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "600", fontSize: 20 }}>
                        Procesar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Modal>
        </View>
      </View>
      {!planograms && (
        <View
          style={{ flex: 9, justifyContent: "center", alignItems: "center" }}
        >
          <Text style>Cargando planogramas ...</Text>
        </View>
      )}
      {planograms && (
        <View style={{ flex: 9 }}>
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{ alignItems: "center" }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {planograms &&
              Object.keys(planograms).length > 0 &&
              Object.entries(planograms).map(([key, value]) => (
                <PlanogramRow
                  key={key}
                  planogramId={key}
                  planogram={value}
                  setPlanograms={setPlanograms}
                />
              ))}
          </ScrollView>
        </View>
      )}
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          style={{ flex: 1, opacity: 0 }}
          onPress={async () => {
            let planograms = await getLocalPlanograms();
            console.log(planograms);
            setPlanograms(planograms);
          }}
        >
          <Icon name="refresh" size={50} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, opacity: 0 }}
          onPress={async () => {
            let planograms = await resetPlanogramTracker();
            setPlanograms(planograms);
          }}
        >
          <Icon name="refresh" size={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rowLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#A6A6FD",
  },
  colLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#A6A6FD",
  },
});
