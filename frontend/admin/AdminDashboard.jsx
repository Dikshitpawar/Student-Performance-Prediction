import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../src/styles/AdminDashboard.css';


const DEPARTMENTS = ['CE', 'IT', 'ME', 'EE', 'Civil'];
const DESIGNATIONS = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'];

/**
 * AdminDashboard
 * - Admin adds faculty with name, email, department + sets password directly
 * - Can edit and delete faculty
 * - No email/token flow
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  const [faculty, setFaculty] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // faculty being edited
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = { name: '', email: '', department: '', designation: 'Lecturer', password: '' };
  const [form, setForm] = useState(emptyForm);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  useEffect(() => {
    if (!adminToken) { navigate('/login'); return; }
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoadingList(true);
      const res = await api.get('/api/admin/faculty');
      setFaculty(res.data.faculty || []);
    } catch {
      toast.error('Failed to load faculty list');
    } finally {
      setLoadingList(false);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setShowForm(true); };
  const openEdit = (f) => {
    setForm({ name: f.name, email: f.email, department: f.department, designation: f.designation, password: '' });
    setEditTarget(f);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department) {
      toast.error('Name, email and department are required');
      return;
    }
    if (!editTarget && !form.password) {
      toast.error('Password is required');
      return;
    }
    try {
      setSubmitting(true);
      if (editTarget) {
        // Update
        const res = await api.put(`/api/admin/faculty/${editTarget._id}`, form);
        if (res.data.success) { toast.success('Faculty updated'); closeForm(); fetchFaculty(); }
      } else {
        // Create
        const res = await api.post('/api/admin/faculty', form);
        if (res.data.success) { toast.success('Faculty added successfully'); closeForm(); fetchFaculty(); }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete faculty "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/faculty/${id}`);
      toast.success('Faculty deleted');
      fetchFaculty();
    } catch { toast.error('Delete failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  return (
    <div className="adm-dashboard">
      {/* ── Header ── */}
      <header className="adm-header">
        <div className="adm-header-left">
          <span className="adm-logo">🛡️</span>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {adminInfo.name}</p>
          </div>
        </div>
        <button className="adm-btn-danger" onClick={handleLogout}>Logout</button>
      </header>

      {/* ── Stats ── */}
      <div className="adm-stats">
        <div className="adm-stat-card">
          <span className="adm-stat-num">{faculty.length}</span>
          <span className="adm-stat-label">Total Faculty</span>
        </div>
        {DEPARTMENTS.map((d) => (
          <div className="adm-stat-card" key={d}>
            <span className="adm-stat-num">{faculty.filter((f) => f.department === d).length}</span>
            <span className="adm-stat-label">{d} Dept</span>
          </div>
        ))}
      </div>

      {/* ── Section header ── */}
      <div className="adm-section-header">
        <h2>Faculty Members</h2>
        <button className="adm-btn-primary" onClick={openAdd}>+ Add Faculty</button>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="adm-form-card">
          <h3>{editTarget ? `Edit: ${editTarget.name}` : 'Add New Faculty'}</h3>
          <form onSubmit={handleSubmit} className="adm-form-grid">
            <div className="adm-form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Doe" required />
            </div>
            <div className="adm-form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="faculty@college.edu" required disabled={!!editTarget} />
            </div>
            <div className="adm-form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>Designation</label>
              <select name="designation" value={form.designation} onChange={handleChange}>
                {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>{editTarget ? 'New Password (leave blank to keep)' : 'Password *'}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder={editTarget ? 'Leave blank to keep current' : 'Min 6 characters'}
                required={!editTarget} minLength={6} />
            </div>
            <div className="adm-form-actions">
              <button type="button" className="adm-btn-outline" onClick={closeForm}>Cancel</button>
              <button type="submit" className="adm-btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editTarget ? 'Update Faculty' : 'Add Faculty'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Faculty Table ── */}
      {loadingList ? (
        <div className="adm-loading">Loading faculty...</div>
      ) : faculty.length === 0 ? (
        <div className="adm-empty">No faculty added yet. Click "+ Add Faculty" to get started.</div>
      ) : (
        <div className="adm-table-wrapper">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.email}</td>
                  <td><span className="dept-chip">{f.department}</span></td>
                  <td>{f.designation}</td>
                  <td>
                    <span className={`adm-badge ${f.isActive ? 'active' : 'inactive'}`}>
                      {f.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td className="adm-actions">
                    <button className="adm-btn-outline-sm" onClick={() => openEdit(f)}>Edit</button>
                    <button className="adm-btn-danger-sm" onClick={() => handleDelete(f._id, f.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;