import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gmeetLink: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const LiveClass = mongoose.model('LiveClass', liveClassSchema);
