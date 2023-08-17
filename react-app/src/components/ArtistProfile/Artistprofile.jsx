
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import APCardUi from './APCardUI/APCardUI';
import APGalleryUI from './APGalleryUI/APGalleryUI';
import { doc, getDoc } from "firebase/firestore";
import './Artistprofile.css';
import { firestore } from '../../index';

const ArtistProfile = ({ match }) => {
    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const userId = id;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userDocRef = doc(firestore, "users", userId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserProfile(userDocSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
    
        fetchUserProfile();
    }, [userId]);    

    if (!userProfile) return 'Loading...';

    return (
        <div className='main'>
            <Navbar />
            <div className="user-page">
                <div className="user-profile">
                    <div className="box-01"></div>
                    <div className="user-profile-bar">
                        <APCardUi userProfile={userProfile} />
                    </div>
                    <div className="user-gallery">
                        <APGalleryUI userProfile={userProfile} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};    

export default ArtistProfile;
