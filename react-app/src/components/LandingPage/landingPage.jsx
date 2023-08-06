import React from 'react';
import CustomNavbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import HeroImage from './HeroSection/HeroSection';

const LandingPage = () => {
    return (
        <div className='lp-container'>
          <div className='content-wrap'>
            <CustomNavbar />
            <HeroImage />
          </div>
          <Footer />
        </div>
    );
};

export default LandingPage;