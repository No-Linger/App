import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from '../../styles'
import Svg,{Ellipse, Image,ClipPath} from 'react-native-svg';
import Imagen from '../components/imagen.js';
import { Dimensions } from "react-native";
import Caca from "../components/caca";
import Animated,{
  interpolate, 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring
} from 'react-native-reanimated'

const logoImageSource = require('../../assets/logoOxxo.png');

export default function Login(props) {
    const {height, width}= Dimensions.get('window');
    const imagePosition = useSharedValue(1);
    const formButtonScale = useSharedValue(1);
    const [isRegistering,setIsRegistering]=useState(false);
    const imageAnimatedStyle = useAnimatedStyle(()=>{
      const interpolation=interpolate(
        imagePosition.value,
        [0,1],
        [-height/2,0])
      return {
        transform: [{translateY:withTiming(interpolation, {duration:1000})}]
      }
    })
    const buttonsAnimatedStyle = useAnimatedStyle(()=>{
      const interpolation =interpolate(imagePosition.value, [0,1],[250,0])
      return{
        opacity:withTiming(imagePosition.value,{duration:500}),
        transform:[{translateY:withTiming(interpolation,{duration:1000})}]
      }
    })
    const closeButtonContainerStyle=useAnimatedStyle(()=>{
      const interpolation=interpolate(imagePosition.value, [0,1],[180,360])
      return {
        opacity:withTiming(imagePosition.value===1?0:1,{duration:800}),
        transform:[{rotate:withTiming(interpolation+"deg",{duration:1000})}]
      }
    })
    const formAnimatedStyle=useAnimatedStyle(()=>{
      return{
        opacity:imagePosition.value===0?withDelay(400,withTiming(1,{duration:800})):withTiming(0,{duration:300})
      }
    })
    const formButtonAnimatedStyle=useAnimatedStyle(()=>{
      return{
        transform:[{scale:formButtonScale.value}]
      }
    })
    //USERNAME: adrianbravo10@hotmail.com
    //PASSWORD: Password123!
    const loginHandler=()=>{
      imagePosition.value=0
      // if(isRegistering){
      //   runOnJS(setIsRegistering)(false);
      // }
    }

    const registerHandler=()=>{
      imagePosition.value=0
      // if(!isRegistering){
      //   runOnJS(setIsRegistering)(true);
      // }
    }
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
        <Animated.View style={styles.container}> 
          <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
            <Svg height={height +100} width={width}>
              <ClipPath id="clipPathId">
                <Ellipse cx={width/2} rx={height} ry={height+100}/>
              </ClipPath>
              <Image href={require("../../assets/cruz.jpg")} 
              width={width+100} 
              height={height+100}
              preserveAspectRatio='xMidYmid slice'
              clipPath="url(#clipPathId)"
              />
            </Svg>
            <Animated.View style={[styles.closeButtomContainer,closeButtonContainerStyle]}>
              <Text onPress={()=>imagePosition.value=1}>X</Text>
            </Animated.View>
          </Animated.View>
          <View style={styles.bottomContainer}>
            <Animated.View style={buttonsAnimatedStyle}>
              <Pressable style={styles.button} onPress={loginHandler}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </Pressable>
            </Animated.View>
            <Animated.View tyle={buttonsAnimatedStyle}>
              <Pressable style={styles.button} onPress={registerHandler}>
                <Text style={styles.buttonText}>REGISTER</Text>
              </Pressable>
            </Animated.View>
          </View>
          <Animated.View style={[styles.formInputContainer,formAnimatedStyle]}>
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
            <Animated.View style={[styles.formButtom, formButtonAnimatedStyle]}>
              <Pressable onPress={()=>formButtonScale.value=withSequence(withSpring(1.5),withSpring(1))}>
              <Text style={styles.buttonText}>{isRegistering?'REGISTER':'LOG IN'}</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
          </Animated.View>
        
      );
    }