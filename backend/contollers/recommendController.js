import axios from "axios";
import Doctor from "../models/doctorModel.js";

export const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No symptoms provided"
      });
    }

    // remove trailing slash if present
    const base = process.env.ML_API_URL.replace(/\/$/, "");

    // call ML server
    const ml = await axios.post(
      `${base}/predict`,
      { symptoms },
      { timeout: 60000 }
    );

    const specialist = ml.data.recommended_specialist;

    const doctors = await Doctor.find({
      speciality: { $regex: new RegExp(`^${specialist}$`, "i") }
    }).limit(5);

    // ⭐ IMPORTANT: send success:true
    return res.json({
      success: true,
      specialist,
      doctors
    });

  } catch (error) {
    console.log("===== ML ERROR =====");
    console.log(error.code);
    console.log(error.message);
    console.log(error.response?.data);

    return res.status(500).json({
      success: false,
      message: "AI service unavailable"
    });
  }
};