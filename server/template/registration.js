import { emailBaseLayout } from "./baseLayout.js";

function welcomeEmailTemplate(username, useremail, appUrl) {
    const clientUrl = appUrl || process.env.APP_URL || "https://carrerforge.vercel.app";

    const content = `
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 800; color: #1E293B; line-height: 1.2;">
            Welcome to the future of careers, ${username}! 🚀
        </h1>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
            We're thrilled to have you join **CareerForge.AI**. You've just taken a massive step towards building a standout professional presence.
        </p>
        
        <div style="background-color: #EFF6FF; border-left: 4px solid #2563EB; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #1E40AF; font-weight: 600;">
                Registered Email: <span style="font-weight: 400; color: #1E293B;">${useremail}</span>
            </p>
        </div>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
            Get started by exploring our AI-powered CV templates, analyzing your current resume, or connecting with our career assistant.
        </p>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <a href="${clientUrl}" style="display: inline-block; padding: 16px 32px; background-color: #2563EB; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; transition: background-color 0.3s ease;">
                        Go to Dashboard
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #9CA3AF; font-style: italic; text-align: center;">
            No longer interested? <a href="#" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe</a> anytime.
        </p>
    `;

    return emailBaseLayout(content, `Welcome to CareerForge.AI, ${username}!`);
}

export { welcomeEmailTemplate };