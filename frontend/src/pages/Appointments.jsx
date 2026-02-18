import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

function Appointments() {

  const navigate = useNavigate();
  const { docId } = useParams();

  const { doctors, currencySymbol, token, backendURL, getDoctorsData } = useContext(AppContext);

  const daysOfWeek = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  /* -------------------------------------------------- */
  /* FETCH DOCTOR */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!doctors.length) return;

    const foundDoctor = doctors.find(doc => doc._id === docId);
    if (!foundDoctor) return;

    // ensure slots_booked always exists
    if (!foundDoctor.slots_booked) foundDoctor.slots_booked = {};

    setDocInfo(foundDoctor);

  }, [doctors, docId]);

  /* -------------------------------------------------- */
  /* SLOT GENERATION */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!docInfo) return;

    const generateSlots = () => {

      let today = new Date();
      let allSlots = [];

      for (let i = 0; i < 7; i++) {

        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        if (i === 0) {
          currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }

        let daySlots = [];

        while (currentDate < endTime) {

          // ⭐ FIXED TIME FORMAT (VERY IMPORTANT)
          const formattedTime = currentDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });

          const slotDate =
            currentDate.getDate() + "_" +
            (currentDate.getMonth() + 1) + "_" +
            currentDate.getFullYear();

          const bookedSlots = docInfo.slots_booked?.[slotDate] || [];

          const isAvailable = !bookedSlots.includes(formattedTime);

          if (isAvailable) {
            daySlots.push({
              dateTime: new Date(currentDate),
              time: formattedTime
            });
          }

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        allSlots.push(daySlots);
      }

      setDocSlot(allSlots);
    };

    generateSlots();

  }, [docInfo]);

  /* -------------------------------------------------- */
  /* BOOK APPOINTMENT */
  /* -------------------------------------------------- */

  const bookAppointment = async () => {

    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.error("Select a time slot");
    }

    try {

      const date = docSlot[slotIndex][0].dateTime;

      const slotDate =
        date.getDate() + "_" +
        (date.getMonth() + 1) + "_" +
        date.getFullYear();

      const { data } = await axios.post(
        backendURL + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getDoctorsData(); // refresh slots
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  /* -------------------------------------------------- */
  /* RENDER GUARDS (CRASH FIX) */
  /* -------------------------------------------------- */

  if (!doctors.length)
    return <div className="p-20 text-center text-xl">Loading doctors...</div>;

  if (!docInfo)
    return <div className="p-20 text-center text-xl">Preparing slots...</div>;

  /* -------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------- */

  return (
    <div className="px-6 md:px-10 lg:px-20 py-14 bg-gray-50 min-h-screen">

      {/* Doctor Card */}
      <div className="flex flex-col md:flex-row gap-12">

        <div className="md:w-1/3 bg-white rounded-3xl p-6 shadow-sm">
          <img className="w-full rounded-2xl" src={docInfo.image} alt="Doctor" />
        </div>

        <div className="md:w-2/3 bg-white rounded-3xl p-10 shadow-sm flex flex-col gap-8">

          <div>
            <p className="text-3xl font-semibold flex items-center gap-3">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>

            <div className="flex gap-4 mt-3 text-gray-500">
              <p>{docInfo.degree} • {docInfo.speciality}</p>
              <button className="border px-4 py-1 rounded-full text-sm">
                {docInfo.experience}
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm">{docInfo.about}</p>

          <p className="text-lg font-semibold">
            Appointment Fee
            <span className="text-primary ml-3 text-xl">
              {currencySymbol}{docInfo.fees}
            </span>
          </p>

        </div>
      </div>

      {/* Slots */}
      <div className="mt-16 bg-white rounded-3xl p-10 shadow-sm">

        <p className="text-2xl font-semibold mb-10">Booking Slots</p>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {docSlot.map((item, index) => (
            <div key={index}
              onClick={() => setSlotIndex(index)}
              className={`min-w-[90px] text-center p-5 rounded-2xl border cursor-pointer ${
                slotIndex === index ? "bg-primary text-white" : ""
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
              <p className="text-xl">{item[0] && item[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          {docSlot[slotIndex]?.map((item, index) => (
            <p key={index}
              onClick={() => setSlotTime(item.time)}
              className={`px-5 py-2 rounded-full border cursor-pointer ${
                slotTime === item.time ? "bg-primary text-white" : ""
              }`}
            >
              {item.time}
            </p>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={bookAppointment}
            className="bg-primary text-white px-14 py-3 rounded-full"
          >
            Book an Appointment
          </button>
        </div>

      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
}

export default Appointments;
