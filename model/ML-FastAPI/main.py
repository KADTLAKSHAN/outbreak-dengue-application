from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, ValidationError, validator
import pickle
import numpy as np
import pandas as pd

# Load the dictionary that contains the model, scaler, and encoder
with open('model/dengue_model_dict.pkl', 'rb') as file:
    model_data = pickle.load(file)

# Extract model, scaler, and encoder
model = model_data['model']
scaler = model_data['scaler']
encoder = model_data['encoder']

# FastAPI app
app = FastAPI(title="Dengue Prediction API")

# Input Model
class DengueRequest(BaseModel):
    year: int
    month: int
    week: int
    district: str
    max_temp: float
    min_temp: float
    rain: float
    wind: float
    gust: float
    weather_code: int

    # Validator to check for empty inputs
    @validator("year", "month", "week", "district", "max_temp", "min_temp", "rain", "wind", "gust", "weather_code")
    def validate_inputs(cls, value):
        if value is None or (isinstance(value, str) and not value.strip()):
            raise ValueError("Input cannot be blank")
        return value

# Preprocessing function
def preprocess_input(data: DengueRequest):
    month_log = np.log1p(data.month)
    year_log = np.log1p(data.year)
    week_log = np.log1p(data.week)

    # Scale weather features
    scaled_weather = scaler.transform([[data.max_temp, data.min_temp, data.rain, data.wind, data.gust, data.weather_code]])

    # One-hot encode the district
    district_encoded = encoder.transform([[data.district]])

    # Combine all features
    input_data = np.concatenate(([month_log, year_log, week_log], scaled_weather[0], district_encoded[0]))

    return input_data.reshape(1, -1)

# Prediction endpoint
@app.post("/predict/")
def predict_dengue(data: DengueRequest):
    try:
        input_data = preprocess_input(data)
        log_prediction = model.predict(input_data)
        prediction = round(np.expm1(log_prediction[0]))  # Inverse of log transformation
        return {"predicted_cases": prediction}
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
