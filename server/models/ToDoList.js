import mongoose from "mongoose";

const ToDoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [
    {
      title: { type: String, required: true },
      subtasks: [
        {
          title: { type: String, required: true },
          completionStatus: { type: Boolean, default: false },
        },
      ],
    },
  ],
  taskStatus: {
    ongoing: { type: Number, default: 0 },
    inProcess: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    canceled: { type: Number, default: 0 },
  },
});

export default mongoose.model("ToDoList", ToDoSchema);
