import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
const app=express();
const port=process.env.PORT || 4000;
connectDB();
//  middleware

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("hii hello");
});
app.listen(port,()=>{
    console.log(` app is running on ${port}`);
});