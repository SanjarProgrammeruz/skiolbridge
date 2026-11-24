import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PortfolioProject } from '../models/Portfolio';

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const projects = await PortfolioProject.find({ userId: req.userId }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const count = await PortfolioProject.countDocuments({ userId: req.userId });
    const project = await PortfolioProject.create({
      ...req.body,
      userId: req.userId,
      order: count,
    });
    res.status(201).json({ success: true, data: project });
  } catch {
    res.status(500).json({ success: false, message: 'Loyihani qo\'shishda xato' });
  }
}

export async function updateProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const project = await PortfolioProject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!project) {
      res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
      return;
    }
    res.json({ success: true, data: project });
  } catch {
    res.status(500).json({ success: false, message: 'Loyihani yangilashda xato' });
  }
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const project = await PortfolioProject.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
      return;
    }
    res.json({ success: true, message: 'Loyiha o\'chirildi' });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
