import joblib
import numpy as np

artifact = joblib.load("specialist_model.joblib")

model = artifact["model"]
ALL_SYMPTOMS = [s.lower().strip() for s in artifact["symptom_columns"]]  # normalize once


def normalize(symptom: str):
    return str(symptom).lower().strip().replace(" ", "_")


def symptoms_to_vector(user_symptoms: list):
    vector = [0] * len(ALL_SYMPTOMS)

    for symptom in user_symptoms:
        clean = normalize(symptom)

        if clean in ALL_SYMPTOMS:
            idx = ALL_SYMPTOMS.index(clean)
            vector[idx] = 1

    return np.array(vector).reshape(1, -1)


def predict_specialist(symptoms: list):
    if not symptoms:
        return "General physician"

    vec = symptoms_to_vector(symptoms)

    # safeguard: empty vector (no known symptoms)
    if vec.sum() == 0:
        return "General physician"

    prediction = model.predict(vec)[0]
    return prediction