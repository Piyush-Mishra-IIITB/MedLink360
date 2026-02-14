import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

function Contact() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-12 bg-gray-50 flex justify-center">

      {/* Smaller Centered Container */}
      <div className="w-full max-w-5xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-semibold text-gray-800">
            Contact <span className="text-primary">Us</span>
          </p>
        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row items-stretch gap-8">

          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={assets.contact_image}
              alt="contact"
              className="w-full h-full max-h-[350px] object-cover rounded-xl shadow-sm"
            />
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between text-gray-600 text-sm">

            <div className="flex flex-col gap-5">

              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                  Our Office
                </h2>
                <p>54709 Bhopal, MP, India</p>
              </div>

              <div>
                <p>
                  <span className="font-medium text-gray-800">Contact:</span> +91 6269968982
                </p>
                <p>
                  <span className="font-medium text-gray-800">Email:</span> medi360@gmail.com
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Careers at Medi360
                </h3>
                <p className="text-xs mt-1">
                  Join us in building smarter digital healthcare solutions.
                </p>
              </div>

            </div>

            <button className="mt-6 w-fit bg-primary text-white px-5 py-2 rounded-full text-xs font-medium transition duration-300 hover:shadow-lg hover:-translate-y-1">
              Explore Jobs
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Contact;
