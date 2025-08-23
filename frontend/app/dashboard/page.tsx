'use client';

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
export default function AuthPage() { // Renamed to AuthPage for broader scope
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between Sign In and Sign Up
  const [showOtpVerification, setShowOtpVerification] = useState(false); // New state for OTP verification
  const [otpData, setOtpData] = useState({
    email: '',
    otp: '',
    tempUserId: null
  });
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    gender: '',
    agreeTerms: false
  });

  const [loginData, setLoginData] = useState({ // New state for login form
    email: '',
    password: ''
  });
  const router = useRouter(); // Router for navigation
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Handle changes for both forms
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (showOtpVerification) {
      setOtpData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (isSignIn) {
      setLoginData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSignUpSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Sending verification code...', type: 'info' });

    // Basic validation for signup
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      setLoading(false);
      return;
    }
    if (!formData.agreeTerms) {
      setMessage({ text: 'You must agree to the terms and conditions.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender
      };

      const res = await fetch(`${AZURE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      // Check if verification is required
      if (data.step === 'verification_required') {
        // Store email for verification and show OTP form
        setOtpData(prev => ({
          ...prev,
          email: formData.email,
          tempUserId: data.tempUserId
        }));
        setShowOtpVerification(true);
        setMessage({
          text: 'Verification code sent to your email. Please check your inbox.',
          type: 'success'
        });
      } else {
        // If registration completed without verification (fallback)
        setMessage({
          text: data.message || 'Registration successful!',
          type: 'success'
        });
        setTimeout(() => {
          setIsSignIn(true);
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred during registration.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Logging in...', type: 'info' });

    try {
      const payload = {
        email: loginData.email,
        password: loginData.password,
      };

      const res = await fetch(`${AZURE_BACKEND_URL}/auth/login`, { // Assuming a login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token); 

      setMessage({
        text: data.message || 'Login successful!',
        type: 'success'
      });

       // Assuming you have a dashboard route set up
      // Redirect to dashboard or home page after successful login

      router.push('/dashboard/home'); // Redirect to dashboard
      console.log('User logged in:', data.user);
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred during login.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Verifying code...', type: 'info' });

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        verification_code: otpData.otp
      };

      const res = await fetch(`${AZURE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setMessage({
        text: 'Email verified successfully! Registration complete.',
        type: 'success'
      });

      // Reset states and redirect to login
      setTimeout(() => {
        setShowOtpVerification(false);
        setIsSignIn(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          dob: '',
          gender: '',
          agreeTerms: false
        });
        setOtpData({
          email: '',
          otp: '',
          tempUserId: null
        });
        setMessage({ text: 'Please sign in with your verified account.', type: 'info' });
      }, 2000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Verification failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage({ text: 'Resending verification code...', type: 'info' });

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender
      };

      const res = await fetch(`${AZURE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setMessage({
        text: 'Verification code resent to your email.',
        type: 'success'
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to resend code.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {showOtpVerification ? 'Verify Your Email' : (isSignIn ? 'Sign In' : 'Create Account')}
          </h1>
          <p className="text-blue-100">
            {showOtpVerification 
              ? 'Enter the verification code sent to your email' 
              : (isSignIn ? 'Welcome back!' : 'Join our community today')
            }
          </p>
        </div>

        {/* Conditional Rendering */}
        {showOtpVerification ? (
          // OTP Verification Form
          <form onSubmit={handleOtpVerification} className="p-6 space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                We sent a verification code to
              </p>
              <p className="font-medium text-gray-900">{otpData.email}</p>
            </div>

            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otpData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                required
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpData.otp.length !== 6}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading || otpData.otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                Didn't receive code? Resend
              </button>
            </div>

            {/* Back to Sign Up */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowOtpVerification(false);
                  setOtpData({ email: '', otp: '', tempUserId: null });
                }}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                ← Back to registration
              </button>
            </div>
          </form>
        ) : isSignIn ? (
          // Sign In Form
          <form onSubmit={handleSignInSubmit} className="p-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          // Sign Up Form (your existing form)
          <form onSubmit={handleSignUpSubmit} className="p-6 space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                //minLength="8" // Corrected minimum length
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <label key={gender} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender.toLowerCase()}
                      checked={formData.gender === gender.toLowerCase()}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <label htmlFor="agreeTerms" className="ml-3 text-sm">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 text-center ${
            message.type === 'success' ? 'text-green-700 bg-green-100' : 
            message.type === 'info' ? 'text-blue-700 bg-blue-100' : 
            'text-red-700 bg-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Toggle between Sign In/Sign Up - Hidden during OTP verification */}
        {!showOtpVerification && (
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              {isSignIn ? (
                <>
                  Don't have an account?{' '}
                  <a
                    href="#"
                    onClick={() => setIsSignIn(false)} // Toggle to Sign Up
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={() => setIsSignIn(true)} // Toggle to Sign In
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </a>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}