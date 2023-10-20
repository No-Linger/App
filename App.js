import { StatusBar } from "expo-status-bar";
import Main from "./src";
// import Svg,{Image} from 'react-native-svg';

import * as React from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authClient } from "./src/services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from './styles'
import Svg,{Ellipse, Image,ClipPath} from 'react-native-svg';
import Imagen from './src/components/imagen.js';
import { Dimensions } from "react-native";
import Caca from "./src/components/caca";
import Animated,{
  interpolate, 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring
} from 'react-native-reanimated'
import { Pressable } from "react-native";

const logoImageSource = require('./assets/logoOxxo.png');

export default function App() {
  const {height, width}= Dimensions.get('window');
  const imagePosition = useSharedValue(1)

  const imageAnimatedStyle=useAnimatedStyle(()=>{
    const interpolation=interpolate(imagePosition.value,[0,1],[-height/2,0])
    return {
      transform: [{translateY:withTiming(interpolation,{duration:1000})}]
    }
  })

  const loginHandler=()=>{
    imagePosition.value=0
  }

  const registerHandler=()=>{
    imagePosition.value=0
  }
  //USERNAME: adrianbravo10@hotmail.com
  //PASSWORD: Password123!
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const AUTH = authClient

  const signIn = async() =>{
      try{
          const response = await signInWithEmailAndPassword(AUTH,username,password)
          console.log(response)
          props.onClick()
      }
      catch(error){
          console.log(error)
      }
  }

  const handleClick = () => {
      // Add your authentication logic here.
      // if (username === 'testuser' && password === 'testpassword') {
      //   Alert.alert('Login Successful', 'You are now logged in!');
      // } else {
      //   Alert.alert('Login Failed', 'Invalid username or password');
      // }

      signIn()
    }
  return (
    <View style={styles.container}> 
      <Animated.View style={[StyleSheet.absoluteFill,imageAnimatedStyle]}>
        <Svg height={height} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width/2} rx={height} ry={height+100}/>
          </ClipPath>
          <Image href={require("./assets/cruz.jpg")} 
          width={width+100} 
          height={height+100}
          preserveAspectRatio='xMidYmid slice'
          clipPath="url(#clipPathId)"
          />
        </Svg>
        <View style={styles.closeButtomContainer}>
          <Text>X</Text>
        </View>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <Pressable style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={registerHandler}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>
      </View>
      {/* <View style={styles.formInputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          style={styles.textInput}
        />
        <TextInput
          placeholder="PassWord"
          placeholderTextColor="black"
          style={styles.textInput}
        />
        <View style={styles.formButtom}>
          <Text style={styles.buttomText}>LOG IN</Text>
        </View>
      </View> */}
      </View>
    

  );
}
{/* <>
<StatusBar barStyle="light-content" />
<Main />
</> */}