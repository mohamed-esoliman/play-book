'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/firebaseConfig'
import { signIn } from 'next-auth/react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import styles from '@/styles/auth/SignInPage.module.scss'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordMatchError, setPasswordMatchError] = useState('')
  const router = useRouter()

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Please enter a valid email address');
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
    setPasswordMatchError(newPassword !== passwordAgain ? 'Passwords do not match' : '');
  };

  const handlePasswordAgainChange = (e) => {
    const newPasswordAgain = e.target.value;
    setPasswordAgain(newPasswordAgain);
    setPasswordMatchError(password !== newPasswordAgain ? 'Passwords do not match' : '');
  };

  const handleSignUp = async () => {
    if (!emailError && passwordErrors.length === 0 && !passwordMatchError) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        toast.success('Account created! Please check your email to verify your account.');
        router.push('/auth/verificationPending');
      } catch (error) {
        console.error("Error signing up:", error);
        toast.error('An error occurred. Please try again later.');
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', { callbackUrl: '/' })
      if (result?.error) {
        toast.error('Failed to sign in with Google')
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('An error occurred during Google sign-in. Please try again.')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <img
        className={styles.loginLogo}
        src="https://placeholder.com/"
        alt="PlayBook Logo"
      />
      <h2 className={styles.loginTitle}>Sign Up</h2>
      <form className={styles.loginForm}>
        <label htmlFor="email" className={styles.formLabel}>
          Email address
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={handleEmailChange}
            required
            className={styles.formInput}
          />
          {emailError && <p className={styles.errorText}>{emailError}</p>}
        </label>
        <label htmlFor="password" className={styles.formLabel}>
          Enter a Password
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            onChange={handlePasswordChange}
            required
            className={styles.formInput}
          />
          {passwordErrors.length > 0 && (
            <ul className={styles.errorList}>
              {passwordErrors.map((error, index) => (
                <li key={index} className={styles.errorText}>{error}</li>
              ))}
            </ul>
          )}
        </label>
        <label htmlFor="passwordagain" className={styles.formLabel}>
          Re-enter the Password
          <input
            id="passwordagain"
            name="passwordagain"
            type="password"
            autoComplete="new-password"
            onChange={handlePasswordAgainChange}
            required
            className={styles.formInput}
          />
          {passwordMatchError && <p className={styles.errorText}>{passwordMatchError}</p>}
        </label>
        <button
          type="button"
          onClick={handleSignUp}
          disabled={!email || !password || !passwordAgain || emailError || passwordErrors.length > 0 || passwordMatchError}
          className={styles.submitButton}
        >
          Sign Up
        </button>

        <div className={styles.divider}>
          <hr className={styles.line} />
          <span className={styles.orText}>or</span>
          <hr className={styles.line} />
        </div>
        
        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className={styles.googleIcon} />
          Sign up with Google
        </button>

      </form>
      <p className={styles.signupPrompt}>
        Already have an account?{' '}
        <button onClick={() => router.push('/auth/signIn')} className={styles.signupLink}>
          Sign In
        </button>
      </p>
    </div>
  )
}