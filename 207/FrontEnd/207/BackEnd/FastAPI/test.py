import requests
import json

def get_public_data():
    api_key = "92f1d3371dec42cca1370626251501"
    city = "seoul"
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
    response = requests.get(url)
    return response.json()

print(get_public_data())