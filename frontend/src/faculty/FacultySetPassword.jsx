import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/FacultyAuth.css';

/**
 * FacultySetPassword
 * Faculty lands here via the email link: /faculty/set-password?token=xxx
 * Verifies token first, then allows password setup.
 */
const FacultySetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState('verifying'); // verifying | form | done | invalid
  const [facultyName, setFacultyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // Verify the token on mount
  useEffect(() => {
    if (!token) {
      setStep('invalid');
      return;
    }
    axios
      .get(`http://localhost:3000/api/faculty/verify-token?token=${token}`)
      .then((res) => {
        if (res.data.success) {
          setFacultyName(res.data.name);
          setStep('form');
        } else {
          setStep('invalid');
        }
      })
      .catch(() => setStep('invalid'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/faculty/set-password', {
        token,
        password,
      });
      if (res.data.success) {
        toast.success('Password set! You can now login.');
        setStep('done');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verifying') {
    return (
      <div className="faculty-auth-wrapper">
        <div className="faculty-auth-card">
          <div className="faculty-auth-icon">⏳</div>
          <h2>Verifying link...</h2>
        </div>
      </div>
    );
  }

  if (step === 'invalid') {
    return (
      <div className="faculty-auth-wrapper">
        <div className="faculty-auth-card">
          <div className="faculty-auth-icon">❌</div>
          <h2>Link Expired or Invalid</h2>
          <p className="faculty-auth-subtitle">
            This set-password link is invalid or has expired. Please contact your admin to resend the
            email.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="faculty-auth-wrapper">
        <div className="faculty-auth-card">
          <div className="faculty-auth-icon">✅</div>
          <h2>Password Set!</h2>
          <p className="faculty-auth-subtitle">
            Your password has been set successfully. You can now log in.
          </p>
          <button className="faculty-btn-primary" onClick={() => navigate('/faculty/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-auth-wrapper">
      <div className="faculty-auth-card">
        <div className="faculty-auth-icon">🔑</div>
        <h2>Set Your Password</h2>
        <p className="faculty-auth-subtitle">
          Welcome, <strong>{facultyName}</strong>! Please create a secure password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="faculty-form-group">
            <label>New Password (min 8 characters)</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="faculty-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="faculty-btn-primary" disabled={loading}>
            {loading ? 'Setting Password...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FacultySetPassword;
