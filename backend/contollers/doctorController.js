import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* =========================================================
   CHANGE AVAILABILITY
========================================================= */
const changeAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);
    if (!doctor)
      return res.json({ success: false, message: "Doctor not found" });

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      message: "Availability updated",
      available: doctor.available,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating availability" });
  }
};


/* =========================================================
   GET ALL DOCTORS (PUBLIC)
========================================================= */
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select("-password -email")
      .lean();

    res.json({ success: true, doctors });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   DOCTOR LOGIN
========================================================= */
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor)
      return res.json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      doctor: {
        name: doctor.name,
        email: doctor.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   GET DOCTOR APPOINTMENTS
========================================================= */
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel
      .find({ docId })
      .populate("userId", "name image dob")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   COMPLETE APPOINTMENT (ATOMIC SAFE)
========================================================= */
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findOneAndUpdate(
      {
        _id: appointmentId,
        docId: docId,
        cancelled: false,
        isCompleted: false
      },
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (!appointment)
      return res.json({
        success: false,
        message: "Cannot complete cancelled/invalid appointment"
      });

    res.json({ success: true, message: "Appointment completed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   CANCEL APPOINTMENT (ATOMIC SAFE)
========================================================= */
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findOneAndUpdate(
      {
        _id: appointmentId,
        docId: docId,
        cancelled: false,
        isCompleted: false,
        payment: false
      },
      { $set: { cancelled: true } },
      { new: true }
    );

    if (!appointment)
      return res.json({
        success: false,
        message: "Cannot cancel paid/completed appointment"
      });

    // free slot after successful cancel
    const doctor = await doctorModel.findById(docId);
    if (doctor?.slots_booked?.[appointment.slotDate]) {
      doctor.slots_booked[appointment.slotDate] =
        doctor.slots_booked[appointment.slotDate].filter(
          (t) => t !== appointment.slotTime
        );
      await doctor.save();
    }

    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   DOCTOR DASHBOARD
========================================================= */
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel.find({ docId }).lean();

    let earnings = 0;
    const patients = new Set();

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) earnings += item.amount;
      if (item.userId) patients.add(item.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments: appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   GET DOCTOR PROFILE
========================================================= */
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;

    const profileData = await doctorModel
      .findById(docId)
      .select("-password");

    if (!profileData)
      return res.json({ success: false, message: "Profile not found" });

    res.json({ success: true, profileData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* =========================================================
   UPDATE DOCTOR PROFILE
========================================================= */
const updateDoctorPeofile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available
    });

    res.json({ success: true, message: "Profile updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  updateDoctorPeofile,
  doctorProfile,
};