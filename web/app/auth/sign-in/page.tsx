'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const SignIn: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is already signed in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // User is already signed in, redirect to home
          setIsAuthenticated(true);
          router.replace('/'); // Use replace instead of push
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
    return null; // Return nothing instead of loading spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: { email?: string; password?: string; general?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // Don't log the error to console to avoid Next.js warnings
          // console.error('Sign in error:', error);
          
          // Handle specific error types
          if (error.message.includes('Invalid login credentials')) {
            // Check if the email exists using our API
            try {
              const checkResponse = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
              });
              
              const checkData = await checkResponse.json();
              
              if (checkResponse.ok) {
                if (checkData.exists) {
                  // Email exists, so password is wrong
                  setErrors({ password: 'The password you entered is incorrect.' });
                } else {
                  // Email not found
                  setErrors({ email: 'The email is not yet registered.' });
                }
              } else {
                // API error, default to wrong password for better UX
                setErrors({ password: 'The password you entered is incorrect.' });
              }
            } catch (checkError) {
              // Don't log check errors to console
              // console.error('Error checking email:', checkError);
              // Default to wrong password error
              setErrors({ password: 'The password you entered is incorrect.' });
            }
          } else if (error.message.includes('Email not confirmed')) {
            setErrors({ email: 'Please check your email and confirm your account.' });
          } else {
            setErrors({ general: 'Sign in failed, please try again' });
          }
        } else {
          // Sign in successful
          // Clear form and redirect to home page
          setEmail('');
          setPassword('');
          
          // Small delay to ensure session is set
          setTimeout(() => {
            router.push('/');
          }, 100);
        }
      } catch (error) {
        // Don't log catch errors to console
        // console.error('Sign in catch error:', error);
        setErrors({ general: 'Sign in failed, please try again' });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="relative font-geist bg-sign-in min-h-screen w-full flex items-center justify-center px-4 pt-14 pb-20 overflow-hidden">
      {/* Decorative Images */}
      <Image
        src="/images/1.png"
        alt="Top Left Decoration"
        width={0}
        height={0}
        sizes="(max-width: 768px) 120px, 200px"
        className="absolute top-0 left-0 z-0 w-[120px] md:w-[200px]"
      />
      <Image
        src="/images/2.png"
        alt="Bottom Right Decoration"
        width={0}
        height={0}
        sizes="(max-width: 768px) 240px, 500px"
        className="absolute bottom-0 right-0 z-0 w-[240px] md:w-[500px]"
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
        <h2 className="text-xl font-bold mb-6">Sign in to your account</h2>

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

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">
              Password <span className="text-[#D41716]">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-10 rounded outline-none bg-[#F9F8F8] border ${
                errors.password ? 'border-[#D41716]' : 'border-black/20'
              } focus:ring-2 focus:ring-black`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <Image
                  src="/icons/hide-password.svg"
                  alt="Hide password"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/icons/show-password.svg"
                  alt="Show password"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              )}
            </button>
            {errors.password && (
              <p className="text-sm text-[#D41716] mt-1">
                {errors.password}
                {errors.password.includes('incorrect') }
              </p>
            )}
            <div className="text-right mt-1">
              <a href="/auth/forgot-password" className="text-sm text-gray-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-xs mt-4 text-center">
          Don’t have an account?{' '}
          <a
            href="/auth/register"
            className="font-semibold text-[#040163] hover:underline"
          >
            Register now
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;