import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CardUi from './CardUi/CardUi';
import GalleryUi from './GalleryUi/GalleryUi';
import { Context } from '../../Context';
import { doc, getDoc, setDoc } from "firebase/firestore";
import './UserPage.css';
import { firestore } from '../../index';

const UserPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fetchError, setFetchError] = useState(null); // New state variable for potential fetch errors
    const { user } = useContext(Context); // Extracting the user object from the context

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (user && user.uid) {  // Check for user and user's uid
                    const userDocRef = doc(firestore, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUserProfile(userDocSnap.data());
                    } else {
                        console.log("No such document!");
                        setUserProfile({});
                        setFetchError("Profile data not found."); // Setting the error state
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserProfile({});
                setFetchError("Error fetching profile data. Please try again."); // Setting the error state
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

    if (fetchError) return <p>{fetchError}</p>; // Render the error message if there's an error
    if (!userProfile) return 'Loading...';

    return (
        <div className='main'>
            <Navbar />
            <div className="user-page">
                <div className="user-profile">
                    <div className="box-01"></div>
                    <div className="user-profile-bar">
                        <CardUi userProfile={userProfile} editMode={editMode} setEditMode={setEditMode} />
                    </div>
                    <div className="user-gallery">
                        <GalleryUi userProfile={userProfile} editMode={editMode} setEditMode={setEditMode} handleProfileUpdate={handleProfileUpdate} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};    

export default UserPage;



