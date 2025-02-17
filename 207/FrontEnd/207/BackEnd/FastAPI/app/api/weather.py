from fastapi import APIRouter, HTTPException, Depends
from app.services import control
import requests

router = APIRouter()

def get_public_data():
    api_key = "92f1d3371dec42cca1370626251501"
    city = "beijing"
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
    response = requests.get(url)
    return response.json()

# 1. 모든 항목 조회
@router.get("/")
def get_data():
    public_data = get_public_data()
    result = control.send_public_data(public_data)
    return {"public_data": public_data
        , "result": result
            }