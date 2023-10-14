import { Button, StyleSheet, View } from "react-native";
import LottieView from 'lottie-react-native';
import tw from 'twrnc';

export default function RobotLoading() {
    return (
        <View style={{}}>
            <LottieView
                source={require('../../assets/robotLoading.json')}
                autoPlay
                loop
                style={tw`w-[70] h-[70]`}
            />
        </View>
    );
}

const styles = StyleSheet.create({});