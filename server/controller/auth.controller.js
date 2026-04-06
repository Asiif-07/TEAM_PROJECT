import crypto from "crypto";
import AsyncHandler from '../handler/AsyncHandler.js'
import User from '../model/user.model.js'
import CustomError from '../handler/CustomError.js'
import {generateAccessToken , generateRefreshToken} from "../utils/genrateAccessToken.js"
import {CookieOptions} from '../utils/cookiesOption.js'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from "google-auth-library"
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

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const googleOAuthStateCookie = {
  httpOnly: true,
  secure: CookieOptions.secure === true,
  sameSite: "lax",
  maxAge: 10 * 60 * 1000,
  path: "/",
};

const GOOGLE_CALLBACK_PATH = "/api/v1/auth/google/callback";

function getOAuthRedirectAllowlist() {
  const raw = process.env.OAUTH_REDIRECT_ORIGINS;
  if (raw) {
    return raw.split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
  }
  const list = ["http://localhost:5173", "http://127.0.0.1:5173"];
  if (process.env.APP_URL) {
    try {
      list.push(new URL(process.env.APP_URL).origin);
    } catch {
      list.push(String(process.env.APP_URL).replace(/\/$/, ""));
    }
  }
  return [...new Set(list)];
}

function originIsAllowed(origin, allowlist) {
  if (!origin) return false;
  const n = origin.replace(/\/$/, "");
  return allowlist.some((a) => a === n);
}

function getOriginFromRequest(req) {
  const o = req.get("origin");
  if (o) {
    try {
      return new URL(o).origin;
    } catch {
      /* ignore */
    }
  }
  const ref = req.get("referer");
  if (ref) {
    try {
      return new URL(ref).origin;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function buildGoogleRedirectUri(origin) {
  return `${String(origin).replace(/\/$/, "")}${GOOGLE_CALLBACK_PATH}`;
}

function redirectUriIsAllowed(redirectUri, allowlist) {
  if (!redirectUri || typeof redirectUri !== "string") return false;
  try {
    const u = new URL(redirectUri);
    const path = (u.pathname || "").replace(/\/$/, "") || "/";
    const expected = GOOGLE_CALLBACK_PATH.replace(/\/$/, "");
    if (path !== expected) return false;
    return originIsAllowed(u.origin, allowlist);
  } catch {
    return false;
  }
}

/** Same redirect_uri must be used for authorize + token exchange; derive from browser + store in cookie. */
function resolveOAuthRedirectUri(req) {
  const allowlist = getOAuthRedirectAllowlist();
  const fromBrowser = getOriginFromRequest(req);
  if (fromBrowser && originIsAllowed(fromBrowser, allowlist)) {
    return buildGoogleRedirectUri(fromBrowser);
  }
  const fallback = process.env.CALLBACK_URL?.trim();
  if (fallback && redirectUriIsAllowed(fallback, allowlist)) {
    return fallback.replace(/\/$/, "");
  }
  return null;
}

function appBaseFromRedirectUri(redirectUri) {
  if (!redirectUri) return null;
  try {
    return new URL(redirectUri).origin;
  } catch {
    return null;
  }
}

function getOAuth2ClientForRedirect(redirectUri) {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret || !redirectUri) return null;
  return new OAuth2Client(id, secret, redirectUri);
}

const appBaseUrl = () => process.env.APP_URL || "http://localhost:5173";

async function findOrCreateUserFromGooglePayload(payload) {
  if (!payload?.email || !payload?.sub) {
    throw new CustomError(400, "Invalid Google account data");
  }
  const email = String(payload.email).toLowerCase().trim();

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

  if (!user) {
    user = await User.create({
      name: email.split("@")[0],
      email,
      googleId: payload.sub,
      gender: "other",
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
  if (user.name === "hi" || user.name === "Hi") {
    user.name = email.split("@")[0];
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
    return next(
      new CustomError(503, "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.")
    );
  }

  const redirectUri = resolveOAuthRedirectUri(req);
  if (!redirectUri) {
    const examples = getOAuthRedirectAllowlist().map((o) => buildGoogleRedirectUri(o)).join(", ");
    return next(
      new CustomError(
        400,
        `Could not pick a safe redirect URI. Open the app from an allowed origin (see OAUTH_REDIRECT_ORIGINS), ` +
          `and in Google Cloud add these Authorized redirect URIs: ${examples}`
      )
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  res.cookie("google_oauth_state", state, googleOAuthStateCookie);
  res.cookie("google_oauth_redirect", redirectUri, googleOAuthStateCookie);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

const GoogleOAuthCallback = AsyncHandler(async (req, res) => {
  const allowlist = getOAuthRedirectAllowlist();
  let redirectUri = req.cookies?.google_oauth_redirect;
  const cookieState = req.cookies?.google_oauth_state;
  const baseFromCookie = appBaseFromRedirectUri(redirectUri);
  const base = baseFromCookie || appBaseUrl();

  const redirectLogin = (msg) =>
    res.redirect(302, `${base}/login?oauth_error=${encodeURIComponent(msg)}`);

  const clearOAuthCookies = () => {
    res.clearCookie("google_oauth_state", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    res.clearCookie("google_oauth_redirect", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
  };

  if (!redirectUri?.trim() && process.env.CALLBACK_URL?.trim()) {
    redirectUri = process.env.CALLBACK_URL.trim().replace(/\/$/, "");
  }

  if (!redirectUriIsAllowed(redirectUri, allowlist)) {
    clearOAuthCookies();
    return redirectLogin(
      "Invalid OAuth redirect (redirect_uri_mismatch). Add this exact URL under Google Cloud → Credentials → Authorized redirect URIs: " +
        (redirectUri || buildGoogleRedirectUri("http://localhost:5173"))
    );
  }

  const oauth2 = getOAuth2ClientForRedirect(redirectUri);
  if (!oauth2) {
    clearOAuthCookies();
    return redirectLogin("Google OAuth is not configured on the server.");
  }

  if (req.query.error) {
    clearOAuthCookies();
    return redirectLogin(String(req.query.error_description || req.query.error));
  }

  const { code, state } = req.query;

  if (!code || !state || !cookieState || state !== cookieState) {
    clearOAuthCookies();
    return redirectLogin("Invalid or expired sign-in session. Please try again.");
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
    const message = err instanceof CustomError ? err.message : "Sign-in failed.";
    return redirectLogin(message);
  }

  clearOAuthCookies();
  await issueSessionForUser(res, user);
  res.redirect(302, `${base}/oauth/google-done`);
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

export {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  GoogleLoginUser,
  GoogleOAuthStart,
  GoogleOAuthCallback,
}