import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCEB4dNEx5SA8yrFV0RaihMTiDidFVk51Y",
  authDomain: "e-commerce-app-ed78e.firebaseapp.com",
  projectId: "e-commerce-app-ed78e",
  storageBucket: "e-commerce-app-ed78e.appspot.com",
  messagingSenderId: "1006657282687",
  appId: "1:1006657282687:web:eb35094331dcc3b7ecd54a",
  measurementId: "G-Z20CHRMFJM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth };
