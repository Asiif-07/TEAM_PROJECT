import { emailBaseLayout } from "./baseLayout.js";

function resetPasswordEmailTemplate(username, resetToken, appUrl) {
    const clientUrl = appUrl || process.env.APP_URL || "https://carrerforge.vercel.app";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #1E293B; line-height: 1.2; letter-spacing: -0.02em;">
                Reset your password
            </h1>
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                Hi <span style="color: #1E293B; font-weight: 600;">${username}</span>, we received a request to secure your account.
            </p>
        </div>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
            <tr>
                <td align="center">
                    <a href="${resetLink}" style="display: inline-block; padding: 18px 44px; background-color: #2563EB; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                        Secure My Account
                    </a>
                </td>
            </tr>
        </table>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #1E293B; font-weight: 600;">
                Important Security Information
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748B; line-height: 1.6;">
                <li>This link will expire in <span style="color: #1E293B; font-weight: 600;">10 minutes</span>.</li>
                <li>If you didn't request this, you can safely ignore this email.</li>
                <li>Your account remains secure.</li>
            </ul>
        </div>
        
        <div style="border-top: 1px solid #F1F5F9; padding-top: 24px; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #94A3B8;">
                If you're having trouble with the button, copy and paste this link:
            </p>
            <p style="margin: 0; font-size: 12px; color: #2563EB; word-break: break-all; opacity: 0.8;">
                ${resetLink}
            </p>
        </div>
    `;

    return emailBaseLayout(content, "Password reset request for your CareerForge.AI account");
}

export { resetPasswordEmailTemplate };