import {initializeApp} from "firebase/app"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {API_KEY,AUTH_DOMAIN,PROJECT_ID,BUCKET,MEASUREMENT_ID,MESSAGE_ID,APP_ID} from "@env"
  import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: BUCKET,
    messagingSenderId: MESSAGE_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
  };


export const Firebase_APP = initializeApp(firebaseConfig)
export const authClient= initializeAuth(Firebase_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
