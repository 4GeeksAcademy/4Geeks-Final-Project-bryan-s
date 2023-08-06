import React from 'react';
import './MainLogo.css';
import { Link } from 'react-router-dom'; // Import the Link component

const MainLogo = () => {
  return (
    <Link to="/">  {/* Wrap the logo in Link component, 'to' prop should lead to the root route ("/") */}
      <p className="main-logo">VAULTFOLIO</p>
    </Link>
  );
};

export default MainLogo;
