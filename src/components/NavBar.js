import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <div className="header">
                <h1>PlayBook</h1>
                
            </div>
            <div className="links">
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/About">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Login">Log-in/Sign-up</NavLink>
                    </li>
                </ul>
            </div>
            
        </nav>
    );
};

export default NavBar;