import React, { useState } from 'react';
import { auth } from '../../index';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../Logo/MainLogo';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc } from "firebase/firestore";
import fetch from 'node-fetch';
import "./SignUp.css";

const SignUp = () => {
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
        console.log("User created: ", user);
  
        const db = getFirestore();
        console.log("Attempting to write to Firestore..."); 

        await setDoc((db, "users", user.uid), {
          fullName: fullName,
          email: email,
          gender: gender
        });
        console.log("User data successfully written to Firestore!");

        //signUpOrSigninUser function call here:
        const res = await fetch(`http://127.0.0.1:5001/photo-sharing-app-354f6/us-central1/signUpUser`, {
          method: 'post',
          body: JSON.stringify({ email: user.email }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const dbUser = await res.json();
        console.log('DB User: ', dbUser);
      } catch (error) {
        const errorCode = error.code || error.message;
        const errorMessage = error.message || "Something went wrong!";
        console.log(`Error: ${errorCode}, Message: ${errorMessage}`);
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
              <button className="google-signin">
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
