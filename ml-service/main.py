from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from predict import predict_specialist

app = FastAPI()

class SymptomInput(BaseModel):
    symptoms: List[str]

@app.post("/predict")
def predict(data: SymptomInput):
    try:
        specialist = predict_specialist(data.symptoms)
        return {"recommended_specialist": specialist}
    except Exception as e:
        return {"recommended_specialist": "General physician"}