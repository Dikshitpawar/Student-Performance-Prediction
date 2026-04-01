import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/FacultyAuth.css';

/**
 * FacultyLogin
 * Faculty logs in with email + password (set via email link).
 * JWT stored as "facultyToken" in localStorage.
 */
const FacultyLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('All fields required');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/faculty/login', form);
      if (res.data.success) {
        localStorage.setItem('facultyToken', res.data.token);
        localStorage.setItem('facultyInfo', JSON.stringify(res.data.faculty));
        toast.success(`Welcome, ${res.data.faculty.name}!`);
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-auth-wrapper">
      <div className="faculty-auth-card">
        <div className="faculty-auth-icon">👩‍🏫</div>
        <h2>Faculty Login</h2>
        <p className="faculty-auth-subtitle">Student Performance Prediction System</p>

        <form onSubmit={handleSubmit}>
          <div className="faculty-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="faculty@college.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="faculty-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="faculty-btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="faculty-auth-note">
          First time? Check your email for the set-password link from Admin.
        </p>
      </div>
    </div>
  );
};

export default FacultyLogin;
