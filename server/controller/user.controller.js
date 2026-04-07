import AsyncHandler from "../handler/AsyncHandler.js";
import User from "../model/user.model.js"
import { resetPasswordEmailTemplate } from "../template/resetPassword.js"
import sendEmail from "../utils/sendMail.js"
import crypto from "crypto"
import CustomError from "../handler/CustomError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import sanitizeUser from "../utils/sanitizeUser.js";

const getAppUrlFromRequest = (req) => {
    const origin = req?.headers?.origin;
    return origin || process.env.APP_URL || "http://localhost:5173";
}

// const User = AsyncHandler(async(req,res,next)=>{
//     res.status(200).json({
//         success:true,
//         message:"User route is working"
//     })
// })

const ChangePassword = AsyncHandler(async (req, res, next) => {

    const user = req.user; //from auth middleware

    const { oldPassword, newPassword } = req.body;



    const passwordIsCorrect = await user.comparePassword(oldPassword);



    if (!passwordIsCorrect) {
        return next(new CustomError(400, "Old password is incorrect"));
    }

    if (oldPassword === newPassword) {
        return next(new CustomError(400, "New password cannot be same as old password"));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })




})



const forgetPassword = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // here we will qurey in db
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If this email exists, reset instructions were sent."
        })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    user.forgetPasswordToken = hashedToken
    user.forgetPasswordExpiry = Date.now() + 10 * 60 * 1000

    await user.save()

    const appUrl = getAppUrlFromRequest(req)
    const resetPasswordTemp = resetPasswordEmailTemplate(user.name, token, appUrl)

    // Do not block forgot-password on email delivery (faster response).
    sendEmail(user.email, "reset_password", resetPasswordTemp)
        .catch((error) => console.error("Reset email failed:", error?.message || error))

    res.status(200).json({
        success: true,
        message: "If this email exists, reset instructions were sent."
    })


})

const resetPassword = AsyncHandler(async (req, res, next) => {

    const { token } = req.params;

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return next(new CustomError(400, "password should be equal to confirm password"))
    }

    const hashedIncomingToken = crypto.createHash("sha256").update(token).digest("hex")
    const findToken = await User.findOne({ forgetPasswordToken: hashedIncomingToken, forgetPasswordExpiry: { $gt: Date.now() } }).select("+password")

    if (!findToken) {
        return next(new CustomError(400, "invalid token"))

    }

    const isPasswordSame = await findToken.comparePassword(password)

    if (isPasswordSame) {
        return next(new CustomError(400, "New password cannot be same as old password"))
    }

    findToken.password = password;
    // Invalidate the token after a successful reset.
    findToken.forgetPasswordToken = null;
    findToken.forgetPasswordExpiry = null;


    await findToken.save()

    res.status(200).json({
        success: true,
        message: "password change successfully"
    })


})

const UpdateProfilePic = AsyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new CustomError(400, "Please upload an image"));
    }

    try {
        const result = await uploadToCloudinary({
            buffer: req.file.buffer,
            folder: "profiles"
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    profileImage: {
                        secure_url: result.secure_url,
                        public_id: result.public_id
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: sanitizeUser(updatedUser)
        });
    } catch (error) {
        return next(new CustomError(500, error.message || "Failed to upload image"));
    }
});

export { ChangePassword, forgetPassword, resetPassword, UpdateProfilePic };