import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-16 bg-[var(--primary-color)] text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Live the Dream?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sign up now and unlock the best rental deals – because life's too short for boring stays.
        </motion.p>
        <motion.button
          className="bg-white text-[var(--primary-color)] font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

export default CallToAction;
