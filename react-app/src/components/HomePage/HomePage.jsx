import React from "react";
import "./HomePage.css";
import CustomNavbar from "../Navbar/Navbar";
import MosaicGalleryUI from './MosaicGalleryUI';
import Footer from "../Footer/Footer";

const HomePage = () => {
    return (
        <div className="main">
            <CustomNavbar />
            <div className='mosaic'>
                <MosaicGalleryUI />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;

