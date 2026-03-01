export const getAppointmentWindow = (slotDate, slotTime) => {

  if (!slotDate || !slotTime) {
    return { valid: false, reason: "INVALID_SLOT_DATA" };
  }

  // Example: "10:30 AM"
  const [time, modifier] = slotTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const start = new Date(slotDate);
  start.setHours(hours, minutes, 0, 0);

  // 30 minute consultation
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const now = new Date();

  // allow 10 min early join
  const earlyJoin = new Date(start.getTime() - 10 * 60 * 1000);

  if (now < earlyJoin) return { valid: false, reason: "TOO_EARLY" };
  if (now > end) return { valid: false, reason: "EXPIRED" };

  return { valid: true, start, end };
};