import { emailBaseLayout } from "./baseLayout.js";

function resetPasswordEmailTemplate(username, resetToken, appUrl) {
    const clientUrl = appUrl || process.env.APP_URL || "https://carrerforge.vercel.app";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    const content = `
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 800; color: #1E293B; line-height: 1.2;">
            Reset your password
        </h1>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
            Hi **${username}**, we received a request to reset your account password. If you didn't request this, you can safely ignore this email.
        </p>
        
        <div style="background-color: #FFF7ED; border-left: 4px solid #EA580C; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #9A3412; font-weight: 600;">
                Security Note: <span style="font-weight: 400; color: #1E293B;">This link will expire in 10 minutes.</span>
            </p>
        </div>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; background-color: #EA580C; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; transition: background-color 0.3s ease;">
                        Reset Password
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #9CA3AF; text-align: center;">
            If you're having trouble clicking the button, copy and paste this link into your browser:
            <br>
            <span style="color: #2563EB; word-break: break-all;">${resetLink}</span>
        </p>
    `;

    return emailBaseLayout(content, "Password reset request for your CareerForge.AI account");
}

export { resetPasswordEmailTemplate };