import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

/* ================= ADD DOCTOR ================= */
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
      return res.json({ success: false, message: "Missing details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Weak password" });

    const hashedPass = await bcrypt.hash(password, 10);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

    const doctorData = {
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPass,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now()
    };

    await doctorModel.create(doctorData);

    res.json({ success: true, message: "Doctor added successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= ADMIN LOGIN ================= */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= GET ALL DOCTORS ================= */
const allDoctor = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= GET ALL APPOINTMENTS (FIXED) ================= */
const appointmentAdmin = async (req, res) => {
  try {

    const appointments = await appointmentModel
      .find({})
      .populate({
        path: "userId",
        select: "name dob image email phone"
      })
      .populate({
        path: "docId",
        select: "name speciality image fees"
      })
      .sort({ date: -1 });

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API for appointment cancellation

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });


    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const doctor = await doctorModel.findById(appointment.docId);
    doctor.slots_booked[appointment.slotDate] =
      doctor.slots_booked[appointment.slotDate].filter(t => t !== appointment.slotTime);

    await doctor.save();

    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin, allDoctor, appointmentAdmin,appointmentCancel};
