const isProduction = process.env.NODE_ENV === "production";

const CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 8 * 24 * 60 * 60 * 1000
};

export { CookieOptions };