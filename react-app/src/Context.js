import React, { createContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './index';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { storage, firestore } from './index';

export const Context = createContext();

export default function ContextProvider(props) {
    const [user, setUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                console.log('User is signed in');

                const db = getFirestore();
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        fullName: userSnapshot.data().fullName || '',
                        location: userSnapshot.data().location || '',
                        bio: userSnapshot.data().bio || '',
                        profilePic: userSnapshot.data().profilePic || ''
                    });
                }
            } else {
                console.log('User not signed in');
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                const db = getFirestore();
                const userRef = doc(db, "users", userCredential.user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    setUser({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email || '',
                        fullName: userSnapshot.data().fullName || '',
                        location: userSnapshot.data().location || '',
                        bio: userSnapshot.data().bio || '',
                        profilePic: userSnapshot.data().profilePic || ''
                    });
                    return true; // Sign in successful
                } else {
                    throw new Error('User not found in database.');
                }
            }
        } catch (error) {
            let errorMessage;
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
          break;
      }
      setErrorMsg(errorMessage);
      throw error; // Re-throw the error for the calling function to handle
    }
  }
  
  const signUp = async (email, password, fullName) => {  // added fullName parameter
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      if (userCredential.user) {
        const db = getFirestore();
        const userRef = doc(db, "users", userCredential.user.uid);
  
        await userRef.set({
          email: userCredential.user.email,
          fullName: fullName,  // Use the passed in fullName
          // You can add other default values like 'createdAt' here if needed
        });
  
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: fullName  // Also set the fullName in state
        });
  
        return true;  // Sign up successful
      }
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Sign-up not allowed.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.';
          break;
        default:
          errorMessage = 'An error occurred during sign up. Please try again.';
          break;
      }
      setErrorMsg(errorMessage);
      throw error;
    }
  }

  const personalize = async (uid, location, bio, profilePicUrl) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", uid);
      
      // Update the user document with location, bio, and profilePicUrl details
      await setDoc(userRef, {
        location,
        bio,
        profilePic: profilePicUrl
    }, { merge: true });

      // Update the user context state
      setUser(prevState => {
        const updatedUser = { ...prevState, location, bio, profilePic: profilePicUrl };
        console.log("Updated user context:", updatedUser);
        return updatedUser;
    });

      return true;  // Personalization successful

    } catch (error) {
      let errorMessage;
      switch (error.code) {
        // Add more specific error cases if required.
        default:
          errorMessage = 'An error occurred during personalization. Please try again.';
          break;
      }
      setErrorMsg(errorMessage);
      throw error;  // Re-throw the error for the calling function to handle
    }
  }

  const artUploading = async (title, file, uid) => {
    try {
        const bucket = storage.bucket();
        const filePath = `${uid}/${file.name}`;  // use the UID as a folder
        const blob = bucket.file(filePath);  // Updated path here
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.type,
            },
        });
  
        blobWriter.on('error', (err) => {
            console.error(err);
            throw new Error(err.message);
        });
  
        blobWriter.on('finish', async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
            const artRef = firestore.collection("art").doc();
            const data = {
                title,
                uid,
                created_at: new Date().toISOString(),
                url: publicUrl,
            };
            await artRef.set(data);
        });
  
        blobWriter.end(file.buffer);
    } catch (error) {
        console.error('Error uploading art:', error);
        throw error;
    }
  }

  return (
    <Context.Provider value={{ user, setUser, errorMsg, setErrorMsg, signIn, signUp, personalize, artUploading }}>
        {props.children}
    </Context.Provider>
);
}
