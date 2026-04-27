/**
 * Premium Base Layout for CareerForge.AI Emails
 */
function emailBaseLayout(content, preheader = "") {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CareerForge.AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6;">
    <!-- Preheader text for inbox preview -->
    <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <div style="font-size: 24px; font-weight: 800; color: #2563EB; letter-spacing: -0.025em;">
                                CareerForge<span style="color: #1E293B;">.AI</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; background-color: #F9FAFB; text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.5;">
                                &copy; ${new Date().getFullYear()} CareerForge.AI. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #9CA3AF;">
                                Empowering careers with AI-driven precision.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export { emailBaseLayout };
