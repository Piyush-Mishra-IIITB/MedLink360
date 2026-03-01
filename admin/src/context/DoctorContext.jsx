import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // AUTH
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

  // DATA
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashdata] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // 🔔 IMPORTANT → STORE ARRAY NOT NUMBER
  const [unreadChats, setUnreadChats] = useState([]);

  const authHeaders = { headers: { token: dToken } };

  // ================= APPOINTMENTS =================
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/appointments", authHeaders);
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();
      else toast.error(error.message);
    }
  };

  // ================= COMPLETE =================
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
        getDashData();
      } else toast.error(data.message);

    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= CANCEL =================
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
        getDashData();
      } else toast.error(data.message);

    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= DASHBOARD =================
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/dashboard", authHeaders);
      if (data.success) setDashdata(data.dashData);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= PROFILE =================
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/profile", authHeaders);
      if (data.success) setProfileData(data.profileData);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= 🔔 UNREAD CHATS =================
  const getUnreadChats = async () => {
    try {
      if (!dToken) return;

      const { data } = await axios.get(
        backendURL + "/api/doctor/unread-chats",
        authHeaders
      );

      if (data.success) {
        setUnreadChats(data.conversations);   // ⭐ ARRAY
      }

    } catch (error) {
      console.log("Unread error:", error.message);
    }
  };

  // ================= MARK READ =================
  const markChatAsRead = async (appointmentId) => {
    try {

      await axios.post(
        backendURL + "/api/doctor/mark-chat-read",
        { appointmentId },
        authHeaders
      );

      // 🔥 instant UI refresh
      await getUnreadChats();

    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOGOUT =================
  const logoutDoctor = () => {
    localStorage.removeItem("dToken");
    setDToken("");
    setAppointments([]);
    setUnreadChats([]);
    toast.error("Session Expired. Login Again");
  };

  // ================= LOAD ON LOGIN =================
  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
      getAppointments();
      getDashData();
      getUnreadChats();
    }
  }, [dToken]);

  // ================= POLLING =================
  useEffect(() => {
    if (!dToken) return;

    const interval = setInterval(() => {
      getUnreadChats();
    }, 5000);

    return () => clearInterval(interval);
  }, [dToken]);


  useEffect(() => {
  const refresh = () => getUnreadChats();
  window.addEventListener("new-message", refresh);
  return () => window.removeEventListener("new-message", refresh);
}, [dToken]);


  // ================= PROVIDER =================
  const value = {
    dToken,
    setDToken,
    backendURL,

    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,

    dashData,
    getDashData,

    profileData,
    setProfileData,
    getProfileData,

    unreadChats,
    markChatAsRead,

    logoutDoctor
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;