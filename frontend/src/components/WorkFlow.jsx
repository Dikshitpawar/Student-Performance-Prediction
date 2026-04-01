import "../styles/WorkFlow.css";


const steps = [
  {
    number: "01",
    title: "Input Data",
    desc: "Enter student attendance, marks, and study hours using our simple interface.",
    icon: "📝",
  },
  {
    number: "02",
    title: "AI Analysis",
    desc: "Our AI model analyzes patterns, trends, and student behavior accurately.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Get Insights",
    desc: "Receive predictions, weak areas, and personalized improvement suggestions.",
    icon: "📊",
  },
];
const WorkFlow = () => {
    return (
    <section className="how">
      <h2>How It Works</h2>
      <p className="how-sub">
        Simple, fast, and accurate predictions in three easy steps
      </p>

      <div className="how-grid">
        {steps.map((step, index) => (
          <div className="how-card" key={index}>
            <span className="step-number">{step.number}</span>
            <div className="icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkFlow