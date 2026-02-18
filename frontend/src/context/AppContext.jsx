import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const currencySymbol = '$';

    const [doctors, setDoctors] = useState([]);
   const[userData,setUserData]=useState(false);
    // ⭐ FIXED AUTH STATE
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/list');
            if (data.success) setDoctors(data.doctors);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => { getDoctorsData(); }, []);

    // ⭐ KEEP STORAGE IN SYNC
    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

const loadUserProfileData=async()=>{
    try{
      const {data}=await axios.get(backendURL + '/api/user/get-profile',{headers:{token}});
      if(data.success){
        setUserData(data.userData);
      }else{
        toast.error(data.message);
      }
    }catch(error){
        console.log(error);
        toast.error(error.message);
    }
}
useEffect(()=>{
 if(token){
    loadUserProfileData();
 }else{
    setUserData(false);
 }
},[token]);

    const value = { doctors, currencySymbol, token, setToken, backendURL,userData,setUserData,loadUserProfileData,getDoctorsData };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContextProvider;
