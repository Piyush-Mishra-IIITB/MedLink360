import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import axios from 'axios';
import { toast } from "react-toastify";
function Login() {
  const [state, setState] = useState("Admin");
 const{setAToken,backendURL}=useContext(AdminContext);


 const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const onSubmit=async(event)=>{
   event.preventDefault();
   try{
     if(state==='Admin'){
         const {data}=await axios.post(backendURL + '/api/admin/login',{email,password});
         if(data.success){
            localStorage.setItem('aToken',data.token);
            setAToken(data.token);
         }else{
            toast.error(data.message);
         }
     }else{
        
     }
   }catch(error){

   }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

      <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={assets.admin_logo} alt="logo" className="w-14 h-14 object-contain" />
        </div>

        {/* Title */}
        <p className="text-3xl font-bold text-center mb-8 tracking-tight">
          <span className="text-primary">{state}</span>
          <span className="text-gray-700"> Login</span>
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder={`${state}@gmail.com`}
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-400"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold tracking-wide hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Toggle Role */}
        <p className="text-center text-sm text-gray-600">
          {state === "Admin" ? (
            <>
              Doctor panel?{" "}
              <span
                onClick={() => setState("Doctor")}
                className="text-primary font-semibold cursor-pointer hover:underline hover:text-primary/80 transition"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin panel?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-primary font-semibold cursor-pointer hover:underline hover:text-primary/80 transition"
              >
                Click here
              </span>
            </>
          )}
        </p>

      </form>
    </div>
  );
}

export default Login;
