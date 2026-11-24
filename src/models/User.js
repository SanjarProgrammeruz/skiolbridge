import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  track: { type: String, default: 'frontend' },
  level: { type: String, default: 'beginner' },
  goal: { type: String, default: 'Frontend developer bo‘lish' },
  completedTasks: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
