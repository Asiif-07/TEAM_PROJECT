import crypto from "crypto";
import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import { generateAccessToken, generateRefreshToken } from "../utils/genrateAccessToken.js"
import { CookieOptions } from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from "google-auth-library"
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

  // Do not block signup on email sending (faster UX).
  sendEmail(user.email, "welcome to our application", welcomeEmail)
    .catch((error) => console.error("Welcome email failed:", error?.message || error))

  res.status(201).json({
    success: true,
    message: "Account created successfully. Please log in.",
    user: sanitizeUser(user)
  })



})

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const GOOGLE_CALLBACK_URI = process.env.CALLBACK_URL || "https://team-project-qa0v.onrender.com/api/v1/auth/google/callback";
const FRONTEND_BASE = process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.APP_URL || "https://carrerforge.vercel.app";

const googleOAuthStateCookie = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 10 * 60 * 1000,
  path: "/",
};

function getOAuth2ClientForRedirect() {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret) return null;
  return new OAuth2Client(id, secret, GOOGLE_CALLBACK_URI);
}

const appBaseUrl = () => FRONTEND_BASE;

async function findOrCreateUserFromGooglePayload(payload) {
  if (!payload?.email || !payload?.sub) {
    throw new CustomError(400, "Invalid Google account data");
  }
  const email = String(payload.email).toLowerCase().trim();
  const googleName = payload.name || email.split("@")[0];
  const googlePicture = payload.picture || "";

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

  if (!user) {
    user = await User.create({
      name: googleName,
      email,
      googleId: payload.sub,
      gender: "other",
      profileImage: {
        secure_url: googlePicture,
        public_id: ""
      }
    });
    return user;
  }

  if (user.googleId && user.googleId !== payload.sub) {
    throw new CustomError(403, "This email is already linked to a different Google account");
  }

  let needsSave = false;
  if (!user.googleId) {
    user.googleId = payload.sub;
    needsSave = true;
  }

  if (!user.name || user.name === "hi" || user.name === "Hi" || user.name === email.split("@")[0]) {
    user.name = googleName;
    needsSave = true;
  }

  if (!user.profileImage?.secure_url && googlePicture) {
    user.profileImage = {
      secure_url: googlePicture,
      public_id: ""
    };
    needsSave = true;
  }

  if (needsSave) {
    await user.save({ validateBeforeSave: false });
  }
  return user;
}

async function issueSessionForUser(res, user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = [{ token: refreshToken, createdAt: Date.now() }];
  await user.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, CookieOptions);
  return { accessToken, user: sanitizeUser(user) };
}

const GoogleOAuthStart = AsyncHandler(async (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return next(new CustomError(503, "Google OAuth is not configured."));
  }

  const state = crypto.randomBytes(24).toString("hex");
  res.cookie("google_oauth_state", state, googleOAuthStateCookie);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

const GoogleOAuthCallback = AsyncHandler(async (req, res) => {
  const cookieState = req.cookies?.google_oauth_state;

  const redirectLogin = (msg) =>
    res.redirect(302, `${FRONTEND_BASE}/login?oauth_error=${encodeURIComponent(msg)}`);

  const clearOAuthCookies = () =>
    res.clearCookie("google_oauth_state", { httpOnly: true, path: "/", sameSite: "lax" });

  if (req.query.error) {
    clearOAuthCookies();
    return redirectLogin(String(req.query.error_description || req.query.error));
  }

  const { code, state } = req.query;
  if (!code || !state || !cookieState || state !== cookieState) {
    clearOAuthCookies();
    return redirectLogin("Invalid or expired sign-in session. Please try again.");
  }

  const oauth2 = getOAuth2ClientForRedirect();
  if (!oauth2) {
    clearOAuthCookies();
    return redirectLogin("Google OAuth is not configured on the server.");
  }

  let tokens;
  try {
    const result = await oauth2.getToken(code);
    tokens = result.tokens;
  } catch {
    clearOAuthCookies();
    return redirectLogin("Could not complete Google sign-in. Please try again.");
  }

  if (!tokens?.id_token) {
    clearOAuthCookies();
    return redirectLogin("Google did not return an ID token.");
  }

  let ticket;
  try {
    ticket = await oauth2.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch {
    clearOAuthCookies();
    return redirectLogin("Could not verify Google sign-in.");
  }

  const payload = ticket.getPayload();
  let user;
  try {
    user = await findOrCreateUserFromGooglePayload(payload);
  } catch (err) {
    clearOAuthCookies();
    return redirectLogin(err instanceof CustomError ? err.message : "Sign-in failed.");
  }

  clearOAuthCookies();
  await issueSessionForUser(res, user);
  res.redirect(302, `${FRONTEND_BASE}/oauth/google-done`);
});

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
  } catch {
    return next(new CustomError(400, "Could not verify Google sign-in"));
  }

  const payload = ticket.getPayload();
  let user;
  try {
    user = await findOrCreateUserFromGooglePayload(payload);
  } catch (err) {
    return next(err);
  }

  const { accessToken, user: safeUser } = await issueSessionForUser(res, user);

  res.status(200).json({
    success: true,
    message: "Signed in with Google",
    accessToken,
    user: safeUser,
  });
});

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

  if (!incomingRefreshToken) {
    return next(new CustomError(400, "Refresh token not found"))
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

  if (!decoded.userId) {
    return next(new CustomError(400, "Invalid refresh token"))
  }

  const isTokenValid = await User.findOne({ "refreshToken.token": incomingRefreshToken });

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

export {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  GoogleLoginUser,
  GoogleOAuthStart,
  GoogleOAuthCallback,
}