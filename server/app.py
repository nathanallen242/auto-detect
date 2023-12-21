from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import os

# Initialize Flask App
app = Flask(__name__)
cors = CORS(app)

# Load the trained model
model_dir = os.path.join(os.path.dirname(__file__), 'model')
model_file = 'full_model.pth'
model_path = os.path.join(model_dir, model_file)

# Load the model
model = torch.load(model_path, map_location=torch.device('cpu'))
model.eval()

# Define image transformations
loader = transforms.Compose([
    transforms.Resize((400, 400)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

def transform_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    return loader(image).unsqueeze(0)

# Load class names
with open('output.txt', 'r') as f:
    lines = f.readlines()

classes = {}
for line in lines:
    name, idx = line.strip().split(': ')
    classes[int(idx)] = name


# Endpoint for the home page
@app.route('/')
def index():
    return render_template('index.html')


# Endpoint for image upload and model inference
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Ensure there is an image in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['file']

        # If the user does not select a file
        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file:
            image_bytes = file.read()
            image = transform_image(image_bytes=image_bytes)
            outputs = model(image)
            _, predicted = torch.max(outputs.data, 1)
            prediction = classes[predicted.item()]

            return jsonify({'prediction': prediction})


# Testing function
def test():
    # Define the path to the test image within the model directory
    test_image_path = os.path.join(os.path.dirname(__file__), 'model', 'test_images', 'coupe.jpeg')

    # Create a test client using the Flask application configured for testing
    with app.test_client() as c:
        # Open the image file in binary mode
        with open(test_image_path, 'rb') as f:
            # Send a POST request to the /predict endpoint
            response = c.post('/predict', data={'file': f})

        # Check the status code of the response
        assert response.status_code == 200

        # Check the JSON response
        data = response.get_json()
        assert 'prediction' in data

        # Print the prediction
        print('Prediction for the test image:', data['prediction'])

# Run the server
if __name__ == '__main__':
    # test()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')