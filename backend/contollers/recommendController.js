import axios from "axios";
import Doctor from "../models/doctorModel.js";

export const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "No symptoms provided" });
    }

    // use ENV instead of localhost
    const ml = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      { symptoms }
    );

    const specialist = ml.data.recommended_specialist;

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