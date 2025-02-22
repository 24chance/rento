import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaSpinner } from "react-icons/fa";

const AvailableHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleHouse, setSingleHouse] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await api.get("/houses");
        setHouses(response.data);
      } catch (error) {
        console.error("Failed to fetch houses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  const handleHouseClick = async (e, houseId) => { 
    e.preventDefault();
    try {
      const response = await api.get(`/houses/${houseId}`);
      setSingleHouse(response.data);
      setShowBookingForm(false);
    } catch (error) {
      console.error("Failed to fetch house details:", error);
    }
  };

  const closeModal = () => {
    setSingleHouse(null);
    setShowBookingForm(false);
    setCheckIn("");
    setCheckOut("");
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
    setBookingLoading(true);
    try {
      // Send the booking data: house id, checkIn, checkOut
      const response = await api.post("/bookings", {
        house_id: singleHouse.id,
        check_in: checkIn,
        check_out: checkOut,
        status: "pending",
      });
      console.log("Booking successful:", response.data);
      console.log("Single House:", singleHouse);
      alert("Booking confirmed!");
      closeModal();
    } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.detail);
          return;
        }
      console.error("Failed to book house:", error.response || error.message);
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Available Houses</h1>
        <p className="text-gray-600 mt-2">
          Browse through our available properties and find your perfect stay.
        </p>
      </div>

      {/* Houses List */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <FaSpinner className="animate-spin mr-2" />
          <span>Loading houses...</span>
        </div>
      ) : houses.length === 0 ? (
        <p className="text-center text-gray-600">No houses available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {houses.map((house) => (
            <div key={house.id} className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mt-2">{house.title}</h2>
              <p className="text-gray-600 mt-1">{house.description}</p>
              <p className="text-gray-800 mt-2">{house.location} - ${house.price}/night</p>
              <a
                href="#"
                onClick={(e) => handleHouseClick(e, house.id)}
                className="mt-3 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {singleHouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            {/* Conditionally render House Details or Booking Form */}
            {!showBookingForm ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {singleHouse.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Location:</span> {singleHouse.location}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Price:</span> ${singleHouse.price}/night
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Description:</span> {singleHouse.description}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  <span className="font-medium">Created at:</span> {new Date(singleHouse.created_at).toLocaleString()}
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowBookingForm(true);
                  }}
                  className="mt-5 inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Book this house
                </a>
              </>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Book {singleHouse.title}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="checkIn">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="checkOut">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-2 px-4 bg-orange-500 text-white rounded-md focus:outline-none cursor-pointer transition duration-75 ease-in-out hover:bg-orange-600"
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" /> Booking...
                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="mt-3 w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableHouses;
