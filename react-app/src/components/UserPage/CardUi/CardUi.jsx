import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useDisclosure, Textarea } from '@chakra-ui/react';
import { Context } from '../../../Context';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { firestore, storage } from "../../../index";
import "./CardUi.css";

const CardUi = () => {
  const { user, personalize, setUser } = useContext(Context);
  const { profilePic, fullName, location, bio } = user || {};
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [newBio, setNewBio] = useState(bio || "");
  const [newLocation, setNewLocation] = useState(location || "");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const gsReference = useMemo(() => {
    if (profilePic) {
      return ref(storage, profilePic);
    }
    return ref(storage, 'gs://photo-sharing-app-354f6.appspot.com/placeholders/placeholder-profile.png');
  }, [profilePic]);

  useEffect(() => {
    console.log("Fetching image for:", gsReference);
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
  }, [gsReference, user]);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        console.error("Uploaded file is not an image.");
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        console.error("Uploaded file exceeds the allowed size.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    if (!user || !user.uid) {
        console.error("User or UID is not defined.");
        return;
    }

    let updatedProfilePicUrl = profileImageUrl;

    if (file) {
        const storageRef = ref(storage, `profile-pictures/${user.uid}/profilePicture.jpg`);
        try {
            await uploadBytes(storageRef, file);
            const profilePicReference = `profile-pictures/${user.uid}/profilePicture.jpg`;
            setUser(prevUser => ({ ...prevUser, profilePic: profilePicReference }));
            updatedProfilePicUrl = await getDownloadURL(storageRef);
            setProfileImageUrl(updatedProfilePicUrl);
        } catch (error) {
            console.error("Error uploading image to Firebase Storage:", error);
            alert("Failed to upload the profile picture. Please try again.");
            return;
        }
    }

    try {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
            profilePic: `profile-pictures/${user.uid}/profilePicture.jpg`,
            bio: newBio,
            location: newLocation
        }, { merge: true });
        await personalize(user.uid, newLocation, newBio, `profile-pictures/${user.uid}/profilePicture.jpg`);
        onClose();
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
        alert("Failed to update your profile information. Please try again.");
    }

    onClose();
  };


  function splitLongLines(bioText, maxWordsPerLine = 17) {
    const words = bioText.split(' ');
    const lines = [];
    let currentLine = '';
  
    words.forEach((word, index) => {
      if ((index + 1) % maxWordsPerLine === 0) {
        currentLine += word;
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += word + ' ';
      }
    });
  
    if (currentLine) {
      lines.push(currentLine);
    }
  
    return lines;
  }

  return (
    <div className="main-view">
      <div className="full-width-box card">
        <div className="imgBx">
          <img src={profileImageUrl} alt="profile" />
        </div>
        <div className="user-profile-info">
          <p className="fullName">{fullName}</p>
          <p className="location">{location}</p>
          <p className="bio">
                {splitLongLines(bio).map((line, index) => (
                <span key={index}>
                {line}
                <br />
                </span>
            ))}
            </p>
        </div>
        <div className="edit-button">
          <Button onClick={onOpen} colorScheme='linkedin' size='md'>Edit Profile</Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Upload Profile Picture</FormLabel>
              <input
                type="file"
                className="input-box"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder='Location' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Bio</FormLabel>
              <Textarea value={newBio} onChange={e => setNewBio(e.target.value)} placeholder='Bio' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleProfileEdit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CardUi;




