import React, { useState } from 'react';
import Login from '../comps/Login';   
import Signup from '../comps/Signup'; 
import GoogleLoginButton from '../comps/GoogleLoginButton';
import { Navigate } from 'react-router-dom';


const Authpage = () => {
  const [activeTab, setActiveTab] = useState('login');

    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    let user = null;
  
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  
    // If there's a user, redirect to dashboard
    if (user) {
       return <Navigate to="/dashboard" replace />;
    }
  


  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/authbg.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-[#efd7be] px-8 pt-2.5 pb-8 rounded-lg w-full max-w-lg">
          <nav className="mb-10">
            <div className="my-6 flex justify-center">
                <img
                    src="/R3nt0-full.png"
                    alt="Rento Logo"
                    className="w-30"
                />
                </div>
                <div className="flex w-full">
                <button
                    className={`flex-1 text-center py-2 border-b-2 ${
                    activeTab === 'login'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500'
                    }`}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
                <button
                    className={`flex-1 text-center py-2 border-b-2 ${
                    activeTab === 'signup'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500'
                    }`}
                    onClick={() => setActiveTab('signup')}
                >
                    Signup
                </button>
                </div>
          </nav>

        {/* google login button  */}
          <GoogleLoginButton activeTab={activeTab} />
            
            <p className="text-center text-gray-500 my-4">or</p>

          {/* dynamically render the active tab */}
          {activeTab === 'login' ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default Authpage;
