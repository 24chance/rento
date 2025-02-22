import React from 'react';
import { Navigate } from 'react-router-dom';
import OwnerDashboard from '../comps/dashboard/OwnersDash';
import RenterDashboard from '../comps/dashboard/RenterDash';

const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data", error);
    }
  }

  // Redirect if no user
  if (!user) return <Navigate to="/auth" replace />;

  // If role is missing, go to onboarding
  if (!user.user.role || user.user.role === 'None' || user.user.role === "") {
    return <Navigate to="/onboarding" replace />;
  }

  // Route based on role
  if (user.user.role === "Owner") {
    return <OwnerDashboard />;
  } else if (user.user.role === "Renter") {
    return <RenterDashboard />;
  } else {
    return <Navigate to="/auth" replace />;
  }
};

export default Dashboard;
