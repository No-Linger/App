import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
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
    const navigation = useNavigation();
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
            <Svg height={height+100} width={width}>
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
    // try {
    //   const response = await signInWithEmailAndPassword(AUTH, username, password);
    //   console.log(response);
    //   props.onClick();
    // } catch (error) {
    //   console.log(error);
    //     }
       }}
    >
              <Text style={styles.buttonText}>LOG IN</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>
      );
    }
    
        // <View style={styles.container}>
        //   <View style={styles.formContainer}>
        //     <View style={styles.logoImageContainer}>
        //       <Imagen source={logoImageSource} width="50%" height="100%" style={styles.logoImage} />
        //     </View>
        //     <Text style={styles.label}>Username</Text>
        //     <TextInput
        //       style={styles.input}
        //       onChangeText={(text) => setUsername(text)}
        //       value={username}
        //     />
        //     <Text style={styles.label}>Password</Text>
        //     <TextInput
        //       style={styles.input}
        //       onChangeText={(text) => setPassword(text)}
        //       value={password}
        //       secureTextEntry
        //     />
        //     <Button title="Login" 
        //       onPress={handleClick} 
        //     />
        //   </View>
        // </View>
    // const styles = StyleSheet.create({
    //   container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   },
    //   formContainer: {
    //     backgroundColor: 'rgba(192, 192, 192, 0.5)',
    //     padding: 16,
    //     borderRadius: 16,
    //     width: '80%',
    //   },
    //   logoImageContainer: {
    //     alignItems: 'center', // Centra la imagen horizontalmente
    //     marginBottom: 16,
    //     height:'20%',
    //     marginTop:10
    //   },
    //   label: {
    //     fontSize: 18,
    //     marginBottom: 8,
    //   },
    //   input: {
    //     height: 40,
    //     borderColor: 'gray',
    //     borderWidth: 1,
    //     marginBottom: 16,
    //     paddingLeft: 8,
    //     borderRadius: 8,
    //   },
    // });
