import React, { createContext, useState, useEffect } from 'react';
import { auth } from './index';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const Context = createContext();

export default function ContextProvider(props) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      const db = getFirestore();

      if (firebaseUser) {
        console.log('User is signed in');

        const userRef = doc(db, "users", firebaseUser.uid); // Assuming your users collection is named "users"
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: userSnapshot.data().fullName // Fetching fullName from Firestore
          });
        } else {
          // Handle the scenario where user exists in auth but not in Firestore (just as a safety measure)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }

      } else {
        console.log('User not signed in');
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe when component is unmounted
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>
      {props.children}
    </Context.Provider>
  );
}
