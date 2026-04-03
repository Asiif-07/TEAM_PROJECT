function resetPasswordEmailTemplate(username, resetToken, appUrl) {
    const clientUrl = appUrl || process.env.APP_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    return `
    <div style="
        font-family: Arial, sans-serif; 
        max-width: 600px; 
        margin: auto; 
        padding: 20px; 
        border: 1px solid #e0e0e0; 
        border-radius: 10px;
        background-color: #f9f9f9;
        color: #333;
    ">
        <h2 style="color: #FF5722;">Reset Your Password, ${username}</h2>
        <p>We received a request to reset your account password.</p>

        <p>Click the button below to reset your password. This link will expire in 10 minutes for security reasons.</p>

          <a href="${resetLink}" style="
            display: inline-block;
            padding: 10px 20px;
            margin-top: 14px;
            background-color: #FF5722;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">Reset Password</a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
            If you did not request a password reset, please ignore this email. Your account is safe.
        </p>

        <p style="margin-top: 10px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} UCONNECT INTERS. All rights reserved.
        </p>
    </div>
    `;
}

export { resetPasswordEmailTemplate };