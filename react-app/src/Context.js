import React, { createContext, useState, useEffect } from 'react';
import { auth } from './index';

export const Context = createContext();

export default function ContextProvider(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('In the onAuthStateChanged function');

      if (firebaseUser) {
        console.log('User is signed in');

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // any other user info you need
        });

      } else {
        console.log('User not signed in');
        setUser(null);
      }
    });

    return unsubscribe; // Unsubscribe when component is unmounted
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>
      {props.children}
    </Context.Provider>
  );
}

