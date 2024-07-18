'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/firebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'
import styles from '@/styles/auth/SignInPage.module.scss'
import toast from 'react-hot-toast'

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const router = useRouter()

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Please enter a valid email address');
  };

  const handleResetPassword = () => {
    if (!emailError) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success('If this is a registered email, a password reset email has been sent');
          router.push('/');
        })
        .catch((error) => {
          console.error("Error sending password reset email:", error);
          toast.error('An error occurred. Please try again.');
        });
    }
  }
  
  return (
    <div className={styles.loginContainer}>
      <img
        className={styles.loginLogo}
        src="https://placeholder.com/"
        alt="PlayBook Logo"
      />
      <h2 className={styles.loginTitle}>Change Your Password</h2>
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
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={!email || emailError}
          className={styles.submitButton}
        >
          Send Reset Email
        </button>
        <p className={styles.signupPrompt}>
        Return to signIn?{' '}
        <button onClick={() => router.push('/auth/signIn')} className={styles.signupLink}>
          Sign In
        </button>
      </p>
      </form>
    </div>
  )
}