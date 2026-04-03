import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import {generateAccessToken , generateRefreshToken} from "../utils/genrateAccessToken.js"
import {CookieOptions} from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'
import {welcomeEmailTemplate} from "../template/registration.js"
import sendEmail from "../utils/sendMail.js"
import sanitizeUser from "../utils/sanitizeUser.js"

const getAppUrlFromRequest = (req) => {
    const origin = req?.headers?.origin;
    return origin || process.env.APP_URL || "http://localhost:5173";
}

const RegisterUser = AsyncHandler(async(req,res,next)=>{

    const {name,email,password,gender} = req.body
    const normalizedEmail = email.trim().toLowerCase();

    const UserExist = await User.findOne({email: normalizedEmail})

    if(UserExist){
        return next(new CustomError(400 ,"User already exist"))
    }

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        gender
    })

    if (!user){
        return next(new CustomError(400 ,"User not created"))
    }

    const appUrl = getAppUrlFromRequest(req)
    const welcomeEmail = welcomeEmailTemplate(user.name, user.email, appUrl)

    // Do not block signup on email sending (faster UX).
    sendEmail(user.email, "welcome to our application", welcomeEmail)
        .catch((error) => console.error("Welcome email failed:", error?.message || error))

    res.status(201).json({
        success:true,
        message: "Account created successfully. Please log in.",
        user: sanitizeUser(user)
    })



})

const LoginUser = AsyncHandler(async(req,res,next)=>{
    const {email,password} = req.body
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({email: normalizedEmail}).select("+password")

    if(!user){
        return next(new CustomError(400 ,"Invalid email or password"))
    }

    const comparePassword = await user.comparePassword(password);

    if(!comparePassword){
        return next(new CustomError(400 ,"Invalid email or password"))
    }

    let accessToken = generateAccessToken(user)
    let refreshToken = generateRefreshToken(user)

    user.refreshToken =[{token: refreshToken , createdAt: Date.now()}]

    await user.save({validateBeforeSave: false})

    res.cookie("refreshToken" , refreshToken, CookieOptions).status(200).json({
        success:true,
        message:"User logged in successfully",
        accessToken: accessToken,
        user: sanitizeUser(user)
    })

})

const RefreshToken = AsyncHandler(async(req,res,next)=>{
    
    const incomingRefreshToken = req.cookies.refreshToken

    if(!incomingRefreshToken){
        return next(new CustomError(400 ,"Refresh token not found"))
    }

    const decoded = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

    if(!decoded.userId){
        return next(new CustomError(400 ,"Invalid refresh token"))
    }

    const isTokenValid = await User.findOne({"refreshToken.token": incomingRefreshToken});

    if(!isTokenValid){
        return next(new CustomError(400 ,"Invalid refresh token"))
    }

    const newAccessToken = generateAccessToken(isTokenValid)
    const newRefreshToken = generateRefreshToken(isTokenValid)

    // Use update query to avoid Mongoose optimistic concurrency conflicts.
    const updatedUser = await User.findOneAndUpdate(
        { _id: isTokenValid._id, "refreshToken.token": incomingRefreshToken },
        {
            $set: {
                refreshToken: [{ token: newRefreshToken, createdAt: Date.now() }],
            },
        },
        { new: true }
    )

    if (!updatedUser) {
        return next(new CustomError(400, "Invalid refresh token"))
    }

    res.cookie("refreshToken", newRefreshToken, CookieOptions).status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        user: sanitizeUser(updatedUser),
    })
})

const LogoutUser = AsyncHandler(async(req,res,next)=>{
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
        await User.updateOne(
            { "refreshToken.token": incomingRefreshToken },
            { $pull: { refreshToken: { token: incomingRefreshToken } } }
        );
    }

    res.clearCookie("refreshToken", CookieOptions).status(200).json({
        success: true,
        message: "User logged out successfully",
    });
})

export {RegisterUser,LoginUser,RefreshToken,LogoutUser}