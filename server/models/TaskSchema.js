import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId , ref : "User" },
    name: String,
    date: Date, // Format: yyyy-MM-dd
    completed: Boolean,
  });
  
export const Task = mongoose.model('Task', TaskSchema);
