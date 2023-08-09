import React, { useEffect, useState, useContext } from 'react';
import { FiMenu } from 'react-icons/fi';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../../index'; 
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';  // Adjust the path accordingly

const CustomNavbar = () => {
  const { user } = useContext(Context);  // Use the user from the context instead
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

  const handleSignOut = () => {
    signOut(auth)  // Note: ensure you're passing the correct auth instance here, perhaps from the context if required
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
                <Dropdown alignright="true">
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="hamburger custom-toggle">
                        <img src={user.photoURL} alt="Profile" className="profile-image"/>
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu>
                        <Dropdown.Item className="fullNameDropdownItem" disabled><strong>User:</strong>  {user.fullName}</Dropdown.Item> {/* Displaying fullName here */}
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to={`/userpage/${user.uid}`}>Profile</Dropdown.Item>
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
                      <Dropdown.Item className="fullNameDropdownItem" disabled>{user.fullName}</Dropdown.Item> 
                      <Dropdown.Divider />
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


