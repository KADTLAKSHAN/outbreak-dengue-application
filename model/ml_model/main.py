from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np

# Load the trained ML model using Pickle
filename = "model/dengue_case_prediction_model.pickle"
with open(filename, "rb") as file:
    model = pickle.load(file)

with open("model/columns.pickle", "rb") as file:
    feature_columns = pickle.load(file)

# FastAPI app instance
app = FastAPI(title="Dengue Prediction API")

# Input validation model
class DengueRequest(BaseModel):
    district: str
    Month: int
    Year: int
    Week: int
    AvgMaxTemp: float
    AvgMinTemp: float
    AvgApparentMaxTemp: float
    AvgApparentMinTemp: float
    TotalPrecipitation: float
    AvgWindSpeed: float
    MaxWindGusts: float
    WeatherCode: int
    Cases_Last_Week: float
    Cases_Last_2_Weeks: float
    Cases_3_Week_Avg: float
    Cases_5_Week_Avg: float
    Cases_Diff_1_Week: float

@app.post("/predict/")
def predict_dengue(data: DengueRequest):
    try:
        # Create input array
        x = np.zeros(len(feature_columns))

        # Fill numeric features
        x[0] = data.Month
        x[1] = data.Year
        x[2] = data.Week
        x[3] = data.AvgMaxTemp
        x[4] = data.AvgMinTemp
        x[5] = data.AvgApparentMaxTemp
        x[6] = data.AvgApparentMinTemp
        x[7] = data.TotalPrecipitation
        x[8] = data.AvgWindSpeed
        x[9] = data.MaxWindGusts
        x[10] = data.WeatherCode
        x[11] = data.Cases_Last_Week
        x[12] = data.Cases_Last_2_Weeks
        x[13] = data.Cases_3_Week_Avg
        x[14] = data.Cases_5_Week_Avg
        x[15] = data.Cases_Diff_1_Week

        # Handle one-hot encoding for districts
        if data.district in feature_columns:
            loc_index = feature_columns.index(data.district)
            x[loc_index] = 1  # Set the one-hot encoded column to 1

        # Predict cases
        prediction = model.predict([x])[0]

        return {"predicted_cases": prediction}

    # uvicorn main:app --host 0.0.0.0 --port 8000 --reload

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
