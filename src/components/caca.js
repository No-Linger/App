import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import tw from "twrnc";

export default function Caca(props) {
  return (
    <View style={props.style}>
      <LottieView
        source={props.source}
        autoPlay
        loop
        style={tw`w-[${props.width}] h-[${props.height}]`}
      />
    </View>
  );
}