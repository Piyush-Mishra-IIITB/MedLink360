import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Doctor() {

    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();

    const [filterDoc, setFilterDoc] = useState([]);

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(
                doctors.filter(doc => doc.speciality === speciality)
            );
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);

    return (
        <div className="px-6 md:px-10 lg:px-20 py-10">

            <p className="text-2xl font-semibold mb-6">
                Browse through the doctors Specialist
            </p>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Filter Panel */}
                <div className="flex flex-col gap-3 md:w-1/4 text-sm">
                    {[
                        "General physician",
                        "Gynecologist",
                        "Dermatologist",
                        "Pediatricians",
                        "Neurologist",
                        "Gastroenterologist"
                    ].map((item) => (
                        <p 
                            key={item}
                            onClick={() => navigate(`/doctors/${item}`)}
                            className={`cursor-pointer border px-4 py-2 rounded-md hover:bg-primary hover:text-white transition ${
                                speciality === item ? "bg-primary text-white" : ""
                            }`}
                        >
                            {item}
                        </p>
                    ))}
                </div>

                {/* Doctor Cards */}
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
