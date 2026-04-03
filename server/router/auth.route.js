import { Router } from "express";
import { RegisterUser, LoginUser ,RefreshToken, LogoutUser } from "../controller/auth.controller.js";
import validate from "../middleWare/validate.js";
import registerSchema from "../schemas/registerSchema.schema.js";
import LoginSchema from "../schemas/loginSchema.schema.js";
import { authRegisterLimiter, authLoginLimiter } from "../middleWare/rateLimiters.js";

const authRouter = Router();

authRouter.route("/register").post(authRegisterLimiter, validate(registerSchema), RegisterUser)
authRouter.route("/login").post(authLoginLimiter, validate(LoginSchema), LoginUser)
authRouter.route("/refresh-Token").post(RefreshToken)
authRouter.route("/logout").post(LogoutUser)



export default authRouter;