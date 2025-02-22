import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi"; // Import spinner icon

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardLanding = () => {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser).user : null;
  const [profilePic, setProfilePic] = useState(null);

  // Set profile picture preview if one exists in user data
  useEffect(() => {
    const profilePictureTemp = user?.profilePicture || user?.profile_picture;
    if (profilePictureTemp) {
      setProfilePic(profilePictureTemp.startsWith("http") ? profilePictureTemp : API_BASE_URL + profilePictureTemp);
    }
  }, [user]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await api.get("/houses/user");
        setHouses(response.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetch
      }
    };

    fetchHouses();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Houses Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Your Houses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center w-full">
                <FiLoader className="animate-spin text-orange-500 text-4xl" />
              </div>
            ) : houses.length > 0 ? (
              houses.map((house) => (
                <div key={house.id} className="bg-white p-4 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold mt-2">{house.title}</h2>
                  <p className="mt-2 text-lg text-orange-500">${house.price}/night</p>
                  <p className="text-gray-800 mt-2">{house.location}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No houses found.</p>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${profilePic ? "" : "bg-gray-300"} rounded-full`}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-16 h-16 object-cover rounded-full" />
              ) : (
                <FiUser size={30} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user?.username || "Owner"}</h3>
              <p className="text-gray-500 text-sm">{user?.email || "No email provided"}</p>
            </div>
          </div>
          <hr className="my-4" />
          <p className="text-gray-600 text-sm">
            Welcome to your dashboard. Here you can manage all your bookings, update your profile, and track your listings.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Your Properties</h1>
          <p className="text-gray-600 mt-2 mb-8">
            Here you can create, update, and delete your houses. Keep your listings up to date!
          </p>
          <Link
            to={"/dashboard/create-house"}
            className="px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            + Create New House
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
