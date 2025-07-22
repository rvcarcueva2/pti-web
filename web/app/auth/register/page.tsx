'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required.';
      }
    });

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            mobile: formData.mobile,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful
          console.log('Registration successful:', data);
          
          // Now sign in the user automatically
          try {
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });
            
            if (signInError) {
              console.error('Auto sign-in failed:', signInError);
              // Still redirect to home, but user will need to sign in manually
              window.location.href = '/';
            } else {
              console.log('Auto sign-in successful:', authData);
              // Reset form
              setFormData({
                firstName: '',
                lastName: '',
                gender: '',
                mobile: '',
                email: '',
                password: '',
                confirmPassword: '',
              });
              // Redirect to home page with user signed in
              window.location.href = '/';
            }
          } catch (autoSignInError) {
            console.error('Auto sign-in error:', autoSignInError);
            // Still redirect to home page
            window.location.href = '/';
          }
        } else {
          // Registration failed
          setErrors({ general: data.error || 'Registration failed. Please try again.' });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="relative font-geist bg-register min-h-screen w-full flex items-center justify-center px-4 pt-14 pb-20 overflow-hidden">
      {/* Decorative Images */}
      <Image
        src="/images/1.png"
        alt="Top Left Decoration"
        width={0}
        height={0}
        sizes="(max-width: 768px) 100px, 200px"
        className="absolute top-0 left-0 z-0 w-[100px] md:w-[200px]"
      />

      <Image
        src="/images/2.png"
        alt="Bottom Right Decoration"
        width={0}
        height={0}
        sizes="(max-width: 768px) 200px, 500px"
        className="absolute bottom-0 right-0 z-0 w-[200px] md:w-[500px]"
      />

      {/* Form */}
      <div className="relative z-10 w-full max-w-md text-center rounded-lg p-6">
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/PTI-Logo.png"
              alt="Logo"
              width={0}
              height={0}
              sizes="(max-width: 768px) 80px, 100px"
              className="w-[80px] md:w-[100px] mx-auto cursor-pointer"
            />
          </Link>
        </div>

        <>
          {/* h4 for mobile only */}
          <h4 className="block md:hidden text-base font-bold mb-6">
            Create your account
          </h4>

          {/* h2 for tablet and up */}
          <h2 className="hidden md:block text-xl font-bold mb-6">
            Create your account
          </h2>
        </>

        {/* General Error Display */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              First Name<span className="text-[#D41716]">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            {errors.firstName && (
              <p className="text-sm text-[#D41716] mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Last Name<span className="text-[#D41716]">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            {errors.lastName && (
              <p className="text-sm text-[#D41716] mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Gender & Mobile */}
          <div className="flex flex-col sm:flex-row gap-4">

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Gender<span className="text-[#D41716]">*</span>
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-8 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black appearance-none"
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A] text-xs">
                  ⏷
                </div>
              </div>
              {errors.gender && (
                <p className="text-sm text-[#D41716] mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Mobile Number<span className="text-[#D41716]">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="09xxxxxxxxx"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
              />
              {errors.mobile && (
                <p className="text-sm text-[#D41716] mt-1">{errors.mobile}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email Address<span className="text-[#D41716]">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            {errors.email && (
              <p className="text-sm text-[#D41716] mt-1">{errors.email}</p>
            )}
          </div>

          
          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">
              Password<span className="text-[#D41716]">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
              tabIndex={-1}
            >
              <Image
                src={showPassword ? '/icons/hide-password.svg' : '/icons/show-password.svg'}
                alt="Toggle password"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            {errors.password && (
              <p className="text-sm text-[#D41716] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">
              Confirm Password<span className="text-[#D41716]">*</span>
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
              tabIndex={-1}
            >
              <Image
                src={
                  showConfirmPassword
                    ? '/icons/hide-password.svg'
                    : '/icons/show-password.svg'
                }
                alt="Toggle confirm password"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-[#D41716] mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded transition cursor-pointer ${
              isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-[#1A1A1A] text-white hover:opacity-90'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-xs mt-4 text-center">
          Already have an account?{' '}
          <a
            href="/auth/sign-in"
            className="font-semibold text-[#040163] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;