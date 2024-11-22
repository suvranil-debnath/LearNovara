import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";
import transcriptRoutes from './routes/transcript.js';
import faqRoutes from './routes/faq.js'

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import tutorRoutes from "./routes/tutor.js"
import scheduleRoutes from './routes/schedule.js'
import toDoRouter from "./routes/todolist.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use('/api/transcript', transcriptRoutes);
app.use('/api/faqs',faqRoutes);
app.use("/api",tutorRoutes)
app.use("/api", scheduleRoutes);
app.use("/api/todolist", toDoRouter); 




//scheduleing
import { startScheduler } from "./middlewares/scheduling/scheduler.js";
startScheduler();


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
