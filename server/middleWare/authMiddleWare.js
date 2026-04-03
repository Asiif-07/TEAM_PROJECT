import asyncHandler from '../handler/AsyncHandler.js'
import CustomError from '../handler/CustomError.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const authMiddleWare = asyncHandler(async (req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return next(new CustomError(401, "Unauthorized, No token provided"))
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return next(new CustomError(401, "Invalid or expired token"));
    }

    const userId = decodedToken.userId;

    if (!userId) {
        return next(new CustomError(401, "Unauthorized, Invalid token"))
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new CustomError(401, "Unauthorized, User not found"))
    }

    req.user = user;
    req.userId = userId;

    next();




})

export default authMiddleWare