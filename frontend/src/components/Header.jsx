'use client';

import { useState, useEffect } from "react";
import styles from "../styles/components/Header.module.scss";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Link from "next/link";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className={styles.header}>
      <h1>Play-Book</h1>
      <nav>
        <button onClick={() => setDarkMode(!darkMode)} />
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/games">Games</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          {user ? (
            <>
              <li>Welcome, {user.email}</li>
              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/authentication">Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
