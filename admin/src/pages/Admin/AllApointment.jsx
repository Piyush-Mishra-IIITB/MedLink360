import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

function AllApointments() {

const { aToken, getAllAppointments, appointments, cancelAppointment } = useContext(AdminContext);
const { calculateAge, currency } = useContext(AppContext);

/* ---------------- MONTH FORMATTER ---------------- */
const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (slotDate) => {
if (!slotDate) return "";
const arr = slotDate.split("_");
return `${arr[0]} ${months[Number(arr[1])]} ${arr[2]}`;
};

/* ---------------- AVATAR ---------------- */
const Avatar = ({ name, image }) => {


if (image) {
  return (
    <img
      src={image}
      alt={name}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
  );
}

const initials = name
  ? name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
  : "?";

return (
  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
    {initials}
  </div>
);


};

/* ---------------- FETCH ---------------- */
useEffect(() => {
if (aToken) getAllAppointments();
}, [aToken, getAllAppointments]);

return ( <div className="w-full px-6 py-8">

  <div className="flex justify-between items-center mb-6">
    <p className="text-2xl font-semibold text-gray-800">All Appointments</p>
    <span className="text-sm text-gray-500">
      {appointments?.length || 0} records
    </span>
  </div>

  {/* TABLE */}
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    {/* HEADER */}
    <div className="hidden md:grid grid-cols-12 bg-gray-50 text-gray-600 text-sm font-semibold px-4 py-3 border-b sticky top-0 z-10">
      <p className="col-span-3">Patient</p>
      <p className="col-span-3">Date & Time</p>
      <p className="col-span-3">Doctor</p>
      <p className="col-span-1 text-center">Fees</p>
      <p className="col-span-2 text-center">Action</p>
    </div>

    {/* ROWS */}
    <div className="flex flex-col">

      {appointments && appointments.length > 0 ? (
        appointments.map((item, index) => {

          const isCancelled = item?.cancelled;

          return (
            <div
              key={item._id}
              className={`grid grid-cols-1 md:grid-cols-12 items-center px-4 py-4 text-sm border-b last:border-none
              ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
              hover:bg-primary/5 transition`}
            >

              {/* PATIENT */}
              <div className="col-span-3 flex items-center gap-3 mb-3 md:mb-0">
                <Avatar
                  name={item?.userData?.name}
                  image={item?.userData?.image}
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {item?.userData?.name || "Unknown"}
                  </p>
                  {item?.userData?.dob && (
                    <p className="text-xs text-gray-500">
                      Age {calculateAge(item.userData.dob)}
                    </p>
                  )}
                </div>
              </div>

              {/* DATE */}
              <div className="col-span-3 text-gray-700 mb-2 md:mb-0">
                <p className="font-medium">{formatDate(item?.slotDate)}</p>
                <p className="text-xs text-gray-500">{item?.slotTime}</p>
              </div>

              {/* DOCTOR */}
              <div className="col-span-3 flex items-center gap-3 mb-2 md:mb-0">
                <Avatar
                  name={item?.docData?.name}
                  image={item?.docData?.image}
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {item?.docData?.name || "Doctor Removed"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item?.docData?.speciality || ""}
                  </p>
                </div>
              </div>

              {/* FEES */}
              <div className="col-span-1 text-center font-semibold text-gray-800">
                {currency}{item?.amount || item?.docData?.fees || 0}
              </div>

              {/* ACTION */}
              <div className="col-span-2 flex justify-center">
                {isCancelled ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Cancelled
                  </span>
                ) : item.isCompleted
                ? <p>Completed</p>
                :(
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition"
                  >
                    <img src={assets.cancel_icon} className="w-4" alt="" />
                    Cancel
                  </button>
                )}
              </div>

            </div>
          );
        })
      ) : (
        <p className="py-16 text-center text-gray-400">
          No appointments found
        </p>
      )}

    </div>
  </div>

</div>


);
}

export default AllApointments;
