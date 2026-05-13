export const getContactEmailTemplate = (data) => {
  const { fullName, email, company, phone, message, userId } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Support Request</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f7f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #2563eb; /* A nice modern blue */
          color: #ffffff;
          padding: 30px 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 40px;
          color: #333333;
        }
        .user-details {
          background-color: #f8fafc;
          border-left: 4px solid #94a3b8;
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 30px;
        }
        .user-details p {
          margin: 8px 0;
          font-size: 15px;
          line-height: 1.5;
        }
        .user-details strong {
          color: #475569;
          display: inline-block;
          width: 140px;
        }
        .message-section h2 {
          font-size: 18px;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .message-box {
          font-size: 16px;
          line-height: 1.6;
          color: #334155;
          white-space: pre-wrap; /* Preserves formatting and line breaks */
        }
        .footer {
          background-color: #f1f5f9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>New Contact Inquiry</h1>
        </div>

        <!-- Body Content -->
        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">You have received a new message from your website contact form.</p>
          
          <!-- Sender Information -->
          <div class="user-details">
            <p><strong>System User ID:</strong> ${userId || 'Guest'}</p>
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></p>
            <p><strong>Company/School:</strong> ${company || '<em>Not provided</em>'}</p>
            <p><strong>Phone:</strong> ${phone || '<em>Not provided</em>'}</p>
          </div>

          <!-- Message Details -->
          <div class="message-section">
            <h2>How can we help?</h2>
            <div class="message-box">${message}</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>This email was generated automatically by your application backend.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};