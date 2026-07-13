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

  res.clearCookie("refreshToken", { path: "/" }).status(200).json({
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

async function findOrCreateUserFromLinkedInPayload({ sub, email, name, picture }) {
  if (!email || !sub) {
    throw new CustomError(400, "Invalid LinkedIn account data");
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  let user = await User.findOne({ 
    $or: [{ linkedinId: sub }, { email: normalizedEmail }] 
  });

  if (!user) {
    return new User({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      linkedinId: sub,
      gender: "other",
      profileImage: {
        secure_url: picture || "",
        public_id: "",
      },
    });
  }

  if (user.linkedinId && user.linkedinId !== sub) {
    throw new CustomError(403, "This email is already linked to a different LinkedIn account");
  }

  if (!user.linkedinId) user.linkedinId = sub;
  if (!user.name || user.name === "hi" || user.name === "Hi" || user.name === normalizedEmail.split("@")[0]) {
    user.name = name;
  }
  if (!user.profileImage?.secure_url && picture) {
    user.profileImage = { secure_url: picture, public_id: "" };
  }

  return user;
}

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const GoogleLoginUser = AsyncHandler(async (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !googleClient) {
    return next(new CustomError(503, "Google sign-in is not configured on the server"));
  }

  const { credential, access_token } = req.body;
  let payload;

  if (credential) {
    // ID token from standard GoogleLogin widget
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return next(new CustomError(400, "Could not verify Google sign-in"));
    }
    payload = ticket.getPayload();
  } else if (access_token) {
    // Access token from useGoogleLogin implicit flow
    try {
      const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!resp.ok) throw new Error("Invalid token");
      payload = await resp.json();
    } catch (err) {
      return next(new CustomError(400, "Could not verify Google access token"));
    }
  } else {
    return next(new CustomError(400, "Missing Google credentials"));
  }

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

const LinkedinStart = AsyncHandler(async (req, res) => {
  // Encode the frontend origin into state so the callback can redirect back to the correct URL
  const clientOrigin = req.headers.referer
    ? new URL(req.headers.referer).origin
    : (process.env.CLIENT_URL || "http://localhost:5173");
  const state = Buffer.from(JSON.stringify({ clientOrigin })).toString("base64");
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_CALLBACK_URL)}&state=${state}&scope=openid%20profile%20email`;
  res.redirect(linkedinAuthUrl);
});

const LinkedinCallback = AsyncHandler(async (req, res, next) => {
  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
    return next(new CustomError(503, "LinkedIn is not configured on the server"));
  }

  const { code, state } = req.query;

  // Decode the client origin from state (encoded by LinkedinStart)
  let clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  if (state && state !== "some_random_state") {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      if (decoded?.clientOrigin) clientUrl = decoded.clientOrigin;
    } catch {
      // ignore decode errors, use default clientUrl
    }
  }

  if (!code) {
    return res.redirect(`${clientUrl}/login?oauth_error=LinkedIn+authorization+code+missing`);
  }

  // Strip any surrounding quotes from the secret (dotenv quirk)
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET.replace(/^"|"$/g, "");
  const callbackUrl = process.env.LINKEDIN_CALLBACK_URL;

  let accessTokenData;
  try {
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUrl,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: clientSecret,
      }),
    });
    
    if (!tokenResponse.ok) {
      console.error("[AUTH] LinkedIn token error:", await tokenResponse.text());
      return res.redirect(`${clientUrl}/login?oauth_error=LinkedIn+verification+failed`);
    }
    accessTokenData = await tokenResponse.json();
  } catch (err) {
    return res.redirect(`${clientUrl}/login?oauth_error=LinkedIn+verification+failed`);
  }

  let linkedinProfile;
  try {
    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessTokenData.access_token}` },
    });
    if (!profileResponse.ok) {
      throw new Error("Invalid LinkedIn access token for profile");
    }
    linkedinProfile = await profileResponse.json();
  } catch (err) {
    return res.redirect(`${clientUrl}/login?oauth_error=LinkedIn+profile+fetch+failed`);
  }

  let user;
  try {
    user = await findOrCreateUserFromLinkedInPayload({
      sub: linkedinProfile.sub,
      email: linkedinProfile.email,
      name: linkedinProfile.name,
      picture: linkedinProfile.picture
    });
  } catch (err) {
    return res.redirect(`${clientUrl}/login?oauth_error=${encodeURIComponent(err.message)}`);
  }

  const { accessToken, user: safeUser } = await issueSessionForUser(req, res, user);

  // Encode the token and user to pass to frontend cleanly, bypassing cross-site cookie drops
  const payloadStr = JSON.stringify({ accessToken, user: safeUser });
  const b64Payload = Buffer.from(payloadStr).toString('base64');

  res.redirect(`${clientUrl}/oauth/linkedin-done?t=${b64Payload}`);
});

export {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  GoogleLoginUser,
  LinkedinStart,
  LinkedinCallback,
}

