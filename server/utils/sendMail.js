import transporter from "../config/nodemailer.config.js";

const sendEmail = async (useremail, subject, html) => {
    try {
        console.log(`[DEBUG] Attempting to send email to: ${useremail} with subject: ${subject}`);
        const info = await transporter.sendMail({
            from: `"CareerForge.AI" <${process.env.EMAIL}>`,
            to: useremail,
            subject: subject,
            html: html,
        })
        console.log(`[SUCCESS] Email sent successfully to ${useremail}. MessageId: ${info.messageId}`);
        return true
    } catch (err) {
        console.error(`[ERROR] Failed to send email to ${useremail} due to error:`, err.message || err);
        throw err;
    }
}


export default sendEmail