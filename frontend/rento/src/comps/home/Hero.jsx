import { motion } from "framer-motion";
import house1 from "../../assets/houses/house1.jpg";
import house2 from "../../assets/houses/house2.jpg";
import house3 from "../../assets/houses/house3.jpg";
import house4 from "../../assets/houses/house4.jpg";
import bgImage from "../../assets/hero-bg.jpg"; 

const HeroSection = () => {
  return (
    <section
      className="bg-gradient-to-b from-white to-[#ffdec9] relative mt-35 md:mt-30 flex flex-col md:flex-row items-center justify-between gap-5 px-8 md:px-16 lg:px-24 py-16" 
    >

      {/* Background Image with Overlay - Only Visible on Small Screens */}
      <div className="absolute inset-0 md:hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      
      {/* Left Side - Text Content */}
      <div className="w-full md:w-3/5 text-center md:text-left relative z-10">
        <h1 className="text-4xl font-bold text-gray-300 md:text-gray-800">
          Your Perfect Home
        </h1>
        <h1 className="text-4xl font-bold text-gray-300 md:text-gray-800 capitalize mb-8">
          on the tip of your finger
        </h1>
        <p className="text-lg mx-auto md:mx-0 text-gray-400 md:text-gray-600 mb-8 w-[80%]">
          Explore the best rental properties tailored for your comfort and convenience. 
          Whether you're traveling for business or leisure, find the perfect place with ease.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-[var(--primary-color)] cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition"
        >
          Get Started
        </motion.button>
      </div>

      {/* Right Side - Bouncing Images (Hidden on Small Screens) */}
      <div className="hidden md:grid w-2/5 grid-cols-2 gap-2 relative">
        {[house1, house2, house3, house4].map((src, index, arr) => (
          <motion.img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className={`w-full h-auto rounded-lg shadow-lg ${
              index === arr.length - 1 ? "xl:-mt-44 lg:-mt-35 md:-mt-26" : ""
            }`} 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSection;
