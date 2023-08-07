import React, { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { auth } from '../../index';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const [user, setUser] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate('/'); // replace with the path of your landing page if it's not '/'
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <Navbar expand="lg" className="myNavbar">
      <Navbar.Brand className="logo" href="/">Vaultfolio</Navbar.Brand>

      {windowWidth > 1000 ? (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="hamburger">
            <FiMenu color="white" size="1.5em" />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            {user ? (
              <Dropdown alignRight>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="hamburger custom-toggle">
                <img src={user.photoURL} alt="Profile" className="profile-image"/>
              </Dropdown.Toggle>
        
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/userpage/${user.uid}`}>Profile</Dropdown.Item>  {/* updated here */}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin" className="nav-link">Sign-In</Nav.Link>
                <Nav.Item className="separator"></Nav.Item>
                <Nav.Link as={Link} to="/signup" className="nav-link">Sign-Up</Nav.Link>
              </>
            )}
          </Navbar.Collapse>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" className="hamburger custom-toggle">
            <FiMenu color="white" size="1.5em" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {user ? (
              <>
                <Dropdown.Item as={Link} to={`/userpage/${user.uid}`}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item as={Link} to="/signin">Sign-In</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/signup">Sign-Up</Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Navbar>
  )
}  

export default CustomNavbar;


