import { Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import Doctor from "./pages/Doctor"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./pages/MyProfile"
import MyAppointments from "./pages/MyAppointments"
import Appointments from "./pages/Appointments"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  return (
    <div>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/doctors" element={<Doctor/>}/>
      <Route path="/doctors/:speciality" element={<Doctor/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/my-profile" element={<MyProfile/>}/>
      <Route path="/appoitment/:docId" element={<Appointments/>}/>
      <Route path="/my-appointments" element={<MyAppointments/>}/>
    </Routes>
    <Footer/>
    </div>
  )
}

export default App
