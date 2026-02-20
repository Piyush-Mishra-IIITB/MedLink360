import express from "express";
import { recommendDoctor } from "../contollers/recommendController.js";

const recommendRouter = express.Router();

recommendRouter.post("/ai-recommend", recommendDoctor);

export default recommendRouter;