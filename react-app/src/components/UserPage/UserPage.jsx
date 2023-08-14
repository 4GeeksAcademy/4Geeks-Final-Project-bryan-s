import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CardUi from './CardUi/CardUi';
import { Context } from '../../Context';
import { doc, getDoc, setDoc } from "firebase/firestore";
import './UserPage.css';
import { firestore } from '../../index';

const UserPage = () => {
    const [userProfile, setUserProfile] = useState(null);
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
                </div>
            </div>
            <Footer />
        </div>
    );
};    

export default UserPage;


