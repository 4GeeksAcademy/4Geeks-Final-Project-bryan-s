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
  const navigate = useNavigate();
  const { setUser, setErrorMsg } = useContext(Context);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [gender, setGender] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if(!user.uid || !user.email) {
        throw new Error("User creation was not successful or user information is missing.");
      }

      // Set user in the context
      setUser({
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        gender: gender
      });

      console.log("User created: ", user);

      const db = getFirestore();
      console.log("Attempting to write to Firestore...");

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        gender: gender
      });

      console.log("User data successfully written to Firestore!");

      const res = await fetch(`http://127.0.0.1:5001/photo-sharing-app-354f6/us-central1/signUpUser`, {
        method: 'post',
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          fullName: fullName  // Add this line
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const dbUser = await res.json();
      console.log('DB User: ', dbUser);

      // Redirect to Personalize page
      navigate("/personalize");
    } catch (error) {
      const errorCode = error.code || "CUSTOM_ERROR";
      const errorMessage = error.message || "Something went wrong!";
      setErrorMsg(`Error: ${errorCode}, Message: ${errorMessage}`);
      console.error(`Error: ${errorCode}, Message: ${errorMessage}`);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

    return (
      <div className="main">
        <Logo />
        <div className="container">
          <div className="box">
            <div className="box-login" id="login">
              <div className="top-header">
                <h3>Welcome to Vaultfolio</h3>
                <small>Create a new account</small>
              </div>
              <button className="google-signup">
            <FcGoogle />
            Sign Up with Google
          </button> 
              <form className="input-group" onSubmit={handleSubmit}>
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
                  <div className="eye-area">
                    <div className="eye-box" onClick={togglePasswordVisibility}>
                      <i className={`fa-regular fa-eye${passwordVisible ? "" : "-slash"}`} id="eye"></i>
                    </div>
                  </div>
                </div>
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
