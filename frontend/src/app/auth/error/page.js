'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import styles from '@/styles/auth/ErrorPage.module.scss'

export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="https://placeholder.com/"
        alt="PlayBook Logo"
      />
      <h1 className={styles.title}>Authentication Error</h1>
      <p className={styles.message}>
        {getErrorMessage(error)}
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