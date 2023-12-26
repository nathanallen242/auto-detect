import os
from dotenv import load_dotenv
import requests
import sys

load_dotenv()

url = os.getenv("RAPIDAPI_URL")

# Get the prediction string from the command line arguments
prediction_string = sys.argv[1]

# Split the prediction string into words
words = prediction_string.split()

# Assign the make from the first word
make = words[0]

# Assign the year from the last word
year = words[-1]

# Assign the model from all words between the first and last
model = " ".join(words[1:-1])

querystring = {"make": make, "model": model, "year": year}

headers = {
    "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
    "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST")
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())