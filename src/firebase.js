// firebase.js

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCsVw4Rj0f0Vj86hcat7aEj7bzhBBy7e5Q",
    authDomain: "identity-card-a40d7.firebaseapp.com",
    projectId: "identity-card-a40d7",
    storageBucket: "identity-card-a40d7.appspot.com",
    messagingSenderId: "4651873997",
    appId: "1:4651873997:web:6f5a58a3b977e37cb01b84",
    measurementId: "G-DPGT4N0HT4"
  };

// Check if Firebase has already been initialized to avoid re-initialization
const app = initializeApp(firebaseConfig);

export default app;
