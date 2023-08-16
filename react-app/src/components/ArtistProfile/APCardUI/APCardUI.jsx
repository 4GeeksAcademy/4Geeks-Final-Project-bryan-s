import React from 'react';
import './APCardUI.css';

const APCardUi = ({ userProfile }) => {
    return (
        <div className="main-view">
            <div className="full-width-box card">
                <div className="imgBx">
                    <img src={userProfile.profilePic} alt="profile" />
                </div>
                <div className="user-profile-info">
                    <p className="fullName">{userProfile.fullName || "N/A"}</p>
                    <p className="location">{userProfile.location || "N/A"}</p>
                    <p className="bio">{userProfile.bio || "No bio available"}</p>
                </div>
            </div>
        </div>
    );
};

export default APCardUi;
