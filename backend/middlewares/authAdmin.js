import jwt from 'jsonwebtoken'

const authAdmin= async(req,res,next)=>{
   try{
     const {atoken}=req.headers;
     if(!atoken){
   console.log(error);
   res.json({success:false,message:"invalid person"});
     }else{
        const token_decode=jwt.verify(atoken,process.env.JWT_SECRET);
        if(token_decode !==process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
             res.json({success:false,message:"invalid person"});
        }
        next();
     }



   }catch(error){
   console.log(error);
   res.json({success:false,message:"error occured"});
   }
}


export default authAdmin;