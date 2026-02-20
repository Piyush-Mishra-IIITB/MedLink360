import { useState } from "react";
import symptoms from "../data/symptoms.json";

const SymptomSelector = ({ selected, setSelected }) => {
  const [search, setSearch] = useState("");

  const filtered = symptoms.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (symptom) => {
    if (selected.includes(symptom)) {
      setSelected(selected.filter(s => s !== symptom));
    } else {
      setSelected([...selected, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelected(selected.filter(s => s !== symptom));
  };

  const clearAll = () => setSelected([]);

  return (
    <div className="border rounded-2xl p-5 bg-white">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Select Your Symptoms
        </h2>
        <p className="text-sm text-gray-500">
          Choose all symptoms you are experiencing
        </p>
      </div>

      {/* SELECTED CHIPS */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map(symptom => (
            <span
              key={symptom}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              {symptom.replaceAll("_", " ")}
              <button
                onClick={() => removeSymptom(symptom)}
                className="text-xs hover:text-red-500"
              >
                ✕
              </button>
            </span>
          ))}

          <button
            onClick={clearAll}
            className="text-sm text-red-500 ml-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="sticky top-0 bg-white pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search symptoms (e.g. fever, headache)"
            className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* LIST */}
      <div className="max-h-72 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-6">
            No symptoms found
          </div>
        )}

        {filtered.map(symptom => {
          const active = selected.includes(symptom);

          return (
            <button
              key={symptom}
              onClick={() => toggle(symptom)}
              className={`
                text-sm px-3 py-2 rounded-xl border transition
                ${active
                  ? "bg-primary text-white border-primary shadow-sm scale-[0.97]"
                  : "bg-gray-50 hover:bg-primary/10 hover:border-primary/40"}
              `}
            >
              {symptom.replaceAll("_", " ")}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default SymptomSelector;