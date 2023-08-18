import React, { useState, useContext } from 'react';
import './ResetPassword.css';
import Logo from '../../Logo/MainLogo';
import Footer from '../../Footer/Footer';
import { Context } from '../../../Context';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const { setErrorMsg, errorMsg } = useContext(Context);
  const auth = getAuth();

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent');
    } catch (error) {
      setErrorMsg('Error sending password reset email');
    }
  };
  

  return (
    <div className="main">
      <Logo />
      <div className="container">
        <div className="box">
          <div className="box-login" id="login">
            <div className="top-header">
              <h3>Password Reset</h3>
              <small>Enter your email to reset your password</small>
            </div>
            <div>
              <p className='error-msg'>{errorMsg}</p>
            </div>
            <form className="input-group" onSubmit={handlePasswordReset}>
              <div className="input-field">
                <input
                  type="email"
                  className="input-box"
                  id="resetEmail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="resetEmail">Email address</label>
              </div>
              <div className="input-field">
                <input type="submit" className="input-submit" value="Reset Password" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
