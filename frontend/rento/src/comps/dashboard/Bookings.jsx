import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaSpinner } from "react-icons/fa";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/user"); // Adjust endpoint as needed
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin mr-2 text-orange-500" />
          <span className="text-gray-600">Loading bookings...</span>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3
                className={`text-lg font-semibold capitalize ${
                  booking.status === "pending"
                    ? "text-yellow-500"
                    : booking.status === "confirm"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {booking.status}
              </h3>
              <p className="text-gray-600 text-sm">{booking.location}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-800">
                  {`${new Date(booking.check_in).toLocaleDateString()} - ${new Date(booking.check_out).toLocaleDateString()}`}
                </span>
                {/* Add any extra details or actions here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
