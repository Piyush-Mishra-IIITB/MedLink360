import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

function About() {
  return (
    <div className="px-6 md:px-10 lg:px-20 py-12 bg-gray-50">

      {/* Heading */}
      <div className="text-center pt-6">
        <p className="text-2xl md:text-3xl font-semibold text-gray-800">
          About <span className="text-primary font-medium">Us</span>
        </p>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-stretch gap-8 mt-10">

        {/* Image Section */}
        <div className="md:w-1/2 max-h-[420px]">
          <img
            src={assets.about_image}
            alt="about"
            className="w-full h-full object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 flex flex-col justify-center gap-4 text-xs md:text-sm text-gray-600 bg-white p-6 rounded-xl shadow-sm">

          <p>
            Our platform simplifies healthcare access by connecting patients
            with trusted and verified doctors. We provide a seamless
            appointment booking experience that allows users to find
            specialists based on their medical needs.
          </p>

          <p>
            With AI-powered symptom prediction, our system helps patients
            identify possible health concerns and recommends suitable
            doctors, ensuring faster and smarter healthcare decisions.
          </p>

          <div>
            <h2 className="text-gray-800 font-semibold text-sm mb-2">
              Our Vision
            </h2>
            <p>
              We aim to build a smart, accessible, and technology-driven
              healthcare ecosystem where patients can receive timely medical
              assistance and make informed decisions through intelligent
              prediction systems.
            </p>
          </div>

        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-16 text-center">
        <p className="text-2xl font-semibold text-gray-800">
          Why <span className="text-primary">Choose Us</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-8 text-sm text-gray-600">

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl transition duration-300">
          <b className="text-gray-800">Efficiency :</b>
          <p className="mt-2">
            Book appointments quickly with real-time availability and streamlined scheduling designed to save valuable time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl transition duration-300">
          <b className="text-gray-800">Convenience :</b>
          <p className="mt-2">
            Access trusted doctors anytime, anywhere with an easy-to-use and responsive digital platform.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl transition duration-300">
          <b className="text-gray-800">Personalization :</b>
          <p className="mt-2">
            AI-powered recommendations match patients with the most suitable specialists based on symptoms.
          </p>
        </div>

      </div>

    </div>
  );
}

export default About;
