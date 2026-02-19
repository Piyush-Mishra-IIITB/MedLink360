import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {

  // ---------------- CONFIG ----------------
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ---------------- AUTH ----------------
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

  // ---------------- DATA ----------------
  const [appointments, setAppointments] = useState([]);
  const[dashData,setDashdata]=useState(false);
  const[profileData,setProfileData]=useState(false);
  // ---------- Attach token globally ----------
  const authHeaders = {
    headers: { token: dToken }
  };

  // ---------------- GET APPOINTMENTS ----------------
  const getAppointments = async () => {
    try {

      const { data } = await axios.get(
        backendURL + "/api/doctor/appointments",
        authHeaders
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);

      // token expired / invalid
      if (error.response?.status === 401) {
        logoutDoctor();
      } else {
        toast.error(error.message);
      }
    }
  };

  // ---------------- COMPLETE APPOINTMENT ----------------
  const completeAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(
        backendURL + "/api/doctor/complete-appointment",
        { appointmentId },
        authHeaders
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        await getDashData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- CANCEL APPOINTMENT ----------------
  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(
        backendURL + "/api/doctor/cancel-appointment",
        { appointmentId },
        authHeaders
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        await getDashData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- LOGOUT ----------------
  const logoutDoctor = () => {
    localStorage.removeItem("dToken");
    setDToken("");
    setAppointments([]);
    toast.error("Session Expired. Login Again");
  };

  // ---------------- AUTO LOAD AFTER LOGIN ----------------
  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
      getAppointments();
      getDashData(); 
    }
  }, [dToken]);

  //---------getDashboard--------
  const getDashData=async()=>{
    try{
      const {data}=await axios.get(backendURL +'/api/doctor/dashboard',{headers:{token:dToken}});
      if(data.success){
        setDashdata(data.dashData);
      }else{
        toast.error(data.message);
      }
    }catch(error){
       console.log(error);
       toast.error(error.message);
    }
  }
  //profile
  const getProfileData=async()=>{
     try{
      const {data}=await axios.get(backendURL +'/api/doctor/profile',{headers:{token:dToken}});
      if(data.success){
        setProfileData(data.profileData);
      }else{
        toast.error(data.message);
      }
    }catch(error){
       console.log(error);
       toast.error(error.message);
    }
  }
  // ---------------- CONTEXT VALUE ----------------
  const value = {
    dToken,
    setDToken,
    backendURL,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    logoutDoctor,
    dashData,setDashdata,getDashData,
    profileData,setProfileData,getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
