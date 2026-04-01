import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../src/styles/AdminAuth.css';

/**
 * AdminLogin
 * Admin authenticates here. Token stored in localStorage as "adminToken".
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/admin/login', form);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(res.data.admin));
        toast.success('Welcome, Admin!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-icon">🛡️</div>
        <h2>Admin Login</h2>
        <p className="admin-auth-subtitle">Student Performance Prediction System</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@smartpredict.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
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

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
