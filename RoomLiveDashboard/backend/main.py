from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

app = FastAPI()

latest_data = {
    "temperature": 0,
    "humidity": 0,
    "heart_rate": 0
}

@app.post("/sensor")
async def receive_sensor(data: dict):
    global latest_data
    latest_data = data
    return {"status": "ok"}

@app.websocket("/data")
async def websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            await websocket.send_json(latest_data)
            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        print("Disconnected")