from fastapi import FastAPI

app=FastAPI()

buzzno=0

@app.post("/buzzer/{buzznumber}")
def get_buzzerno(buzznumber:int):
    global buzzno
    buzzno=buzznumber

@app.get("/on")
def get_status():
    return{
        "message":f"{buzzno}"
    }