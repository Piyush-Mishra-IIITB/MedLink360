import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

function Navbar() {
  const { aToken, setAToken } = useContext(AdminContext);
  const {dToken,setDToken}=useContext(DoctorContext);
 const navigate=useNavigate();
  const logout = () => {
    navigate('/');
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken('');
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <div className="w-full bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={assets.admin_logo}
          alt="admin"
          className="w-10 h-10 object-contain"
        />

        <div className="leading-tight">
          <p className="text-lg font-semibold text-gray-700">
            {aToken ? "Admin Panel" : "Doctor Panel"}
          </p>
          <span className="text-xs text-gray-400">
            Healthcare Management System
          </span>
        </div>
      </div>

      {/* Right Section */}
      <button
        onClick={logout}
        className="bg-primary text-white px-5 py-2 rounded-lg font-medium
                   hover:bg-primary/90 hover:shadow-lg active:scale-95
                   transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
