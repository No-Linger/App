import React, { useEffect, useState, useCallback, useRef } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getLocalPlanograms,
  getLocalPlanogramsMatrix,
  resetPlanogramTracker,
  updatePlanogramRecord,
} from "../services/planograms";

import * as ImagePicker from "expo-image-picker";
import PlanogramRow from "../components/PlanogramRow";
import Slider from "react-native-a11y-slider";

export default function Profile() {
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

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const [selectedImage, setSelectedImage] = useState(null);
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let newPlanograms = await updatePlanogramRecord();
    setPlanograms(newPlanograms);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadPlanograms = async () => {
      const response = await getLocalPlanograms();
      setPlanograms(response);
      console.log(response);
    };
    loadPlanograms();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 15,
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Planogramas :</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3 }} />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              padding: 5,
              borderColor: "black",
              borderWidth: 2,
              flex: 1,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>+ Añadir</Text>
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
                  borderColor: "black",
                }}
              >
                <View style={{ flex: 1, marginTop: 30, marginLeft: 16 }}>
                  <TextInput
                    style={{
                      fontWeight: "600",
                      fontSize: 30,
                      color: "black",
                    }}
                    placeholder="Nombre"
                    placeholderTextColor={"#777777"}
                  />
                  <Text style={{ fontSize: 18 }}>21-10-2023</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Button
                    title="Pick an image from camera roll"
                    onPress={pickImage}
                  />
                  {selectedImage && <Image source={{ uri: selectedImage }} />}
                </View>
                <View style={{ flex: 4 }}>
                  <Text
                    style={{
                      marginTop: 20,
                      marginLeft: 20,
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
                      style={{ width: "70%", marginLeft: 20, marginTop: 10 }}
                      showLabel={false}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
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
                      marginLeft: 20,
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
                      style={{ width: "70%", marginLeft: 20, marginTop: 10 }}
                      showLabel={false}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
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
          style={{ flex: 1 }}
          onPress={async () => {
            let planograms = await getLocalPlanograms();
            let planogramMatrix = await getLocalPlanogramsMatrix();
            setPlanograms(planograms);
            console.log("PLANOGRAM TRACKER", planograms);
            console.log("PLANOGRAMS MATRIX", planogramMatrix);
          }}
        >
          <Icon name="refresh" size={50} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
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
