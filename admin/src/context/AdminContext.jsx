import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {

  const backendURL = "http://localhost:4000";

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);

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

  // stable value
  const value = useMemo(() => ({
    backendURL,
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability
  }), [aToken, doctors, getAllDoctors,changeAvailability]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
 export default AdminContextProvider;