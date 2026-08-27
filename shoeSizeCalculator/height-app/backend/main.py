from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml import predict
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HeightRequest(BaseModel):
    height: float

class HeightResponse(BaseModel):
    height: float
    message: str

user_height = 0

@app.get("/")
async def root():
    return {"message": "Height API is running"}

@app.post("/height", response_model=HeightResponse)
async def receive_height(request: HeightRequest):
    global user_height
    
    try:
        if request.height <= 0:
            raise HTTPException(status_code=400, detail="Height must be greater than 0")
        
        user_height = request.height
        print(f"Height updated to: {user_height}")
        footsize=predict(user_height)
        return {
            "height": request.height,
            "message": f"US-footsize is predicted to be {int(footsize)}"
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid height value")

