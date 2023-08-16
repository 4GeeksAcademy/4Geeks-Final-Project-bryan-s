
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import APCardUi from './APCardUI/APCardUI';
import APGalleryUI from './APGalleryUI/APGalleryUI';
import { doc, getDoc } from "firebase/firestore";
import './Artistprofile.css';
import { firestore } from '../../index';

const ArtistProfile = ({ match }) => {
    const [userProfile, setUserProfile] = useState(null);
    const userId = match.params.uid; // Assuming you're using React Router and the uid is a route parameter.

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userDocRef = doc(firestore, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setUserProfile(userDocSnap.data());
            } else {
                console.log("No such document!");
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
