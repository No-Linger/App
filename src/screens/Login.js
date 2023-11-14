import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Animated, { interpolate, useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated';
import Svg, { Ellipse, Image, ClipPath } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { LottieAnimation } from '../components';
import CustomModal from '../components/modalLottie';
import styles from '../../styles';

const logoImageSource = require('../../assets/logoOxxo.png');

export default function Login(props) {
  const { height, width } = Dimensions.get('window');
  const imagePosition = useSharedValue(1);
  const [modalVisible, setModalVisible] = useState(false);
  const formButtonScale = useSharedValue(1);

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const signInHandler = useCallback(async () => {
    try {
      const response = await signInWithEmailAndPassword(authClient, username, password);
      console.log(response);
      setLoggedIn(true);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        props.onClick();
      }, 3000);
      console.log(authClient.currentUser.uid);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setModalVisible(false);
        setIsButtonClicked(false); // Set isButtonClicked to false after handling the sign-in
      }, 3000);
    }
  }, [username, password, setModalVisible, setLoggedIn, props, setIsButtonClicked]);

  const loginHandler = () => {
    imagePosition.value = 0;
    setIsButtonClicked(true); // Set isButtonClicked to true when login button is pressed
  };

  const startButtonAnimation = () => {
    formButtonScale.value = withSequence(withSpring(1.1), withSpring(1));
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', // Use different events for iOS and Android
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', // Use different events for iOS and Android
      () => {
        setKeyboardOpen(false);
      }
    );
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [setKeyboardOpen]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [-height / 4, 0]);
    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 500 }) }],
    };
  });
  
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const opacityInterpolation = interpolate(imagePosition.value, [0, 1], [0, 1]);
    const translateYInterpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
  
    return {
      opacity: withTiming(opacityInterpolation, { duration: 300 }),
      transform: [{ translateY: withTiming(translateYInterpolation, { duration: 500 }) }],
    };
  });
  

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        {
          rotate: withTiming(
            Platform.OS === 'ios' ? interpolation + 'deg' : `${interpolation}deg` // Add 'deg' suffix for Android
          ),
        },
        {
          translateY: withTiming(imagePosition.value === 1 ? 0 : 0, { duration: 800 }), // Adjust translateY as needed
        },
      ],
    };
  });
  

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imagePosition.value === 0 ? withTiming(1, { duration: 800 }) : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const registerHandler = () => {
    imagePosition.value = 0;
  };

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
      <Svg height={height + 100} width={width}>
        <ClipPath id="clipPathId">
          <Ellipse cx={width / 2} rx={height} ry={height + 100} />
        </ClipPath>
        <Image
          href={require('../../assets/splash.png')}
          width={width}
          height={height + 100}
          preserveAspectRatio="xMidYmid slice"
          clipPath="url(#clipPathId)"
        />
      </Svg>
    </Animated.View>
    <View style={styles.bottomContainer}>
      <Animated.View style={buttonsAnimatedStyle}>
        <Pressable
          style={styles.button}
          onPress={loginHandler}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Pressable>
      </Animated.View>
    </View>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[keyboardOpen ? { backgroundColor: 'white', marginTop:-20 } : null]}>
        <Animated.View style={[styles.formInputContainer, formAnimatedStyle]}>
          <TextInput
            placeholder="Correo"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={(text) => setUsername(text)}
            value={username}
            editable={isButtonClicked && !modalVisible}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            editable={isButtonClicked && !modalVisible}
          />
          <Animated.View style={[styles.closeButtonContainer, closeButtonContainerStyle]}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                imagePosition.value = 1;
                setUsername('');
                setPassword('');
                setIsButtonClicked(false); // Set isButtonClicked to false when "X" button is clicked
              }}
            >
              <Text style={{ transform: [{ rotate: '180deg' }] }}>X</Text>
            </Pressable>
          </Animated.View>
          <Animated.View style={[styles.formButtom, formButtonAnimatedStyle]}>
            <Pressable
              onPress={async () => {
                if (isButtonClicked) {
                  startButtonAnimation();
                  signInHandler();
                } 
              }}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
        {modalVisible && <CustomModal isVisible={modalVisible} onModalClose={() => setModalVisible(false)} />}
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}