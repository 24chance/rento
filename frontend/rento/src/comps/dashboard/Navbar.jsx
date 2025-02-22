import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiBell } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const [profilePic, setProfilePic] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  // Set profile picture preview if one exists in user data
  useEffect(() => {
    const profilePictureTemp = user.user.profilePicture || user.user.profile_picture;
      if (profilePictureTemp) {
        // Check if it starts with "http" or "https"
        if (profilePictureTemp.startsWith("http")) {
          setProfilePic(profilePictureTemp);
        } else {
          setProfilePic(API_BASE_URL + profilePictureTemp);
        }
      }
     
  }, [user.user, profilePic]);


  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Dashboard Title / Logo */}
        <div className="">
          <img src="/R3nt0-full.png" alt="Logo" className="w-20" />
        </div>
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button className="text-gray-700 hover:text-orange-500 focus:outline-none">
            <FiBell size={24} />
          </button>
          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
              <img
                src={
                  profilePic || "https://e7.pngegg.com/pngimages/321/296/png-clipart-computer-icons-user-svg-free-customers-miscellaneous-text-thumbnail.png" }
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <FiChevronDown className="ml-1 text-gray-700" size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link
                  to="/dashboard/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                    onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/auth";
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                    Logout
                    </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
