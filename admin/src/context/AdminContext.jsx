import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {

  const backendURL = "http://localhost:4000";

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const[appointments,setAppointments]=useState([]);
  const [dashData,setDashdata]=useState(false);
  // stable function
  const getAllDoctors = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/admin/all-doctor",
        { headers: { aToken } }
      );

      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
    }
  }, [aToken]);
  // change avilabiltiy
const changeAvailability = async (docId) => {
  try {

    const { data } = await axios.patch(
      backendURL + '/api/admin/change-availability/' + docId,
      {},
      { headers: { atoken: aToken } }
    );

    if (data.success) {
      toast.success("Availability updated");
      getAllDoctors();
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};
// 
const getAllAppointments=async()=>{
    try{
       const {data}= await axios.get(backendURL + '/api/admin/appointments',{headers:{aToken}});
       if(data.success){
        setAppointments(data.appointments);
       }else{
        toast.error(data.message);
       }
    }catch(error){
        toast.error(error.message);
    }
}
// api cancel appointment
  const cancelAppointment=async(appointmentId)=>{
    try{
     const {data}=await axios.post(backendURL + '/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}});
     if(data.success){
      toast.success(data.message);
      await getAllAppointments();
      await getDashdata();

     }else{
      toast.error(data.message);
     }
    }catch(error){
      toast.error(error.message);
    }
  }
 // get dash data
 const getDashdata=async()=>{
  try{
     const {data}=await axios.get(backendURL + '/api/admin/dashboard',{headers:{aToken}});
     if(data.success){
      setDashdata(data.dashData);

     }
     else{
      toast.error(data.message);
     }
  }catch(error){
      toast.error(error.message);
  }
 }
  // stable value
  const value = useMemo(() => ({
    backendURL,
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    appointments,
    setAppointments,
    changeAvailability,
    getAllAppointments,
    cancelAppointment,
    getDashdata,
    dashData
  }), [aToken,dashData, doctors,cancelAppointment, getAllDoctors,changeAvailability,getAllAppointments,getDashdata]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
 export default AdminContextProvider;