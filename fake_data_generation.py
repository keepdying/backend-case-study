import uuid
import random
from datetime import datetime, timedelta
import requests

def generate_event_log(session_id, user_id):
    event_name = "click"
    page = "main"
    country = "TR"
    region = "Marmara"
    city = "Istanbul"
    event_time = int(datetime(2023,7,random.randrange(1,31),random.randrange(1,24),random.randrange(0,60),random.randrange(1,60)).timestamp())

    event_logs = []
    for _ in range(2):
        event_logs.append({
            "type": "event",
            "session_id": session_id,
            "event_name": event_name,
            "event_time": event_time,
            "page": page,
            "country": country,
            "region": region,
            "city": city,
            "user_id": user_id
        })
        event_time += random.randrange(1, 60)

    return event_logs

def generate_random_data(num_users):
    random_data = []
    for i in range(num_users):
        session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        random_data.extend(generate_event_log(session_id, user_id))

    return random_data

def send_data_to_api(event_logs):
    api_endpoint = "http://localhost:3000/analytics/event"
    for log in event_logs:
        response = requests.post(api_endpoint, json=log)
        print("Sent Log:", log)
        print("API Response:", response.status_code, response.text)

if __name__ == "__main__":
    num_users = 20
    event_logs = generate_random_data(num_users)

    send_data_to_api(event_logs)
