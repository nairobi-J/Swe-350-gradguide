'use client';

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() { // Renamed to AuthPage for broader scope
  const [isSignIn, setIsSignIn] = useState(false); // State to toggle between Sign In and Sign Up
 
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isSignIn) {
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

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Submitting...', type: 'info' });

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

      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage({
        text: data.message || 'Registration successful!',
        type: 'success'
      });
      router.push('/dashboard/home'); // Redirect to dashboard after successful registration
      // Optionally clear form data or redirect
    } catch (err) {
      setMessage({ text: err.message || 'An error occurred during registration.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Logging in...', type: 'info' });

    try {
      const payload = {
        email: loginData.email,
        password: loginData.password,
      };

      const res = await fetch('http://localhost:5000/auth/login', { // Assuming a login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMessage({
        text: data.message || 'Login successful!',
        type: 'success'
      });

       // Assuming you have a dashboard route set up
      // Redirect to dashboard or home page after successful login

      router.push('/dashboard/home'); // Redirect to dashboard
      console.log('User logged in:', data.user);
    } catch (err) {
      setMessage({ text: err.message || 'An error occurred during login.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">{isSignIn ? 'Sign In' : 'Create Account'}</h1>
          <p className="text-blue-100">{isSignIn ? 'Welcome back!' : 'Join our community today'}</p>
        </div>

        {/* Conditional Rendering */}
        {isSignIn ? (
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
          <div className={`p-4 text-center ${message.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
            {message.text}
          </div>
        )}

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
      </div>
    </div>
  );
}