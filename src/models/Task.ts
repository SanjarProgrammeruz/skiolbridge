import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  requirements: string[];
  instructions: string;
  expectedResult: string;
  phase: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    technologies: [String],
    requirements: [String],
    instructions: { type: String, required: true },
    expectedResult: { type: String, required: true },
    phase: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);

export interface ITaskSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  solution: string;
  status: 'pending' | 'submitted' | 'reviewed';
  feedback?: string;
  score?: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSubmissionSchema = new Schema<ITaskSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    solution: { type: String, required: true },
    status: { type: String, enum: ['pending', 'submitted', 'reviewed'], default: 'submitted' },
    feedback: String,
    score: Number,
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

taskSubmissionSchema.index({ userId: 1, taskId: 1 });

export const TaskSubmission = mongoose.model<ITaskSubmission>('TaskSubmission', taskSubmissionSchema);
