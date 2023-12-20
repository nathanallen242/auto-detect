import joblib
import torch

def main():
    # Load the model
    model = torch.load('full_model.pth', map_location=torch.device('cpu'))

    # Save the model
    joblib.dump(model, 'model.joblib')

if __name__ == '__main__':
    main()
