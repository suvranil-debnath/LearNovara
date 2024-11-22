import { createTransport } from "nodemailer";

// Create reusable transporter
const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
});


// Function to send email
export const sendMail = async (email, subject, templateName, data) => {
  try {
    // Fetch template and inject data
    const html = templates[templateName](data);

    // Send the email
    await transporter.sendMail({
      from: process.env.Gmail,
      to: email,
      subject,
      html,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email.");
  }
};
