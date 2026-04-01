import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/FacultyDashboard.css';

/**
 * FacultyDashboard
 * Shows students from the faculty's department only.
 * Supports filtering by semester and searching by name/email/enrollment.
 */


/**
 * FacultyDashboard
 * Shows only students from the faculty's department (CE/IT/ME/EE/Civil).
 * Filters: search by name/email/enrollment, filter by semester.
 */
const FacultyDashboard = () => {
  const navigate = useNavigate();
  const facultyToken = localStorage.getItem('facultyToken');
  const facultyInfo = JSON.parse(localStorage.getItem('facultyInfo') || '{}');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${facultyToken}` },
  });

  useEffect(() => {
    if (!facultyToken) { navigate('/login'); return; }
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (semester !== 'all') params.semester = semester;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/api/faculty/students', { params });
      setStudents(res.data.students || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load students');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce search, instant for semester change
  useEffect(() => {
    const t = setTimeout(fetchStudents, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search, semester]);

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyInfo');
    navigate('/login');
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="fac-dashboard">
      {/* ── Header ── */}
      <header className="fac-header">
        <div className="fac-header-left">
          <div className="fac-avatar-sm">{getInitials(facultyInfo.name || 'F')}</div>
          <div>
            <h1>Faculty Dashboard</h1>
            <p>{facultyInfo.name} &nbsp;·&nbsp; <span className="fac-dept-pill">{facultyInfo.department}</span> &nbsp;·&nbsp; {facultyInfo.designation}</p>
          </div>
        </div>
         <div className="fac-header-right">
          <button className="fac-btn-home" onClick={() => navigate('/')}>
            Home
          </button>

          <button className="fac-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </header>

      {/* ── Filters Bar ── */}
      <div className="fac-filters">
        <input
          className="fac-search"
          type="text"
          placeholder="🔍  Search by name, email or enrollment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="fac-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="all">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
        <span className="fac-result-count">
          {loading ? '...' : `${students.length} student${students.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="fac-dept-banner">
        Showing students from <strong>{facultyInfo.department}</strong> department only
      </div>

      {/* ── Students Grid ── */}
      {loading ? (
        <div className="fac-loading"><div className="fac-spinner" /><p>Loading students...</p></div>
      ) : students.length === 0 ? (
        <div className="fac-empty">
          <span>📭</span>
          <p>No students found{search ? ` for "${search}"` : ''}.</p>
          <small>Make sure students are registered under department: <strong>{facultyInfo.department}</strong></small>
        </div>
      ) : (
        <div className="fac-grid">
          {students.map((s) => (
            <div
              key={s._id}
              className="fac-student-card"
              onClick={() => navigate(`/faculty/students/${s._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/faculty/students/${s._id}`)}
            >
              <div className="fac-card-avatar">{getInitials(s.name)}</div>
              <div className="fac-card-info">
                <h3>{s.name}</h3>
                <p>📧 {s.email}</p>
                <p>🆔 {s.enrollmentNo}</p>
                <p>📚 Sem {s.semester} &nbsp;|&nbsp; {s.department}</p>
              </div>
              <span className="fac-card-arrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;

