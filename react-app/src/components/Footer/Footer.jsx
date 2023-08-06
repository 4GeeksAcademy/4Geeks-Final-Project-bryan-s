import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="sb__footer section__padding">
                <div className="sb__footer-links">
                    <div className="sb__footer-links-div">
                        <h4>For Business</h4>
                        <a href="/employer">
                            <p>Employer</p>
                        </a>
                        </div>
                        <div className="sb__footer-links-div">
                            <h4>Resources</h4>
                            <a href="/resource">
                                <p>Resource Center</p>
                            </a>
                        </div>
                        <div className="sb__footer-links-div">
                            <h4>Company</h4>
                            <a href="/about">
                                <p>About Us</p>
                            </a>
                        </div>
                    </div>
                    </div>
                    

            <hr></hr>
            
            <div className="sb__footer-below">
                <div className="sb__footer-copyright">
                    <p>
                        @{new Date().getFullYear()} Vaultfolio. All Rights Reserved.
                    </p>
                </div>
                <div className="sb__footer-below-links">
                    <a href="/privacy"><div>Privacy Policy</div></a>
                    <a href="/terms"><div>Terms of Use</div></a>
                    <a href="/contact"><div>Contact Us</div></a>
                </div>
            </div>
         </div>               
    );
};

export default Footer;