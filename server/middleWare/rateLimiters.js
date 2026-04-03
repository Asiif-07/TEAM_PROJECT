import limiter from "express-rate-limit";

// Short-window limiters for auth-related endpoints (avoid spam + reduce load).
const authRegisterLimiter = limiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 5,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) =>
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again in a minute.",
        }),
});

const authLoginLimiter = limiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 8,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) =>
        res.status(429).json({
            success: false,
            message: "Too many login attempts. Please try again in a minute.",
        }),
});

const forgetPasswordLimiter = limiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 5,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) =>
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again in a minute.",
        }),
});

const resetPasswordLimiter = limiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 8,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) =>
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again in a minute.",
        }),
});

export { authRegisterLimiter, authLoginLimiter, forgetPasswordLimiter, resetPasswordLimiter };

