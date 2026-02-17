import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req,res)=>{
  try{

    const { id } = req.params;

    const doctor = await doctorModel.findById(id);

    if(!doctor){
      return res.json({success:false,message:"Doctor not found"});
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success:true,
      message:"Availability updated",
      available:doctor.available
    });

  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error updating availability"});
  }
}
// all doc

const doctorList= async (req,res)=>{
    try{
       const doctors=await doctorModel.find({}).select(['-password','-email']);
       res.json({success:true,doctors});
    }catch(error){
       console.log(error);
    res.json({success:false,message:error.message});
    }
}
export {changeAvailability,doctorList};