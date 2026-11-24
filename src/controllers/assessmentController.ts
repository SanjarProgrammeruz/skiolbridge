import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Assessment } from '../models/Assessment';
import { ASSESSMENT_QUESTIONS, getRandomQuestions } from '../services/assessmentQuestions';

export async function startAssessment(req: AuthRequest, res: Response): Promise<void> {
  try {
    // Check for existing incomplete assessment
    const existing = await Assessment.findOne({ userId: req.userId, status: 'in_progress' });
    if (existing) {
      res.json({ success: true, data: { assessmentId: existing._id, questions: getRandomQuestions(20) } });
      return;
    }

    const assessment = await Assessment.create({ userId: req.userId });
    const questions = getRandomQuestions(20);

    res.json({ success: true, data: { assessmentId: assessment._id, questions } });
  } catch {
    res.status(500).json({ success: false, message: 'Baholashni boshlashda xato' });
  }
}

export async function submitAssessment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { assessmentId, answers } = req.body;

    const assessment = await Assessment.findOne({ _id: assessmentId, userId: req.userId });
    if (!assessment) {
      res.status(404).json({ success: false, message: 'Baholash topilmadi' });
      return;
    }

    // Calculate scores per skill
    const skillMap: Record<string, { correct: number; total: number }> = {};
    const processedAnswers: Array<{ questionId: string; selectedAnswer: number; isCorrect: boolean }> = [];

    answers.forEach((answer: { questionId: string; selectedAnswer: number }) => {
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === answer.questionId);
      if (!question) return;

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      processedAnswers.push({ ...answer, isCorrect });

      if (!skillMap[question.skill]) skillMap[question.skill] = { correct: 0, total: 0 };
      skillMap[question.skill].total++;
      if (isCorrect) skillMap[question.skill].correct++;
    });

    const skillScores = Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      score: Math.round((data.correct / data.total) * 100),
      totalQuestions: data.total,
      correctAnswers: data.correct,
      level: data.correct / data.total >= 0.8 ? 'Advanced' : data.correct / data.total >= 0.5 ? 'Intermediate' : 'Beginner',
    }));

    const totalCorrect = processedAnswers.filter(a => a.isCorrect).length;
    const overallScore = Math.round((totalCorrect / processedAnswers.length) * 100);
    const overallLevel = overallScore >= 80 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner';
    const knowledgeGaps = skillScores.filter(s => s.score < 60).map(s => s.skill);

    assessment.answers = processedAnswers;
    assessment.skillScores = skillScores;
    assessment.overallScore = overallScore;
    assessment.overallLevel = overallLevel;
    assessment.knowledgeGaps = knowledgeGaps;
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    await assessment.save();

    res.json({ success: true, data: assessment });
  } catch {
    res.status(500).json({ success: false, message: 'Baholashni saqlashda xato' });
  }
}

export async function getAssessmentHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const assessments = await Assessment.find({ userId: req.userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: assessments });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function getLatestAssessment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const assessment = await Assessment.findOne({ userId: req.userId, status: 'completed' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: assessment });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
