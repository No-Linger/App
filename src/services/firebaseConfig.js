import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {API_KEY,AUTH_DOMAIN,PROJECT_ID,BUCKET,MEASUREMENT_ID,MESSAGE_ID,APP_ID} from "@env"

const firebaseConfig = {
  apiKey:"AIzaSyDks0-N1Ij39YXk0kmncjFqIAvUHvboi3k",
  authDomain : "nolinger-28643.firebaseapp.com",
  projectId : "nolinger-28643",
  storageBucket : "nolinger-28643.appspot.com",
  messagingSenderId : "617838473229",
  appId : "1:617838473229:web:6b99dbd06e20d2b70f2544",
  measurementId : "G-LYX35QKNG9"
  // apiKey: API_KEY,
    // authDomain: AUTH_DOMAIN,
    // projectId: PROJECT_ID,
    // storageBucket: BUCKET,
    // messagingSenderId: MESSAGE_ID,
    // appId: APP_ID,
    // measurementId: MEASUREMENT_ID
  };

export const Firebase_APP = initializeApp(firebaseConfig)
export const authClient = getAuth(Firebase_APP)
