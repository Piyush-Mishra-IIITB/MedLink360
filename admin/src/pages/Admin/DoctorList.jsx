import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

function DoctorList() {
  const { doctors = [], aToken, getAllDoctors ,changeAvailability} = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        All Doctors
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {doctors.length === 0 && (
          <p className="text-gray-500">No doctors found</p>
        )}

        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-xl transition duration-300"
          >
            {/* Image */}
            <img
              src={doc.image}
              alt={doc.name}
              className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
            />

            {/* Name */}
            <h3 className="text-lg font-semibold text-center">
              Dr. {doc.name}
            </h3>

            {/* Speciality */}
            <p className="text-sm text-gray-500 text-center mb-2">
              {doc.speciality}
            </p>

            {/* Availability Toggle */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <span
                className={`text-sm font-medium ${
                  doc.available ? "text-green-600" : "text-gray-400"
                }`}
              >
                {doc.available ? "Available" : "Unavailable"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.available}
                  onChange={()=>changeAvailability(doc._id)}
                  className="sr-only peer"
                />

                {/* Track */}
                <div
                  className="
                  w-12 h-6 bg-gray-300 rounded-full
                  peer-checked:bg-green-500
                  transition-colors duration-300
                "
                ></div>

                {/* Thumb */}
                <div
                  className="
                  absolute left-1 top-1
                  w-4 h-4 bg-white rounded-full shadow
                  transition-transform duration-300
                  peer-checked:translate-x-6
                "
                ></div>
              </label>
            </div>

            {/* Details */}
            <div className="mt-4 text-sm text-gray-600 space-y-1 border-t pt-3">
              <p>
                <span className="font-medium">Experience:</span> {doc.experience}
              </p>
              <p>
                <span className="font-medium">Degree:</span> {doc.degree}
              </p>
              <p>
                <span className="font-medium">Fees:</span> ₹{doc.fees}
              </p>
            </div>

            {/* About */}
            <p className="mt-3 text-xs text-gray-500 line-clamp-3 leading-relaxed">
              {doc.about}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
