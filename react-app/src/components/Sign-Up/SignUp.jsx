import React, { useState, useContext } from 'react';
import { auth } from '../../index';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../Logo/MainLogo'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import fetch from 'node-fetch';
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { Context } from '../../Context';

const SignUp = () => {
  // Initialize useNavigate
  const navigate = useNavigate();
  
  // Get user context from Context
  const { setUser, setErrorMsg } = useContext(Context);

  // State variables
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [gender, setGender] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create user with email and password using Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user information is complete
      if (!user.uid || !user.email) {
        throw new Error("User creation was not successful or user information is missing.");
      }

      // Set user context in the app
      setUser({
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        gender: gender
      });

      // Write user data to Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        gender: gender
      });

      // Call backend API to sign up user
      const res = await fetch(`http://127.0.0.1:5001/photo-sharing-app-354f6/us-central1/signUpUser`, {
        method: 'post',
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          fullName: fullName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle response errors
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Redirect to Personalize page
      navigate("/personalize");
    } catch (error) {
      // Handle error messages and display them
      const errorCode = error.code || "CUSTOM_ERROR";
      const errorMessage = error.message || "Something went wrong!";
      setErrorMsg(`Error: ${errorCode}, Message: ${errorMessage}`);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="main">
      {/* Logo */}
      <Logo />
      <div className="container">
        <div className="box">
          <div className="box-login" id="login">
            <div className="top-header">
              <h3>Welcome to Vaultfolio</h3>
              <small>Create a new account</small>
            </div>
            {/* Google sign-up button */}
            <button className="google-signup">
              <FcGoogle />
              Sign Up with Google
            </button> 
            {/* Sign-up form */}
            <form className="input-group" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="fullName"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
                <label htmlFor="fullName">Full Name</label>
              </div>
              {/* Email */}
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email address</label>
              </div>
              {/* Password */}
              <div className="input-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="input-box"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                {/* Password visibility toggle */}
                <div className="eye-area">
                  <div className="eye-box" onClick={togglePasswordVisibility}>
                    <i className={`fa-regular fa-eye${passwordVisible ? "" : "-slash"}`} id="eye"></i>
                  </div>
                </div>
              </div>
              {/* Gender */}
              <div className="input-field">
                <label htmlFor="gender">Gender</label>
                <select
                  className="input-box"
                  id="gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Sign Up button */}
              <div className="input-field">
                <input type="submit" className="input-submit" value="Sign Up" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

