import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from 'react-redux'; 
import store from './Redux/store'; 

import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
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

connectFunctionsEmulator(functions, "localhost", 5001);
connectAuthEmulator(auth, "http://localhost:9099"); 
connectFirestoreEmulator(firestore, "localhost", 5057);
connectStorageEmulator(storage, "localhost", 9199); 

export { getFunctions };
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>  {/* Wrap the entire app with the Redux Provider */}
    <ContextProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ContextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

