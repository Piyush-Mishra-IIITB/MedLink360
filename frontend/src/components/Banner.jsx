import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

function Banner() {
    const navigate=useNavigate();
  return (
    <div className="w-full bg-primary mt-5 rounded-lg">

      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-16">

        {/* Left Section */}
        <div className="text-white md:w-1/2 flex flex-col gap-4">

          <p className="text-3xl md:text-4xl font-semibold leading-tight">
            Book Appointment
          </p>

          <p className="text-lg md:text-xl font-light">
            with 100+ Trusted Doctors
          </p>

          <button onClick={()=>{navigate('/login');scrollTo(0,0)}} className="mt-4 bg-white text-primary px-6 py-3 rounded-full font-medium w-fit hover:scale-105 transition">
            Create Account
          </button>

        </div>

        {/* Right Section */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            className="w-full max-w-md"
            src={assets.appointment_img}
            alt="appointment"
          />
        </div>

      </div>

    </div>
  );
}

export default Banner;
