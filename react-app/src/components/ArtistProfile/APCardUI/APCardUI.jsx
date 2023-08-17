import React, { useState, useEffect, useMemo } from 'react';
import './APCardUI.css';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../index";

const APCardUi = ({ userProfile }) => {
    const { profilePic, fullName, location, bio } = userProfile || {};
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const gsReference = useMemo(() => {
        if (profilePic) {
            return ref(storage, profilePic);
        }
        return ref(storage, 'gs://photo-sharing-app-354f6.appspot.com/placeholders/placeholder-profile.png');
    }, [profilePic]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const url = await getDownloadURL(gsReference);
                setProfileImageUrl(url);
            } catch (error) {
                console.error("Error fetching profile image:", error);
                const placeholderReference = ref(storage, 'gs://photo-sharing-app-354f6.appspot.com/placeholders/placeholder-profile.png');
                const placeholderUrl = await getDownloadURL(placeholderReference);
                setProfileImageUrl(placeholderUrl);
            }
        };
        fetchProfileImage();
    }, [gsReference, userProfile]);

    return (
        <div className="main-view">
            <div className="full-width-box card">
                <div className="imgBx">
                    <img src={profileImageUrl} alt="profile" />
                </div>
                <div className="user-profile-info">
                    <p className="fullName">{fullName || "N/A"}</p>
                    <p className="location">{location || "N/A"}</p>
                    <p className="bio">{bio || "No bio available"}</p>
                </div>
            </div>
        </div>
    );
};

export default APCardUi;


