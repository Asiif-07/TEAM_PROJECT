import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

// OAuth (Google only) + traditional auth flows.


import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import { generateAccessToken, generateRefreshToken } from "../utils/genrateAccessToken.js"
import { CookieOptions } from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'
import { welcomeEmailTemplate } from "../template/registration.js"
import sendEmail from "../utils/sendMail.js"
import sanitizeUser from "../utils/sanitizeUser.js"


const getAppUrlFromRequest = (req) => {
  const origin = req?.headers?.origin;
  return origin || process.env.CLIENT_URL || process.env.APP_URL || "http://localhost:5173";
}

const RegisterUser = AsyncHandler(async (req, res, next) => {

  const { name, email, password, gender } = req.body
  const normalizedEmail = email.trim().toLowerCase();

  const UserExist = await User.findOne({ email: normalizedEmail })

  if (UserExist) {
    return next(new CustomError(400, "User already exist"))
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    gender
  })

  if (!user) {
    return next(new CustomError(400, "User not created"))
  }

  const appUrl = getAppUrlFromRequest(req)
  const welcomeEmail = welcomeEmailTemplate(user.name, user.email, appUrl)

  console.log(`[AUTH] Sending welcome email to ${user.email} for traditional signup...`);
  // Await email sending to guarantee completion on platforms like Render/Vercel
  await sendEmail(user.email, "welcome to our application", welcomeEmail)
    .then(() => console.log(`[AUTH] Welcome email sent for ${user.email}`))
    .catch((error) => console.error("[AUTH] Welcome email failed:", error?.message || error))

  res.status(201).json({
    success: true,
    message: "Account created successfully. Please log in.",
    user: sanitizeUser(user)
  })



})



const LoginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password")

  if (!user) {
    return next(new CustomError(400, "Invalid email or password"))
  }

  const comparePassword = await user.comparePassword(password);

  if (!comparePassword) {
    return next(new CustomError(400, "Invalid email or password"))
  }

  let accessToken = generateAccessToken(user)
  let refreshToken = generateRefreshToken(user)

  user.refreshToken = [{ token: refreshToken, createdAt: Date.now() }]

  await user.save({ validateBeforeSave: false })

  res.cookie("refreshToken", refreshToken, CookieOptions).status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken: accessToken,
    user: sanitizeUser(user)
  })

})

const RefreshToken = AsyncHandler(async (req, res, next) => {

  const incomingRefreshToken = req.cookies.refreshToken

  console.log("[Refresh Token] Cookie received:", !!incomingRefreshToken);

  if (!incomingRefreshToken) {
    return next(new CustomError(400, "Refresh token not found"))
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    console.error("[Refresh Token] JWT verification failed:", err.message);
    return next(new CustomError(400, "Invalid or expired refresh token"))
  }

  if (!decoded.userId) {
    return next(new CustomError(400, "Invalid refresh token"))
  }

  const isTokenValid = await User.findOne({ "refreshToken.token": incomingRefreshToken });

  console.log("[Refresh Token] User found:", !!isTokenValid);

  if (!isTokenValid) {
    return next(new CustomError(400, "Invalid refresh token"))
  }

  const newAccessToken = generateAccessToken(isTokenValid)
  const newRefreshToken = generateRefreshToken(isTokenValid)


  const updatedUser = await User.findOneAndUpdate(
    { _id: isTokenValid._id, "refreshToken.token": incomingRefreshToken },
    {
      $set: {
        refreshToken: [{ token: newRefreshToken, createdAt: Date.now() }],
      },
    },
    { returnDocument: 'after' }
  )

  if (!updatedUser) {
    return next(new CustomError(400, "Invalid refresh token"))
  }

  console.log("[Refresh Token] Success - tokens refreshed for user:", updatedUser.email);

  res.cookie("refreshToken", newRefreshToken, CookieOptions).status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    accessToken: newAccessToken,
    user: sanitizeUser(updatedUser),
  })
})

const LogoutUser = AsyncHandler(async (req, res, next) => {
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



const googleOAuthStateCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 10 * 60 * 1000,
  path: "/",
};

async function findOrCreateUserFromGooglePayload(payload) {
  if (!payload?.email || !payload?.sub) {
    throw new CustomError(400, "Invalid Google account data");
  }

  const email = String(payload.email).toLowerCase().trim();
  const googleName = payload.name || email.split("@")[0];
  const googlePicture = payload.picture || "";

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

  if (!user) {
    return new User({
      name: googleName,
      email,
      googleId: payload.sub,
      gender: "other",
      profileImage: {
        secure_url: googlePicture,
        public_id: "",
      },
    });
  }

  if (user.googleId && user.googleId !== payload.sub) {
    throw new CustomError(403, "This email is already linked to a different Google account");
  }

  if (!user.googleId) user.googleId = payload.sub;
  if (!user.name || user.name === "hi" || user.name === "Hi" || user.name === email.split("@")[0]) {
    user.name = googleName;
  }
  if (!user.profileImage?.secure_url && googlePicture) {
    user.profileImage = { secure_url: googlePicture, public_id: "" };
  }

  return user;
}

async function issueSessionForUser(req, res, user) {
  const isNewUser = user.isNew;
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = [{ token: refreshToken, createdAt: Date.now() }];
  await user.save({ validateBeforeSave: false });

  if (isNewUser) {
    const appUrl = getAppUrlFromRequest(req);
    const welcomeEmail = welcomeEmailTemplate(user.name, user.email, appUrl);
    await sendEmail(user.email, "welcome to our application", welcomeEmail).catch(() => {});
  }

  res.cookie("refreshToken", refreshToken, CookieOptions);
  return { accessToken, user: sanitizeUser(user) };
}

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const GoogleLoginUser = AsyncHandler(async (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !googleClient) {
    return next(new CustomError(503, "Google sign-in is not configured on the server"));
  }

  const { credential } = req.body;

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    return next(new CustomError(400, "Could not verify Google sign-in"));
  }

  const payload = ticket.getPayload();
  let user;
  try {
    user = await findOrCreateUserFromGooglePayload(payload);
  } catch (err) {
    return next(err);
  }

  const { accessToken, user: safeUser } = await issueSessionForUser(req, res, user);

  return res.status(200).json({
    success: true,
    message: "Signed in with Google",
    accessToken,
    user: safeUser,
  });
});

export {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  GoogleLoginUser,
}

