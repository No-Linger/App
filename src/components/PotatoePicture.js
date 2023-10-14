import { Button, StyleSheet, View } from "react-native";
import LottieView from 'lottie-react-native';
import tw from 'twrnc';

export default function IconPicture() {
    return (
        <View style={{}}>
            <LottieView
                source={require('../../assets/potatoeWalking.json')}
                autoPlay
                loop
                style={tw`w-[50] h-[50]`}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
