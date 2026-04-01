import React, { useState } from 'react';
import { Download, FileSpreadsheet, Loader } from 'lucide-react';
import { facultyAPI } from '../../services/api';
import { exportToCSV } from '../../utils/helpers';
import './ExportButton.css';

const ExportButton = ({ filters }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await facultyAPI.exportStudents(filters);
      
      if (response.data.success && response.data.data) {
        exportToCSV(response.data.data, `students_export_${Date.now()}`);
      } else {
        alert('No data to export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={loading}
      className="export-button"
    >
      {loading ? (
        <>
          <Loader className="export-icon spinning" size={18} />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="export-icon" size={18} />
          <FileSpreadsheet className="export-icon-secondary" size={18} />
          <span>Export to CSV</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;