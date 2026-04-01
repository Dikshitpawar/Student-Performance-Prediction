import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
    xl: 'spinner-xl'
  };

  const spinner = (
    <div className="spinner-wrapper">
      <div className={`spinner ${sizeClasses[size]}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;