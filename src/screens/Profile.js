import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const setTempPlanogram = async () => {
    try {
      const testPlanogram = {
        grid: [4, 2],
        labels: [
          ["rancheritos", "rancheritos", "doritos", "doritos"],
          ["chips", "jalapeno", "adobadas", "ruffles"],
        ],
      };
      await AsyncStorage.setItem(
        "testPlanogram",
        JSON.stringify(testPlanogram)
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={setTempPlanogram}
          style={{
            padding: 10,
            borderWidth: 2,
            borderRadius: 15,
          }}
        >
          <Icon name="camera-iris" size={40} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
