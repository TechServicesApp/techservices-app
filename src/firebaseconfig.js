// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFSHPwbPwAYN1TXLPtauRXprm5_CH3Cmw",
  authDomain: "techservicebackend.firebaseapp.com",
  projectId: "techservicebackend",
  storageBucket: "techservicebackend.appspot.com",
  messagingSenderId: "575719248377",
  appId: "1:575719248377:web:44a56654111baa48762d28",
  measurementId: "G-WEGSFSCWDN",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth(app);
export { auth, firebase };

export const db = getFirestore(app);
export const imgdb = getStorage(app);
