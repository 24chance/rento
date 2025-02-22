import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPlus, FiEdit, FiMenu } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";


const OwnerSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state

  // Sidebar links for house management
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <MdOutlineDashboard size={20} /> },
    { name: "Add House", path: "/dashboard/create-house", icon: <FiPlus size={20} /> },
    { name: "Manage Bookings", path: "/dashboard/owner/bookings", icon: <FiEdit size={20} /> },
    { name: "Manage Houses", path: "/dashboard/owner/houses", icon: <FiEdit size={20} /> },
  ];

  return (
    <div className={`h-screen bg-white transition-all duration-300 ${isOpen ? "w-60" : "w-20"} flex flex-col`}>
      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-between mb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 focus:outline-none">
        <FiMenu size={24} className="text-gray-600" />
      </button>

       {/* Sidebar Header with Logo */}
       {isOpen &&
        <img src="/R3nt0-full.png" alt="Logo" className="w-20" />
       }
        <div></div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md mx-3 text-gray-700 transition-all duration-200 ${
              location.pathname === link.path ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            {link.icon}
            <span className={`${isOpen ? "block" : "hidden"}`}>{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default OwnerSidebar;
