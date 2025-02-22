import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardNavbar from './Navbar';
import OwnerSidebar from './OwnerSidebar';
import OwnerHome from './OwnerHome';
import CreateHouse from './Create';
import OwnerBookings from './OwnerBookings';
import OwnerHouses from './OwnerHouses';

const OwnerDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#fffaf4] p-6 rounded-xl overflow-auto mt-17">
        <DashboardNavbar profilePicture={user.user.profile_picture} />

        {/* Nested Routes */}
        <Routes>
          <Route index element={<OwnerHome />} /> {/* This matches "/dashboard" */}
          <Route path="create-house" element={<CreateHouse />} /> {/* This matches "/dashboard/create-house" */}
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/houses" element={<OwnerHouses />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
