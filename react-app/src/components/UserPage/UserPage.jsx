import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CardUi from './CardUi';
import { Context } from '../../Context';
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UserProfileEditForm from './UserProfileEditForm';
import './UserPage.css';
import { firestore, storage } from '../../index';

const UserPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [newGalleryItem, setNewGalleryItem] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { user } = useContext(Context); // Extracting the user object from the context

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.uid) {  // Check for user and user's uid
                const userDocRef = doc(firestore, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserProfile(userDocSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleProfileUpdate = async (updatedProfile) => {
        if (user && user.uid) {  // Check for user and user's uid
            const userDocRef = doc(firestore, "users", user.uid);
            await setDoc(userDocRef, updatedProfile);
            setUserProfile(updatedProfile);
            setEditMode(false);
        }
    };

    const handleGalleryUpload = async () => {
        if (newGalleryItem && user && user.uid) {  // Check for newGalleryItem and user's uid
            const storageRef = ref(storage, `gallery/${user.uid}/${newGalleryItem.name}`);
            await uploadBytes(storageRef, newGalleryItem);
            const downloadURL = await getDownloadURL(storageRef);

            const galleryColRef = collection(firestore, "users", user.uid, "gallery");
            await addDoc(galleryColRef, { imageURL: downloadURL });
        }
    };

    if (!userProfile) return 'Loading...';

    return (
        <div className='main'>
            <Navbar />
            <div className="user-page">
                <div className="user-profile">
                    <div className="box-01"></div>
                    <div className="user-profile-bar">
                    <CardUi />
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
            <Footer />
        </div>
    );
};    

export default UserPage;


