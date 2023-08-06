import { useContext } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Context } from '../Context'; 
import { auth } from '../index';

export const useGoogleAuth = () => { // renamed to useGoogleAuth and exported
  const { setUser } = useContext(Context);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => { // nested inside useGoogleAuth
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User: ', user);

      const res = await fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS_HOST}photo-sharing-app-354f6/us-central1/signUpOrSigninUser`, {
        method: 'post',
        body: JSON.stringify({ email: user.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dbUser = await res.json();

      console.log('DB User: ', dbUser);
      setUser(dbUser.data);
    } catch (error) {
      console.error(error);
    }
  };

  return signInWithGoogle; // returning signInWithGoogle function
};
