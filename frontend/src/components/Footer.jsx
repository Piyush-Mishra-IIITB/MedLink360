import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink } from "react-router-dom";

function Footer() {
  const linkStyle = ({ isActive }) =>
    `transition cursor-pointer ${
      isActive
        ? "text-primary font-semibold"
        : "text-gray-600 hover:text-primary"
    }`;

  return (
    <div className="w-full bg-white text-gray-800 mt-20 border-t">

      {/* Main Footer Content */}
      <div className="px-6 md:px-12 lg:px-20 py-12 flex flex-col md:flex-row justify-between gap-10">

        {/* Logo Section */}
        <div className="md:w-1/3">
          <img className="w-36 mb-4" src={assets.logo} alt="logo" />
          <p className="text-sm leading-relaxed text-gray-600">
            Book appointments with trusted doctors easily and securely.
            Your health, our priority.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="font-semibold mb-4">COMPANY</p>
          <ul className="flex flex-col gap-2 text-sm">

            <NavLink to="/" className={linkStyle}>
              Home
            </NavLink>

            <NavLink to="/about" className={linkStyle}>
              About Us
            </NavLink>

            <NavLink to="/contact" className={linkStyle}>
              Contact Us
            </NavLink>

            <NavLink to="/Policy" className={linkStyle}>
              Privacy Policy
            </NavLink>

          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <p className="font-semibold mb-4">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>+91 6269968982</li>
            <li>medi360@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © 2026 Prescripto — All Rights Reserved
      </div>

    </div>
  );
}

export default Footer;
