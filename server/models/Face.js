// models/Face.js
import mongoose from 'mongoose';

const faceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
  facedec: { type: [Number], required: true }, // Array of numbers for the face descriptor
}, { timestamps: true });

export const Face = mongoose.model('Face', faceSchema);
