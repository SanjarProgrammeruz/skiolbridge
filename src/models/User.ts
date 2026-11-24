import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  careerPath: string;
  experienceLevel: string;
  learningGoal: string;
  dailyLearningTime: number;
  language: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    careerPath: { type: String, default: 'Frontend Developer' },
    experienceLevel: { type: String, default: 'Beginner' },
    learningGoal: { type: String, default: '' },
    dailyLearningTime: { type: Number, default: 1 },
    language: { type: String, default: 'uz' },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const doc = this as IUser;
  doc.password = await bcrypt.hash(doc.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
