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
function App() {
  const {aToken}=useContext(AdminContext);
  return aToken?(<div >
    <ToastContainer/>
    <Navbar/>
    <div className='flex items-start'>
    <Sidebar/>
    <Routes>
      <Route path='/' element={<></>}/>
      <Route path='/admin-dashboard' element={<Dashboard/>}/>
      <Route path='/all-appointment' element={<AllApointments/>}/>
      <Route path='/add-doctor' element={<AddDoctor/>}/>
      <Route path='/doctor-list' element={<DoctorList/>}/>
    </Routes>
    </div>
  </div>):(
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App ;