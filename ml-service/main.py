from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from predict import predict_specialist

app = FastAPI()


class SymptomsRequest(BaseModel):
    symptoms: List[str]


@app.get("/")
def home():
    return {"message": "ML service running"}


@app.post("/predict")
def get_prediction(data: SymptomsRequest):
    specialist = predict_specialist(data.symptoms)

    return {
        "recommended_specialist": specialist
    }