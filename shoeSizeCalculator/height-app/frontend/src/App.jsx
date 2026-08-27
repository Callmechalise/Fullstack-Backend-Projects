import React, { useState } from 'react';
import './App.css';
import HeightForm from './components/HeightForm';
import ResponseDisplay from './components/ResponseDisplay';

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (height) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiUrl = 'http://localhost:8000/height';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ height: parseFloat(height) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send height');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'An error occurred while sending the height');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="card">
          <h1 className="title">Height Input Application</h1>
          <p className="subtitle">Enter your height in centimeters</p>
          
          <HeightForm onSubmit={handleSubmit} loading={loading} />
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          {response && (
            <ResponseDisplay 
              height={response.height} 
              message={response.message} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;