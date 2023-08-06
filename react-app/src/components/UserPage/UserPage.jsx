import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebase";
import './UserPage.css';

const UserPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [newGalleryItem, setNewGalleryItem] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
      const fetchUserProfile = async () => {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      };

      fetchUserProfile();
    }, [currentUser]);

    const handleProfileUpdate = async (updatedProfile) => {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, updatedProfile);
        setUserProfile(updatedProfile);
        setEditMode(false);
    };

    const handleGalleryUpload = async () => {
        if (newGalleryItem) {
            const storageRef = ref(storage, `gallery/${currentUser.uid}/${newGalleryItem.name}`);
            await uploadBytes(storageRef, newGalleryItem);
            const downloadURL = await getDownloadURL(storageRef);

            const galleryColRef = collection(db, "users", currentUser.uid, "gallery");
            await addDoc(galleryColRef, { imageURL: downloadURL });
        }
    };

    if (!userProfile) return 'Loading...';

    return (
        <div>
            <Navbar />
            <div className="user-page">
                <div className="user-profile">
                    <div>
                        <img src={userProfile.profilePic} alt="user-profile-pic" />
                    </div>
                    {editMode ? (
                        <UserProfileEditForm userProfile={userProfile} onUpdate={handleProfileUpdate} />
                    ) : (
                        <div className="user-profile-info">
                            <p>{userProfile.name}</p>
                            <p>{userProfile.bio}</p>
                            <p>{userProfile.location}</p>
                            <button onClick={() => setEditMode(true)}>Edit Profile</button>
                        </div>
                    )}
                </div>
                <div className="user-gallery-upload">
                    <input type="file" onChange={e => setNewGalleryItem(e.target.files[0])} />
                    <button onClick={handleGalleryUpload}>Upload New Gallery Item</button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
