import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import "../styles/Home.css";
import Stats from "../components/Stats";
import Features from "../components/Features";
import WorkFlow from "../components/WorkFlow";
import Footer from "../components/Footer";



const Home = () => {
  return (
    <>
      <Navbar />
       
      <Hero />
      <Stats />
      <Features />
      <WorkFlow />
      <Footer />
    </>
  );
};

export default Home;
