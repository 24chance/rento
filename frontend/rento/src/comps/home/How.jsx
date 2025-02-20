import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Search & Discover",
    description: "Enter your destination and explore our handpicked rental spots.",
    icon: "🔍",
  },
  {
    id: 2,
    title: "Select & Book",
    description: "Choose your favorite spot and book it with a few clicks.",
    icon: "🖱️",
  },
  {
    id: 3,
    title: "Enjoy Your Stay",
    description: "Kick back and relax. Your perfect getaway is ready for you.",
    icon: "🏖️",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-12">
          Booking made simple – follow these easy steps and get ready for a chill stay.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
