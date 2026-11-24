import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserProgress } from '../models/UserProgress';
import { Assessment } from '../models/Assessment';
import { Roadmap } from '../models/Roadmap';
import { TaskSubmission } from '../models/Task';
import { InterviewSession } from '../models/Interview';

export async function getDashboardData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const [progress, assessment, roadmap, recentTasks, recentInterviews] = await Promise.all([
      UserProgress.findOne({ userId: req.userId }),
      Assessment.findOne({ userId: req.userId, status: 'completed' }).sort({ createdAt: -1 }),
      Roadmap.findOne({ userId: req.userId }),
      TaskSubmission.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(5),
      InterviewSession.find({ userId: req.userId, status: 'completed' }).sort({ createdAt: -1 }).limit(3),
    ]);

    // Generate weekly activity (last 7 days)
    const today = new Date();
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const existing = progress?.weeklyActivity?.find(a => a.date === dateStr);
      return {
        date: dateStr,
        day: ['Yak', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'][date.getDay()],
        minutesSpent: existing?.minutesSpent || 0,
        tasksCompleted: existing?.tasksCompleted || 0,
      };
    });

    const currentPhase = roadmap?.phases.find(p => p.id === roadmap.currentPhaseId);

    res.json({
      success: true,
      data: {
        progress: progress || { totalPoints: 0, currentStreak: 0, level: 1 },
        assessment: assessment ? { overallScore: assessment.overallScore, overallLevel: assessment.overallLevel } : null,
        roadmap: roadmap ? {
          overallProgress: roadmap.overallProgress,
          currentPhase: currentPhase,
          totalPhases: roadmap.phases.length,
          completedPhases: roadmap.phases.filter(p => p.status === 'completed').length,
        } : null,
        weeklyActivity,
        recentActivity: {
          tasks: recentTasks.length,
          interviews: recentInterviews.length,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function getProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const progress = await UserProgress.findOne({ userId: req.userId });
    res.json({ success: true, data: progress });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
