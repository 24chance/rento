import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Travel Enthusiast",
        feedback: "This service completely transformed my travel experience. Booking was a breeze and the stay was epic!",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        id: 2,
        name: "Samantha Lee",
        role: "Digital Nomad",
        feedback: "Finding a place that felt like home was never this easy. Highly recommended for anyone on the move!",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        id: 3,
        name: "Michael Chen",
        role: "Globetrotter",
        feedback: "Smooth, hassle-free, and downright fun. The listings are top-notch and the booking process is super intuitive.",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        id: 4,
        name: "Olivia Martinez",
        role: "Adventure Seeker",
        feedback: "I’ve used many services, but this one exceeded my expectations. The properties are stunning, and the process is seamless.",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      {
        id: 5,
        name: "Ethan Parker",
        role: "Remote Worker",
        feedback: "Perfect for remote workers like me! I found a cozy spot with fast Wi-Fi and peaceful surroundings. Can’t ask for more!",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        id: 6,
        name: "Lily Brown",
        role: "Solo Traveler",
        feedback: "As a solo traveler, I was looking for safety, comfort, and convenience. This platform delivered all that and more. Loved it!",
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      {
        id: 7,
        name: "David Cooper",
        role: "Family Vacationer",
        feedback: "We booked a family trip, and the house was perfect for us. Spacious, comfortable, and in a great location. Highly recommended!",
        avatar: "https://i.pravatar.cc/150?img=7",
      },
    ];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Testimonials</h2>
        <p className="text-center text-gray-600 mb-12">
          Hear from our happy travelers and see why they keep coming back.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-15 md:gap-15">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full">
                <img
                  src={testimonial.avatar}
                  className="w-20 h-20 rounded-full border-4 border-white absolute top-[-50px] left-1/2 transform -translate-x-1/2 shadow-xl"
                />
              </div>
              <p className="text-gray-700 mb-4 mt-12">"{testimonial.feedback}"</p>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <span className="text-sm text-gray-500">{testimonial.role}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
