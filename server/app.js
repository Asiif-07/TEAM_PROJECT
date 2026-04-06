import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "express-rate-limit";
import ErrorMiddleWare from "./middleWare/errorMiddleWare.middleware.js";
import authRouter from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.route.js";
import cvRouter from "./router/cv.route.js";


dotenv.config();


const app = express();

const isAllowed = ['http://localhost:5173'];
const localhostPortPattern = /^http:\/\/localhost:\d+$/;

const corsOptions = (req , cb) => {

    const origin = req.headers.origin;

    if(!origin){
        return cb(null, true);
    }

    if(isAllowed.includes(origin) || localhostPortPattern.test(origin)){
        return cb(
            null,
            {
                origin: true,
                methods:["GET" , "POST" , "PUT" , "PATCH" , "DELETE"],
                credentials: true,
                allowedHeaders: ['Content-Type', 'Authorization']
            }
        )
    }

    return cb(new Error("Not allowed by CORS"))
}

app.use(cors(corsOptions));

const rateLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    limit:100,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) => {
        res.status(429).json({
            message: "Too many requests, please try again later."
        })
    }
});

app.use(rateLimiter);

app.use(express.json({ limit: "15mb" }));

app.use(cookieParser())

app.use(express.urlencoded({extended:true}));


app.use('/api/v1/auth' , authRouter); 
app.use('/api/v1/user' , userRouter); 
app.use('/api/v1/cv' , cvRouter); 


app.use(ErrorMiddleWare);

export default app;



