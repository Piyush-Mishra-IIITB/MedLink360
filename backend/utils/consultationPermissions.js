import { getAppointmentWindow } from "./appointmentWindow.js";

export function getConsultationPermissions(userId, appointment) {

  if (!appointment || appointment.cancelled) return null;

  const isDoctor = appointment.docId === userId;
  const isPatient = appointment.userId === userId;

  // stranger trying to access
  if (!isDoctor && !isPatient) return null;

  const { start, end } = getAppointmentWindow(appointment);
  const now = new Date();

  const inTime = now >= start && now <= end;
  const paid = appointment.payment === true;

  return {
    role: isDoctor ? "doctor" : "patient",

    // always allowed
    canChat: true,

    // strict conditions
    canCall: inTime && paid,

    // useful for UI messages
    reason: !paid
      ? "PAYMENT_REQUIRED"
      : !inTime
      ? "OUTSIDE_TIME_WINDOW"
      : null
  };
}