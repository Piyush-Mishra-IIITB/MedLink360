import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function MyAppointments() {
  const { token, backendURL,getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/user/appointments",
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserAppointment();
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
        // optimistic UI update
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, cancelled: true } : a
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-6 md:px-12 py-10">
      <h3 className="text-2xl font-semibold mb-8 text-primary text-center">
        My Appointments
      </h3>

      <div className="flex flex-col gap-6">
        {appointments.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-xl shadow-sm border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Doctor Image */}
            <img
              src={item?.docData?.image}
              alt="doctor"
              className="w-32 h-32 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1 text-sm text-gray-600">
              <p className="text-lg font-semibold text-gray-800">
                {item?.docData?.name}
              </p>
              <p className="text-primary">{item?.docData?.speciality}</p>

              <div className="mt-2">
                <p className="font-medium text-gray-700">Address:</p>
                <p>{item?.docData?.address?.line1}</p>
                <p>{item?.docData?.address?.line2}</p>
              </div>

              <p className="mt-2">
                <span className="font-medium text-gray-700">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex md:flex-col gap-3 justify-center">
              {!item.cancelled ? (
                <>
                  <button className="px-4 py-2 rounded-full bg-primary text-white text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                    Pay Online
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-4 py-2 rounded-full border text-sm hover:bg-red-50 hover:border-red-400 hover:text-red-500 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    Cancel Appointment
                  </button>
                </>
              ) : (
                <button className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm cursor-not-allowed">
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;