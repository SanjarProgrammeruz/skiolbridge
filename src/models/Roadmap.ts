import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapPhase {
  id: string;
  title: string;
  description: string;
  topics: string[];
  exercises: string[];
  estimatedDays: number;
  status: 'locked' | 'active' | 'completed';
  progress: number;
  order: number;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  careerPath: string;
  phases: IRoadmapPhase[];
  currentPhaseId: string;
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    careerPath: { type: String, default: 'Frontend Developer' },
    phases: [
      {
        id: String,
        title: String,
        description: String,
        topics: [String],
        exercises: [String],
        estimatedDays: Number,
        status: { type: String, enum: ['locked', 'active', 'completed'], default: 'locked' },
        progress: { type: Number, default: 0 },
        order: Number,
      },
    ],
    currentPhaseId: String,
    overallProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

roadmapSchema.index({ userId: 1 });

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', roadmapSchema);
