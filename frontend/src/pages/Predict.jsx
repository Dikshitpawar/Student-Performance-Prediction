import { useContext, useEffect, useState } from "react";
import "../styles/Predict.css";
import { authContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const Predict = () => {

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const {
    register,
    handleSubmit,
    reset
  } = useForm();

  const navigate = useNavigate();
  const { token, url } = useContext(authContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/api/performance/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        console.log(response.data.data);
        setPrediction(response.data.data);
        setShowResult(true);
        reset();
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">

      {/* ================= FORM ================= */}
      {!showResult && (
        <div className="predict-card">
          <div className="card-top">
          <h2>Student Performance Prediction</h2>
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Back
          </button>

          </div>
          <p>Enter student data to get AI-powered insights</p>


          <form onSubmit={handleSubmit(onSubmit)}>

            <label>Subject</label>
            <input type="text" {...register("subject")} placeholder="e.g. Mathematics" />

            <label>Attendance (%)</label>
            <input type="number" {...register("attendance")} placeholder="e.g. 75" />

            <label>Internal Marks</label>
            <input type="number" {...register("internalMarks")} placeholder="e.g. 40" />

            <label>Assignment Marks</label>
            <input type="number" {...register("assignmentMarks")} placeholder="e.g. 40" />

            <label>Study Hours</label>
            <input type="number" {...register("studyHours")} placeholder="e.g. 5" />

            <button type="submit" className="pred-btn-primary">
              {loading ? "Predicting..." : "Predict Performance"}
            </button>

          </form>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {showResult && prediction && (

        <div className="result-card">

          <div className="top-sec">
            <h3>📈 Performance Prediction</h3>

            <h2 className={
              prediction?.prediction === "At Risk"
                ? "risk"
                : "safe"
            }>
              {prediction?.prediction}
            </h2>

            <p className="score">
              Risk Score : {prediction?.riskScore}%
            </p>
          </div>

          {/* ANALYSIS */}
          <div className={`box ${
            prediction?.prediction === "At Risk"
              ? "warning"
              : "success"
          }`}>
            <h4>📊 Analysis</h4>

            <p>
              {prediction?.riskScore > 60
                ? "High probability of poor performance detected"
                : "Student performance looks stable but improvements possible"}
            </p>
          </div>

          {/* WEAK AREAS */}
          <div className="box danger">
            <h4>⚠ Weak Areas</h4>

            <ul>
              {prediction?.weakAreas?.length > 0 ? (
                prediction?.weakAreas?.map((area, index) => (
                  <li key={index}>{area}</li>
                ))
              ) : (
                <li>No major weak areas detected </li>
              )}
            </ul>
          </div>

          {/* SUGGESTIONS */}
          <div className="box success">
            <h4>💡 Suggestions</h4>

            <ul>
              {prediction?.suggestions?.length > 0 ? (
                prediction?.suggestions?.map((s, index) => (
                  <li key={index}>{s}</li>
                ))
              ) : (
                <li>Maintain current performance </li>
              )}
            </ul>
          </div>

          <button
            className="pred-btn-outline"
            onClick={() => {
              setShowResult(false);
              setPrediction(null);
            }}
          >
            Reset Form
          </button>

        </div>
      )}

    </div>
  );
};

export default Predict;
