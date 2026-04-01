import React, { useEffect, useState, useContext } from "react";
import "../styles/History.css";
import axios from "axios";
import { Pencil, Trash2, CalendarDays, TrendingUp } from "lucide-react";
import { authContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const History = () => {

  const { url } = useContext(authContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);


  const token = localStorage.getItem("token");
  const student = JSON.parse(localStorage.getItem("student"));

  /* GET HISTORY */
  const getHistory = async () => {
    try {
      const res = await axios.get(`${url}/api/performance/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.data.reverse());
      setLoading(false);
    } catch {
      toast.error("Error fetching history");
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  /* DELETE */
  const handleDelete = async (id) => {
  try {
    console.log(id)
    await axios.delete(`${url}/api/performance/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted Successfully");   
    getHistory();
  } catch {
    toast.error("Delete Failed");
  }
};


  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="history-wrapper">

      <div className="history-header">
        <div className="head">
          <h2>Prediction History</h2>
          <p>
            {student?.name} |  {student?.enrollmentNo} | {student?.department} | Sem {student?.semester}
          </p>
        </div>

        <div className="header-btns">
          <span className="record">{data.length} Records</span>
          <button onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="no-records">
          <h3>No history records found.</h3>
        </div>
      ) : (
        <div className="wrapper-class">
          {data.map((item) => (
          <div className="performance-card" key={item._id}>

          {/* CARD HEADER */}
          <div className="perf-header">
  <div className="left">
    <div className="date-row">
      <CalendarDays size={16} />
      <span>{new Date(item.createdAt).toDateString()}</span>
    </div>

    <div className="status-row">
      <span className="good">{item.prediction}</span>
      <span className="improved">
        <TrendingUp size={14} /> Improved
      </span>
    </div>
  </div>

  <div className="actions">
    <Trash2 size={18} onClick={() => handleDelete(item._id)} />
  </div>
</div>

          {/* 4 BOXES */}
          <div className="analysis">
            <p>Subject</p>
            <h3>{item.subject}</h3>
          </div>
          <div className="perf-grid">
            
            <div className="box">
              <p>Attendance</p>
              <h3>{item.attendance}%</h3>
            </div>

            <div className="box">
              <p>Internal</p>
              <h3>{item.internalMarks}/100</h3>
            </div>

            <div className="box">
              <p>Assignment</p>
              <h3>{item.assignmentMarks}/100</h3>
            </div>

            <div className="box">
              <p>Study Hours</p>
              <h3>{item.studyHours}h/wk</h3>
            </div>
          </div>

          
          

          {/* WEAK + SUGGEST */}
          <div className="bottom-grid">
            <div className="weak">
              <p>Weak Areas</p>
              <span>{item.weakAreas}</span>
            </div>

            <div className="suggest">
              <p>Suggestions</p>
              <span>{item.suggestions}</span>
            </div>
          </div>

        </div>
      ))}
      </div>
      )}
    </div>
  );
};

export default History;
