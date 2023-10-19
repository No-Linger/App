import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getLocalPlanograms,
  resetPlanogramTracker,
  updatePlanogramRecord,
} from "../services/planograms";

export default function Profile() {
  const [planograms, setPlanograms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      <Text style={{ flex: 1, fontSize: 25, fontWeight: "bold", margin: 15 }}>
        Planogramas :
      </Text>
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
            {Object.entries(planograms).map(([key, value]) => (
              <View
                key={key}
                style={{
                  width: "95%",
                  height: 70,
                  marginBottom: 10,
                  backgroundColor: "#E6E6FA",
                  borderRadius: 20,
                }}
              >
                <Text>{key}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            let planograms = getLocalPlanograms();
            setPlanograms(planograms);
          }}
        >
          <Icon name="refresh" size={50} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            let planograms = resetPlanogramTracker();
            setPlanograms(planograms);
          }}
        >
          <Icon name="reset" size={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
