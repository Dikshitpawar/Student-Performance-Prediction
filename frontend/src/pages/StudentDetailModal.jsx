import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, BookOpen, TrendingUp, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getInitials, getAvatarColor, getPredictionBadge, formatDateTime } from '../../utils/helpers';
import './StudentDetailModal.css';

const StudentDetailModal = ({ student, predictions, onClose }) => {
  if (!student) return null;

  const avgMarks = ((student.internalMarks + student.assignmentMarks) / 2).toFixed(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">Student Details</h2>
            <button onClick={onClose} className="modal-close-btn">
              <X size={24} />
            </button>
          </div>

          {/* Student Profile */}
          <div className="student-profile-section">
            <div className="profile-avatar-wrapper">
              <div className={`profile-avatar ${getAvatarColor(student._id)}`}>
                {getInitials(student.name)}
              </div>
              <div className="profile-status">
                <span className={`status-badge ${getPredictionBadge(student.currentPrediction?.prediction)}`}>
                  {student.currentPrediction?.prediction || 'Not Predicted'}
                </span>
              </div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{student.name}</h3>
              <p className="profile-id">{student.studentId}</p>
              <p className="profile-dept">{student.department} • Semester {student.semester}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="info-section">
            <h4 className="section-title">
              <User size={18} />
              Contact Information
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <Mail size={16} />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{student.email}</span>
                </div>
              </div>
              <div className="info-item">
                <Phone size={16} />
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{student.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={16} />
                <div>
                  <span className="info-label">Address</span>
                  <span className="info-value">{student.address || 'N/A'}</span>
                </div>
              </div>
              <div className="info-item">
                <Calendar size={16} />
                <div>
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">
                    {student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="info-section">
            <h4 className="section-title">
              <BookOpen size={18} />
              Academic Performance
            </h4>
            <div className="performance-grid">
              <div className="performance-card perf-blue">
                <span className="perf-label">Attendance</span>
                <span className="perf-value">{student.attendance}%</span>
                <div className="perf-bar-mini">
                  <div className="perf-fill-mini" style={{ width: `${student.attendance}%` }}></div>
                </div>
              </div>
              <div className="performance-card perf-green">
                <span className="perf-label">Internal Marks</span>
                <span className="perf-value">{student.internalMarks}/100</span>
                <div className="perf-bar-mini">
                  <div className="perf-fill-mini" style={{ width: `${student.internalMarks}%` }}></div>
                </div>
              </div>
              <div className="performance-card perf-purple">
                <span className="perf-label">Assignment</span>
                <span className="perf-value">{student.assignmentMarks}/100</span>
                <div className="perf-bar-mini">
                  <div className="perf-fill-mini" style={{ width: `${student.assignmentMarks}%` }}></div>
                </div>
              </div>
              <div className="performance-card perf-orange">
                <span className="perf-label">Study Hours</span>
                <span className="perf-value">{student.studyHours}h/wk</span>
              </div>
              <div className="performance-card perf-indigo">
                <span className="perf-label">Average Marks</span>
                <span className="perf-value">{avgMarks}</span>
              </div>
            </div>
          </div>

          {/* Current Prediction */}
          {student.currentPrediction && (
            <div className="info-section">
              <h4 className="section-title">
                <Brain size={18} />
                Current AI Prediction
              </h4>
              <div className="prediction-content">
                <div className="prediction-header">
                  <TrendingUp size={20} className="prediction-icon" />
                  <span className={`prediction-status ${getPredictionBadge(student.currentPrediction.prediction)}`}>
                    {student.currentPrediction.prediction}
                  </span>
                  {student.currentPrediction.date && (
                    <span className="prediction-date">
                      <Clock size={14} />
                      {formatDateTime(student.currentPrediction.date)}
                    </span>
                  )}
                </div>

                {student.currentPrediction.reason && (
                  <div className="prediction-reason">
                    <p className="reason-title">Analysis:</p>
                    <p className="reason-text">{student.currentPrediction.reason}</p>
                  </div>
                )}

                {student.currentPrediction.weakAreas?.length > 0 && (
                  <div className="prediction-weak-areas">
                    <p className="weak-title">
                      <AlertTriangle size={16} />
                      Weak Areas:
                    </p>
                    <div className="weak-tags">
                      {student.currentPrediction.weakAreas.map((area, idx) => (
                        <span key={idx} className="weak-tag">{area}</span>
                      ))}
                    </div>
                  </div>
                )}

                {student.currentPrediction.suggestions?.length > 0 && (
                  <div className="prediction-suggestions">
                    <p className="suggestions-title">
                      <CheckCircle size={16} />
                      Suggestions:
                    </p>
                    <ul className="suggestions-list">
                      {student.currentPrediction.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="suggestion-item">
                          <CheckCircle size={14} />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prediction History */}
          {predictions && predictions.length > 0 && (
            <div className="info-section">
              <h4 className="section-title">
                <Clock size={18} />
                Prediction History ({predictions.length} records)
              </h4>
              <div className="history-timeline">
                {predictions.slice(0, 5).map((pred, idx) => (
                  <div key={pred._id} className="history-item">
                    <div className="history-dot"></div>
                    <div className="history-content">
                      <div className="history-header">
                        <span className={`history-badge ${getPredictionBadge(pred.prediction)}`}>
                          {pred.prediction}
                        </span>
                        <span className="history-date">{formatDateTime(pred.createdAt)}</span>
                      </div>
                      <div className="history-metrics">
                        <span>Attendance: {pred.attendance}%</span>
                        <span>Internal: {pred.internalMarks}</span>
                        <span>Assignment: {pred.assignmentMarks}</span>
                        <span>Study: {pred.studyHours}h</span>
                      </div>
                      {pred.reason && (
                        <p className="history-reason">{pred.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;