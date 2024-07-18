'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/auth/VerificationPendingPage.module.scss'

export default function VerificationPendingPage() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="https://placeholder.com/"
        alt="PlayBook Logo"
      />
      <h1 className={styles.title}>Verify Your Email</h1>
      <p className={styles.message}>
        We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.
      </p>
      <p className={styles.subMessage}>
        If you don't see the email, check your spam folder.
      </p>
      <button
        onClick={() => router.push('/auth/signIn')}
        className={styles.button}
      >
        Return to Sign In
      </button>
    </div>
  )
}