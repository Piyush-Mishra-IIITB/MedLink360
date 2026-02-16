
import validator from "validator";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
const addDoctor=async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const imageFile=req.file;
    if(!name || !email || ! password || ! speciality || ! degree || ! experience || ! about || !fees || !address ){
        return res.json({success:false,message:"missing details"});
    }
    // validating email
    if(!validator.isEmail(email)){
         return res.json({success:false,message:"please enter a valid email"});
    }
    if(password.length<8){
        return res.json({success:false,message:"please enter a Strong password"});
    }
      const slat= await bcrypt.genSalt(10);
      const hashedPass= await bcrypt.hash(password,salt);

      const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
      const imageUrl=imageUpload.secure_url;

      const doctorData={
        name,
        email,
        image:imageUrl,
        password:hashedPass,
        speciality,
        degree,
        experience,
        fees,
        address:JSON.parse(address),
        date:Date.now()
      }
      const newDoctor=new doctorModel(doctorData);
      await newDoctor.save();
      res.json({success:true,message:"Doctor added"});
    }
    catch(error){
      console.log(error);
      res.json({success:false,message:"some error occured"});
    }
}

// Login admin
const loginAdmin=async(req,res)=>{
    try{

    }catch(error){
      console.log(error);
      res.json({success:false,message:"some error occured"});
    }
}

export {addDoctor,loginAdmin}