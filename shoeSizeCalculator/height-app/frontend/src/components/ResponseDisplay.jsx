import React from 'react';
import './ResponseDisplay.css';

const ResponseDisplay = ({ height, message }) => {
  return (
    <div className="response-display">
      <div className="response-header">
        <span className="response-icon">✓</span>
        <h3 className="response-title">Success!</h3>
      </div>
      <div className="response-content">
        <div className="response-item">
          <span className="response-label">Height:</span>
          <span className="response-value">{height} cm</span>
        </div>
        <div className="response-item">
          <span className="response-label">Message:</span>
          <span className="response-value">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;