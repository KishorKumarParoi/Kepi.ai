'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic here
      console.log('Login attempt:', formData);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login clicked');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <Link href='/' className='inline-block'>
            <div className='flex items-center justify-center space-x-3 group'>
              <div className='relative'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105'>
                  <span className='text-white font-bold text-3xl'>K</span>
                </div>
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
            </div>
          </Link>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Welcome back!
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Login Form Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className='w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 group'
          >
            <Chrome className='w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform' />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500 font-medium'>
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email Input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-50'
                    }`}
                  placeholder='you@example.com'
                />
              </div>
              {errors.email && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
                  <span className='text-red-500'>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-50'
                    }`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
                  <span className='text-red-500'>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700 cursor-pointer'
                >
                  Remember me
                </label>
              </div>

              <Link
                href='/forgot-password'
                className='text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
            >
              Sign in
            </button>
          </form>

          {/* Sign Up Link */}
          <div className='text-center pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link
                href='/signup'
                className='font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors'
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Terms & Privacy */}
        <p className='text-center text-xs text-gray-500'>
          By signing in, you agree to our{' '}
          <Link href='/terms' className='text-blue-600 hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='text-blue-600 hover:underline'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
