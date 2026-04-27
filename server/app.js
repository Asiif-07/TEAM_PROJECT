import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import limiter from "express-rate-limit";
import ErrorMiddleWare from "./middleWare/errorMiddleWare.middleware.js";
import authRouter from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.route.js";
import cvRouter from "./router/cv.route.js";
import aiRouter from "./router/ai.route.js";
import stripeRouter from "./router/stripe.route.js";
import { stripeWebhook } from "./controller/stripe.controller.js";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.APP_URL,
    "https://carrerforge.vercel.app", // Explicit fallback

].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/$/, "");
        const allowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        if (allowed.includes(normalizedOrigin) || normalizedOrigin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            console.error(`[CORS] Blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const rateLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) => {
        res.status(429).json({
            message: "Too many requests, please try again later."
        })
    }
});

// app.use(rateLimiter);

// MUST BE BEFORE express.json() to parse Stripe Webhooks correctly
app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json({ limit: "15mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/cv', cvRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/stripe', stripeRouter);

app.use(ErrorMiddleWare);

export default app;
