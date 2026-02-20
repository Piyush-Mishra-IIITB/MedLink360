import { useState } from "react";
import SymptomSelector from "../components/SymptomSelector";
import DoctorCard from "../components/DoctorCard";
import axios from "axios";

const AiConsult = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialist, setSpecialist] = useState("");
  const [loading, setLoading] = useState(false);

  const findDoctor = async () => {
    if (selectedSymptoms.length === 0) return alert("Select symptoms");

    try {
      setLoading(true);

      const res = await axios.post("/api/ai-recommend", {
        symptoms: selectedSymptoms
      });

      setDoctors(res.data.doctors);
      setSpecialist(res.data.specialist);
      setSelectedSymptoms([]);

    } catch (err) {
      alert("AI service unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Health Assistant
          </h1>
          <p className="text-gray-500">
            Select your symptoms and our AI will suggest the right specialist doctor for you
          </p>
        </div>

        

        {/* SELECTOR */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SymptomSelector
            selected={selectedSymptoms}
            setSelected={setSelectedSymptoms}
          />

          {/* BUTTON */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={findDoctor}
              className="bg-primary text-white px-10 py-3 rounded-xl text-lg font-medium hover:scale-105 active:scale-95 transition"
            >
              {loading ? "Analyzing Symptoms..." : "Find Suitable Doctor"}
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center mt-10 text-gray-500 animate-pulse">
            AI is analyzing your symptoms and matching specialists...
          </div>
        )}

        {/* RESULT */}
        {!loading && specialist && (
          <div className="mt-10">

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
              <p className="text-gray-600 mb-1">Recommended Specialist</p>
              <h2 className="text-2xl font-bold text-green-700">
                {specialist}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map(doc => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && doctors.length === 0 && specialist === "" && (
          <div className="text-center mt-12 text-gray-400">
            No analysis yet. Select symptoms and click Find Suitable Doctor.
          </div>
        )}

      </div>
    </div>
  );
};

export default AiConsult;