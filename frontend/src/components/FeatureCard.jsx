import "../styles/FeatureCard.css";

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="feature-card">
      <div className="icon-box">
        {icon}
      </div>

      <div className="feature-content">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;