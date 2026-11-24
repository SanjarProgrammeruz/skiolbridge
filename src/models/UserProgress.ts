import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyActivity {
  date: string;
  minutesSpent: number;
  tasksCompleted: number;
  lessonsCompleted: number;
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalLessonsCompleted: number;
  totalInterviews: number;
  weeklyActivity: IDailyActivity[];
  level: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },
    totalLessonsCompleted: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    weeklyActivity: [
      {
        date: String,
        minutesSpent: Number,
        tasksCompleted: Number,
        lessonsCompleted: Number,
      },
    ],
    level: { type: Number, default: 1 },
    badges: [String],
  },
  { timestamps: true }
);

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
