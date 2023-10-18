import * as React from "react";
import { View, Text, TextInput, Pressable } from 'react-native';
import { authClient } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from '../../styles';
import { Dimensions } from "react-native";
import Animated from 'react-native-redash';

const { height, width } = Dimensions.get('window');
const { Value, interpolate, useSharedValue, useDerivedValue, withSpring, withTiming, withDelay, withSequence } = Animated;

const loginContainerHeight = height / 3;
const formContainerHeight = height / 1.5;

export default function Login(props) {
  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);
  const isRegistering = useDerivedValue(() => imagePosition.value === 1);

  const loginHandler = () => {
    imagePosition.value = 0;
    if (isRegistering.value) {
      formButtonScale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
    }
  };

  const registerHandler = () => {
    imagePosition.value = 0;
    if (!isRegistering.value) {
      formButtonScale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
    }
  };

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const AUTH = authClient;

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(AUTH, username, password);
      console.log(response);
      props.onClick();
    } catch (error) {
      console.log(error);
    }
  }

  const animatedStyles = {
    formContainer: {
      opacity: imagePosition.value === 0 ? withDelay(400, withTiming(1, { duration: 800 })) : withTiming(0, { duration: 300 }),
    },
    closeButtonContainer: {
      opacity: imagePosition.value === 1 ? 0 : 1,
    },
    formButton: {
      transform: [{ scale: formButtonScale.value }]
    },
  };

  return (
    <View style={styles.container}>
      <View style={{ height: loginContainerHeight }}>
        <View>
          {/* Image Component Here */}
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={[styles.button, animatedStyles.formButton]}
            onPress={loginHandler}
          >
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
          <Pressable
            style={[styles.button, animatedStyles.formButton]}
            onPress={registerHandler}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.formInputContainer, animatedStyles.formContainer]}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          style={styles.textInput}
        />
        <Pressable
          style={[styles.formButton, animatedStyles.formButton]}
          onPress={() => formButtonScale.value = withSequence(withSpring(1.5), withSpring(1))}
        >
          <Text style={styles.buttonText}>{isRegistering ? 'REGISTER' : 'LOG IN'}</Text>
        </Pressable>
      </View>
    </View>
  );
}


// import * as React from "react";
// import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable } from 'react-native';
// import { authClient } from "../services/firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import styles from '../../styles'
// import Svg,{Ellipse, Image} from 'react-native-svg';
// import Imagen from '../components/imagen.js';
// import { Dimensions } from "react-native";
// import Caca from "../components/caca";
// import Animated,{
//   interpolate, 
//   useSharedValue, 
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   withSequence,
//   withSpring
// } from 'react-native-reanimated'

// const logoImageSource = require('../../assets/logoOxxo.png');

// export default function Login(props) {
//     const {height, width}= Dimensions.get('window');
//     const imagePosition = useSharedValue(1)
//     const formButtonScale = useSharedValue(1)
//     const [isRegistering,setIsRegistering]=useState(false);
//     const imageAnimatedStyle = useAnimatedStyle(()=>{
//       const interpolation=interpolate(imagePosition.value,[0,1],[-height/2,0])
//       return {
//         transform: [{transalteY:withTiming(interpolation, {duration:1000})}]
//       }
//     })
//     const buttonsAnimatedStyle = useAnimatedStyle(()=>{
//       const interpolation =interpolate(imagePosition.value, [0,1],[250,0])
//       return{
//         opacity:withTiming(imagePosition.value,{duration:500}),
//         transform:[{transalteY:withTiming(interpolation,{duration:1000})}]
//       }
//     })
//     const closeButtonContainerStyle=useAnimatedStyle(()=>{
//       const interpolation=interpolate(imagePosition.value, [0,1],[180,360])
//       return {
//         opacity:withTiming(imagePosition.value===1?0:1,{duration:800}),
//         transform:[{rotate:withTiming(interpolation+"deg",{duration:1000})}]
//       }
//     })
//     const formAnimatedStyle=useAnimatedStyle(()=>{
//       return{
//         opacity:imagePosition.value===0?withDelay(400,withTiming(1,{duration:800})):withTiming(0,{duration:300})
//       }
//     })
//     const formButtonAnimatedStyle=useAnimatedStyle(()=>{
//       return{
//         transform:[{scale:formButtonScale.value}]
//       }
//     })
//     //USERNAME: adrianbravo10@hotmail.com
//     //PASSWORD: Password123!
//     const loginHandler=()=>{
//       imagePosition.value=0
//       if(isRegistering){
//         runOnJS(setIsRegistering)(false);
//       }
//     }

//     const registerHandler=()=>{
//       imagePosition.value=0
//       if(!isRegistering){
//         runOnJS(setIsRegistering)(true);
//       }
//     }
//     const [username, setUsername] = React.useState('');
//     const [password, setPassword] = React.useState('');
//     const AUTH = authClient

//     const signIn = async() =>{
//         try{
//             const response = await signInWithEmailAndPassword(AUTH,username,password)
//             console.log(response)
//             props.onClick()
//         }
//         catch(error){
//             console.log(error)
//         }
//     }

//     const handleClick = () => {
//         // Add your authentication logic here.
//         // if (username === 'testuser' && password === 'testpassword') {
//         //   Alert.alert('Login Successful', 'You are now logged in!');
//         // } else {
//         //   Alert.alert('Login Failed', 'Invalid username or password');
//         // }

//         signIn()
//       }

//       return (
//         <Animated.View style={styles.container}> 
//           <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
//             <Svg height={height +100} width={width}>
//               <ClipPath id="clipPathId">
//                 <Ellipse cx={width/2} rx={height} ry={height+100}/>
//               </ClipPath>
//               <Image href={require("../../assets/cruz.jpg")} 
//               width={width+100} 
//               height={height+100}
//               preserveAspectRatio='xMidYmid slice'
//               clipPath="url(#clipPathId)"
//               />
//             </Svg>
//             <Animated.View style={[styles.closeButtomContainer,closeButtonContainerStyle]}>
//               <Text onPress={()=>imagePosition.value=1}>X</Text>
//             </Animated.View>
//           </Animated.View>
//           <View style={styles.bottomContainer}>
//             <Animated.View style={buttonsAnimatedStyle}>
//               <Pressable style={styles.button} onPress={loginHandler}>
//                 <Text style={styles.buttonText}>LOG IN</Text>
//               </Pressable>
//             </Animated.View>
//             <Animated.View tyle={buttonsAnimatedStyle}>
//               <Pressable style={styles.button} onPress={registerHandler}>
//                 <Text style={styles.buttonText}>REGISTER</Text>
//               </Pressable>
//             </Animated.View>
//           </View>
//           <Animated.View style={[styles.formInputContainer,formAnimatedStyle]}>
//             <TextInput
//               placeholder="Email"
//               placeholderTextColor="black"
//               style={styles.textInput}
//             />
//             <TextInput
//               placeholder="PassWord"
//               placeholderTextColor="black"
//               style={styles.textInput}
//             />
//             <Animated.View style={[styles.formButtom, formButtonAnimatedStyle]}>
//               <Pressable onPress={()=>formButtonScale.value=withSequence(withSpring(1.5),withSpring(1))}>
//               <Text style={styles.buttonText}>{isRegistering?'REGISTER':'LOG IN'}</Text>
//               </Pressable>
//             </Animated.View>
//           </Animated.View>
//           </Animated.View>
        
//       );
//     }
    
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
