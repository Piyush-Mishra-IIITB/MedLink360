import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudiary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
const app=express();
const port=process.env.PORT || 4000;
connectDB();
connectCloudiary();
//  middleware

app.use(cors());
app.use(express.json());

// api endpoint

app.use('/api/admin',adminRouter);

app.get("/",(req,res)=>{
    res.send("hii hello");
});
app.listen(port,()=>{
    console.log(` app is running on ${port}`);
});