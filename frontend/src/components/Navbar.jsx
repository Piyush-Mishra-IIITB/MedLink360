import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  const {token,setToken}=useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const logout=()=>{
    setToken(false);
    localStorage.removeItem('token');

  }

  return (
    <div className="flex items-center justify-between py-4 px-8 border-b bg-white shadow-sm">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer relative group">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={assets.profile_pic}
              alt="profile"
            />

            <img
              className="w-2.5 transition-transform duration-200 group-hover:rotate-180"
              src={assets.dropdown_icon}
              alt="dropdown"
            />

            <div className="absolute right-0 top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="min-w-48 bg-white shadow-xl rounded-lg flex flex-col gap-3 p-4 text-sm text-gray-700">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-primary transition cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-primary transition cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-red-500 transition cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="menu"
        />
        {/* Mobile view */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300
  ${showMenu ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <img className="w-32" src={assets.logo} alt="logo" />
            <img
              onClick={() => setShowMenu(false)}
              className="w-6 cursor-pointer"
              src={assets.cross_icon}
              alt="close"
            />
          </div>

          {/* Links */}
          <ul className="flex flex-col gap-6 px-8 py-8 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }`
              }
            >
              All Doctors
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }`
              }
            >
              Contact
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
