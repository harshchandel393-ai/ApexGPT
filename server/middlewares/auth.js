import jwt from 'jsonwebtoken'
import User from "../models/user.js";

export const protect = async (req, res, next) => {

    let token = req.headers.authorization;

    console.log("TOKEN RECEIVED:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED TOKEN:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {

        console.log("AUTH ERROR:", error.message);

        res.status(401).json({
            message: "Not authorized, token failed"
        });
    }
}