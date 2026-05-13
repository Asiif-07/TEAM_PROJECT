import sendEmail from "../utils/sendMail.js"; // Changed to match your export name
import AsyncHandler from "../handler/AsyncHandler.js"; 
import { getContactEmailTemplate } from "../template/contactmail.templet.js"; 
import { Contact } from "../model/contact.model.js";

export const submitContactForm = AsyncHandler(async (req, res, next) => {
    const userId = req.userId; 
  const { fullName, email, company, phone, message } = req.body;
  

  // 1. Save to DB (AsyncHandler catches any DB errors automatically)
  const savedContact = await Contact.create({
    userId,
    fullName,
    email,
    company,
    phone,
    message
  });

  // 2. Try sending the email
  try {
    const emailSubject = `New Support Request from ${fullName}`;
    const emailHtml = getContactEmailTemplate({
      fullName,
      email,
      company,
      phone,
      message,
      userId
    });

    // 3. Send email using YOUR positional arguments
    // Passed exactly as: (useremail, subject, html)
    await sendEmail(
      process.env.EMAIL, 
      emailSubject, 
      emailHtml
    );

    // 4. If email sent successfully -> delete message from DB
    await Contact.findByIdAndDelete(savedContact._id);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });

  } catch (emailError) {
    // 5. If email fails -> keep message in DB
    console.error('Email delivery failed. Message retained in DB safely:', emailError);
    
    return res.status(201).json({
      success: true,
      message: 'Your message has been received successfully. We will be in touch soon!',
      data: {
        id: savedContact._id, 
      }
    });
  }
});