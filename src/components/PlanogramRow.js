import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  PanResponder,
  Animated,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import {
  deletePlanogramRecord,
  downloadPlanogram,
  processPlanogram,
} from "../services/planograms";
import Slider from "react-native-a11y-slider";
import { ModelContext } from "../contexts/model";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function PlanogramRow({
  planogramId,
  planogram,
  setPlanograms,
}) {
  const { model } = useContext(ModelContext);
  const [downloading, setDownloading] = useState(false);
  const [processing, setProcessing] = useState(false);

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

  const [containerHeight, setContainerHeight] = useState(null);

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const generateLines = (count, isRow, imageWidth, imageHeight) => {
    const lines = [];
    for (let i = 0; i < count; i++) {
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

  const handlePlanogramDownload = async () => {
    setDownloading(true);
    let newPlanograms = await downloadPlanogram(planogramId);
    setDownloading(false);
    setPlanograms(newPlanograms);
  };

  const showProcessAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        planogram.processed ? "Reprocesar planograma" : "Procesar planograma",
        "Esto podría tardar un poco.",
        [
          {
            text: "Cancelar",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: planogram.processed ? "Reprocesar" : "Procesar",
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      );
    });
  };

  const handlePlanogramProcess = async () => {
    setModalVisible(false);
    setProcessing(true);
    let newPlanograms = await processPlanogram(
      model,
      planogram.localUri,
      planogramId,
      [cols, rows]
    );
    setProcessing(false);
    setPlanograms(newPlanograms);
  };

  const showDeleteAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "¿Estás seguro?",
        "El planograma se eliminará de tu dispositivo. ",
        [
          {
            text: "Cancelar",
            onPress: () => resolve(false),
            style: "cancel",
          },
          { text: "Eliminar", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });
  };

  const handlePlanogramDelete = async () => {
    const userResponse = await showDeleteAlert();
    if (userResponse) {
      let newPlanograms = await deletePlanogramRecord(
        planogramId,
        planogram.localUri
      );
      setPlanograms(newPlanograms);
      setModalVisible(!modalVisible);
    }
  };

  return (
    <View
      style={{
        width: "92%",
        height: 70,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
      }}
    >
      <View style={{ flex: 1, flexDirection: "column", marginLeft: 10 }}>
        <Text style={{ fontWeight: "500", fontSize: 15 }}>
          {planogram.name}
        </Text>
        <Text style={{ fontWeight: "400", fontSize: 10 }}>
          {planogram.fecha}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {planogram.downloaded && (
          <>
            {!processing && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <LottieView
                  autoPlay={false}
                  source={require("../../assets/lotties/cube.json")}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            )}
            {processing && (
              <LottieView
                autoPlay={true}
                loop
                source={require("../../assets/lotties/processingImage.json")}
                style={{ width: 50, height: 50 }}
              />
            )}
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
                    borderColor: "black",
                  }}
                >
                  <View style={{ flex: 1, marginTop: 30, marginLeft: 16 }}>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 30,
                        color: "black",
                      }}
                    >
                      {planogram.name}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{planogram.fecha}</Text>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <View
                      style={styles.container}
                      onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setContainerHeight(height);
                      }}
                    >
                      {containerHeight &&
                        planogram.width &&
                        planogram.height && (
                          <>
                            <Image
                              source={{ uri: planogram.localUri }}
                              style={{
                                width:
                                  containerHeight *
                                  (planogram.width / planogram.height),
                                height: containerHeight,
                                borderRadius: 10,
                              }}
                            />
                            {generateLines(
                              rows,
                              true,
                              containerHeight *
                                (planogram.width / planogram.height),
                              containerHeight
                            )}
                            {generateLines(
                              cols,
                              false,
                              containerHeight *
                                (planogram.width / planogram.height),
                              containerHeight
                            )}
                          </>
                        )}
                    </View>
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
                        onPress={handlePlanogramDelete}
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
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handlePlanogramProcess}
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
          </>
        )}
        {!planogram.downloaded && !downloading && (
          <TouchableOpacity
            onPress={handlePlanogramDownload}
            style={{ marginRight: 10 }}
          >
            <Icon name="cloud-download-outline" color={"blue"} size={30} />
          </TouchableOpacity>
        )}
        {!planogram.downloaded && downloading && (
          <ActivityIndicator style={{ width: 50, height: 50 }} />
        )}
        {planogram.downloaded && !downloading && !planogram.processed && (
          <Icon
            name="cog-play-outline"
            color={"black"}
            size={40}
            style={{ marginRight: 10 }}
          />
        )}
        {planogram.downloaded && !downloading && planogram.processed && (
          <Icon
            name="bookmark-check-outline"
            color={"green"}
            size={40}
            style={{ marginRight: 10 }}
          />
        )}
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
    height: 1,
    backgroundColor: "white",
  },
  colLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "white",
  },
});
