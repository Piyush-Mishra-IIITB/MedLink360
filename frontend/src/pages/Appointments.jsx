import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";

function Appointments() {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const fetchDocInfo = () => {
    const foundDoctor = doctors.find((doc) => doc._id.toString() === docId);
    setDocInfo(foundDoctor);
  };
  const getAvailableSlots = async () => {
    setDocSlot([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlot((prev) => [...prev, timeSlots]);
    }
  };
  useEffect(() => {
    console.log(docSlot);
  }, [docSlot]);
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);
  if (!docInfo) return null;

  return (
    <div className="px-6 md:px-10 lg:px-20 py-14 bg-gray-50 min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Doctor Image Card */}
        <div className="md:w-1/3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <img
            className="w-full rounded-2xl object-cover"
            src={docInfo.image}
            alt="Doctor"
          />
        </div>

        {/* Doctor Info Card */}
        <div className="md:w-2/3 bg-white border border-gray-100 rounded-3xl p-10 shadow-sm flex flex-col gap-8">
          <div>
            <p className="text-3xl font-semibold flex items-center gap-3 text-gray-800">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="verified" />
            </p>

            <div className="flex items-center gap-4 text-gray-500 mt-3">
              <p className="text-base">
                {docInfo.degree} • {docInfo.speciality}
              </p>
              <button className="border border-gray-300 px-4 py-1 rounded-full text-sm bg-gray-50">
                {docInfo.experience}
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold flex items-center gap-2 text-gray-800">
              About
              <img
                className="w-4 opacity-70"
                src={assets.info_icon}
                alt="info"
              />
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed text-sm">
              {docInfo.about}
            </p>
          </div>

          <div className="border-t pt-6">
            <p className="text-lg font-semibold text-gray-800">
              Appointment Fee
              <span className="text-primary ml-3 text-xl">
                {currencySymbol || "$"}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="w-full mt-16 bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
        <p className="text-2xl font-semibold mb-10 text-gray-800">
          Booking Slots
        </p>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {docSlot.length &&
            docSlot.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`min-w-[90px] text-center p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  slotIndex === index
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                <p className="text-sm font-medium tracking-wide">
                  {item[0] && daysOfWeek[item[0].dateTime.getDay()]}
                </p>
                <p className="text-xl font-semibold mt-2">
                  {item[0] && item[0].dateTime.getDate()}
                </p>
              </div>
            ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-8">
          {docSlot.length &&
            docSlot[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-5 py-2 rounded-full text-sm cursor-pointer border transition-all duration-300 ${
                  slotTime === item.time
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <div className="flex justify-center mt-10">
  <button className="bg-primary text-white text-sm font-medium px-14 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
    Book an Appointment
  </button>
</div>

      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
}
export default Appointments;
