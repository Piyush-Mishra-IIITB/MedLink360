import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

function DoctorAppointments() {

const { currency } = useContext(AppContext);
const { dToken, appointments, getAppointments, completeAppointment,
 cancelAppointment } = useContext(DoctorContext);

const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (slotDate) => {
if (!slotDate) return "";
const arr = slotDate.split("_");
return `${arr[0]} ${months[Number(arr[1])]} ${arr[2]}`;
};

useEffect(() => {
if (dToken) getAppointments();
}, [dToken]);

return ( <div className="w-full px-6 py-8">


  <h3 className="text-2xl font-semibold mb-6 text-gray-800">
    All Appointments
  </h3>

  {/* TABLE HEADER */}
  <div className="hidden md:grid grid-cols-12 bg-gray-100 rounded-lg p-3 text-gray-600 font-medium text-sm">
    <p className="col-span-1">#</p>
    <p className="col-span-3">Patient</p>
    <p className="col-span-2">Payment</p>
    <p className="col-span-3">Date & Time</p>
    <p className="col-span-1">Fees</p>
    <p className="col-span-2 text-center">Action</p>
  </div>

  {/* TABLE ROWS */}
  <div className="flex flex-col">

    {appointments && appointments.length > 0 ? (
      [...appointments].reverse().map((item, index) => {

        const isCancelled = item?.cancelled;
        const isCompleted = item?.isCompleted;

        return (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 items-center border-b p-4 text-sm hover:bg-gray-50 transition"
          >

            {/* index */}
            <p className="col-span-1 text-gray-500">{index + 1}</p>

            {/* patient */}
            <div className="col-span-3 flex items-center gap-3">
              <img
                src={item?.userData?.image || assets.profile_pic}
                className="w-10 h-10 rounded-full object-cover border"
                alt=""
              />
              <p className="font-medium text-gray-800">
                {item?.userData?.name || "Unknown"}
              </p>
            </div>

            {/* payment */}
            <div className="col-span-2">
              {item?.payment ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                  Online
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                  Cash
                </span>
              )}
            </div>

            {/* date */}
            <div className="col-span-3 text-gray-700">
              {formatDate(item?.slotDate)} | {item?.slotTime}
            </div>

            {/* fees */}
            <p className="col-span-1 font-semibold">
              {currency}{item?.amount}
            </p>

            {/* action */}
            <div className="col-span-2 flex justify-center gap-3">

              {isCancelled ? (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                  Cancelled
                </span>
              ) : isCompleted ? (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  Completed
                </span>
              ) : (
                <>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="p-2 rounded-lg border border-red-200 hover:bg-red-50 transition"
                  >
                    <img src={assets.cancel_icon} className="w-4" alt="" />
                  </button>

                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="p-2 rounded-lg border border-green-200 hover:bg-green-50 transition"
                  >
                    <img src={assets.tick_icon} className="w-4" alt="" />
                  </button>
                </>
              )}

            </div>

          </div>
        );
      })
    ) : (
      <p className="text-center py-20 text-gray-400">No appointments</p>
    )}

  </div>

</div>


);
}

export default DoctorAppointments;
