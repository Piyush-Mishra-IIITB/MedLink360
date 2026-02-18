import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
//api to register user
const registerUser=async(req,res)=>{
  try{
    const{name,email,password}=req.body;
    if (!name || !email || !password){
        return res.json({success:false,message:"missing Details"});
    }
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"enter a valid email"});
    }
    if(password.length<8){
        return res.json({success:false,message:"enter a strong password"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
    const userData={
        name,email,password:hashedPassword
    }
    const newUser=new userModel(userData);
    const user= await newUser.save();
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.json({success:true,token});
  }catch(error){
     console.log(error);
     res.json({success:false,message:error.message});
  }
}

// api for userLogin
const loginUser=async(req,res)=>{
    try{
      const {email,password}=req.body;
      const user=await userModel.findOne({email});
      if(!user){
       return res.json({success:false,message:"user does not exist"}); 
      }
      const isMatch=await bcrypt.compare(password,user.password);
      if(isMatch){
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.json({success:true,token});
      }else{
        res.json({success:false,message:"Inavlid credentials"});
      }
    }catch(error){
     console.log(error);
     res.json({success:false,message:error.message});
  }
}
// api to get user profile
const getProfile=async(req,res)=>{
    try{
       const userId = req.userId;
       const userData=await userModel.findById(userId).select('-password');
       res.json({success:true,userData});

    }catch(error){
     console.log(error);
     res.json({success:false,message:error.message});
    }
}
// api to update user profile
const updateProfile=async(req,res)=>{
    try{
       const {name,phone,address,dob,gender}=req.body;
       const userId = req.userId;
       const imageFile=req.file;
       if( !name || !phone || !dob|| !gender){
           return res.json({success:false,message:"Data is missing"});
       }
       await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender});
       if(imageFile){
        // upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
        const imageURL=imageUpload.secure_url;
        await userModel.findByIdAndUpdate(userId,{image:imageURL});
       }
       res.json({success:true,message:"Profile updated"});
    }catch(error){
     console.log(error);
     res.json({success:false,message:error.message});
    }
}
// api to book appointment
const bookAppointment = async (req, res) => {
    try {

        // ⭐ userId must come from auth middleware
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (docData.available === false) {
    return res.json({ success: false, message: "doctor not available" });
}

        let slots_booked = docData.slots_booked || {};


        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        // ⭐ now userId exists
        const userData = await userModel.findById(userId).select('-password');

        // remove heavy data before saving snapshot
        const docSnapshot = docData.toObject();
        delete docSnapshot.slots_booked;

        const appointment_data = {
            userId,
            docId,
            userData,
            docData: docSnapshot,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointment_data);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment is booked" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// api to get user appointment for frontend my appointment page

const listAppointment = async (req, res) => {
    try {

        const userId = req.userId;

        const appointments = await appointmentModel.find({ userId });

        res.json({
            success: true,
            appointments
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment};