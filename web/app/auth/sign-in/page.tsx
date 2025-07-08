'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
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
      console.log('Signing in with', { email, password });
    }
  };

  return (
    <div className="font-geist bg-sign-in min-h-[107vh] w-full flex items-start justify-center px-4 pt-26 pb-26">
      {/* Form Container */}
      <div className="w-full max-w-md text-center rounded-lg p-6">
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

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div className="text-left">
            <label className="block text-sm font-semibold mb-1">
              Email Address <span className="text-[#D41716]">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded outline-none bg-[#F9F8F8] border ${
                errors.email ? 'text-[#D41716]' : 'border-black/20'
              } focus:ring-2 focus:ring-black`}
            />
            {errors.email && (
              <p className="text-sm text-[#D41716] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="text-left relative">
            <label className="block text-sm font-semibold mb-1">
              Password <span className="text-[#D41716]">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded outline-none bg-[#F9F8F8] border ${
                errors.password ? 'text-[#D41716]' : 'border-black/20'
              } pr-10 focus:ring-2 focus:ring-black`}
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
                  width={16}
                  height={16}
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
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#1A1A1A] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Register link */}
        <p className="text-xs mt-4">
          Don’t have an account?{' '}
          <a href="/auth/register" className="font-semibold text-[#040163] hover:underline">
            Register now
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;