import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles'
import Svg,{Image} from 'react-native-svg';
import Imagen from '../components/imagen.js';
import { Dimensions } from "react-native";
import Caca from "../components/caca";
import Animated,{useSharedValue, useAnimatedStyle,interpolate,withTiming} from 'react-native-reanimated'

const logoImageSource = require('../../assets/logoOxxo.png');

export default function Login(props) {
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
    const navigation = useNavigation();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const AUTH = authClient

    const signIn = async() =>{
        try{
            const response = await signInWithEmailAndPassword(AUTH,username,password)
            console.log(response)
            setLoggedIn(true);
            navigation.navigate('Stats');
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
          <Animated.View style={StyleSheet.absoluteFill}>
            <Svg height={height} width={width}>
              <Image href={require("../../assets/cruz.jpg")} 
              width={width} 
              height={height}
              preserveAspectRatio='xMidYmid slice'
              />
            </Svg>
            <View style={styles.closeButtomContainer}>
              <Text>X</Text>
            </View>
          </Animated.View>
          <View style={styles.bottomContainer}>
            <Presabble style={styles.button} onPress={loginHandler}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </Presabble>
            <Presabble style={styles.button} onPress={registerHandler}>
              <Text style={styles.buttonText}>REGISTER</Text>
            </Presabble>
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
      );
    }
    
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
