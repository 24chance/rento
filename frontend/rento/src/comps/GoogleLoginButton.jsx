import React from "react";
import googleLogo from '../assets/google.png';
const GoogleLoginButton = ({ activeTab }) => {
  /**
   * Handles the Google login flow.
   * Redirects the user to the Google OAuth authentication flow.
   */
  const handleGoogleLogin = () => {
    window.location.href = "https://rento-cf14.onrender.com/auth/google/login";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-[80%] flex items-center justify-center space-x-2 py-2 px-4 mt-5 mx-auto rounded-md bg-[#ffefde] hover:bg-orange-450 cursor-pointer transition"
    >
      <img src={googleLogo} alt="Google Logo" className="w-5 h-5 mr-8" />
      <span className="text-gray-700">
        {activeTab === "signup" ? "Sign up with Google" : "Continue with Google"}
        </span>
    </button>
  );
};

export default GoogleLoginButton;
