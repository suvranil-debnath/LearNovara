import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          /* Base reset */
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }
  
          body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f0f2f5;
              color: #333;
          }
  
          .container {
              background-color: #ffffff;
              padding: 40px 30px;
              border-radius: 12px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
  
          .container:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }
  
          h1 {
              color: #4a4a4a;
              font-size: 1.8em;
              margin-bottom: 16px;
          }
  
          p {
              margin-bottom: 24px;
              color: #555;
              font-size: 1em;
              line-height: 1.6;
          }
  
          .otp {
              font-size: 2.2em;
              font-weight: bold;
              color: #6a5acd; /* Slightly softened purple */
              margin-bottom: 20px;
              letter-spacing: 2px;
              transition: color 0.3s ease;
          }
  
          .otp:hover {
              color: #483d8b;
          }
  
          .footer-note {
              font-size: 0.85em;
              color: #888;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>OTP Verification</h1>
          <p>Hello ${data.name}, your one-time password for account verification is:</p>
          <p class="otp">${data.otp}</p> 
          <p class="footer-note">This code will expire in 10 minutes.</p>
      </div>
  </body>
  </html>
  `;
  
  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to reset your password.</p>
    <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://yourwebsite.com">yourwebsite.com</a></p>
    </div>
  </div>
</body>
</html>
`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};
