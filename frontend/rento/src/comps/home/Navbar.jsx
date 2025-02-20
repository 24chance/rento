import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleButtonClick = () => {
    window.location.href = "/auth";
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed left-1/2 transform -translate-x-1/2 px-12 py-4 rounded-full shadow-lg transition-all duration-300 z-100
      ${isScrolled ? "top-0 w-full rounded-none bg-white shadow-md py-3 px-12" : "top-10 w-[70%] bg-white/80 backdrop-blur-md"}`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <img src='/R3nt0-full.png' alt="Logo" className="w-20" />

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <button onClick={() => handleButtonClick()} className="text-gray-700 font-medium hover:text-gray-900 cursor-pointer">Login</button>
          <button onClick={() => handleButtonClick()} className="px-5 py-2 bg-[var(--primary-color)] text-white font-semibold cursor-pointer rounded-lg shadow-md hover:bg-orange-500 transition">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full bg-white shadow-md z-50 p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <button onClick={() => handleButtonClick()} className="text-gray-700 font-medium hover:text-gray-900 cursor-pointer">Login</button>
            <button onClick={() => handleButtonClick()} className="px-5 py-2 bg-[var(--primary-color)] text-white font-semibold cursor-pointer rounded-lg shadow-md hover:bg-orange-500 transition">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
