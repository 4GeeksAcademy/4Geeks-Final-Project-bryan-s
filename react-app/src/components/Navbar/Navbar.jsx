import React, { useEffect, useContext } from 'react';
import { FiMenu } from 'react-icons/fi';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../../index'; 
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';
import NavSearch from './NavSearch'; // Assuming NavSearch is in the same directory

const CustomNavbar = () => {
  // Get user context
  const { user } = useContext(Context);
  const navigate = useNavigate();

  // Resize event handler
  const handleResize = () => {
    // Implementation for handleResize if needed
  };

  useEffect(() => {
    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up resize event listener on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);  

  // Sign out the user
  const handleSignOut = () => {
    signOut(auth) 
      .then(() => {
        console.log("User signed out");
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <Navbar expand="lg" className="myNavbar">
      {/* Brand logo */}
      <Navbar.Brand className="logo" href="/">Vaultfolio</Navbar.Brand>
      
      {/* Conditionally render search bar if the user is logged in */}
      {user && <NavSearch />} 

      {/* Hamburger menu */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="hamburger">
        <FiMenu color="white" size="1.5em" />
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        {user ? (
          <Dropdown alignright="true">
            {/* User profile dropdown */}
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="hamburger custom-toggle">
              <img src={user.photoURL} alt="Profile" className="profile-image"/>
            </Dropdown.Toggle>
          
            <Dropdown.Menu>
              <Dropdown.Item className="fullNameDropdownItem" disabled><strong>User:</strong>  {user.fullName || 'No Name'}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to={`/userpage/${user.uid}`}>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          // Show sign-in and sign-up links if user is not logged in
          <>
            <Nav.Link as={Link} to="/signin" className="nav-link">Sign-In</Nav.Link>
            <Nav.Item className="separator"></Nav.Item>
            <Nav.Link as={Link} to="/signup" className="nav-link">Sign-Up</Nav.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;




