import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import StatsCard from './StatsCard';
import FilterPanel from './FilterPanel';
import StudentCard from './StudentCard';
import DepartmentOverview from './DepartmentOverview';
import SemesterOverview from './SemesterOverview';
import StudentDetailModal from './StudentDetailModal';
import ExportButton from './ExportButton';
import { facultyAPI } from '../../services/api';
import { debounce } from '../../utils/helpers';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState(null);
  const [semesterStats, setSemesterStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPredictions, setStudentPredictions] = useState([]);
  const [showOverviews, setShowOverviews] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    department: 'all',
    semester: 'all',
    performance: 'all',
    search: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load students when filters change
  useEffect(() => {
    loadStudents();
  }, [filters, pagination.page]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all stats in parallel
      const [statsRes, deptRes, semRes] = await Promise.all([
        facultyAPI.getDashboardStats(),
        facultyAPI.getDepartmentStats(),
        facultyAPI.getSemesterStats()
      ]);

      setStats(statsRes.data.stats);
      setDepartmentStats(deptRes.data.stats);
      setSemesterStats(semRes.data.stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await facultyAPI.getStudents(params);
      
      setStudents(response.data.students);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = debounce((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 500);

  const handleResetFilters = () => {
    setFilters({
      department: 'all',
      semester: 'all',
      performance: 'all',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    
    try {
      const response = await facultyAPI.getStudentHistory(student._id);
      setStudentPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Failed to load student history:', error);
      setStudentPredictions([]);
    }
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setStudentPredictions([]);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner fullScreen message="Loading Faculty Dashboard..." />
      </>
    );
  }

  return (
    <div className="faculty-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="dashboard-title">Faculty Dashboard</h1>
              <p className="dashboard-subtitle">
                Monitor and analyze student performance across all departments
              </p>
            </div>
            <div className="header-actions">
              <ExportButton filters={filters} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stats-grid">
            <StatsCard
              title="Total Students"
              value={stats?.total || 0}
              icon={Users}
              color="blue"
              subtitle="Across all departments"
            />
            <StatsCard
              title="Excellent Performance"
              value={stats?.excellent || 0}
              icon={TrendingUp}
              color="green"
              subtitle={`${stats?.total > 0 ? ((stats.excellent / stats.total) * 100).toFixed(0) : 0}% of students`}
            />
            <StatsCard
              title="Need Support"
              value={stats?.average || 0}
              icon={Target}
              color="yellow"
              subtitle="Average performers"
            />
            <StatsCard
              title="At Risk"
              value={stats?.atRisk || 0}
              icon={AlertTriangle}
              color="red"
              subtitle="Require immediate attention"
            />
          </div>

          {/* Additional Metrics */}
          <div className="additional-metrics">
            <div className="metric-card">
              <div className="metric-icon-wrapper metric-purple">
                <BarChart3 size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Average Attendance</span>
                <span className="metric-value">{stats?.avgAttendance || 0}%</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon-wrapper metric-indigo">
                <TrendingUp size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Average Marks</span>
                <span className="metric-value">{stats?.avgMarks || 0}/100</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon-wrapper metric-green">
                <Target size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Success Rate</span>
                <span className="metric-value">
                  {stats?.total > 0 ? (((stats.excellent + stats.good) / stats.total) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Overview Button */}
        <div className="overview-toggle">
          <button 
            onClick={() => setShowOverviews(!showOverviews)}
            className="toggle-btn"
          >
            {showOverviews ? 'Hide' : 'Show'} Department & Semester Overview
          </button>
        </div>

        {/* Department & Semester Overview */}
        {showOverviews && (
          <div className="overview-section">
            <DepartmentOverview stats={departmentStats} />
            <SemesterOverview stats={semesterStats} />
          </div>
        )}

        {/* Students Section */}
        <div className="students-section">
          <div className="section-header">
            <h2 className="section-title">All Students</h2>
            <p className="section-subtitle">
              Showing {students.length} of {pagination.total} students
            </p>
          </div>

          <div className="students-layout">
            {/* Filter Panel */}
            <div className="filter-sidebar">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onReset={handleResetFilters}
              />
            </div>

            {/* Students Grid */}
            <div className="students-content">
              {students.length > 0 ? (
                <>
                  <div className="students-grid">
                    {students.map(student => (
                      <StudentCard
                        key={student._id}
                        student={student}
                        onClick={handleStudentClick}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      
                      <div className="pagination-info">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <Users className="empty-icon" size={64} />
                  <h3 className="empty-title">No students found</h3>
                  <p className="empty-subtitle">
                    Try adjusting your filters or search criteria
                  </p>
                  <button onClick={handleResetFilters} className="reset-filters-btn">
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          predictions={studentPredictions}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;