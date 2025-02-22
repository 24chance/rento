import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPen } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import api from '../api/axios';
import { Navigate } from 'react-router-dom';

const OnboardingForm = () => {
  // Check for user in localStorage
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    // If no user, send to /auth
    return <Navigate to="/auth" replace />;
  }
  const user = JSON.parse(storedUser);
  // If user is onboarded (has a role that's not None), redirect to dashboard
  if (user.user.role && user.user.role !== "None") {
    return <Navigate to="/dashboard" replace />;
  }

  // Initialize react-hook-form with default value for username if available
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user.user.username || "",
    },
  });
  
  const [profile_picture, setProfile_picture] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Set profile picture preview if one exists in user data
  useEffect(() => {
      // Only set the initial preview if none is selected yet.
      const profilePicTemp = user.user.profilePicture || user.user.profile_picture;
      if (!profilePicPreview && profilePicTemp) {
        // Check if it starts with "http" or "https"
        if (profilePicTemp.startsWith("http")) {
          setProfilePicPreview(profilePicTemp);
        } else {
          // Assume it's a relative path – prepend your base URL if necessary
          setProfilePicPreview(`${API_BASE_URL}${profilePicTemp}`);
        }
      }
      // Also update the username field if user already has a username
      if (user.user.username) {
        setValue("username", user.user.username);
    }
  }, [user.user, profilePicPreview, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_picture(file); // Keep the file for upload

      // Generate a preview for UI display
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    setIsLoading(true);

    // Create FormData object
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("role", role);
    formData.append("file", profile_picture);

    // Get the user ID from local storage
    let userId = null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      userId = parsed.user.id;
    }
    try {
      const response = await api.patch(`/users/${userId}/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      // Save the new data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // Navigate to dashboard
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding failed:", error.response || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#ffdec9] min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-md shadow-md"
      >
         {/* Explanation Text */}
         <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Welcome Aboard!</h2>
          <p className="text-gray-600 mt-2">
            Let's get you set up. Upload your profile picture, choose a username, and select your role.
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <label htmlFor="fileUpload" className="cursor-pointer">
              <img
                src={profilePicPreview || "https://e7.pngegg.com/pngimages/321/296/png-clipart-computer-icons-user-svg-free-customers-miscellaneous-text-thumbnail.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[var(--primary-color)] p-2 rounded-full">
                <FaPen className="text-white text-xs" />
              </div>
            </label>
            <input 
              id="fileUpload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
            placeholder="Your username"
            className="mt-2 w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select your role
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("Renter")}
              className={`w-full py-2 border rounded-md font-medium ${
                role === "Renter"
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-white text-gray-700 border-gray-600"
              }`}
            >
              Renter
            </button>
            <button
              type="button"
              onClick={() => setRole("Owner")}
              className={`w-full py-2 border rounded-md font-medium ${
                role === "Owner"
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-white text-gray-700 border-gray-600"
              }`}
            >
              Owner
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-[var(--primary-color)] text-white rounded-md focus:outline-none cursor-pointer transition duration-75 ease-in-out hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={20} color="#fff" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
