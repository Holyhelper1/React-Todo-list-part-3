// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjlIj4YHTrNoEMS6OF-TUqSstbkBcDLKk",
  authDomain: "productsproject-a70ee.firebaseapp.com",
  projectId: "productsproject-a70ee",
  storageBucket: "productsproject-a70ee.appspot.com",
  messagingSenderId: "269811094086",
  appId: "1:269811094086:web:da45ef4c34397614907047",
  databaseURL: "https://productsproject-a70ee-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);