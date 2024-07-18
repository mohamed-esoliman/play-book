'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/auth/EmailVerified.module.scss'

export default function EmailVerifiedPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Verified Successfully!</h1>
      <p className={styles.message}>
        Thank you for verifying your email. Your account is now fully activated.
      </p>
      <button
        onClick={() => router.push('/')}
        className={styles.button}
      >
        Go to Dashboard
      </button>
    </div>
  )
}