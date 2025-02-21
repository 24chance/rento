import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import house1 from "../../assets/houses/house1.jpg";
import house2 from "../../assets/houses/house2.jpg";
import house3 from "../../assets/houses/house3.jpg";
import house4 from "../../assets/houses/house4.jpg";

const houses = [
  {
    id: 1,
    image: house1,
    price: "$200/night",
    location: "New York, USA",
    description: "A cozy apartment with stunning skyline views in the heart of NYC.",
  },
  {
    id: 2,
    image: house2,
    price: "$150/night",
    location: "Los Angeles, USA",
    description: "A chic modern loft located in the vibrant center of Los Angeles.",
  },
  {
    id: 3,
    image: house3,
    price: "$180/night",
    location: "Miami, USA",
    description: "A breezy beachfront property offering a laid-back Miami vibe.",
  },
  {
    id: 4,
    image: house4,
    price: "$220/night",
    location: "San Francisco, USA",
    description: "A stylish home with panoramic views of San Francisco's iconic bay.",
  },
];

const FeaturedListings = () => {
  const [selectedHouse, setSelectedHouse] = useState(null);

  const handleCardClick = (house) => {
    setSelectedHouse(house);
  };

  const handleCloseModal = () => {
    setSelectedHouse(null);
  };

  // Disable scrolling on body when modal is open
  useEffect(() => {
    if (selectedHouse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedHouse]);

  return (
    <div className="bg-gradient-to-b from-[#ffdec9] to-[#ffffff] relative overflow-hidden py-16">
      <h2 className="text-3xl font-bold px-12 mt-8">Top Rentals</h2>
      <p className="text-gray-600 px-12 mb-8">
        Explore our top featured listings, showcasing the best properties for your next stay.
      </p>

      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-100%"] }} // Moves all items left
        transition={{ ease: "linear", duration: 300, repeat: Infinity }} // Smooth infinite scroll
      >
        {[...houses, ...houses, ...houses, ...houses, ...houses].map((house, index) => (
          <motion.div
            key={index}
            className="min-w-[250px] md:min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden backdrop-blur-md"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
            }}
            onClick={() => handleCardClick(house)}
          >
            <img src={house.image} alt={`House ${index + 1}`} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{house.location}</h3>
              <h3 className="text-sm mb-2">{house.description}</h3>
              <p className="text-gray-600">{house.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedHouse && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[80%] md:w-[400px] relative">
            {/* Cross icon for closing */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-orange-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedHouse.image}
              alt={`House ${selectedHouse.id}`}
              className="w-full h-48 object-cover rounded-lg rounded-b-none"
            />
            <div className="px-2 pb-4">
              <h3 className="text-xl font-semibold mt-2">{selectedHouse.location}</h3>
              <p className="text-gray-600 mt-2">{selectedHouse.description}</p>
              <p className="text-gray-700 font-semibold mt-2">{selectedHouse.price}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => alert("Renting this property...")}
                  className="my-6 bg-[var(--primary-color)] text-white px-6 py-2 rounded hover:bg-orange-500"
                >
                  Rent This Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;
