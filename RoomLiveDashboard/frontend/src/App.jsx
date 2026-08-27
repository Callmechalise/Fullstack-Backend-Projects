import React, { useEffect, useState } from "react";

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/data");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(data);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Failed to parse sensor data", e);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
      setIsConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // Helper to safely format values
  const formatValue = (value) => {
    if (value === undefined || value === null || value === "raw") return "—";
    return typeof value === 'number' ? value.toFixed(1) : value;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Header */}
        <div className="header">
          <h2>
            <span className="live-icon">●</span> Live Sensor Data
          </h2>
          <div className={`connection-badge ${isConnected ? "connected" : "disconnected"}`}>
            {isConnected ? "● Connected" : "○ Disconnected"}
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="sensor-grid">
          {/* Temperature Card */}
          <div className="sensor-card temperature">
            <div className="sensor-icon">🌡️</div>
            <div className="sensor-label">Temperature</div>
            <div className="sensor-value-wrapper">
              <div className="sensor-value">
                {sensorData ? formatValue(sensorData.temperature) : "—"}
                <span className="sensor-unit">°C</span>
              </div>
            </div>
            <div className="sensor-trend">
              {sensorData && typeof sensorData.temperature === 'number' && 
                (sensorData.temperature > 25 ? "↑ Warm" : 
                 sensorData.temperature < 20 ? "↓ Cool" : "✓ Moderate")}
            </div>
          </div>

          {/* Humidity Card */}
          <div className="sensor-card humidity">
            <div className="sensor-icon">💧</div>
            <div className="sensor-label">Humidity</div>
            <div className="sensor-value-wrapper">
              <div className="sensor-value">
                {sensorData ? formatValue(sensorData.humidity) : "—"}
                <span className="sensor-unit">%</span>
              </div>
            </div>
            <div className="sensor-trend">
              {sensorData && typeof sensorData.humidity === 'number' && 
                (sensorData.humidity > 70 ? "↑ High" : 
                 sensorData.humidity < 40 ? "↓ Low" : "✓ Normal")}
            </div>
          </div>

          {/* Heart Rate Card */}
          <div className="sensor-card heart-rate">
            <div className="sensor-icon">❤️</div>
            <div className="sensor-label">Heart Rate</div>
            <div className="sensor-value-wrapper">
              <div className="sensor-value">
                {sensorData ? formatValue(sensorData.heart_rate) : "—"}
                <span className="sensor-unit">BPM</span>
              </div>
            </div>
            <div className="sensor-trend">
              {sensorData && typeof sensorData.heart_rate === 'number' && 
                (sensorData.heart_rate > 90 ? "↑ Elevated" : 
                 sensorData.heart_rate < 65 ? "↓ Resting" : "✓ Normal")}
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="status-bar">
          <span>Last update: {lastUpdate || "—"}</span>
          <span className="status-separator">|</span>
          <span>WebSocket</span>
          <span className={`status-dot ${isConnected ? "active" : ""}`}></span>
        </div>
      </div>

      <style>{`
        /* ---------- reset & base ---------- */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(145deg, #0b0f1a 0%, #151e2f 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          padding: 1.5rem;
          margin: 0;
        }

        /* ---------- main container ---------- */
        .dashboard-container {
          width: 100%;
          max-width: 820px;
          animation: fadeUp 0.6s ease-out;
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ---------- card ---------- */
        .dashboard-card {
          background: rgba(20, 28, 45, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 3.5rem;
          padding: 2.5rem 3rem;
          box-shadow: 
            0 30px 60px -20px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.25s ease;
        }

        /* ---------- header ---------- */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.8rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .header h2 {
          font-weight: 500;
          font-size: 1.9rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #eef4ff, #b8ccff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .live-icon {
          color: #4cd9b2;
          font-size: 1.4rem;
          text-shadow: 0 0 12px #4cd9b288;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .connection-badge {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          padding: 0.4rem 1.2rem;
          border-radius: 60px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(4px);
          color: #7d93c7;
          transition: all 0.3s ease;
          white-space: nowrap;
          min-width: 120px;
          text-align: center;
        }

        .connection-badge.connected {
          color: #4cd9b2;
          border-color: rgba(76, 217, 178, 0.25);
          background: rgba(76, 217, 178, 0.08);
          box-shadow: 0 0 20px rgba(76, 217, 178, 0.05);
        }

        .connection-badge.disconnected {
          color: #7a6b8a;
          border-color: rgba(255, 100, 100, 0.1);
          background: rgba(255, 100, 100, 0.04);
        }

        /* ---------- sensor grid ---------- */
        .sensor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.5rem;
          margin-top: 0.4rem;
          min-height: 260px;
        }

        .sensor-card {
          background: rgba(8, 14, 26, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border-radius: 2rem;
          padding: 1.8rem 0.8rem 1.6rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.02);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5), 0 10px 24px -12px rgba(0, 0, 0, 0.7);
          transition: transform 0.2s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 220px;
          width: 100%;
          position: relative;
        }

        .sensor-card:hover {
          transform: translateY(-5px);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5), 0 18px 32px -14px #000000cc;
          border-color: rgba(255, 255, 255, 0.06);
        }

        .sensor-icon {
          font-size: 2.8rem;
          line-height: 1;
          display: block;
          margin-bottom: 0.2rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          flex-shrink: 0;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sensor-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 400;
          color: #7d93c7;
          margin-bottom: 0.5rem;
          opacity: 0.7;
          flex-shrink: 0;
          height: 20px;
          display: flex;
          align-items: center;
        }

        .sensor-value-wrapper {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 100%;
        }

        .sensor-value {
          font-size: 3.2rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f0f6ff, #c6dbff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1;
          display: inline-flex;
          align-items: baseline;
          gap: 0.2rem;
          font-variant-numeric: tabular-nums;
          min-width: 100px;
          justify-content: center;
        }

        .humidity .sensor-value {
          background: linear-gradient(135deg, #dbeafe, #9bc0ff);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .heart-rate .sensor-value {
          background: linear-gradient(135deg, #ffd6d6, #ff9a9a);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .sensor-unit {
          font-size: 1rem;
          font-weight: 300;
          color: #7d93c7;
          background: transparent;
          -webkit-background-clip: unset;
          background-clip: unset;
          color: #7d93c7;
          margin-left: 0.1rem;
          flex-shrink: 0;
        }

        .sensor-trend {
          margin-top: 0.6rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #5b74a3;
          letter-spacing: 0.3px;
          background: rgba(0, 0, 0, 0.2);
          display: inline-block;
          padding: 0.15rem 1.2rem;
          border-radius: 60px;
          border: 1px solid rgba(255, 255, 255, 0.02);
          flex-shrink: 0;
          min-height: 28px;
          min-width: 90px;
          text-align: center;
        }

        /* ---------- status bar ---------- */
        .status-bar {
          margin-top: 2.8rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.8rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #4d6fa3;
          letter-spacing: 0.4px;
          flex-wrap: wrap;
          min-height: 40px;
        }

        .status-separator {
          opacity: 0.2;
          color: #3c5a8a;
        }

        .status-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #2a4070;
          transition: background 0.35s ease, box-shadow 0.35s ease;
          flex-shrink: 0;
        }

        .status-dot.active {
          background: #4cd9b2;
          box-shadow: 0 0 18px #4cd9b288;
        }

        /* ---------- responsive ---------- */
        @media (max-width: 768px) {
          .sensor-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.2rem;
          }
          .sensor-card {
            min-height: 200px;
          }
          .sensor-value {
            font-size: 2.8rem;
            min-width: 80px;
          }
        }

        @media (max-width: 600px) {
          .dashboard-card {
            padding: 2rem 1.5rem;
            border-radius: 2.5rem;
          }
          .sensor-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .header h2 {
            font-size: 1.5rem;
          }
          .sensor-value {
            font-size: 2.8rem;
            min-width: 70px;
          }
          .connection-badge {
            font-size: 0.6rem;
            padding: 0.3rem 0.9rem;
            min-width: 100px;
          }
          .sensor-card {
            min-height: 180px;
            padding: 1.5rem 0.5rem;
          }
        }

        @media (max-width: 400px) {
          .dashboard-card {
            padding: 1.5rem 1rem;
          }
          .sensor-value {
            font-size: 2.2rem;
            min-width: 60px;
          }
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .connection-badge {
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;