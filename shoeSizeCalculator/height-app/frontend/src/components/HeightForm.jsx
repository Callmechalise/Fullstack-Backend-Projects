import React, { useState } from 'react';
import './HeightForm.css';

const HeightForm = ({ onSubmit, loading }) => {
  const [height, setHeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!height || isNaN(height) || parseFloat(height) <= 0) {
      alert('Please enter a valid height greater than 0');
      return;
    }

    onSubmit(height);
  };

  return (
    <form className="height-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="height" className="form-label">
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          className="form-input"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter your height in centimeters"
          step="0.1"
          min="0.1"
          required
          disabled={loading}
        />
      </div>
      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Height'}
      </button>
    </form>
  );
};

export default HeightForm;