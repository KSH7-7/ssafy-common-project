import os
import pytz
import requests
from datetime import datetime

API_URL = "https://www.google.com"

LOCAL_TIMEZONE = "Asia/Seoul"

try:
    response = requests.get(API_URL)
    response.raise_for_status() 

    server_time = response.headers.get("Date")  
    if not server_time:
        raise ValueError("Date header not found in response")

    utc_time = datetime.strptime(server_time, "%a, %d %b %Y %H:%M:%S GMT")
    utc_time = pytz.utc.localize(utc_time) 

    local_timezone = pytz.timezone(LOCAL_TIMEZONE)
    local_time = utc_time.astimezone(local_timezone)

    formatted_time = local_time.strftime("%Y-%m-%d %H:%M:%S")

    os.system("sudo date -s '{}'".format(formatted_time))

    print(formatted_time)

except requests.exceptions.RequestException as e:
    print(e)
except Exception as e:
    print(e)