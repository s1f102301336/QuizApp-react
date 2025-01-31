// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5JsAepGS5Zw8ggVUV4sEYEB1CLFLk_qQ",
  authDomain: "react-quiz-app-353d4.firebaseapp.com",
  projectId: "react-quiz-app-353d4",
  storageBucket: "react-quiz-app-353d4.firebasestorage.app",
  messagingSenderId: "927774549194",
  appId: "1:927774549194:web:53e7e5a61c03aefae30033",
  measurementId: "G-8V0RSNC0FZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app); //RealTimeDB-info
const db = getFirestore(app); //db-info
const auth = getAuth(app); //boolean

export { rtdb, db, auth };
