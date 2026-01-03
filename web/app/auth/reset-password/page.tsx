'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: { password?: string; confirmPassword?: string; general?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Update the user's password
        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        if (error) {
          setErrors({ general: 'Failed to update password. Please try again or request a new reset link.' });
        } else {
          setIsSuccess(true);
          // Auto redirect after 3 seconds
          setTimeout(() => {
            router.push('/auth/sign-in');
          }, 3000);
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
            <h2 className="text-xl font-bold text-green-800 mb-2">Password updated!</h2>
            <p className="text-sm text-green-700 mb-4">
              Your password has been successfully updated.
            </p>
            <p className="text-xs text-green-600">
              Redirecting to sign in page in 3 seconds...
            </p>
          </div>

          {/* Manual redirect */}
          <Link
            href="/auth/sign-in"
            className="text-sm text-[#040163] hover:underline font-semibold"
          >
            Continue to Sign In
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
        <h2 className="text-xl font-bold mb-2">Reset your password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              New Password <span className="text-[#D41716]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 pr-12 rounded outline-none bg-[#F9F8F8] border ${errors.password ? 'border-[#D41716]' : 'border-black/20'
                  } focus:ring-2 focus:ring-black`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 touch-manipulation"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-[#D41716] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm New Password <span className="text-[#D41716]">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 pr-12 rounded outline-none bg-[#F9F8F8] border ${errors.confirmPassword ? 'border-[#D41716]' : 'border-black/20'
                  } focus:ring-2 focus:ring-black`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 touch-manipulation"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-[#D41716] mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        {/* Back to Sign In */}
        <p className="text-xs mt-4 text-center">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center text-[#040163] transition-colors duration-200 group font-semibold"
          >
            <span className="mr-1 transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

// Loading fallback component
const ResetPasswordLoading: React.FC = () => {
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

      {/* Loading Container */}
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

        {/* Loading Content */}
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const ResetPassword: React.FC = () => {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPassword;