import joblib
import numpy as np

# load once at startup (IMPORTANT — not inside function)
artifact = joblib.load("specialist_model.joblib")

model = artifact["model"]
ALL_SYMPTOMS = artifact["symptom_columns"]   # 131 features


def symptoms_to_vector(user_symptoms: list):
    """
    user_symptoms: ["itching", "skin_rash", "nodal_skin_eruptions"]
    returns: 131 length vector
    """

    # initialize all False
    vector = [0] * len(ALL_SYMPTOMS)

    # set True where symptom exists
    for symptom in user_symptoms:
        if symptom in ALL_SYMPTOMS:
            idx = ALL_SYMPTOMS.index(symptom)
            vector[idx] = 1

    return np.array(vector).reshape(1, -1)


def predict_specialist(symptoms: list):
    vec = symptoms_to_vector(symptoms)
    prediction = model.predict(vec)[0]
    return prediction