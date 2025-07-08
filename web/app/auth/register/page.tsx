'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Required field checks
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required.';
      }
    });

    // Email format check
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password match check
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Registering with:', formData);
    }
  };

  return (
    <div className="font-geist min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-y-auto">
      <div className="w-full max-w-md text-center rounded-lg p-6">
        <div className="mb-6">
          <Image src="/PTI-Logo.png" alt="Logo" width={100} height={100} className="mx-auto" />
        </div>

        <h2 className="text-xl font-bold mb-6">Create your account</h2>

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
            {errors.firstName && <p className="text-sm text-[#D41716] mt-1">{errors.firstName}</p>}
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
            {errors.lastName && <p className="text-sm text-[#D41716] mt-1">{errors.lastName}</p>}
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
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A] text-xs">⏷</div>
              </div>
              {errors.gender && <p className="text-sm text-[#D41716] mt-1">{errors.gender}</p>}
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
              {errors.mobile && <p className="text-sm text-[#D41716] mt-1">{errors.mobile}</p>}
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
            {errors.email && <p className="text-sm text-[#D41716] mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Username<span className="text-[#D41716]">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Create a username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#F9F8F8] border border-black/20 outline-none focus:ring-2 focus:ring-black"
            />
            {errors.username && <p className="text-sm text-[#D41716] mt-1">{errors.username}</p>}
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
            {errors.password && <p className="text-sm text-[#D41716] mt-1">{errors.password}</p>}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
              tabIndex={-1}
            >
              <Image
                src={showConfirmPassword ? '/icons/hide-password.svg' : '/icons/show-password.svg'}
                alt="Toggle confirm password"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            {errors.confirmPassword && <p className="text-sm text-[#D41716] mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1A1A1A] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-xs mt-4 text-center">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="font-semibold text-[#040163] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
