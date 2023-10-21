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
  downloadPlanogram,
  getLocalPlanograms,
  resetPlanogramTracker,
  updatePlanogramRecord,
} from "../services/planograms";

import LottieView from "lottie-react-native";
import PlanogramRow from "../components/PlanogramRow";

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
            setPlanograms(planograms);
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
