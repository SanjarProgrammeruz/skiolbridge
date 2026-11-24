import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  assessment: { type: [Number], default: [] },
  roadmap: { type: [String], default: [] },
  interviewHistory: [{ question: String, answer: String, feedback: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
