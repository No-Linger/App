import React, { useState } from "react";

//import { useHistory } from 'react-router-dom'; // Importa useHistory
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { authClient } from "../services/firebaseConfig";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../../styles";
import Svg, { Ellipse, Image, ClipPath } from "react-native-svg";
import Imagen from "../components/imagen.js";
import CustomModal from "../components/modalLottie";
import { Dimensions } from "react-native";
import { LottieAnimation } from "../components";
import Animated, {
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

export default function Login(props) {
  const { height, width } = Dimensions.get("window");
  const imagePosition = useSharedValue(1);
  const [modalVisible, setModalVisible] = useState(false);
  const formButtonScale = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      imagePosition.value,
      [0, 1],
      [-height / 4, 0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });
  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });
  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });
  const loginHandler = () => {
    imagePosition.value = 0;
  };

  const registerHandler = () => {
    imagePosition.value = 0;
  };
  //USERNAME: adrianbravo10@hotmail.com
  //PASSWORD: Password123!
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const AUTH = authClient;

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(
        AUTH,
        username,
        password
      );
      console.log(response);
      setLoggedIn(true);
      setModalVisible(true); // Muestra el modal
      setTimeout(() => {
        setModalVisible(false); // Cierra el modal después de 3 segundos
        props.onClick();
      }, 3000);
      console.log(AUTH.currentUser.uid);
    } catch (error) {
      console.log(error);
    } finally {
      // Cierra el modal después de 3 segundos, independientemente del resultado
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
  };

  const startButtonAnimation = () => {
    formButtonScale.value = withSequence(withSpring(1.5), withSpring(1));
  };

  const handleClick = () => {
    // Add your authentication logic here.
    // if (username === 'testuser' && password === 'testpassword') {
    //   Alert.alert('Login Successful', 'You are now logged in!');
    // } else {
    //   Alert.alert('Login Failed', 'Invalid username or password');
    // }

    signIn();
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.lottieAnimationStyle}>
              <LottieAnimation
              source={require("../../assets/lotties/keyLogin.json")}
              width={"10"}
              height={"10"}
              // autoplay={true}
             />
          </View> */}
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height + 100} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height} ry={height + 100} />
          </ClipPath>

          <Image
            href={require("../../assets/splash.png")}
            width={width}
            height={height + 100}
            preserveAspectRatio="xMidYmid slice"
            clipPath="url(#clipPathId)"
          />
        </Svg>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable style={styles.button} onPress={loginHandler}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
        </Animated.View>
      </View>

      <Animated.View style={[styles.formInputContainer, formAnimatedStyle]}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          style={styles.textInput}
          onChangeText={(text) => setUsername(text)}
          value={username}
          editable={!modalVisible} // Deshabilita la edición cuando el modal está visible
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          style={styles.textInput}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          editable={!modalVisible} // Deshabilita la edición cuando el modal está visible
        />
        <Animated.View
          style={[styles.closeButtonContainer, closeButtonContainerStyle]}
        >
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              imagePosition.value = 1;
              setUsername("");
              setPassword("");
            }}
          >
            <Text style={{ transform: [{ rotate: "180deg" }] }}>Cancel</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.formButtom, formButtonAnimatedStyle]}>
          <Pressable
            onPress={async () => {
              startButtonAnimation();
              signIn(); // Iniciar la animación al presionar el botón
            }}
          >
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
      {modalVisible && (
        <CustomModal
          isVisible={modalVisible}
          onModalClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}
