import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const { token, backendURL, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  // ================= GET APPOINTMENTS =================
  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/user/appointments",
        { headers: { token } }
      );

      if (data.success) setAppointments(data.appointments.reverse());

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    if (token) getUserAppointment();
  }, [token]);

  // ================= CANCEL =================
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment cancelled");
        getUserAppointment();
        getDoctorsData();
      } else toast.error(data.message);

    } catch (error) {
      toast.error("Cancel failed");
    }
  };

  // ================= OPEN RAZORPAY =================
  const initPay = (order, appointmentId) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: "Consultation Payment",
      order_id: order.id,

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendURL + "/api/user/verifyRazorpay",
            {
              ...response,
              appointmentId
            },
            { headers: { token } }
          );

          if (data.success) {
            toast.success("Payment Successful");
            getUserAppointment();
            navigate("/my-appointments");
          } else {
            toast.error("Payment verification failed");
          }

        } catch (error) {
          console.log(error);
          toast.error("Verification error");
        }
      },

      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ================= CREATE ORDER =================
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) initPay(data.order, appointmentId);
      else toast.error("Order creation failed");

    } catch (error) {
      console.log(error);
      toast.error("Payment init failed");
    }
  };

  // ================= UI =================
  return (
    <div className="px-6 md:px-12 py-10">
      <h3 className="text-2xl font-semibold mb-8 text-primary text-center">
        My Appointments
      </h3>

      <div className="flex flex-col gap-6">
        {appointments.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-xl shadow-sm border hover:shadow-xl transition-all"
          >

            <img
              src={item?.docData?.image}
              alt="doctor"
              className="w-32 h-32 object-cover rounded-lg"
            />

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

            {/* ACTION BUTTONS */}
            <div className="flex md:flex-col gap-3 justify-center">

              {/* Paid */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="px-4 py-2 rounded-full bg-green-100 text-green-700">
                  Paid
                </button>
              )}

              {/* Pay + Cancel */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <>
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="px-4 py-2 rounded-full bg-primary text-white hover:shadow-md"
                  >
                    Pay Online
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-4 py-2 rounded-full border hover:bg-red-50 hover:text-red-500"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}

              {/* Cancelled */}
              {item.cancelled && !item.isCompleted  && (
                <button className="px-4 py-2 rounded-full bg-red-100 text-red-600">
                  Appointment Cancelled
                </button>
              )}
              {item.isCompleted && <button>Completed</button>}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;