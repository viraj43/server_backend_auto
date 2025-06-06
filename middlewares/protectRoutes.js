import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    // Access the token from the cookies
    const token = req.cookies.jwt;
    console.log(req.cookies)

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - no token provided" });
    }
    
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
        console.log("I am the problem")
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }
    console.log("Decoded",decoded)

    // Find the user associated with the token's id
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
