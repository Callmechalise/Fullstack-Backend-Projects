# Real-Time Sensor Monitoring System

## 📋 Overview

A real-time IoT sensor monitoring system that collects environmental data (temperature, humidity) from an ESP32 microcontroller and displays it through a WebSocket-powered dashboard. The system uses FastAPI as the backend server to handle data ingestion and real-time data streaming.

---

## 🎯 Purpose

This system enables real-time monitoring of sensor data from remote ESP32 devices. It provides live data visualization through a web dashboard using WebSocket connections for instant updates. Perfect for environmental monitoring, smart home applications, or IoT prototyping projects.

---

## ✨ Features

### Hardware (ESP32)
- Reads temperature and humidity data from DHT11 sensor
- Connects to WiFi network
- Sends sensor data to backend server via HTTP POST requests
- Automatic reconnection handling

### Backend (FastAPI)
- HTTP endpoint for receiving sensor data (`/sensor`)
- WebSocket endpoint for real-time data streaming (`/data`)
- Maintains latest sensor data state
- Broadcasts updates to all connected clients every 0.5 seconds

### Dashboard
- Real-time data visualization with animated updates
- Three sensor cards: Temperature, Humidity, Heart Rate
- Live connection status indicator
- Auto-updating timestamps
- Modern glass-morphism UI design
- Fully responsive for all screen sizes

---

## 🛠️ Tech Stack

### Hardware
- **ESP32** - Microcontroller with WiFi capability
- **DHT11** - Temperature and humidity sensor

### Backend
- **FastAPI** - Python web framework
- **WebSockets** - Real-time bidirectional communication
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI framework
- **WebSocket API** - Real-time data streaming

### Software Libraries (ESP32)
- **DHT.h** - DHT sensor library
- **WiFi.h** - WiFi connectivity
- **HTTPClient.h** - HTTP requests
- **ArduinoJson.h** - JSON parsing/creation

---

## 🔧 Hardware Requirements

- **ESP32 Development Board**
- **DHT11 Temperature & Humidity Sensor**
- **USB Cable** for power/programming
- **Jumper Wires**
- **WiFi Network**

### Connection Diagram
```
DHT11 Sensor:
- VCC  ──► ESP32 3.3V
- GND  ──► ESP32 GND
- DATA ──► ESP32 Pin 15
```

---

## 📦 Installation & Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd sensor-monitoring-system/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install fastapi uvicorn
```

4. **Run the FastAPI server**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be available at: `http://192.168.1.149:8000`

---

### ESP32 Setup

1. **Install Arduino IDE** (or PlatformIO)

2. **Install required libraries**:
   - DHT sensor library (by Adafruit)
   - WiFi library (built-in)
   - HTTPClient (built-in)
   - ArduinoJson (by Benoit Blanchon)

3. **Update WiFi credentials in ESP32 code**:
```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```

4. **Update server URL**:
```cpp
const char* serverUrl = "http://YOUR_SERVER_IP:8000/sensor";
```

5. **Upload the code** to ESP32

6. **Monitor Serial Output**:
   - Open Serial Monitor (115200 baud)
   - Verify WiFi connection and data transmission

---

### Frontend Setup

1. **Create React app** (if not already):
```bash
npx create-react-app sensor-dashboard
cd sensor-dashboard
```

2. **Install dependencies** (none required beyond React)

3. **Replace `App.js`** with the provided frontend code

4. **Update WebSocket URL** in React code if needed:
```javascript
const socket = new WebSocket("ws://YOUR_SERVER_IP:8000/data");
```

5. **Start the React development server**:
```bash
npm start
```

Dashboard will be available at: `http://localhost:3000`

---

## 📡 API Endpoints

### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sensor` | Receive sensor data from ESP32 |

**Request Body:**
```json
{
  "temperature": 24.5,
  "humidity": 65.0,
  "heart_rate": 0
}
```

**Response:**
```json
{
  "status": "ok"
}
```

### WebSocket Endpoint

| Endpoint | Description |
|----------|-------------|
| `ws://localhost:8000/data` | Real-time data streaming |

**WebSocket Message Format:**
```json
{
  "temperature": 24.5,
  "humidity": 65.0,
  "heart_rate": 0
}
```

**WebSocket Behavior:**
- Server sends updates every 0.5 seconds
- Auto-reconnection on disconnect
- Broadcasts latest data to all connected clients

---

## 🚀 Usage Guide

### Starting the System

1. **Power up the ESP32** - Connects to WiFi automatically
2. **Start the FastAPI backend**:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
3. **Start the React dashboard**:
```bash
npm start
```
4. **Open dashboard** in browser: `http://localhost:3000`

### Data Flow

```
ESP32 (DHT11) 
    ↓ (HTTP POST every loop)
FastAPI Backend (/sensor)
    ↓ (stores latest data)
WebSocket Server (/data)
    ↓ (broadcasts every 0.5s)
React Dashboard (real-time updates)
```

---

## ⚙️ Configuration

### ESP32 Settings
```cpp
#define dhtpin 15          // GPIO pin for DHT11
#define dhttype DHT11      // Sensor type (DHT11 or DHT22)

const char* ssid = "Your WiFi Name";
const char* password = "Your WiFi Password";
```

### Backend Settings
```python
# WebSocket update interval (seconds)
await asyncio.sleep(0.5)  # Change as needed

# Server host and port
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Settings
```javascript
// WebSocket connection URL
const socket = new WebSocket("ws://localhost:8000/data");
// Update with your server IP if hosting remotely
```

---

## 📊 Dashboard Features

### Sensor Cards
- **Temperature** (°C) - Shows current temperature with trend indicator (Warm/Cool/Moderate)
- **Humidity** (%) - Shows humidity level with trend indicator (High/Low/Normal)
- **Heart Rate** (BPM) - Shows heart rate with trend indicator (Elevated/Resting/Normal)

### UI Components
- **Live Indicator** - Blinking green dot shows real-time updates
- **Connection Badge** - Shows WebSocket connection status (Connected/Disconnected)
- **Status Bar** - Shows last update time and connection status
- **Responsive Grid** - Adapts to mobile, tablet, and desktop screens

---

## 🔄 System Architecture

```
┌─────────────────┐
│   ESP32 Device  │
│   - DHT11       │
│   - WiFi        │
└────────┬────────┘
         │ HTTP POST (every loop)
         ▼
┌─────────────────┐
│  FastAPI Server │
│  - /sensor POST │
│  - /data WS     │
└────────┬────────┘
         │ WebSocket (0.5s interval)
         ▼
┌─────────────────┐
│  React Dashboard│
│  - Live Updates │
│  - UI Rendering │
└─────────────────┘
```

---

## 🧪 Testing

### Test Backend API
```bash
# Test POST endpoint
curl -X POST http://localhost:8000/sensor \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25.5, "humidity": 60.0, "heart_rate": 0}'

# Test WebSocket (using wscat)
npx wscat -c ws://localhost:8000/data
```

### Test ESP32
- Monitor Serial output for connection status
- Check HTTP response codes (200 = success)
- Verify data is being sent to server

---

## 🐛 Common Issues & Solutions

### ESP32 Not Connecting to WiFi
```bash
# Verify WiFi credentials
# Check if network is visible
# Try resetting ESP32
# Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
```

### WebSocket Connection Failed
```bash
# Verify server is running
curl http://localhost:8000

# Check CORS settings
# Update WebSocket URL with correct IP
# Check firewall settings
```

### No Data Showing on Dashboard
```bash
# Check ESP32 Serial Monitor for errors
# Verify POST requests are reaching server
# Check WebSocket connection status
# Ensure React app is running
```

### DHT11 Not Reading Data
```bash
# Verify wiring connections
# Check GPIO pin number in code
# Add pull-up resistor (4.7kΩ) if needed
# Try different DHT library
```

---

## 🔐 Security Considerations

- **Never** hardcode WiFi credentials in public repositories
- Use environment variables for sensitive data
- Consider adding authentication for POST endpoint
- Use HTTPS/ WSS in production
- Implement rate limiting on POST endpoint
- Validate input data on backend

---

## 🚀 Future Enhancements

- [ ] Add multiple ESP32 device support
- [ ] Implement data persistence (database)
- [ ] Add historical data chart visualization
- [ ] Set up alerts/notifications for threshold breaches
- [ ] Add user authentication
- [ ] Support for more sensor types
- [ ] Mobile app integration
- [ ] Data export functionality

---

## 📊 Performance

- **Update Frequency**: 0.5 seconds (WebSocket)
- **POST Rate**: As fast as ESP32 loop allows
- **Latency**: < 100ms typical
- **Concurrent Clients**: Limited by WebSocket server

---

## 🎨 Dashboard Screenshots

*The dashboard features:*
- Glass-morphism design with gradient backgrounds
- Animated live indicator
- Color-coded sensor cards (Temperature: blue, Humidity: cyan, Heart Rate: red)
- Responsive layout for all devices
- Real-time trend indicators

---

## 📝 Notes for Developers

### Adding New Sensors
1. Update ESP32 code to read new sensor
2. Add new field to JSON payload
3. Update backend data structure
4. Add new card to React frontend

### Modifying Update Rate
```python
# Backend: Change sleep duration
await asyncio.sleep(0.5)  # Adjust this value

# ESP32: Control loop delay
delay(100)  # Add delay in loop()
```

### Customizing Dashboard Colors
```javascript
// Temperature card (blue gradient)
background: linear-gradient(145deg, #0b0f1a 0%, #151e2f 100%);

// Humidity card (cyan accent)
.humidity .sensor-value {
  background: linear-gradient(135deg, #dbeafe, #9bc0ff);
}
```

---

**Happy Monitoring! 📊**