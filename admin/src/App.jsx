import React, { useContext } from "react";
import Login from "./pages/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllApointments from "./pages/Admin/AllApointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointment.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";
import Consultation from "./pages/Doctor/Consultation.jsx";

import IncomingCallModal from "./components/IncomingCallModal.jsx";


// ---------------- PROTECTED ROUTES ----------------

const AdminRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  return aToken ? children : <Navigate to="/" replace />;
};

const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  return dToken ? children : <Navigate to="/" replace />;
};


// ---------------- APP ----------------

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isLoggedIn = aToken || dToken;

  return (
    <div>
      <ToastContainer />

      {!isLoggedIn ? (
        <Login />
      ) : (
        <>
          <Navbar />

          <div className="flex items-start">
            <Sidebar />
            <IncomingCallModal />

            <Routes>

              {/* DEFAULT */}
              <Route path="/" element={<Navigate to="/doctor-appointments" replace />} />

              {/* ADMIN */}
              <Route path="/admin-dashboard" element={
                <AdminRoute><Dashboard /></AdminRoute>
              } />

              <Route path="/all-appointment" element={
                <AdminRoute><AllApointments /></AdminRoute>
              } />

              <Route path="/add-doctor" element={
                <AdminRoute><AddDoctor /></AdminRoute>
              } />

              <Route path="/doctor-list" element={
                <AdminRoute><DoctorList /></AdminRoute>
              } />

              {/* DOCTOR */}
              <Route path="/doctor-dashboard" element={
                <DoctorRoute><DoctorDashboard /></DoctorRoute>
              } />

              <Route path="/doctor-appointments" element={
                <DoctorRoute><DoctorAppointments /></DoctorRoute>
              } />

              <Route path="/doctor-profile" element={
                <DoctorRoute><DoctorProfile /></DoctorRoute>
              } />

              <Route path="/consult/:appointmentId" element={
                <DoctorRoute><Consultation /></DoctorRoute>
              } />

            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;