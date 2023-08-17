import { useContext } from 'react';
import { Context } from '../Context';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const useGoogleAuth = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  const { setErrorMsg } = useContext(Context); // Use context to set error messages

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        // Do additional tasks if needed like saving the user data in your database
        return true;
      } else {
        setErrorMsg("Failed to authenticate with Google");
        return false;
      }
    } catch (error) {
      setErrorMsg(error.message);
      return false;
    }
  };

  return signInWithGoogle;
};

export default useGoogleAuth;

