import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import {toast} from 'react-toastify';
import axios from "axios";
function AddDoctor() {

 
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  // connecting to backend
  const{aToken,backendURL}=useContext(AdminContext);

  const onSubmitHandler =async(e)=>{
     e.preventDefault();
     try{
       if(!docImg){
        return toast.error('Image is not selected');
       }
       const formData= new FormData();
       formData.append('image',docImg);
       formData.append('name',name);
       formData.append('email',email);
       formData.append('password',password);
       formData.append('experience',experience);
       formData.append('fees',Number(fees));
       formData.append('about',about);
       formData.append('speciality',speciality);
       formData.append('degree',degree);
       formData.append('address',JSON.stringify({line1:address1,line2:address2}));


       const {data}=await axios.post(backendURL +'/api/admin/add-doctor',formData,{headers:{aToken}});
       if(data.success){
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');

       }
    }
     catch(error){
     toast.error(error.message);
     console.log(error);
     }
  }
  // reusable classes (Tailwind v4 safe)
  const inputClass =
    "w-full border border-gray-300 bg-white rounded-xl px-4 py-2.5 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400";

  const labelClass =
    "text-sm font-medium text-gray-600 mb-1 block";

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">

      <form onSubmit={onSubmitHandler} className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-5 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Add Doctor</h2>
          <p className="text-sm text-gray-500">Fill details to register a new doctor</p>
        </div>

        <div className="p-8 flex flex-col lg:flex-row gap-10">

          {/* Upload Section */}
          <div className="flex flex-col items-center gap-4 w-full lg:w-64">
            <label
              htmlFor="doc-img"
              className="relative w-44 h-44 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition overflow-hidden"
            >
              <img
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=""
                className="w-full h-full object-cover"
              />
            </label>

            <input
              type="file"
              id="doc-img"
              hidden
              onChange={(e) => setDocImg(e.target.files[0])}
            />

            <p className="text-sm text-gray-500 text-center">
              Upload Doctor Photo <br />
              <span className="text-xs text-gray-400">(JPG, PNG under 2MB)</span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
                Basic Information
              </h3>
            </div>

            <div>
              <label className={labelClass}>Doctor Name</label>
              <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Full name" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="doctor@email.com" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="••••••••" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Experience</label>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className={inputClass}>
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1} Year</option>
                ))}
              </select>
            </div>

            {/* Professional */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
                Professional Details
              </h3>
            </div>

            <div>
              <label className={labelClass}>Fees </label>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} type="number" placeholder="500" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Speciality</label>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className={inputClass}>
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Education</label>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" placeholder="MBBS, MD..." required className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Clinic Address</label>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder="Address line 1" required className={`${inputClass} mb-2`} />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder="Address line 2" required className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>About Doctor</label>
              <textarea
                rows={5}
                onChange={(e)=>setAbout(e.target.value)} value={about}
                placeholder="Write about doctor experience, specialization, achievements..."
                className={`${inputClass} py-3 leading-relaxed resize-none`}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center px-8 py-4 border-t bg-gray-50">
          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            Add Doctor
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddDoctor;
