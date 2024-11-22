import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  date: { type: Date, required: true }, // Format: yyyy-MM-dd
  status: {
    type: Object,
    default: {
      completed: false,
      notificationsSent: {
        oneDay: false,
        oneHour: false,
        exactTime: false,
      },
    },
  },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);
export default Schedule;
