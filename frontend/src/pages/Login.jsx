import "../styles/Auth.css";
import { useForm } from "react-hook-form";
import { authContext } from "../contexts/AuthContext";
import axios from "axios"
import toast from "react-hot-toast";




import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/UnifiedLogin.css';

/**
 * UnifiedLogin
 * Single login page with 3 tabs: Student | Faculty | Admin
 * - Student: existing flow (unchanged)
 * - Faculty: JWT stored as facultyToken + facultyInfo
 * - Admin:   JWT stored as adminToken + adminInfo
 */
const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { url, setToken, setStudent } = useContext(authContext);
  const { register, handleSubmit, reset } = useForm();

  // Active tab: 'student' | 'faculty' | 'admin'
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (activeTab === 'student') {
        // ── Student login (existing logic, untouched) ─────────────────────────
        const res = await axios.post(`${url}/api/auth/login`, data, { withCredentials: true });
        if (res.data.success) {
          const token = res.data.token;
          const student = res.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('student', JSON.stringify(student));
          setToken(token);
          setStudent(JSON.stringify(student));
          toast.success('Logged in successfully!');
          navigate('/');
        }
      } else if (activeTab === 'faculty') {
        // ── Faculty login ─────────────────────────────────────────────────────
        const res = await axios.post(`${url}/api/faculty/login`, data);
        if (res.data.success) {
          localStorage.setItem('facultyToken', res.data.token);
          localStorage.setItem('facultyInfo', JSON.stringify(res.data.faculty));
          toast.success(`Welcome, ${res.data.faculty.name}!`);
          navigate('/');
        }
      } else if (activeTab === 'admin') {
        // ── Admin login ───────────────────────────────────────────────────────
        const res = await axios.post(`${url}/api/admin/login`, data);
        if (res.data.success) {
          localStorage.setItem('adminToken', res.data.token);
          localStorage.setItem('adminInfo', JSON.stringify(res.data.admin));
          toast.success('Welcome, Admin!');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Tab config
  const tabs = [
    { key: 'student', label: '🎓 Student', color: '#4f46e5' },
    { key: 'faculty', label: '👩‍🏫 Faculty', color: '#059669' },
    { key: 'admin',   label: '🛡️ Admin',   color: '#dc2626' },
  ];

  const activeColor = tabs.find((t) => t.key === activeTab)?.color || '#4f46e5';

  return (
    <div className="auth-wrapper">
      <div className="auth-card unified-login-card">

        {/* Icon */}
        <div className="icon" style={{ background: activeColor }}>
          {activeTab === 'student' ? '🔒' : activeTab === 'faculty' ? '👩‍🏫' : '🛡️'}
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Login to access your dashboard</p>

        {/* ── Role Tabs ── */}
        <div className="role-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`role-tab ${activeTab === tab.key ? 'active' : ''}`}
              style={activeTab === tab.key ? { borderBottomColor: tab.color, color: tab.color } : {}}
              onClick={() => handleTabChange(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: true })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register('password', { required: true, minLength: 6 })}
          />

          <button
            className="btn-primary full"
            style={{ background: activeColor, marginTop: '16px' }}
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : `Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </form>

        {/* Student-only: signup link */}
        {activeTab === 'student' && (
          <p className="switch-text">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')}>Sign up</span>
          </p>
        )}

        {/* Admin hint */}
        {activeTab === 'admin' && (
          <p className="login-hint">
            Admin account is created via seed script.<br />
            Default: admin@smartpredict.com
          </p>
        )}

        {/* Faculty hint */}
        {activeTab === 'faculty' && (
          <p className="login-hint">
            Use credentials set by your Admin.
          </p>
        )}
      </div>
    </div>
  );
};

export default UnifiedLogin;

