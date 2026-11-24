import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillScore {
  skill: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  level: string;
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Array<{ questionId: string; selectedAnswer: number; isCorrect: boolean }>;
  skillScores: ISkillScore[];
  overallScore: number;
  overallLevel: string;
  knowledgeGaps: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    currentQuestionIndex: { type: Number, default: 0 },
    answers: [
      {
        questionId: String,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    skillScores: [
      {
        skill: String,
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        level: String,
      },
    ],
    overallScore: { type: Number, default: 0 },
    overallLevel: { type: String, default: 'Beginner' },
    knowledgeGaps: [String],
    completedAt: Date,
  },
  { timestamps: true }
);

assessmentSchema.index({ userId: 1, createdAt: -1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
