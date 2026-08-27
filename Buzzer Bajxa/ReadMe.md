# ESP32 Buzzer Controller - README

## 🎵 Remote Buzzer Control System

A real-time IoT system that allows remote control of a passive buzzer connected to an ESP32 via HTTP API. The system uses FastAPI as the backend server, enabling wireless sound effect playback through WiFi communication. Currently uses Postman/API testing tools for control, with the option to add a React frontend for a more user-friendly interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Sound Effects Library](#sound-effects-library)
- [Tech Stack](#tech-stack)
- [Hardware Requirements](#hardware-requirements)
- [Installation & Setup](#installation--setup)
  - [Backend Setup (FastAPI)](#backend-setup-fastapi)
  - [ESP32 Setup](#esp32-setup)
  - [Frontend Setup (Optional)](#frontend-setup-optional)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

This project enables wireless control of a passive buzzer using an ESP32 microcontroller. The system communicates over HTTP with a FastAPI backend server, allowing users to trigger various sound effects remotely. It's perfect for IoT projects, interactive installations, or adding audio feedback to applications.

---

## ✨ Features

- **10 Built-in Sound Effects**: Pre-programmed sound patterns including:
  - Coin/reward sound
  - Level up jingle
  - Error/fail sound
  - Laser gun
  - UFO/alien sounds
  - Police siren
  - Explosion effect
  - Machine gun
  - Heartbeat
  - Arcade random effects

- **Remote Control via HTTP API**: Trigger sounds from anywhere on the network
- **Real-time Communication**: ESP32 polls the server every 5 seconds for new commands
- **WiFi Connectivity**: No wires needed for control
- **Volume Control**: Configurable volume level (50% default)
- **Scalable Architecture**: Easy to extend with new sound effects or API endpoints

---

## 🎵 Sound Effects Library

| Command ID | Sound Effect | Description |
|------------|--------------|-------------|
| 0 | Arcade | Random arcade-style sound effects |
| 1 | Laser | Descending frequency laser sound |
| 2 | Coin | Two-tone reward/coin collection sound |
| 3 | Machine Gun | Rapid repetitive beeps |
| -1 | No Effect | No valid command received |

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Python web framework for API development
- **Uvicorn** - ASGI server for running FastAPI

### Hardware
- **ESP32** - Microcontroller with WiFi capability
- **Passive Buzzer** - Output sound device

### Software/Libraries (ESP32)
- **WiFi.h** - WiFi connectivity
- **HTTPClient.h** - HTTP requests
- **ArduinoJson.h** - JSON parsing

### Frontend (Optional)
- **React** - For creating a user interface (can be added with CORS handling)

---

## 🔧 Hardware Requirements

- **ESP32 Development Board**
- **Passive Buzzer** (connected to pin 4)
- **USB Cable** for power/programming
- **Jumper Wires**
- **WiFi Network** for communication

### Connection Diagram
```
ESP32 Pin 4  ──► Buzzer (+) 
GND Pin      ──► Buzzer (-)
```

---

## 📦 Installation & Setup

### Backend Setup (FastAPI)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/esp32-buzzer-controller.git
cd esp32-buzzer-controller/backend
```

2. **Create and activate virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install fastapi uvicorn
```

4. **Create `main.py`**
```python
from fastapi import FastAPI

app = FastAPI()
buzzno = 0

@app.post("/buzzer/{buzznumber}")
def set_buzzer_number(buzznumber: int):
    global buzzno
    buzzno = buzznumber
    return {"status": "success", "buzzer_number": buzzno}

@app.get("/on")
def get_status():
    return {"message": f"{buzzno}"}
```

5. **Run the server**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be available at: `http://192.168.1.149:8000`

---

### ESP32 Setup

1. **Install Arduino IDE** (or PlatformIO)
2. **Install required libraries**:
   - WiFi
   - HTTPClient
   - ArduinoJson (by Benoit Blanchon)

3. **Upload the code**:
   - Open the provided `.txt` file in Arduino IDE
   - Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
   - Update server IP:
   ```cpp
   const char* serverName = "http://YOUR_SERVER_IP:8000";
   ```
   - Select board: ESP32 Dev Module
   - Upload the code

4. **Monitor Serial Output**:
   - Open Serial Monitor (115200 baud)
   - Verify WiFi connection and command polling

---

### Frontend Setup (Optional)

If you want to add a React frontend:

1. **Create React app**
```bash
npx create-react-app buzzer-frontend
cd buzzer-frontend
```

2. **Install dependencies**
```bash
npm install axios
```

3. **Enable CORS in FastAPI backend**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. **Create a simple React component** (example):
```jsx
import axios from 'axios';

const API_URL = 'http://192.168.1.149:8000';

function BuzzerControl() {
  const playSound = async (soundId) => {
    try {
      await axios.post(`${API_URL}/buzzer/${soundId}`);
      console.log(`Playing sound: ${soundId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={() => playSound(0)}>Arcade</button>
      <button onClick={() => playSound(1)}>Laser</button>
      <button onClick={() => playSound(2)}>Coin</button>
      <button onClick={() => playSound(3)}>Machine Gun</button>
    </div>
  );
}
```

---

## 📡 API Documentation

### Set Buzzer Sound
**POST** `/buzzer/{buzznumber}`

Sets the sound effect to play.

**Parameters:**
- `buzznumber` (int) - Sound effect ID (0-3)

**Response:**
```json
{
  "status": "success",
  "buzzer_number": 2
}
```

### Get Current Sound Status
**GET** `/on`

Returns the currently selected sound ID.

**Response:**
```json
{
  "message": "2"
}
```

---

## 🚀 Usage Guide

### Quick Start

1. **Power up the ESP32** - It will automatically connect to WiFi
2. **Start the FastAPI server** - Run `uvicorn main:app --host 0.0.0.0 --port 8000`
3. **Control via API** - Use curl, Postman, or create a frontend

### Testing with curl

```bash
# Play arcade sound
curl -X POST http://192.168.1.149:8000/buzzer/0

# Play laser sound
curl -X POST http://192.168.1.149:8000/buzzer/1

# Play coin sound
curl -X POST http://192.168.1.149:8000/buzzer/2

# Play machine gun sound
curl -X POST http://192.168.1.149:8000/buzzer/3

# Check current sound
curl http://192.168.1.149:8000/on
```

### Testing with Postman

1. Set method to POST
2. URL: `http://192.168.1.149:8000/buzzer/0`
3. Send request
4. ESP32 will play the sound within 5 seconds

---

## ⚙️ Configuration

### ESP32 Settings

```cpp
#define BUZZER 4        // GPIO pin for buzzer (change if needed)
#define VOLUME 250      // Volume level (0-255, 250 = ~98%)

// WiFi Credentials
const char* ssid = "Your WiFi Name";
const char* password = "Your WiFi Password";

// Server URL (change to your server's IP)
const char* serverName = "http://192.168.1.149:8000";
```

### Polling Interval
```cpp
if (millis() - lastCheck > 5000) {  // Check every 5 seconds
    // Code to check for commands
}
```

### Adding New Sound Effects

Add your own sound function:

```cpp
void myCustomSound() {
    // Define your sound pattern
    tonePlay(frequency, duration);
    // ...
    soundOff();
}

// Add to command mapping in loop():
else if(x==4) {
    myCustomSound();
}
```

---

## 📁 Project Structure

```
esp32-buzzer-controller/
├── backend/
│   └── main.py                 # FastAPI server
├── esp32/
│   └── buzzer_controller.ino   # ESP32 code
├── frontend/ (optional)
│   ├── src/
│   │   ├── App.js
│   │   └── BuzzerControl.jsx
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Ways to Contribute
- Add new sound effects
- Improve API error handling
- Create a React frontend
- Add authentication/security features
- Write documentation
- Report bugs

---

---

## 📈 Roadmap

- [ ] Add more sound effects
- [ ] Create React frontend with sound selector UI
- [ ] Add WebSocket support for real-time control
- [ ] Implement sound scheduling
- [ ] Add authentication for security
- [ ] Support for multiple buzzers
- [ ] Mobile app integration

---

**Happy Building! 🚀**