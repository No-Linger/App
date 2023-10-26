import React, { useState } from 'react';

//import { useHistory } from 'react-router-dom'; // Importa useHistory
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from '../../styles'
import Svg,{Ellipse, Image,ClipPath} from 'react-native-svg';
import Imagen from '../components/imagen.js';
import { Dimensions } from "react-native";
import { LottieAnimation } from '../components';
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

const logoImageSource = require('../../assets/logoOxxo.png');

export default function Login(props) {
    const {height, width}= Dimensions.get('window');
    const imagePosition = useSharedValue(1)
    const formButtonScale = useSharedValue(1);
    const imageAnimatedStyle=useAnimatedStyle(()=>{
      const interpolation=interpolate(imagePosition.value,[0,1],[-height/2,0])
      return {
        transform: [{translateY:withTiming(interpolation,{duration:1000})}]
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
    const [loggedIn, setLoggedIn] = useState(false);
    const AUTH = authClient

    // const signIn = async() => {
    //   try {
    //     const response = await signInWithEmailAndPassword(AUTH, username, password);
    //     console.log(response);
    
    //     // Verificar que el inicio de sesión fue exitoso antes de navegar
    //     if (response) {
    //       // Obtener el objeto de navegación
    //       //const navigation = useNavigation();
    
    //       // Navegar a la pantalla de estadísticas
    //       //navigation.navigate('Estadística'); // Debes usar el nombre de la pantalla en la navegación
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    
    
        // Add your authentication logic here.
        // if (username === 'testuser' && password === 'testpassword') {
        //   Alert.alert('Login Successful', 'You are now logged in!');
        // } else {
        //   Alert.alert('Login Failed', 'Invalid username or password');
        // }

    // const signIn = async() => {
    //   try {
    //     const response = await signInWithEmailAndPassword(AUTH, username, password);
    //     console.log(response);
    
    //     // Verificar que el inicio de sesión fue exitoso antes de navegar
    //     if (response) {
    //       // Obtener el objeto de navegación
    //       //const navigation = useNavigation();
    
    //       // Navegar a la pantalla de estadísticas
    //       //navigation.navigate('Estadística'); // Debes usar el nombre de la pantalla en la navegación
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    
    
        // Add your authentication logic here.
        // if (username === 'testuser' && password === 'testpassword') {
        //   Alert.alert('Login Successful', 'You are now logged in!');
        // } else {
        //   Alert.alert('Login Failed', 'Invalid username or password');
        // }

    const signIn = async() =>{
        try{
            const response = await signInWithEmailAndPassword(AUTH,username,password)
            console.log(response)
            setLoggedIn(true);
            console.log(AUTH.currentUser.uid)
            props.onClick()
        }
        catch(error){
            console.log(error)
        }
    }
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

        signIn()
      }

      return (
        <View style={styles.container}> 
          <Animated.View style={[StyleSheet.absoluteFill,imageAnimatedStyle]}>
            <Svg height={height+100} width={width}>
              <ClipPath id="clipPathId">
                <Ellipse cx={width/2} rx={height} ry={height+100}/>
              </ClipPath>

              <Image href={require("../../assets/splash.png")} 
              width={width} 
              height={height+100}
              preserveAspectRatio='xMidYmid slice'
              clipPath="url(#clipPathId)"
              />
            </Svg>
            <Animated.View style={[styles.closeButtonContainer,closeButtonContainerStyle]}>
              <Text onPress={()=>imagePosition.value=1}>X</Text>
            </Animated.View>
          </Animated.View>
          <View style={styles.bottomContainer}>
            <Animated.View style={buttonsAnimatedStyle}>
              <Pressable style={styles.button} onPress={loginHandler}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </Pressable>
            </Animated.View>
          </View>

          <Animated.View style={[styles.formInputContainer,formAnimatedStyle]}>
          <View style={styles.lottieAnimationStyle}>
              <LottieAnimation
              source={require("../../assets/lotties/keyLogin.json")}
              width={"50"}
              height={"50"}
              // autoplay={true}
             />
          </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="black"
              style={styles.textInput}
              onChangeText={(text) => setUsername(text)}
               value={username}
            />
            <TextInput
              placeholder="PassWord"
              placeholderTextColor="black"
              style={styles.textInput}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Animated.View style={[styles.formButtom, formButtonAnimatedStyle]}>
              <Pressable   onPress={async () => {
    startButtonAnimation();
    signIn()// Iniciar la animación al presionar el botón
       }}
    >
              <Text style={styles.buttonText}>LOG IN</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>
      );
    }
