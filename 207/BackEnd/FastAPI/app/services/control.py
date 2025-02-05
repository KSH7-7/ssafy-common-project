# 라즈베리파이와 통신 관련 로직
import requests
import httpx


def send_public_data(data):
    raspberry_url = "https://normally-amazed-terrapin.ngrok-free.app/rasp"
    response = requests.post(raspberry_url, json=data)
    return response.json()