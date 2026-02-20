import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {

    const { atoken } = req.headers;

    // No token
    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    // Verify token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Allow request
    next();

  } catch (error) {
    console.log("ADMIN AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authAdmin;
