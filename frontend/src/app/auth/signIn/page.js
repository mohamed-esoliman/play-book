'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import styles from '@/styles/auth/SignInPage.module.scss'
import { toast } from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(newPassword.length >= 8 ? '' : 'Password must be at least 8 characters long');
  };

  const handleSignIn = async () => {
    if (!emailError && !passwordError) {
      const response = await signIn('credentials', { email, password, redirect: false })
      if (response?.error) {
        toast.error('incorrect email and/or password')
      } else {
        toast.success('Signed in successfully')
        router.push('/')
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <img
        className={styles.loginLogo}
        src="https://placeholder.com/"
        alt="PlayBook Logo"
      />
      <h2 className={styles.loginTitle}>Sign in to your account</h2>
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
          Password
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            required
            className={styles.formInput}
          />
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}
        </label>
        <button
          type="button"
          onClick={() => router.push('/auth/changePassword')}
          className={styles.forgotPassword}
        >
          Forgot password?
        </button>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={!email || !password || emailError || passwordError}
          className={styles.submitButton}
        >
          Sign in
        </button>
      </form>
      <p className={styles.signupPrompt}>
        Not a member?{' '}
        <button onClick={() => router.push('/auth/signUp')} className={styles.signupLink}>
          Sign Up
        </button>
      </p>
    </div>
  )
}