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

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

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
      .select(["-password", "-email"]);

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

    if (!doctor) {
      return res.json({ success: false, message: "Invalid doctor email" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

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
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   COMPLETE APPOINTMENT
========================================================= */
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    if (appointment.docId.toString() !== docId)
      return res.json({ success: false, message: "Unauthorized action" });

    if (appointment.cancelled)
      return res.json({ success: false, message: "Cancelled appointment cannot be completed" });

    if (appointment.isCompleted)
      return res.json({ success: false, message: "Already completed" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    res.json({ success: true, message: "Appointment completed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   CANCEL APPOINTMENT
========================================================= */
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    if (appointment.docId.toString() !== docId)
      return res.json({ success: false, message: "Unauthorized action" });

    if (appointment.isCompleted)
      return res.json({ success: false, message: "Completed appointment cannot be cancelled" });

    if (appointment.cancelled)
      return res.json({ success: false, message: "Already cancelled" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

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

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    let patientsSet = new Set();

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) earnings += item.amount;
      patientsSet.add(item.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientsSet.size,
      latestAppointments: appointments
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// api t get doctor profile 
const doctorProfile=async(req,res)=>{
    try{
        const docId = req.docId;
        const profileData=await doctorModel.findById(docId).select('-password');
        if(!profileData){
          return res.json({success:false,message:"profile not found"});
        }
        else{
          res.json({success:true,profileData});
        }
    }catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// api to update doc profile
const updateDoctorPeofile=async(req,res)=>{
   try{
        const docId = req.docId;
        const {fees,address,available}=req.body;
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available});
        res.json({success:true,message:"profile updated"})
    }catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }}
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  updateDoctorPeofile,
  doctorProfile
};
