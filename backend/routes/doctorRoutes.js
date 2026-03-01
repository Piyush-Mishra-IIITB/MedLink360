

import express from "express";
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList,doctorProfile,loginDoctor, updateDoctorPeofile,getUnreadChats,markChatAsRead } from "../contollers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter=express.Router();
import { getCapabilities } from "../contollers/consultationController.js";
doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete);
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel);
doctorRouter.get('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorPeofile);

doctorRouter.get("/capabilities/:appointmentId", authDoctor, getCapabilities);
doctorRouter.get("/unread-chats", authDoctor, getUnreadChats);
doctorRouter.post("/mark-read", authDoctor, markChatAsRead);
 export default doctorRouter;