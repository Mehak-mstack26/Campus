// firebase-init.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  updateProfile, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import {
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc,
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxi4zF1f4OJ-7ipvH3hA0_7AHnc9cPyio",
  authDomain: "campuslink-2f138.firebaseapp.com",
  projectId: "campuslink-2f138",
  storageBucket: "campuslink-2f138.appspot.com",
  messagingSenderId: "53273665497",
  appId: "1:53273665497:web:ece915f8980a9c598fc3c8",
  measurementId: "G-DGY8D6VL65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Test the connection
console.log("Firebase initialized successfully");
console.log("Auth:", auth);
console.log("DB:", db);

export {
  app, 
  auth, 
  db,
  onAuthStateChanged, 
  updateProfile,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc,
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  updateDoc
};