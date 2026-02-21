import axios from "axios";
import Doctor from "../models/doctorModel.js";

export const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "No symptoms provided" });
    }

    // CALL FASTAPI
    const ml = await axios.post("http://127.0.0.1:8000/predict", {
      symptoms: symptoms
    });

    const specialist = ml.data.recommended_specialist;

    // FIND DOCTORS
    const doctors = await Doctor.find({
      speciality: { $regex: new RegExp(`^${specialist}$`, "i") }
    }).limit(5);

    res.json({ specialist, doctors });

  } catch (error) {
    console.log("ML ERROR ↓↓↓↓↓↓↓");
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "AI service unavailable" });
  }
};