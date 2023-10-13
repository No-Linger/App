import * as React from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";


import Imagen from '../components/imagen.js';

const logoImageSource = require('../../assets/logoOxxo.png');

export default function Login() {
    //USERNAME: adrianbravo10@hotmail.com
    //PASSWORD: Password123!
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const AUTH = authClient

    const signIn = async() =>{
        try{
            const response = await signInWithEmailAndPassword(AUTH,username,password)
            console.log(response)
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
          <View style={styles.formContainer}>
            <View style={styles.logoImageContainer}>
              <Imagen source={logoImageSource} width="50%" height="100%" style={styles.logoImage} />
            </View>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setUsername(text)}
              value={username}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Button title="Login" 
              onPress={handleClick} 
            />
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      formContainer: {
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
        padding: 16,
        borderRadius: 16,
        width: '80%',
      },
      logoImageContainer: {
        alignItems: 'center', // Centra la imagen horizontalmente
        marginBottom: 16,
        height:'20%'
      },
      label: {
        fontSize: 18,
        marginBottom: 8,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
        borderRadius: 8,
      },
    });
