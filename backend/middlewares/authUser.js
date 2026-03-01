import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const authUser = async (req, res, next) => {
  try {

    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ store in request object
    req.userId = new mongoose.Types.ObjectId(decoded.id);
    req.role = decoded.role; 
    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid Token" });
  }
}

export default authUser;
