import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import ClipLoader from 'react-spinners/ClipLoader';
import api from '../api/axios';



const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  // Watch the password field to compare with confirmPassword
  const password = watch("password", "");

  const onSubmit = async (data) => {
    console.log("Signup Data:", data);

    setIsLoading(true);

    try {
      const response = await api.post("/signup", data);
      // Store user data in local storage 
      console.log("Signup Response:", response.data);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Signup Form */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                message: "Enter a valid email address",
              },
            })}
            className="mt-2 w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field with Eye Toggle */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-2 w-full px-4 py-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <div 
              className="absolute top-1/3 right-3 transform translate-y-0.5 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
        </div>

        {/* Confirm Password Field with Eye Toggle */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="mt-2 w-full px-4 py-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <div 
              className="absolute top-1/3 right-3 transform translate-y-0.5 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-[var(--primary-color)] text-white rounded-md focus:outline-none cursor-pointer duration-75 ease-in-out hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={20} color="#fff" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              "Get Access"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
