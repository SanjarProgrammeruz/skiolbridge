import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewAnswer {
  question: string;
  userAnswer: string;
  feedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  difficulty: string;
  status: 'active' | 'completed';
  answers: IInterviewAnswer[];
  overallScore: number;
  overallFeedback: string;
  weakAreas: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterviewSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, default: 'beginner' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    answers: [
      {
        question: String,
        userAnswer: String,
        feedback: String,
        score: Number,
        strengths: [String],
        improvements: [String],
      },
    ],
    overallScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: '' },
    weakAreas: [String],
    completedAt: Date,
  },
  { timestamps: true }
);

interviewSchema.index({ userId: 1, createdAt: -1 });

export const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', interviewSchema);
