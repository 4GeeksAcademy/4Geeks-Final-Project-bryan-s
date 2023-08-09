import React, { useState, useEffect } from "react";
import "./404.css";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from 'react-router-dom';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../index"

const NotFoundPage = () => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const gsReference = ref(storage, 'gs://photo-sharing-app-354f6.appspot.com/gears21.png');
      const url = await getDownloadURL(gsReference);
      setBgImage(url);
    }

    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main">
      <div className="not-found-container">
          <CustomNavbar />
  
          <div className="not-found-content">
              <h1 className="base-title">404</h1>
  
              {/* New div for the background image */}
              <div className="image-container" style={{ 
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '300px',
                width: '500px',
                margin: '10px auto'
              }}>
              </div>
  
              <h2 className="caption-1">Page Not Found</h2>
              <p>Sorry, the page you are looking for does not exist.</p>
              <div className="home">
                <Link to="/">Back to Home</Link>
              </div>
          </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
