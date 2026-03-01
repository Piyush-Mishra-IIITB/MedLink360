import appointmentModel from "../models/appointmentModel.js";
import { getAppointmentWindow } from "../utils/appointmentWindow.js";

export const getCapabilities = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const role = req.role;

    const appt = await appointmentModel.findById(appointmentId);

    if (!appt)
      return res.json({ success:false, canCall:false, reason:"NOT_FOUND" });

    // ❗ NEW GUARD
    if (!appt.slotDate || !appt.slotTime)
      return res.json({ success:true, canCall:false, reason:"INVALID_APPOINTMENT" });

    if (appt.cancelled || appt.isCompleted)
      return res.json({ success:true, canCall:false, reason:"CLOSED" });

    const { start, end } = getAppointmentWindow(appt.slotDate, appt.slotTime);
    const now = new Date();

    if (now < start || now > end)
      return res.json({ success:true, canCall:false, reason:"OUTSIDE_TIME" });

    // doctor always allowed
    if (role === "doctor")
      return res.json({ success:true, canCall:true });

    // patient must pay
    if (!appt.payment)
      return res.json({ success:true, canCall:false, reason:"PAYMENT_REQUIRED" });

    return res.json({ success:true, canCall:true });

  } catch (e) {
    console.log("Capabilities error:", e);
    res.json({ success:false });
  }
};