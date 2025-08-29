import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // Ensure this is the correct path

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        // Ensure we use decoded.id or decoded._id
        const user = await User.findById(decoded.id || decoded._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Unauthorized: User not found" });
        }

        req.user = { id: user._id }; // Explicitly attach user ID
        next(); // Proceed to next middleware or route
    } catch (error) {
        console.error("Invalid token:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;