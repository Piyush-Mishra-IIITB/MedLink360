import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

function Sidebar() {
  const { aToken } = useContext(AdminContext);

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary";

  const activeClass =
    "bg-primary text-white shadow-md";

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 w-64 p-4">

      {aToken && (
        <ul className="flex flex-col gap-2">

          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <img src={assets.home_icon} alt="home" className="w-5 h-5" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/all-appointment"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <img src={assets.appointment_icon} alt="appointment" className="w-5 h-5" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <img src={assets.add_icon} alt="add doctor" className="w-5 h-5" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <img src={assets.people_icon} alt="doctor list" className="w-5 h-5" />
            <p>Doctors List</p>
          </NavLink>

        </ul>
      )}
    </div>
  );
}

export default Sidebar;
