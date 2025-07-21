'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if user is already signed in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // User is already signed in, redirect to home
          setIsAuthenticated(true);
          router.replace('/');
          return;
        }
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  // Don't render anything while checking authentication or if authenticated
  if (isAuthenticated === null || isAuthenticated === true) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: { email?: string; general?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // First check if email exists in our database
        const checkResponse = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() }),
        });
        
        const checkData = await checkResponse.json();
        
        if (checkResponse.ok && !checkData.exists) {
          setErrors({ email: 'No account found with this email address.' });
          setIsLoading(false);
          return;
        }

        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
          setErrors({ general: 'Failed to send reset email. Please try again.' });
        } else {
          setIsSuccess(true);
        }
      } catch (error) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      }
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="relative font-geist bg-sign-in min-h-screen w-full flex items-center justify-center px-4 pt-14 pb-20 overflow-hidden">
        {/* Decorative Images */}
        <Image
          src="/images/1.png"
          alt="Top Left Decoration"
          width={200}
          height={200}
          className="absolute top-0 left-0 z-0"
        />
        <Image
          src="/images/2.png"
          alt="Bottom Right Decoration"
          width={500}
          height={500}
          className="absolute bottom-0 right-0 z-0"
        />

        {/* Success Message */}
        <div className="relative z-10 w-full max-w-md text-center rounded-lg p-6">
          {/* Logo */}
          <div className="mb-6">
            <Link href="/">
              <Image
                src="/PTI-Logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Success Content */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Check your email</h3>
            <p className="text-sm text-green-700 mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-xs text-green-600">
              If you don't see the email, check your spam folder or try again.
            </p>
          </div>

          {/* Back to Sign In */}
          <Link
            href="/auth/sign-in"
            className="text-sm text-[#040163] font-semibold group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1 inline-block">←</span> Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative font-geist bg-sign-in min-h-screen w-full flex items-center justify-center px-4 pt-14 pb-20 overflow-hidden">
      {/* Decorative Images */}
      <Image
        src="/images/1.png"
        alt="Top Left Decoration"
        width={200}
        height={200}
        className="absolute top-0 left-0 z-0"
      />
      <Image
        src="/images/2.png"
        alt="Bottom Right Decoration"
        width={500}
        height={500}
        className="absolute bottom-0 right-0 z-0"
      />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md text-center rounded-lg p-6">
        {/* Logo */}
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/PTI-Logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-2">Forgot your password?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email Address <span className="text-[#D41716]">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded outline-none bg-[#F9F8F8] border ${
                errors.email ? 'border-[#D41716]' : 'border-black/20'
              } focus:ring-2 focus:ring-black`}
            />
            {errors.email && (
              <p className="text-sm text-[#D41716] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Sign In */}
        <p className="text-xs mt-4 text-center">
          Remember your password?{' '}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-[#040163] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
