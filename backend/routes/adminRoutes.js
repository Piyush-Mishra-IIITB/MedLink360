import e from "express";
import { addDoctor,allDoctor,appointmentAdmin,appointmentCancel,loginAdmin } from "../contollers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../contollers/doctorController.js";

const adminRouter =e.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.get('/all-doctor',authAdmin,allDoctor);
adminRouter.patch('/change-availability/:id',authAdmin,changeAvailability);
adminRouter.get('/appointments',authAdmin,appointmentAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);
export default adminRouter;