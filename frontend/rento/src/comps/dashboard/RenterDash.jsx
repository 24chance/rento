import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardNavbar from './Navbar';
import RenterSidebar from './RenterSidebar';
import RenterHome from './RenterHome';
import Houses from './Houses';
import Bookings from './Bookings';

const OwnerDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <RenterSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#fffaf4] p-6 rounded-xl overflow-auto mt-17">
        <DashboardNavbar profilePicture={user?.user?.profile_picture} />
        <Routes>
          <Route index element={<RenterHome />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="houses" element={<Houses />} /> 
          <Route path="bookings" element={<Bookings />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
