'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
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
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(false);

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
    
    // Check if privacy consent is given
    if (!privacyConsent) {
      setErrors({ general: 'You must consent to the data privacy policy to proceed with registration. Click here to review the privacy notice again.' });
      return;
    }
    
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
      {/* Data Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-[rgba(0,0,0,0.2)] shadow-lg relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Data Privacy Notice</h3>
                <button
                  className="text-xl font-bold text-gray-600 cursor-pointer"
                  onClick={() => {
                    setShowPrivacyModal(false);
                    setPrivacyConsent(false);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="text-sm text-gray-700 space-y-3 mb-6">
                <p>
                  In compliance with the <strong>Data Privacy Act of 2012</strong>, we inform you that 
                  your personal information will be collected and used by Pilipinas Taekwondo Inc. (PTI) for:
                </p>
                
                <ul className="space-y-1 ml-4">
                  <li>• Account creation and management</li>
                  <li>• Competition registration and participation</li>
                  <li>• Event communication and updates</li>
                  <li>• Emergency contact during events</li>
                </ul>

                <p className="text-sm">
                  <strong>Your data will be kept secure</strong> and will not be shared with third parties 
                  without your consent, except as required by law.
                </p>
              </div>

              <div className="border-t pt-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to the collection and use of my personal data as described above. 
                    I understand I can withdraw this consent by contacting PTI.
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowPrivacyModal(false);
                      setPrivacyConsent(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    disabled={!privacyConsent}
                    className={`cursor-pointer px-4 py-2 rounded text-sm transition-colors ${
                      privacyConsent
                        ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Accept & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Form */}
      <div className="relative z-10 w-full max-w-md text-center rounded-lg p-6">
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

        <h2 className="text-xl font-bold mb-6">Create your account</h2>

        {/* General Error Display */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general.includes('Click here to review') ? (
              <span>
                You must consent to the data privacy policy to proceed with registration. Click{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="underline text-red-700 hover:text-red-800 font-medium cursor-pointer bg-transparent border-none p-0"
                >
                  here
                </button>{' '}
                to review the privacy notice again.
              </span>
            ) : (
              errors.general
            )}
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
          <div className="flex gap-4">
            <div className="w-1/2">
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

            <div className="w-1/2">
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