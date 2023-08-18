import { useContext } from 'react';
import { Context } from '../Context';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const useGoogleAuth = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const { setUser, setErrorMsg } = useContext(Context);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);

        // Check if the user exists in Firestore
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Save the user's displayName as fullName and email in Firestore if they don't exist
          const userData = {
            fullName: user.displayName,
            email: user.email
          };

          await setDoc(userRef, userData, { merge: true });
          navigate('/personalize');
        } else {
          const userData = docSnap.data();
          setUser({
            uid: user.uid,
            email: user.email || '',
            fullName: userData.fullName || 'No Name',
            location: userData.location || 'n/a',
            bio: userData.bio || '',
            profilePic: userData.profilePic || ''
          });

          return true; // Returning true for successful sign in
        }
      } else {
        throw new Error("Failed to authenticate with Google");
      }
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-blocked':
            setErrorMsg("Popup was blocked. Please enable popups and try again.");
            break;
          case 'auth/popup-closed-by-user':
            setErrorMsg("Popup was closed before authentication could be completed. Please try again.");
            break;
        
          default:
            setErrorMsg(error.message);
        }
      } else {
        setErrorMsg(error.message);
      }
      return false;
    }
  };

  return signInWithGoogle;
};

export default useGoogleAuth;



