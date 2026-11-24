import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Roadmap } from '../models/Roadmap';
import { Assessment } from '../models/Assessment';
import { generateRoadmapFromAssessment, calculateOverallProgress } from '../services/ai/roadmapAI';

export async function generateRoadmap(req: AuthRequest, res: Response): Promise<void> {
  try {
    // Get latest assessment
    const assessment = await Assessment.findOne({ userId: req.userId, status: 'completed' }).sort({ createdAt: -1 });

    // Delete existing roadmap
    await Roadmap.deleteOne({ userId: req.userId });

    const phases = assessment
      ? generateRoadmapFromAssessment(assessment.skillScores)
      : generateRoadmapFromAssessment([]);

    const firstActivePhase = phases.find(p => p.status === 'active');

    const roadmap = await Roadmap.create({
      userId: req.userId,
      assessmentId: assessment?._id,
      careerPath: 'Frontend Developer',
      phases,
      currentPhaseId: firstActivePhase?.id || phases[0].id,
      overallProgress: calculateOverallProgress(phases),
    });

    res.json({ success: true, data: roadmap });
  } catch {
    res.status(500).json({ success: false, message: 'Yo\'l xaritasini yaratishda xato' });
  }
}

export async function getRoadmap(req: AuthRequest, res: Response): Promise<void> {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.userId });
    res.json({ success: true, data: roadmap });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function updatePhaseProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { phaseId } = req.params;
    const { progress, status } = req.body;

    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Yo\'l xaritasi topilmadi' });
      return;
    }

    const phase = roadmap.phases.find(p => p.id === phaseId);
    if (!phase) {
      res.status(404).json({ success: false, message: 'Bosqich topilmadi' });
      return;
    }

    phase.progress = progress;
    if (status) phase.status = status;

    // If completed, unlock next phase
    if (status === 'completed') {
      const nextPhase = roadmap.phases.find(p => p.order === phase.order + 1);
      if (nextPhase) {
        nextPhase.status = 'active';
        roadmap.currentPhaseId = nextPhase.id;
      }
    }

    roadmap.overallProgress = calculateOverallProgress(roadmap.phases);
    await roadmap.save();

    res.json({ success: true, data: roadmap });
  } catch {
    res.status(500).json({ success: false, message: 'Yo\'l xaritasini yangilashda xato' });
  }
}
