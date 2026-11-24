import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolioProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    imageUrl: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

portfolioSchema.index({ userId: 1, order: 1 });

export const PortfolioProject = mongoose.model<IPortfolioProject>('PortfolioProject', portfolioSchema);
