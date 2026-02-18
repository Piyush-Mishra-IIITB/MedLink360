import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {

  const backendURL = "http://localhost:4000";

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const[appointments,setAppointments]=useState([]);
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
      getAllAppointments();

     }else{
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
    cancelAppointment
  }), [aToken, doctors,cancelAppointment, getAllDoctors,changeAvailability,getAllAppointments]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
 export default AdminContextProvider;