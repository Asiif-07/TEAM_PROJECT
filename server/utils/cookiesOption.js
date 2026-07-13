
const isProduction = process.env.NODE_ENV === "production";

// In deployments behind a proxy, NODE_ENV may be "production" while the app still receives HTTP.
// Using request protocol ensures the browser accepts the cookie when HTTPS is actually used.
function getCookieOptions(req) {
    const proto = req?.headers?.["x-forwarded-proto"];
    const protocol = Array.isArray(proto) ? proto[0] : proto;

    const isSecure = req?.secure === true || protocol === "https";

    return {
        httpOnly: true,
        secure: isProduction ? isSecure : false,
        // For cross-site auth flows you generally need SameSite=None + Secure.
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 8 * 24 * 60 * 60 * 1000,
    };
}

export { getCookieOptions }

