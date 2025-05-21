'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      setMessage('Password reset link sent to your email!');
    } catch (error: any) {
      setIsSuccess(false);
      if (error.code === 'auth/user-not-found') {
        setMessage('No account found with this email address');
      } else {
        setMessage('Failed to send reset email. Please try again later.');
      }
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8"
    >
      <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
      
      {message && (
        <div className={`${isSuccess ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'} border px-4 py-3 rounded-md mb-4`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-700 rounded-md bg-gray-900 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Remember your password?{' '}
          <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
} 