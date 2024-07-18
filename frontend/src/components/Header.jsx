"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "@/styles/components/Header.module.scss";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <h1>PlayBook</h1>
      </Link>
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
          {status === "authenticated" && session?.user ? (
            <>
              <li>Welcome, {session.user.name || session.user.email}</li>
              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/signIn">Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;