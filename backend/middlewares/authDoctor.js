import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {

    const dToken = req.headers.token;

    if (!dToken) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const decoded = jwt.verify(dToken, process.env.JWT_SECRET);

    // ✅ store in request object
    req.docId = decoded.id;
    req.role = decoded.role;
    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid Token" });
  }
}

export default authDoctor;
