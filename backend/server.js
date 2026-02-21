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


// ---------- DATABASE ----------
connectDB();
connectCloudiary();


// ---------- MIDDLEWARE ----------

// allow only your frontends (temporary * for first deploy)
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());


// ---------- ROUTES ----------
app.get("/", (req,res)=>{
  res.send("API WORKING");
});

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api', recommendRouter);


// ---------- PORT FIX (IMPORTANT) ----------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});