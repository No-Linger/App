import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {API_KEY,AUTH_DOMAIN,PROJECT_ID,BUCKET,MEASUREMENT_ID,MESSAGE_ID,APP_ID} from "@env"

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
export const authClient = getAuth(Firebase_APP)
