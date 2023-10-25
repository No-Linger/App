import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import tw from "twrnc";

export default function LottieAnimation(props) {
  return (
    <View style={props.style}>
      <LottieView
        source={props.source}
        autoPlay={true}
        loop
        style={tw`w-[${props.width}] h-[${props.height}]`}
      />
    </View>
  );
}
