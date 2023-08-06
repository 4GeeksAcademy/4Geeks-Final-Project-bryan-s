import React, { useState, useEffect } from "react";
import { app } from "../../index";
import "./404.css";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// initialize firebase storage
const storage = getStorage(app);

const NotFoundPage = () => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const gsReference = ref(storage, 'gs://web-photos-vaultfolio1/gears21.png');
      const url = await getDownloadURL(gsReference);
      setBgImage(url);
    }

    fetchImage();
  }, []);

  return (
    <div className="main" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="not-found-container">
            <CustomNavbar />
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
                <div className="home">
                  <Link to="/">Back to Home</Link>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}

export default NotFoundPage;
