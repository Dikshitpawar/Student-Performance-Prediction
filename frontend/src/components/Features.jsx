import FeatureCard from "../components/FeatureCard";
import "../styles/Features.css";

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-grid">
        <FeatureCard
          icon="🧠"
          title="AI-Powered Predictions"
          desc="Advanced machine learning algorithms analyze student data to predict academic performance with high accuracy."
        />

        <FeatureCard
          icon="🎯"
          title="Personalized Insights"
          desc="Get tailored recommendations and actionable insights for each student's unique learning journey."
        />

        <FeatureCard
          icon="📊"
          title="Real-time Analytics"
          desc="Monitor student progress with comprehensive dashboards and interactive visualizations."
        />

        <FeatureCard
          icon="⚡"
          title="Early Intervention"
          desc="Identify at-risk students early and provide timely support to improve outcomes."
        />
      </div>
    </section>
  );
};

export default Features;
