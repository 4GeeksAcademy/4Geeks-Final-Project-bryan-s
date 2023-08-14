import { useContext } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Context } from '../Context'; 
import { auth } from '../index';

export const useGoogleAuth = () => { 
  const { setUser } = useContext(Context);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => { 
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User: ', user);

      // Check if the user exists in your custom backend
      const signInResponse = await fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS_HOST}photo-sharing-app-354f6/us-central1/signInUser`, {
        method: 'post',
        body: JSON.stringify({ email: user.email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If the user doesn't exist, sign them up.
      if (signInResponse.status !== 200) {
        const signUpResponse = await fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS_HOST}photo-sharing-app-354f6/us-central1/signUpUser`, {
          method: 'post',
          body: JSON.stringify({ email: user.email, /* Other user info if necessary */ }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const dbUser = await signUpResponse.json();
        setUser(dbUser.data);
      } else {
        const dbUser = await signInResponse.json();
        setUser(dbUser.data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return signInWithGoogle; 
};
