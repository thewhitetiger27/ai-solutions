// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "aisolutions-showcase-mxok6",
  "appId": "1:204665133125:web:3d85ee74543b27c490eb2c",
  "storageBucket": "aisolutions-showcase-mxok6.firebasestorage.app",
  "apiKey": "AIzaSyDQMEhuK2UEf6m3byLICH2pxR65uchS1NM",
  "authDomain": "aisolutions-showcase-mxok6.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "204665133125"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
