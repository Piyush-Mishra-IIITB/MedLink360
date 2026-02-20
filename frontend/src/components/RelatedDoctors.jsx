import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
function RelatedDoctors({speciality,docId}) {
    const {doctors}=useContext(AppContext);
    const navigate=useNavigate();
    const[relDoc,setRelDoc]=useState([]);
    useEffect(()=>{
       if(doctors.length>0 && speciality){
        const doctorsData=doctors.filter((doc)=>doc.speciality===speciality && doc._id !==docId);
        setRelDoc(doctorsData);
       }
    },[doctors,speciality,docId]);
    return (
            <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
                
                <h1 className='text-3xl font-medium'>
                    Top Doctors to Book
                </h1>
    
                <p className='text-gray-600 text-center'>
                    Simply browse through our extensive list of trusted doctors <br/> and book them for free
                </p>
    
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 w-full'>
                    
                    {relDoc.slice(0,5).map((item,index)=>(
                        <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={index} className='border rounded-lg p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer'>
                            
                            <img 
                                className='w-full h-48 object-cover rounded-md'
                                src={item.image} 
                                alt={item.name}
                            />
    
                            <div className='mt-3'>
                                <p className={`text-sm ${item.available ? 'text-green-500' : 'text-gray-400'}`}>
{item.available ? 'Available' :'Not available'}</p>
                                <p className='font-medium'>{item.name}</p>
                                <p className='text-sm text-gray-500'>{item.speciality}</p>
                            </div>
    
                        </div>
                    ))}
    
                </div>
    
                <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='mt-8 bg-primary text-white px-6 py-2 rounded-full'>
                    More
                </button>
    
            </div>
        );
    }
    

export default RelatedDoctors;