import "../styles/Hero.css";
import heroImg from "../assets/hero.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="tag">✨ AI-Powered Education Analytics</span>

        <h1>
          Predict Student <br />
          <span>Performance</span> with AI
        </h1>

        <p>
          Harness the power of artificial intelligence to predict academic
          outcomes, identify at-risk students, and improve learning.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/predict")}
          >
            Start Predicting →
          </button>

          <button className="btn-outline">View Dashboard</button>
        </div>
      </div>

      <div className="hero-right">
       <img
  src={heroImg}
  alt="AI-based student performance prediction dashboard"
  className="hero-image"
/>

      </div>
    </section>
  );
};

export default Hero;
