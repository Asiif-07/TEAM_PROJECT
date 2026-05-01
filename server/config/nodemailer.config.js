import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.EMAIL || !process.env.NODEMAILER_PASS) {
    console.warn("WARNING: EMAIL or NODEMAILER_PASS environment variables are missing. Email functionality will not work.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.NODEMAILER_PASS,
    }
})

export default transporter