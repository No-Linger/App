import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Login(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Aqui va el login @Adrian y @Gurtubay
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
          onPress={() => {
            props.onClick();
          }}
          style={{ padding: 20, borderWidth: 2 }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
