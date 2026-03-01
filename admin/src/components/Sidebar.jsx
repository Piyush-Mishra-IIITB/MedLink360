import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

function Sidebar() {

  const { aToken } = useContext(AdminContext);
  const { dToken, unreadChats } = useContext(DoctorContext);

  const unreadCount = unreadChats?.length || 0;

  const linkClass =
    "flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary";

  const activeClass = "bg-primary text-white shadow-md";

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 w-64 p-4">

      {/* ---------------- ADMIN ---------------- */}
      {aToken && (
        <ul className="flex flex-col gap-2">

          <NavLink to="/admin-dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.home_icon} alt="" className="w-5 h-5" />
              <p>Dashboard</p>
            </div>
          </NavLink>

          <NavLink to="/all-appointment" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
              <p>Appointments</p>
            </div>
          </NavLink>

          <NavLink to="/add-doctor" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.add_icon} alt="" className="w-5 h-5" />
              <p>Add Doctor</p>
            </div>
          </NavLink>

          <NavLink to="/doctor-list" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.people_icon} alt="" className="w-5 h-5" />
              <p>Doctors List</p>
            </div>
          </NavLink>

        </ul>
      )}

      {/* ---------------- DOCTOR ---------------- */}
      {dToken && (
        <ul className="flex flex-col gap-2">

          <NavLink to="/doctor-dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.home_icon} alt="" className="w-5 h-5" />
              <p>Dashboard</p>
            </div>
          </NavLink>

          {/* 🔔 CONSULTATION NOTIFICATION */}
          <NavLink to="/doctor-appointments" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
              <p>Appointments</p>
            </div>

            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/doctor-profile" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <div className="flex items-center gap-3">
              <img src={assets.people_icon} alt="" className="w-5 h-5" />
              <p>Doctor Profile</p>
            </div>
          </NavLink>

        </ul>
      )}

    </div>
  );
}

export default Sidebar;