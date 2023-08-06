import React from 'react';
import './NavHome.css';

const NavHome = () => {

return (
    <header>
      <div className="navbar">
        <div className="logo"><a href="/">Vaultfolio</a></div>
        <ul className="nav">
            <li><a href="/Explore" className="nav-link">Explore</a></li>
        </ul>
      </div>
    </header>
    )
}

export default NavHome;

