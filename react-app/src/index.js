import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react'
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage'; // import storage functions
import ContextProvider from "./Context";

const firebaseConfig = {
  apiKey: "AIzaSyCFsgJOGx56Zzh33kXQT5psnrsEDuBvneI",
  authDomain: "photo-sharing-app-354f6.firebaseapp.com",
  projectId: "photo-sharing-app-354f6",
  storageBucket: "photo-sharing-app-354f6.appspot.com",
  messagingSenderId: "320464214659",
  appId: "1:320464214659:web:7eb227f35019999476d9b6",
  measurementId: "G-5029FW5VRV"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

connectFunctionsEmulator(functions, "127.0.0.1", 5001);
connectAuthEmulator(auth, process.env.REACT_APP_FIREBASE_AUTH_HOST);
connectFirestoreEmulator(firestore, process.env.REACT_APP_FIREBASE_FIRESTORE_HOST);
connectStorageEmulator(storage, process.env.REACT_APP_FIREBASE_STORAGE); // connect to Storage emulator

export { getFunctions };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
