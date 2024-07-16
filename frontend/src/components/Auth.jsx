'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import styles from "../styles/components/Auth.module.scss";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleAuthError = (error) => {
    let message = "There was a problem. Please try again.";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "Invalid email or password.";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters.";
        break;
      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Please try again later.";
        break;
    }

    toast.error(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(userCredential.user);
        setShowPinInput(true);
        toast.success("Please check your email for verification.");
      } catch (error) {
        handleAuthError(error);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the PIN to your backend for verification
    // For this example, we'll just simulate a successful verification
    toast.success("Email verified successfully!");
    setShowPinInput(false);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
    } catch (error) {
      handleAuthError(error);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        {!showPinInput ? (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {isSignUp && (
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            )}
            <button type="submit" className={styles.primaryButton}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className={styles.authForm}>
            <input
              type="text"
              value={verificationPin}
              onChange={(e) => setVerificationPin(e.target.value)}
              placeholder="Enter verification PIN"
              required
            />
            <button type="submit" className={styles.primaryButton}>
              Verify Email
            </button>
          </form>
        )}
        <button onClick={handleGoogleSignIn} className={styles.googleButton}>
          <FaGoogle /> Continue with Google
        </button>
        <p className={styles.authToggle}>
          {isSignUp ? "Already have an account?" : "Need an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;