import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId , ref : "User" },
    profilepic: { type: String, required: true },
    createdcourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
        },
    ],
});

export const Tutor = mongoose.model('Tutor', tutorSchema);
