import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import necessary Firebase functions
import './heroSection.css';

export default function HeroSection() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Add a state variable to track sign-in status

  useEffect(() => { // Add a useEffect hook to handle sign-in status changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => { // This function is called whenever the sign-in status changes
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup function to avoid memory leaks
  }, []);

  return (
    <div className="hero-container">
      <img src="/images/placeholder1.png" alt="hero-section" />
      <div className="overlay-text">
        <h1 className='title-h'>CREATIVITY ON DISPLAY</h1>
        <p className='cap-p'>What are you waiting for?</p>
        <div className="slant-wrapper">
          <Link to={isSignedIn ? "/HomePage" : "/signin"}> 
            <button className="slant">{isSignedIn ? "Enter the Vault" : "Get Started"}</button> 
          </Link>
        </div>
      </div>
    </div>
  );
}
