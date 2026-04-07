import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { ChangePassword, forgetPassword, resetPassword, UpdateProfilePic } from "../controller/user.controller.js";
import validate from "../middleWare/validate.js";
import changePasswordSchema from "../schemas/changePassword.schema.js";
import forgetPasswordSchema from "../schemas/forgetPassword.schema.js"
import resetPasswordSchema from "../schemas/resetPassword.schema.js";
import { forgetPasswordLimiter, resetPasswordLimiter } from "../middleWare/rateLimiters.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRouter = Router();

// userRouter.route("/").get(authMiddleWare, User)
userRouter.route("/change-password").post(validate(changePasswordSchema), authMiddleWare, ChangePassword)
userRouter.route("/update-profile-pic").post(authMiddleWare, upload.single("profileImage"), UpdateProfilePic)
userRouter.route("/forget_password").post(forgetPasswordLimiter, validate(forgetPasswordSchema), forgetPassword)
userRouter.route("/resetpassword/:token").post(resetPasswordLimiter, validate(resetPasswordSchema), resetPassword)

export default userRouter;