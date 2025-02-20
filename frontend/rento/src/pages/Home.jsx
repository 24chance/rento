import Navbar from "../comps/home/Navbar";
import Hero from "../comps/home/Hero";
import FeaturedListings from "../comps/home/TopRentals";
import HowItWorks from "../comps/home/How";
import Testimonials from "../comps/home/Testimonials";
import CallToAction from "../comps/home/cta";
import Footer from "../comps/home/Footer";

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;