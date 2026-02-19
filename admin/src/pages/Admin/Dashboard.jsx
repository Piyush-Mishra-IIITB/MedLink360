import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets_admin/assets";

function Dashboard() {

const { aToken, dashData, getDashdata, cancelAppointment } = useContext(AdminContext);

/* -------- DATE FORMAT -------- */
const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (slotDate) => {
if (!slotDate) return "";
const arr = slotDate.split("_");
return `${arr[0]} ${months[Number(arr[1])]} ${arr[2]}`;
};

useEffect(() => {
if (aToken) getDashdata();
}, [aToken]);

if (!dashData) return null;

return ( <div className="w-full px-6 py-8 space-y-8">

  {/* -------- STATS -------- */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* Doctors */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition flex items-center gap-5">
      <img src={assets.doctor_icon} className="w-14" alt="" />
      <div>
        <p className="text-2xl font-semibold text-gray-800">{dashData.doctors}</p>
        <p className="text-gray-500 hover:text-primary hover:tracking-wide transition cursor-pointer">
          Doctors
        </p>
      </div>
    </div>

    {/* Appointments */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition flex items-center gap-5">
      <img src={assets.appointments_icon} className="w-14" alt="" />
      <div>
        <p className="text-2xl font-semibold text-gray-800">{dashData.appointments}</p>
        <p className="text-gray-500 hover:text-primary hover:tracking-wide transition cursor-pointer">
          Appointments
        </p>
      </div>
    </div>

    {/* Patients */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition flex items-center gap-5">
      <img src={assets.patients_icon} className="w-14" alt="" />
      <div>
        <p className="text-2xl font-semibold text-gray-800">{dashData.patients}</p>
        <p className="text-gray-500 hover:text-primary hover:tracking-wide transition cursor-pointer">
          Patients
        </p>
      </div>
    </div>

  </div>

  {/* -------- LATEST BOOKINGS -------- */}
  <div className="bg-white border rounded-2xl shadow-sm">

    <div className="flex items-center gap-3 px-6 py-4 border-b group cursor-pointer">
      <img src={assets.list_icon} className="w-5 group-hover:scale-110 transition" alt="" />
      <p className="font-semibold text-gray-800 group-hover:text-primary transition">
        Latest Bookings
      </p>
    </div>

    <div className="divide-y">

      {dashData.latestAppointment?.length > 0 ? (
        dashData.latestAppointment.map((item, index) => {

          const isCancelled = item?.cancelled;

          return (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <img
                  src={item?.docData?.image || assets.doctor_icon}
                  className="w-12 h-12 rounded-full object-cover border"
                  alt=""
                />

                <div>
                  <p className="font-medium text-gray-800 hover:text-primary transition cursor-pointer">
                    {item?.docData?.name || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item?.slotDate)}
                  </p>
                </div>

              </div>

              {/* ACTION */}
              {isCancelled ? (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  Cancelled
                </span>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition"
                >
                  <img src={assets.cancel_icon} className="w-4" alt="" />
                  Cancel
                </button>
              )}

            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-400 py-10">No recent bookings</p>
      )}

    </div>

  </div>

</div>


);
}

export default Dashboard;
