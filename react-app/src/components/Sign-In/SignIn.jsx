import React, { useState, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './SignIn.css';
import useGoogleAuth from '../GoogleAuth';
import Logo from '../Logo/MainLogo';
import Footer from '../Footer/Footer';
import { Context } from '../../Context';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const signInWithGoogle = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { signIn, errorMsg, setErrorMsg } = useContext(Context);
  
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    try {
      const wasSuccessful = await signIn(email, password);
      if (wasSuccessful) {
        navigate('/homepage');
      } 
    } catch (error) {
      alert(errorMsg);
    }
  };

  const handleGoogleSignIn = async () => {
    const wasSuccessful = await signInWithGoogle();
    if (wasSuccessful) {
      navigate('/homepage');
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
            <div>
              <p className='error-msg'>{errorMsg}</p>
            </div>
            <button className="google-signin" onClick={handleGoogleSignIn}>
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
              <Link to="/ResetPassword">Forgot password?</Link>
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


