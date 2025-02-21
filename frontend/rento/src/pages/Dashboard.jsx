import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data", error);
    }
  }

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but role is null, redirect to onboarding
  if (user && user.user.role === null || user.user.role === 'None') {
    return <Navigate to="/onboarding" replace />;
  }

  // Otherwise, render the dashboard
  return (
    <div>
      {children}
    </div>
  );
};

export default Dashboard;
