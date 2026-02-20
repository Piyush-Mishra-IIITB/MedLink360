import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-4 shadow-sm 
hover:shadow-xl hover:-translate-y-1 hover:border-primary/60
transition-all duration-300 cursor-pointer flex gap-4">

      {/* Doctor Image */}
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-24 h-24 rounded-xl object-cover"
      />

      {/* Info */}
      <div className="flex-1">

        {/* Name + availability */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{doctor.name}</h3>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              doctor.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {doctor.available ? "Available" : "Not Available"}
          </span>
        </div>

        {/* Speciality */}
        <p className="text-blue-600 font-medium">{doctor.speciality}</p>

        {/* Experience */}
        <p className="text-gray-500 text-sm mt-1">
          {doctor.degree} • {doctor.experience}
        </p>

        {/* Address */}
        <p className="text-gray-500 text-sm mt-1">
          {doctor.address?.line1}, {doctor.address?.line2}
        </p>

        {/* Fees + CTA */}
        <div className="flex items-center justify-between mt-3">
          <p className="font-semibold text-gray-800">
            Consultation: ${doctor.fees}
          </p>

          <button
            onClick={() => navigate(`/appointment/${doctor._id}`)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorCard;