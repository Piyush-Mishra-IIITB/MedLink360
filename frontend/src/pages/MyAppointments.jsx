import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

function MyAppointments() {
  const { doctors } = useContext(AppContext);

  return (
    <div className="px-6 md:px-12 py-10">
      <h3 className="text-2xl font-semibold mb-8 text-primary text-center">
        My Appointments
      </h3>

      <div className="flex flex-col gap-6">
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-xl shadow-sm border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Doctor Image */}
            <img
              src={item.image}
              alt="doctor"
              className="w-32 h-32 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1 text-sm text-gray-600">
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-primary">{item.speciality}</p>

              <div className="mt-2">
                <p className="font-medium text-gray-700">Address:</p>
                <p>{item.address.line1}</p>
                <p>{item.address.line2}</p>
              </div>

              <p className="mt-2">
                <span className="font-medium text-gray-700">Date & Time:</span>{" "}
                10 July 2025 | 8:30 PM
              </p>
            </div>

            {/* Buttons */}
            <div className="flex md:flex-col gap-3 justify-center">
              <button
                className="px-4 py-2 rounded-full bg-primary text-white text-sm 
hover:shadow-lg hover:-translate-y-0.5
transition-all duration-300 ease-in-out"
              >
                Pay Online
              </button>

              <button
                className="px-4 py-2 rounded-full border text-sm
hover:bg-red-50 hover:border-red-400 hover:text-red-500
hover:shadow-md hover:-translate-y-0.5
active:scale-95
transition-all duration-300 ease-in-out"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
