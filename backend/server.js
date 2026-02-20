import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import connectCloudiary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recommendRouter from "./routes/recommendRoutes.js";
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudiary();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use("/api",recommendRouter);
app.get("/", (req,res)=>{
    res.send("hii hello");
});

app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
});
