import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPen } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import api from '../api/axios';


const OnboardingForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profile_picture, setProfile_picture] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const storedUser = localStorage.getItem("user");
    let userId = null;
    let accessToken = null;

    if (storedUser) {
      userId = JSON.parse(storedUser).user.id;
      accessToken = JSON.parse(storedUser).access_token;
    }
    try {
      const response = await api.patch(`/users/${userId}/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
      console.log(response)
    } catch (error) {
      console.error("Login failed:", error.response || error.message);
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
