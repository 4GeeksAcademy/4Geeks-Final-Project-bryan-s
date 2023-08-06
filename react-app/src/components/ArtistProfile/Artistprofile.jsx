import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import './Artistprofile.css';

const Artistprofile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
      const fetchUserProfileAndGallery = async () => {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.log("No such document!");
          }

          const galleryColRef = collection(userDocRef, "gallery");
          const galleryQuerySnapshot = await getDocs(galleryColRef);
          setGalleryItems(galleryQuerySnapshot.docs.map(doc => doc.data()));
        }
      };

      fetchUserProfileAndGallery();
    }, [currentUser]);

    if (!userProfile || !galleryItems) return 'Loading...';

    return (
        <div>
            <Navbar />
            <div className="artist-profile">
                <div className="artist-profile-header">
                    <div>
                        <img src={userProfile.profilePic} alt="artist-profile-pic" />
                    </div>
                    <div className="artist-profile-name">
                        <p>{userProfile.name}</p>
                    </div>
                    <div className="artist-profile-bio">
                        <p>{userProfile.bio}</p>
                    </div>
                    <div className="artist-profile-location">
                        <p>{userProfile.location}</p>
                    </div>
                </div>
                <div className="artist-profile-body">
                    <div className="navigation-bar">
                        <div className="navigation-bar-item">
                            <a href="/projects">Projects</a>
                        </div>
                        <div className="navigation-bar-item">
                            <a href="/about">About</a>
                        </div>
                    </div>
                    <div className="artist-profile-projects">
                        <div className="gallery-container">
                            <div className="gallery">
                                {galleryItems.map((item, index) => (
                                    <div key={index} className="gallery-item">
                                        <img src={item.imageURL} alt="gallery-item" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Artistprofile;

