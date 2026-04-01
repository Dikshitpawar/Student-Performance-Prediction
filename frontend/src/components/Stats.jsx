import "../styles/Stats.css";

const Stats = () => {
  return (
    <section className="stats">
      <div className="stat-box">
        <h2>95%</h2>
        <p>Prediction Accuracy</p>
      </div>

      <div className="stat-box">
        <h2>10K+</h2>
        <p>Students Analyzed</p>
      </div>

      <div className="stat-box">
        <h2>500+</h2>
        <p>Institutions</p>
      </div>

      <div className="stat-box">
        <h2>4.9/5</h2>
        <p>User Rating</p>
      </div>
    </section>
  );
};

export default Stats;
