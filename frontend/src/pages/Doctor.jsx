import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Doctor() {

    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();

    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    const categories = [
        "General physician",
        "Gynecologist",
        "Dermatologist",
        "Pediatricians",
        "Neurologist",
        "Gastroenterologist"
    ];

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);

    const handleCategoryClick = (item) => {
        // clicking same filter again -> remove filter (show all doctors)
        if (speciality === item) {
            navigate('/doctors');
        } else {
            navigate(`/doctors/${item}`);
        }
        setShowFilter(false);
    };

    return (
        <div className="px-6 md:px-10 lg:px-20 py-10">

            <p className="text-2xl font-semibold mb-6">
                Browse through the doctors Specialist
            </p>

            {/* MOBILE FILTER BUTTON */}
            <button
                className="md:hidden border px-4 py-2 rounded-lg w-fit mb-4"
                onClick={() => setShowFilter(prev => !prev)}
            >
                Filters
            </button>

            <div className="flex flex-col md:flex-row gap-8">

                {/* FILTER PANEL */}
                <div
                    className={`flex flex-col gap-3 md:w-1/4 text-sm transition-all duration-300
                    ${showFilter ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0 overflow-hidden md:max-h-full md:opacity-100"}
                    md:block`}
                >

                    {/* ALL DOCTORS OPTION */}
                    <p
                        onClick={() => { navigate('/doctors'); setShowFilter(false); }}
                        className={`cursor-pointer border px-4 py-2 rounded-md transition
                        ${!speciality ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}
                    >
                        All Doctors
                    </p>

                    {categories.map((item) => (
                        <p
                            key={item}
                            onClick={() => handleCategoryClick(item)}
                            className={`cursor-pointer border px-4 py-2 rounded-md transition
                            ${speciality === item
                                ? "bg-primary text-white"
                                : "hover:bg-primary hover:text-white"}`}
                        >
                            {item}
                        </p>
                    ))}
                </div>

                {/* DOCTOR CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:w-3/4">

                    {filterDoc.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => navigate(`/appointment/${item._id}`)}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        >
                            <img
                                className="w-full h-48 object-cover rounded-md"
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="mt-3">
                                <p className="text-green-500 text-sm">Available</p>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.speciality}</p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default Doctor;