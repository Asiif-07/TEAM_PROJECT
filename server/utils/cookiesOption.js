
const CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 8 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined
}


export { CookieOptions }