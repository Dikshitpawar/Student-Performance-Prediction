import { useState } from 'react';
import '../styles/FacultyStudentDetail.css';

/**
 * FacultyEditPrediction
 * Modal form to update a prediction's input fields.
 * Note: AI prediction result itself is NOT re-run here (faculty edits raw data only).
 */
const FacultyEditPrediction = ({ prediction, axiosAuth, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    subject: prediction.subject || '',
    attendance: prediction.attendance ?? '',
    internalMarks: prediction.internalMarks ?? '',
    assignmentMarks: prediction.assignmentMarks ?? '',
    studyHours: prediction.studyHours ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await axiosAuth.put(`/api/faculty/predictions/${prediction._id}`, {
        subject: form.subject,
        attendance: Number(form.attendance),
        internalMarks: Number(form.internalMarks),
        assignmentMarks: Number(form.assignmentMarks),
        studyHours: Number(form.studyHours),
      });
      if (res.data.success) {
        onSuccess(res.data.prediction);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div className="fep-backdrop" onClick={onCancel}>
      <div className="fep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fep-modal-header">
          <h3>Edit Prediction</h3>
          <button className="fep-close" onClick={onCancel}>✕</button>
        </div>

        {error && <div className="fep-error">{error}</div>}

        <form onSubmit={handleSubmit} className="fep-form">
          <div className="fep-form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fep-form-row">
            <div className="fep-form-group">
              <label>Attendance (%)</label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                value={form.attendance}
                onChange={handleChange}
                required
              />
            </div>
            <div className="fep-form-group">
              <label>Internal Marks</label>
              <input
                type="number"
                name="internalMarks"
                min="0"
                value={form.internalMarks}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fep-form-row">
            <div className="fep-form-group">
              <label>Assignment Marks</label>
              <input
                type="number"
                name="assignmentMarks"
                min="0"
                value={form.assignmentMarks}
                onChange={handleChange}
                required
              />
            </div>
            <div className="fep-form-group">
              <label>Study Hours/Day</label>
              <input
                type="number"
                name="studyHours"
                min="0"
                step="0.5"
                value={form.studyHours}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fep-modal-actions">
            <button type="button" className="fac-btn-outline-sm" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="fac-btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyEditPrediction;
