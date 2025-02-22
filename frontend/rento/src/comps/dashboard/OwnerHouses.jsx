import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiLoader, FiEdit, FiTrash2 } from "react-icons/fi";

const UserHouses = () => {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch houses for the current user
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await api.get("/houses/user");
        setHouses(response.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouses();
  }, []);

  // Open update modal and fetch single house details
  const handleUpdateClick = async (houseId) => {
    try {
      setActionLoading(true);
      const response = await api.get(`/houses/${houseId}`);
      setSelectedHouse(response.data);
      // Prefill form data from response
      setFormData({
        title: response.data.title,
        description: response.data.description,
        price: response.data.price,
        location: response.data.location,
      });
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching house details:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete action
  const handleDeleteClick = async (houseId) => {
    if (!window.confirm("Are you sure you want to delete this house?")) return;
    try {
      setActionLoading(true);
      await api.delete(`/houses/${houseId}`);
      // Remove deleted house from list
      setHouses((prev) => prev.filter((house) => house.id !== houseId));
    } catch (error) {
      console.error("Error deleting house:", error);
      alert("Delete failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle changes in update modal form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.patch(`/houses/${selectedHouse.id}`, formData);
      // Update houses list with updated data
      setHouses((prev) =>
        prev.map((house) =>
          house.id === selectedHouse.id ? { ...house, ...formData } : house
        )
      );
      setUpdateModalOpen(false);
      setSelectedHouse(null);
    } catch (error) {
      console.error("Error updating house:", error);
      alert("Update failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Close update modal and clear form data
  const closeModal = () => {
    setUpdateModalOpen(false);
    setSelectedHouse(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Houses</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <FiLoader className="animate-spin text-orange-500 text-4xl" />
        </div>
      ) : houses.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div key={house.id} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">{house.title}</h3>
              <p className="mt-2 text-lg text-orange-500">${house.price}/night</p>
              <p className="text-gray-800 mt-2">{house.location}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleUpdateClick(house.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={actionLoading}
                >
                  {actionLoading && selectedHouse && selectedHouse.id === house.id ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiEdit />
                  )}
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(house.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={actionLoading}
                >
                  {actionLoading && selectedHouse && selectedHouse.id === house.id ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiTrash2 />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No houses found.</p>
      )}

      {/* Update Modal */}
      {updateModalOpen && selectedHouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Update House
            </h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" /> Updating...
                  </span>
                ) : (
                  "Update House"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHouses;
