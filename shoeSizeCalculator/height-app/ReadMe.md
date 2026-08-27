# Height to Shoe Size Predictor

## 📋 Overview

A full-stack web application that predicts US shoe size based on a person's height using machine learning. The system uses a Linear Regression model trained on height-shoe size data, with a FastAPI backend and React frontend.

---

## 🎯 Purpose

This application demonstrates how machine learning can be used to predict physical attributes (shoe size) from simple input (height). It serves as a practical example of integrating ML models with modern web technologies.

---

## ✨ Features

- **Machine Learning Prediction**: Linear Regression model trained on height vs shoe size data
- **Real-time Prediction**: Instant shoe size prediction based on height input
- **Data Validation**: Validates input to ensure height is positive
- **User-Friendly Interface**: Clean and responsive React frontend
- **Error Handling**: Graceful error messages for invalid inputs or server issues
- **CORS Support**: Cross-origin requests enabled for frontend integration

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Scikit-learn** - Machine learning library (Linear Regression)
- **Pandas** - Data processing and manipulation
- **Pydantic** - Data validation

### Frontend
- **React** - UI framework
- **CSS3** - Modern styling with animations

### Other Tools
- **Uvicorn** - ASGI server
- **Vite** - Frontend build tool (optional)

---

## 📦 Installation & Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd height-shoe-predictor/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install fastapi uvicorn pandas scikit-learn
```

4. **Prepare the data**
   - Create `data.csv` in backend directory with columns: `Height_cm`, `Shoe_Size_US`
   - Example format:
```csv
Height_cm,Shoe_Size_US
160,36
170,38
175,40
180,42
185,44
```

5. **Run the FastAPI server**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be available at: `http://localhost:8000`

---

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API URL** (if needed)
   - In `App.js`, update the API URL:
```javascript
const apiUrl = 'http://localhost:8000/height';
```

4. **Start React development server**
```bash
npm run dev
```

Dashboard will be available at: `http://localhost:5173`

---

## 📡 API Endpoints

### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check / API status |
| POST | `/height` | Send height and get shoe size prediction |

### Request Format
**POST** `/height`
```json
{
  "height": 175.5
}
```

### Response Format
```json
{
  "height": 175.5,
  "message": "US-footsize is predicted to be 42"
}
```

### Error Response
```json
{
  "detail": "Height must be greater than 0"
}
```

---

## 🤖 Machine Learning Model

### Data Preparation
- Reads CSV data with `Height_cm` and `Shoe_Size_US` columns
- Splits data into training (80%) and testing (20%) sets
- Standardizes features using `StandardScaler`

### Model Architecture
- **Algorithm**: Linear Regression
- **Input**: Height in centimeters
- **Output**: US shoe size
- **Training**: Fitted on scaled height data

### Prediction Process
1. Input height is validated
2. Height is scaled using the same scaler
3. Model predicts shoe size
4. Result is returned to the user

---

## 🚀 Usage Guide

### Starting the System

1. **Start the FastAPI backend**:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

2. **Start the React frontend**:
```bash
npm run dev
```

3. **Open the application**:
   - Navigate to `http://localhost:5173`
   - Enter your height in centimeters
   - Click submit to get your predicted shoe size

### Example Usage

1. Enter height: `175`
2. Click "Predict Shoe Size"
3. Response: "US-footsize is predicted to be 42"

---

## 🧪 Testing

### Test Backend API
```bash
# Test GET endpoint
curl http://localhost:8000/

# Test POST endpoint
curl -X POST http://localhost:8000/height \
  -H "Content-Type: application/json" \
  -d '{"height": 175.5}'
```

### Test API with Invalid Data
```bash
# Negative height (should return 400)
curl -X POST http://localhost:8000/height \
  -H "Content-Type: application/json" \
  -d '{"height": -10}'

# Zero height (should return 400)
curl -X POST http://localhost:8000/height \
  -H "Content-Type: application/json" \
  -d '{"height": 0}'
```

---

## ⚙️ Configuration

### Backend CORS Settings
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Model Parameters
```python
# Train-test split ratio
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

# Scaler for feature normalization
scaler = StandardScaler()
```

---

## 🔄 Data Flow

```
User Input (Height)
    ↓
React Frontend
    ↓ (POST request)
FastAPI Backend (/height)
    ↓ (validate height)
ML Model (predict)
    ↓ (scale, predict)
Return Prediction
    ↓
React Frontend Display
```

---

## 📁 Project Structure

```
height-shoe-predictor/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── ml.py            # ML model training & prediction
│   └── data.csv         # Training data
├── frontend/
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── App.css      # Styling
│   │   └── components/
│   │       ├── HeightForm.js    # Input form component
│   │       └── ResponseDisplay.js # Results display
│   └── package.json
└── README.md
```

---

## 🐛 Common Issues & Solutions

### Module Not Found Errors
```bash
# Install missing dependencies
pip install fastapi uvicorn pandas scikit-learn
npm install
```

### CORS Errors
```bash
# Check CORS configuration in main.py
# Ensure frontend URL matches allow_origins
# For production, add your domain to allow_origins
```

### Data File Not Found
```bash
# Ensure data.csv is in the backend directory
# Check file path in ml.py
df = pd.read_csv("./data.csv")
```

### Model Not Training
```bash
# Check data.csv format
# Ensure columns are named correctly: 'Height_cm', 'Shoe_Size_US'
# Verify data contains valid numeric values
```

---

## 🔐 Security Considerations

- **Input Validation**: Height must be positive number
- **CORS**: Restricted to specific origins
- **Error Handling**: Proper error messages without exposing internals
- **Data Validation**: Pydantic models ensure data integrity

---

## 🚀 Future Enhancements

- [ ] Add more features (age, gender) for better predictions
- [ ] Implement multiple ML models (Random Forest, Decision Tree)
- [ ] Add visualization for prediction confidence
- [ ] Save prediction history
- [ ] Add user authentication
- [ ] Export predictions as CSV
- [ ] Add comparison with actual shoe size

---

## 📊 Performance

- **API Response Time**: < 100ms
- **Model Prediction Time**: < 1ms
- **Concurrent Users**: Limited by server capacity
- **Scaling**: Can be deployed with gunicorn for production

---

## 📝 Notes for Development

### Adding New Features
1. Update `data.csv` with more training data
2. Retrain the model in `ml.py`
3. Update FastAPI endpoints as needed
4. Modify React components for new features

### Modifying Model
```python
# In ml.py, change model type
from sklearn.ensemble import RandomForestRegressor
model = RandomForestRegressor()
```

### API Changes
```python
# Add new endpoint in main.py
@app.post("/predict-batch")
async def predict_batch(heights: list[float]):
    return [predict(h) for h in heights]
```

---

**Happy Predicting! 👟**