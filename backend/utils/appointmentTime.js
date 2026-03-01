// ALWAYS server side

export const getAppointmentWindow = (slotDate, slotTime, duration = 15) => {
  if (!slotDate || !slotTime)
    return { valid: false, reason: "INVALID_SLOT_DATA" };

  try {
    // "02_03_2026"
    const [day, month, year] = slotDate.split("_").map(Number);

    // "05:30 PM"
    let [time, modifier] = slotTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // 12h → 24h
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // 🔥 IMPORTANT FIX
    // create LOCAL IST time (NOT UTC)
    const start = new Date(year, month - 1, day, hours, minutes);

    const end = new Date(start.getTime() + duration * 60 * 1000);
    const earlyJoin = new Date(start.getTime() - 10 * 60 * 1000);

    const now = new Date();

    if (now < earlyJoin) return { valid: false, reason: "TOO_EARLY", start };
    if (now > end) return { valid: false, reason: "EXPIRED", start };

    return { valid: true, start, end };

  } catch (e) {
    return { valid: false, reason: "PARSE_ERROR" };
  }
};