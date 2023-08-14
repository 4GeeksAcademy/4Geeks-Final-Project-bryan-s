import React, { useState } from 'react';
import { auth } from '../../../index';
import Logo from '../../Logo/MainLogo';
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import "./Personalize.css";

const Personalize = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const currentUserId = auth.currentUser.uid;
      
      try {
        console.log("Attempting to personalize profile...");
        const db = getFirestore();
        const storage = getStorage();

        let imageUrl = '';

        if (profilePic) {
            const storageRef = ref(storage, `profile-pictures/${currentUserId}/${profilePic.name}`);
            const uploadTask = uploadBytesResumable(storageRef, profilePic);

            uploadTask.on('state_changed', 
              (snapshot) => {
                // Handle upload progress here if needed
              }, 
              (error) => {
                console.error("Error uploading image to Firebase Storage:", error);
              }, 
              async () => {
                // Upload completed successfully
                imageUrl = await getDownloadURL(storageRef);
                console.log("Image URL:", imageUrl);

                await setDoc(doc(db, "users", currentUserId), {
                  profilePic: imageUrl,
                  location: location,
                  bio: bio
                }, { merge: true });

                console.log("Profile successfully personalized!");
                navigate(`/userpage/${currentUserId}`);
              }
            );
        } else {
          // In case there is no profile picture
          await setDoc(doc(db, "users", currentUserId), {
            location: location,
            bio: bio
          }, { merge: true });

          console.log("Profile successfully personalized!");
          navigate(`/userpage/${currentUserId}`);
        }
      } catch (error) {
        const errorMessage = error.message || "Something went wrong!";
        console.log(`Error Message: ${errorMessage}`);
      }
    };

    return (
      <div className="main">
        <Logo />
        <div className="container">
          <div className="box">
            <div className="box-personalize" id="personalize">
              <div className="top-header">
                <h3>Welcome to Vaultfolio</h3>
                <small>Personalize Your Profile</small>
              </div>

              <form className="input-group" onSubmit={handleSubmit}>
                <div className="input-field">
                  <label htmlFor="profilePic">Upload Profile Picture</label>
                  <input
                    type="file"
                    className="input-box"
                    id="profilePic"
                    accept="image/*"
                    onChange={e => setProfilePic(e.target.files[0])}
                  />
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className="input-box"
                    id="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                  <label htmlFor="location">Location</label>
                </div>
                <div className="input-field">
                  <textarea
                    className="input-box"
                    id="bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={500} // limit to a reasonable character count for 5 sentences
                    required
                  />
                  <label htmlFor="bio">Bio (max 5 sentences)</label>
                </div>
                <div className="input-field">
                  <input type="submit" className="input-submit" value="Save" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Personalize;
