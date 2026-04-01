import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/FacultyStudentDetail.css';

/**
 * FacultyStudentDetail
 * Shows a student's full profile + all prediction records.
 * Faculty can update or delete each prediction.
 */


/**
 * FacultyStudentDetail
 * Full student profile + all prediction records.
 * Faculty can edit or delete each prediction.
 */

/**
 * FacultyStudentDetail
 *
 * Fixes applied:
 * 1. Edit prediction → backend re-runs Python AI model → new prediction/riskScore shown
 * 2. Delete prediction → calls DELETE /api/faculty/predictions/:id correctly
 * 3. After update, card re-renders with fresh AI result live
 */
const FacultyStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facultyToken = localStorage.getItem('facultyToken');

  const [student, setStudent] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${facultyToken}` },
  });

  useEffect(() => {
    if (!facultyToken) { navigate('/login'); return; }
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/faculty/students/${id}`);
      setStudent(res.data.student);
      setPredictions(res.data.predictions || []);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Student not found in your department');
        navigate('/faculty/dashboard');
      } else {
        toast.error('Failed to load student');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Edit handlers ──────────────────────────────────────────────────────────
  const startEdit = (pred) => {
    setEditId(pred._id);
    setEditForm({
      subject: pred.subject,
      attendance: pred.attendance,
      internalMarks: pred.internalMarks,
      assignmentMarks: pred.assignmentMarks,
      studyHours: pred.studyHours,
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  const handleEditChange = (e) =>
    setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveEdit = async (predId) => {
    try {
      setSaving(true);
      // Backend will re-run Python AI model and return updated prediction
      const res = await api.put(`/api/faculty/predictions/${predId}`, {
        subject: editForm.subject,
        attendance: Number(editForm.attendance),
        internalMarks: Number(editForm.internalMarks),
        assignmentMarks: Number(editForm.assignmentMarks),
        studyHours: Number(editForm.studyHours),
      });

      if (res.data.success) {
        // Replace old prediction with updated one (includes new AI result)
        setPredictions((prev) =>
          prev.map((p) => (p._id === predId ? res.data.prediction : p))
        );
        setEditId(null);
        setEditForm({});
        toast.success('Prediction updated with new AI result!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  const deletePred = async (predId) => {
    if (!window.confirm('Delete this prediction record from database?')) return;
    try {
      setDeletingId(predId);
      // Calls DELETE /api/faculty/predictions/:id
      const res = await api.delete(`/api/faculty/predictions/${predId}`);
      if (res.data.success) {
        // Remove from local state immediately
        setPredictions((prev) => prev.filter((p) => p._id !== predId));
        toast.success('Prediction deleted successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const riskColor = (score) => {
    if (score >= 70) return '#ef4444';
    if (score >= 40) return '#f59e0b';
    return '#10b981';
  };

  const predColor = (p = '') => {
    const lower = p.toLowerCase();
    if (lower.includes('excellent')) return '#10b981';
    if (lower.includes('good')) return '#3b82f6';
    if (lower.includes('average')) return '#f59e0b';
    if (lower.includes('risk') || lower.includes('fail') || lower.includes('improvement')) return '#ef4444';
    return '#6b7280';
  };

  const initials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="fsd-page">
      <div className="fsd-loader"><div className="fac-spinner" /><p>Loading student...</p></div>
    </div>
  );

  if (!student) return null;

  return (
    <div className="fsd-page">
      <button className="fsd-back" onClick={() => navigate('/faculty/dashboard')}>
        ← Back to Dashboard
      </button>

      {/* ── Student Profile Card ── */}
      <div className="fsd-profile">
        <div className="fsd-big-avatar">{initials(student.name)}</div>
        <div className="fsd-profile-body">
          <h2>{student.name}</h2>
          <div className="fsd-info-grid">
            <div><span className="info-label">Email</span><span>{student.email}</span></div>
            <div><span className="info-label">Enrollment</span><span>{student.enrollmentNo}</span></div>
            <div><span className="info-label">Department</span><span>{student.department}</span></div>
            <div><span className="info-label">Semester</span><span>{student.semester}</span></div>
            {student.mobile && <div><span className="info-label">Mobile</span><span>{student.mobile}</span></div>}
            {student.bio && (
              <div className="fsd-full"><span className="info-label">Bio</span><span>{student.bio}</span></div>
            )}
          </div>
        </div>
      </div>

      {/* ── Prediction Records ── */}
      <div className="fsd-preds-section">
        <h3>
          Prediction Records
          <span className="pred-badge">{predictions.length}</span>
        </h3>

        {predictions.length === 0 ? (
          <div className="fsd-no-preds">
            <span>📊</span>
            <p>No prediction records yet for this student.</p>
          </div>
        ) : (
          predictions.map((pred) => (
            <div key={pred._id} className="fsd-pred-card">

              {/* ── EDIT MODE ── */}
              {editId === pred._id ? (
                <div className="fsd-edit-form">
                  <h4>✏️ Editing — {pred.subject}</h4>
                  <p className="fsd-edit-note">
                    After saving, the AI model will automatically re-run and update the prediction result.
                  </p>
                  <div className="fsd-edit-grid">
                    <div className="fsd-ef-group">
                      <label>Subject</label>
                      <input name="subject" value={editForm.subject} onChange={handleEditChange} />
                    </div>
                    <div className="fsd-ef-group">
                      <label>Attendance (%)</label>
                      <input type="number" name="attendance" min="0" max="100"
                        value={editForm.attendance} onChange={handleEditChange} />
                    </div>
                    <div className="fsd-ef-group">
                      <label>Internal Marks</label>
                      <input type="number" name="internalMarks" min="0"
                        value={editForm.internalMarks} onChange={handleEditChange} />
                    </div>
                    <div className="fsd-ef-group">
                      <label>Assignment Marks</label>
                      <input type="number" name="assignmentMarks" min="0"
                        value={editForm.assignmentMarks} onChange={handleEditChange} />
                    </div>
                    <div className="fsd-ef-group">
                      <label>Study Hours / Day</label>
                      <input type="number" name="studyHours" min="0" step="0.5"
                        value={editForm.studyHours} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="fsd-edit-actions">
                    <button className="fsd-btn-cancel" onClick={cancelEdit}>Cancel</button>
                    <button
                      className="fsd-btn-save"
                      onClick={() => saveEdit(pred._id)}
                      disabled={saving}
                    >
                      {saving ? '⏳ Running AI...' : '✅ Save & Re-run AI'}
                    </button>
                  </div>
                </div>

              ) : (
                /* ── VIEW MODE ── */
                <>
                  {/* Header row */}
                  <div className="fsd-pred-header">
                    <span className="fsd-pred-subject">{pred.subject}</span>
                    <span
                      className="fsd-pred-result"
                      style={{ background: predColor(pred.prediction) }}
                    >
                      {pred.prediction || 'N/A'}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="fsd-pred-metrics">
                    <div className="fsd-metric">
                      <span className="m-label">Attendance</span>
                      <span className="m-value">{pred.attendance}%</span>
                    </div>
                    <div className="fsd-metric">
                      <span className="m-label">Internal</span>
                      <span className="m-value">{pred.internalMarks}</span>
                    </div>
                    <div className="fsd-metric">
                      <span className="m-label">Assignment</span>
                      <span className="m-value">{pred.assignmentMarks}</span>
                    </div>
                    <div className="fsd-metric">
                      <span className="m-label">Study Hrs</span>
                      <span className="m-value">{pred.studyHours}</span>
                    </div>
                    {pred.riskScore !== undefined && (
                      <div className="fsd-metric">
                        <span className="m-label">Risk Score</span>
                        <span className="m-value" style={{ color: riskColor(pred.riskScore) }}>
                          {pred.riskScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Weak Areas */}
                  {pred.weakAreas?.length > 0 && (
                    <div className="fsd-tags">
                      <span className="tags-title">⚠️ Weak Areas: </span>
                      {pred.weakAreas.map((a, i) => (
                        <span key={i} className="weak-tag">{a}</span>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {pred.suggestions?.length > 0 && (
                    <div className="fsd-suggestions">
                      <span className="tags-title">💡 Suggestions:</span>
                      <ul>
                        {pred.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Footer: date + action buttons */}
                  <div className="fsd-pred-footer">
                    <span className="fsd-date">
                      {new Date(pred.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    <div className="fsd-pred-actions">
                      <button
                        className="fsd-btn-edit"
                        onClick={() => startEdit(pred)}
                      >
                        Edit
                      </button>
                      <button
                        className="fsd-btn-delete"
                        onClick={() => deletePred(pred._id)}
                        disabled={deletingId === pred._id}
                      >
                        {deletingId === pred._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyStudentDetail;


