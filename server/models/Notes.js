import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        name: String,
        path: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Notes = mongoose.model("Notes", notesSchema);
