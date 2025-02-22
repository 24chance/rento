import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiEdit, FiTrash2, FiUser } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import { CgMoreVerticalR } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardLanding = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user")); 
  const user = storedUser?.user;
  const [profilePic, setProfilePic] = useState(null);

  // Set profile picture preview if one exists in user data
  useEffect(() => {
    if (user.profilePicture) {
      if (user.profilePicture.startsWith("http")) {
        setProfilePic(user.profilePicture);
      } else {
        setProfilePic(API_BASE_URL + user.profilePicture);
      }
    }
  }, [user.profilePicture, profilePic]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/user");
        setHouses(response.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Houses Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <FaSpinner className="animate-spin mr-2 text-orange-500" />
              <span className="text-gray-600">Loading bookings...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {houses.length > 0 ? (
                houses.map((house) => (
                  <div key={house.id} className="bg-white p-4 shadow-md rounded-lg">
                    <h3 className={`text-lg font-semibold ${
                      house.status === "pending"
                        ? "text-yellow-500"
                        : house.status === "confirm"
                        ? "text-green-500"
                        : "text-red-500"
                    } capitalize`}>
                      {house.status}
                    </h3>
                    <p className="text-gray-600 text-sm">{house.location}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-gray-800">
                        {new Date(house.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-md">
                          <CgMoreVerticalR size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No bookings found.</p>
              )}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${profilePic ? "" : "bg-gray-300"} rounded-full`}>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-16 h-16 object-cover rounded-full"
                />
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
          <h1 className="text-2xl font-bold text-gray-800">Find Your Dream Stay</h1>
          <p className="text-gray-600 mt-2 mb-8">
            Explore a wide range of properties and book the perfect house for your next getaway.
          </p>
          <Link
            to={"/dashboard/browse-houses"}
            className="px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            + Browse Houses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
