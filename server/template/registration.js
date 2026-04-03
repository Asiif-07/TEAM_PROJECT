function welcomeEmailTemplate(username, useremail, appUrl) {
    const clientUrl = appUrl || process.env.APP_URL || "http://localhost:5173";
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
        <h2 style="color: #4CAF50;">Welcome to UCONNECT, ${username}! 🎉</h2>
        <p>We are thrilled to have you on board.</p>

        <p>Your registered email is: <b>${useremail}</b></p>

        <p>Get started by exploring your dashboard, connecting with other interns, and making the most out of our application.</p>

        <a href="${clientUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        ">Go to Dashboard</a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
            If you did not sign up for this account, please ignore this email.
        </p>

        <p style="margin-top: 10px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} UCONNECT INTERS. All rights reserved.
        </p>
    </div>
    `;
}

export { welcomeEmailTemplate };