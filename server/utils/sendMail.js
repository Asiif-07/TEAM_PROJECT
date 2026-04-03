import transporter from "../config/nodemailer.config.js";

const sendEmail = async (useremail,subject,html)=>{
    try {
        await transporter.sendMail({
            from:`this email is send from ${process.env.EMAIL}`,
            to:useremail,
            subject:subject,
            html:html,

        })
        console.log(`email send successfully`)
        return true
    } catch (err) {
        console.log(`failed to send email due to error ${err}`)
        throw err
    }
}


export default sendEmail