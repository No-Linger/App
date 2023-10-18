import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getPlanograms } from "../services/planograms";

export default function Profile() {
  const [planograms, setPlanograms] = useState(null);

  useEffect(() => {
    const loadPlanograms = async () => {
      const response = await getPlanograms();
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
        <ScrollView
          style={{
            flex: 9,
          }}
        >
          {Object.entries(planograms).map(([key, value]) => (
            <Text>{key}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
