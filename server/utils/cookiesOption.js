
const CookieOptions = {
    httpOnly: true,
    secure: true, // Required for sameSite: "none"
    sameSite: "none", // Required for cross-site cookies
    maxAge: 8 * 24 * 60 * 60 * 1000
}


export { CookieOptions }