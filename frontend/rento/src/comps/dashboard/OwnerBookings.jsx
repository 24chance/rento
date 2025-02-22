import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiLoader } from "react-icons/fi";

const DashboardBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Store an object { bookingId, action } for the button that's loading
  const [loadingAction, setLoadingAction] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser).user : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's houses
        const housesResponse = await api.get("/houses/user");
        setHouses(housesResponse.data);

        // Fetch all bookings
        const bookingsResponse = await api.get("/bookings/all");
        const allBookings = bookingsResponse.data;

        // Filter bookings where the house belongs to the user
        const userHouseIds = housesResponse.data.map((house) => house.id);
        const userBookings = allBookings.filter((booking) =>
          userHouseIds.includes(booking.house_id)
        );

        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle Confirm or Cancel Booking
  const handleBookingAction = async (bookingId, action) => {
    try {
      setLoadingAction({ bookingId, action });
      const endpoint = `/bookings/${bookingId}/${action}`;
      await api.put(endpoint);

      // Update UI instantly
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: action } : booking
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.detail);
        return;
      }
      console.error(`Error ${action}ing booking:`, error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>

      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <FiLoader className="animate-spin text-orange-500 text-4xl" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">House</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="p-3">
                    {houses.find((house) => house.id === booking.house_id)?.title ||
                      "Unknown House"}
                  </td>
                  <td className="p-3">
                    {new Date(booking.check_in).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(booking.check_out).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        booking.status === "confirm"
                          ? "bg-green-200 text-green-800"
                          : booking.status === "cancel"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                      onClick={() =>
                        handleBookingAction(booking.id, "confirm")
                      }
                      disabled={
                        booking.status === "confirm" ||
                        (loadingAction &&
                          loadingAction.bookingId === booking.id &&
                          loadingAction.action === "confirm")
                      }
                    >
                      {loadingAction &&
                      loadingAction.bookingId === booking.id &&
                      loadingAction.action === "confirm" ? (
                        <FiLoader className="animate-spin text-white text-lg" />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                      onClick={() =>
                        handleBookingAction(booking.id, "cancel")
                      }
                      disabled={
                        booking.status === "cancel" ||
                        (loadingAction &&
                          loadingAction.bookingId === booking.id &&
                          loadingAction.action === "cancel")
                      }
                    >
                      {loadingAction &&
                      loadingAction.bookingId === booking.id &&
                      loadingAction.action === "cancel" ? (
                        <FiLoader className="animate-spin text-white text-lg" />
                      ) : (
                        "Cancel"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No bookings found for your houses.</p>
      )}
    </div>
  );
};

export default DashboardBookings;
