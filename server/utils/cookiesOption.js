
const CookieOptions = {
    httpOnly: true,
    secure: true, // Required for sameSite: "none"
    sameSite: "none", // Required for cross-site cookies
    maxAge: 8 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined // Set to '.yourdomain.com' if needed for subdomains
}


export { CookieOptions }