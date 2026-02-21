import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

/* ================= RAZORPAY INSTANCE ================= */
const razorpayInstance = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_SECRET
});

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
try {
const { name, email, password } = req.body;


if (!name || !email || !password)
  return res.json({ success: false, message: "Missing details" });

if (!validator.isEmail(email))
  return res.json({ success: false, message: "Enter valid email" });

if (password.length < 8)
  return res.json({ success: false, message: "Password too short" });

const hashedPassword = await bcrypt.hash(password, 10);

const user = await userModel.create({ name, email, password: hashedPassword });

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

res.json({ success: true, token });


} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
try {
const { email, password } = req.body;


const user = await userModel.findOne({ email });
if (!user)
  return res.json({ success: false, message: "User not found" });

const match = await bcrypt.compare(password, user.password);
if (!match)
  return res.json({ success: false, message: "Invalid credentials" });

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

res.json({ success: true, token });

} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= PROFILE ================= */
const getProfile = async (req, res) => {
try {
const userData = await userModel.findById(req.userId).select("-password");
res.json({ success: true, userData });
} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= UPDATE PROFILE ================= */
const updateProfile = async (req, res) => {
try {
const { name, phone, address, dob, gender } = req.body;


await userModel.findByIdAndUpdate(req.userId, {
  name,
  phone,
  address: JSON.parse(address),
  dob,
  gender
});

if (req.file) {
  const upload = await cloudinary.uploader.upload(req.file.path);
  await userModel.findByIdAndUpdate(req.userId, { image: upload.secure_url });
}

res.json({ success: true });


} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= BOOK APPOINTMENT ================= */
const bookAppointment = async (req, res) => {
try {
const { docId, slotDate, slotTime } = req.body;


const doctor = await doctorModel.findById(docId).select("-password");
if (!doctor || doctor.available === false)
  return res.json({ success: false, message: "Doctor not available" });

let slots = doctor.slots_booked || {};
if (slots[slotDate]?.includes(slotTime))
  return res.json({ success: false, message: "Slot not available" });

slots[slotDate] = slots[slotDate] || [];
slots[slotDate].push(slotTime);

const appointment = await appointmentModel.create({
  userId: req.userId,
  docId,
  userData: await userModel.findById(req.userId).select("-password"),
  docData: { ...doctor.toObject(), slots_booked: undefined },
  amount: doctor.fees || doctor.fee || 500,
  slotDate,
  slotTime,
  date: Date.now(),
  payment: false,
  appointmentStatus: "paid", // after payment verified becomes usable
  roomId: null
});

await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots });

res.json({ success: true, appointment });


} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= LIST APPOINTMENTS ================= */
const listAppointment = async (req, res) => {
try {
const appointments = await appointmentModel.find({ userId: req.userId });
res.json({ success: true, appointments });
} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= CANCEL ================= */
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    /* 🚫 DO NOT CANCEL IF PAID */
    if (appointment.payment === true) {
      return res.json({
        success: false,
        message: "You cannot cancel a paid appointment"
      });
    }

    /* allow cancel only unpaid */
    appointment.cancelled = true;
    appointment.appointmentStatus = "cancelled";
    await appointment.save();

    /* free doctor slot */
    const doctor = await doctorModel.findById(appointment.docId);

    if (doctor?.slots_booked?.[appointment.slotDate]) {
      doctor.slots_booked[appointment.slotDate] =
        doctor.slots_booked[appointment.slotDate].filter(
          t => t !== appointment.slotTime
        );
      await doctor.save();
    }

    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
/* ================= CREATE ORDER ================= */
const paymentRazorpay = async (req, res) => {
try {
const { appointmentId } = req.body;


const appointment = await appointmentModel.findById(appointmentId);
if (!appointment || appointment.cancelled)
  return res.json({ success: false, message: "Invalid appointment" });

const order = await razorpayInstance.orders.create({
  amount: appointment.amount * 100,
  currency: "INR",
  receipt: appointmentId
});

res.json({ success: true, order });

} catch (error) {
res.json({ success: false, message: error.message });
}
};

/* ================= VERIFY PAYMENT ================= */
const verifyRazorpay = async (req, res) => {
try {
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


const generatedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest("hex");

if (generatedSignature !== razorpay_signature)
  return res.json({ success: false, message: "Payment verification failed" });

const order = await razorpayInstance.orders.fetch(razorpay_order_id);

await appointmentModel.findByIdAndUpdate(order.receipt, {
  payment: true,
  appointmentStatus: "paid"
});

res.json({ success: true });


} catch (error) {
res.json({ success: false, message: error.message });
}
};

export {
registerUser,
loginUser,
getProfile,
updateProfile,
bookAppointment,
listAppointment,
cancelAppointment,
paymentRazorpay,
verifyRazorpay
};
