import transporter from "../config/nodemailer.config.js";

const sendEmail = async (useremail, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"CareerForge.AI" <${process.env.EMAIL}>`,
            to: useremail,
            subject: subject,
            html: html,
        })
        console.log(`email send successfully`)
        return true
    } catch (err) {
        console.error(`[ERROR] Failed to send email to ${useremail} due to error:`, err.message || err);
        throw err;
    }
}


export default sendEmail