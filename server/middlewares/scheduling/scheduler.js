import schedule from "node-schedule";
import { createTransport } from "nodemailer";
import Schedule from "../../models/Schedule.js";
import { User } from "../../models/User.js"; // Assuming you have a User model to fetch user details
import dotenv from "dotenv";
dotenv.config();
// Create reusable transporter
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.Gmail,
    pass: process.env.Password,
  },
});

// Templates object
const templates = {
  reminder: ({ name, scheduleName, date }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Schedule Reminder</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          margin: 20px auto;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #5a2d82;
        }
        p {
          color: #555555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 20px;
          color: #999999;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Schedule Reminder</h1>
        <p>Hello ${name},</p>
        <p>You have an upcoming schedule: <strong>${scheduleName}</strong>.</p>
        <p>Date and Time: <strong>${date}</strong></p>
        <div class="footer">
          <p>Thank you, Your App Team</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Function to send email
const sendMail = async (email, subject, templateName, data) => {
  try {
    const html = templates[templateName](data);
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

// Function to send reminders and notifications
const sendReminderNotifications = async () => {
    const now = new Date();
    const oneDayAhead = new Date(now);
    const oneHourAhead = new Date(now);
  
    oneDayAhead.setDate(now.getDate() + 1);
    oneHourAhead.setHours(now.getHours() + 1);
  
    try {
      const upcomingSchedules = await Schedule.find({
        date: { $gte: now, $lte: oneDayAhead },
      });
  
      if (upcomingSchedules.length === 0) {
        console.log("No upcoming schedules found.");
        return;
      }
  
      for (const schedule of upcomingSchedules) {
        const user = await User.findById(schedule.userid);
        if (!user) {
          console.warn(`User not found for schedule ID: ${schedule._id}`);
          continue;
        }
  
        const email = user.email;
        const data = {
          name: user.name,
          scheduleName: schedule.name,
          date: new Date(schedule.date).toLocaleString(),
        };
  
        // Ensure status field exists and is initialized
        if (!schedule.status) {
          schedule.status = {
            completed: false,
            notificationsSent: {
              oneDay: false,
              oneHour: false,
              exactTime: false,
            },
          };
        }
  
        const { completed, notificationsSent } = schedule.status;
  
        // Skip sending notifications if the schedule is marked as completed
        if (completed) {
          console.log(`Schedule ID: ${schedule._id} is already completed. Skipping notifications.`);
          continue;
        }
  
        // One-day reminder
        if (
          schedule.date > now &&
          schedule.date <= oneDayAhead &&
          !notificationsSent.oneDay
        ) {
          console.log(`Sending one-day reminder to ${email}`);
          await sendMail(email, "Reminder: Your Schedule is Tomorrow!", "reminder", data);
          schedule.status.notificationsSent.oneDay = true;
        }
  
        // One-hour reminder
        if (
          schedule.date > now &&
          schedule.date <= oneHourAhead &&
          !notificationsSent.oneHour
        ) {
          console.log(`Sending one-hour reminder to ${email}`);
          await sendMail(email, "Reminder: Your Schedule in 1 Hour!", "reminder", data);
          schedule.status.notificationsSent.oneHour = true;
        }
  
        // Notification at the exact scheduled time (1-minute tolerance)
        const timeDifference = Math.abs(schedule.date.getTime() - now.getTime());
        if (timeDifference <= 60000 && !notificationsSent.exactTime) {
          console.log(`Sending exact-time notification to ${email}`);
          await sendMail(email, "It's Time for Your Schedule!", "reminder", data);
          schedule.status.notificationsSent.exactTime = true;
        }
  
        // Mark the schedule as completed if the time has passed
        if (now >= schedule.date) {
          console.log(`Marking schedule ID: ${schedule._id} as completed.`);
          await Schedule.findByIdAndDelete(schedule._id);
          console.log(`Deleted schedule ID: ${schedule._id} after completion.`);
        } else {
          // Save updated schedule status
          await schedule.save();
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error.message);
    }
  };
  
  

// Scheduler job to check every minute for notifications
export const startScheduler = () => {
  schedule.scheduleJob("* * * * *", sendReminderNotifications); // Run every minute
  console.log("Scheduler started for sending notifications.");
};
