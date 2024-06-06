import React from 'react';
import styles from './navbar.module.css';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <div className={styles.header}>
                <h1>PlayBook</h1>
                
            </div>
            <div className="search">
                <input type="text" placeholder="Search for games..."></input>
                <button>Search</button>
            </div>
            <div className={styles.links}>
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