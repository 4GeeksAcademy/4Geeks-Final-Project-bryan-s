import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './SignIn.css';
import { useGoogleAuth } from '../GoogleAuth'; 
import Logo from '../Logo/MainLogo';
import Footer from '../Footer/Footer';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const auth = getAuth();
  const signInWithGoogle = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // No need to call the signInUser cloud function as we're using Firebase emulator for authentication
      if(userCredential) {
        console.log('User signed in: ', userCredential.user);
        navigate('/homepage');
      }
    } catch (error) {
      console.error('An error occurred:', error);

      if (error.code === 'auth/wrong-password') {
        alert('Wrong password.');
      }
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
              <small>Welcome back!</small>
            </div>
            <button className="google-signin" onClick={signInWithGoogle}> {/* Added onClick handler */}
              <FcGoogle />
              Sign In with Google
            </button>
            <form className="input-group" onSubmit={handleSignIn}>
            <div className="input-field">
              <input
                type="text"
                className="input-box"
                id="logEmail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label htmlFor="logEmail">Email address</label>
            </div>
            <div className="input-field">
              <input
                type={passwordVisible ? "text" : "password"}
                className="input-box"
                id="logPassword"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label htmlFor="logPassword">Password</label>
              <div className="eye-area">
                <div className="eye-box" onClick={togglePasswordVisibility}>
                  <i className={`fa-regular fa-eye${passwordVisible ? "" : "-slash"}`} id="eye"></i>
                </div>
              </div>
            </div>
            <div className="remember">
              <input type="checkbox" id="formCheck" className="check" />
              <label htmlFor="formCheck"> Remember Me</label>
            </div>
            <div className="input-field">
              <input type="submit" className="input-submit" value="Sign In" />
            </div>
            <div className="forgot">
              <a href="/ForgotPassword">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default SignIn;
