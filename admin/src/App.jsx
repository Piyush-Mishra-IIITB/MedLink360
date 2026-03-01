import React, { useContext } from 'react';
import Login from './pages/login';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import { AdminContext } from './context/AdminContext';
import Sidebar from './components/Sidebar.jsx';
import{Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllApointments from './pages/Admin/AllApointment.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointment.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import Consultation from "./pages/Doctor/Consultation.jsx";
import { DoctorSocketProvider } from "./context/DoctorSocketContext.jsx";
import IncomingCallModal from "./components/IncomingCallModal.jsx";
function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken)
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );

  return (
    <div>
      <ToastContainer />
      <Navbar />

      <div className="flex items-start">
        <Sidebar />

        {/* ADMIN PANEL */}
        {aToken && (
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointment" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
          </Routes>
        )}

        {/* DOCTOR PANEL WITH GLOBAL SOCKET */}
        {dToken && (
          <>
            <IncomingCallModal/>
            <Routes>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path="/consult/:appointmentId" element={<Consultation />} />
            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

export default App ;