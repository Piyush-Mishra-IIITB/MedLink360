

import express from "express";
import { doctorList } from "../contollers/doctorController.js";
const doctorRouter=express.Router();

doctorRouter.get('/list',doctorList);

export default doctorRouter;