import os
from dotenv import load_dotenv
import requests

load_dotenv()

def describe(prediction_string):
    url = os.getenv("RAPIDAPI_URL")

    # Split the prediction string into words
    words = prediction_string.split()

    # Assign the make from the first word
    make = words[0]

    # Assign the year from the last word
    year = words[-1]

    # Model most associated with third to last word
    model = words[1]

    querystring = {"make": make, "model": model, "year": year}

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST")
    }

    response = requests.get(url, headers=headers, params=querystring)
    json_resp = response.json()
    return json_resp[0] if json_resp else None
