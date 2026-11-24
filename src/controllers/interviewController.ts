import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { InterviewSession } from '../models/Interview';
import { UserProgress } from '../models/UserProgress';
import { getInterviewQuestion, evaluateAnswer } from '../services/ai/interviewAI';
import { isDemoMode } from '../config';

export async function startInterview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { topic, difficulty } = req.body;

    const session = await InterviewSession.create({
      userId: req.userId,
      topic,
      difficulty: difficulty || 'beginner',
    });

    const question = await getInterviewQuestion(topic, difficulty || 'beginner', []);

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        question,
        questionNumber: 1,
        isDemo: isDemoMode,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Intervyuni boshlashda xato' });
  }
}

export async function submitAnswer(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { answer, currentQuestion } = req.body;
    const sessionId = req.params.id;

    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.userId });
    if (!session) {
      res.status(404).json({ success: false, message: 'Sessiya topilmadi' });
      return;
    }

    const evaluation = await evaluateAnswer(currentQuestion, answer, session.topic);

    session.answers.push({
      question: currentQuestion,
      userAnswer: answer,
      feedback: evaluation.feedback,
      score: evaluation.score,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
    });

    const shouldContinue = session.answers.length < 5;

    if (shouldContinue) {
      const previousQuestions = session.answers.map(a => a.question);
      const nextQuestion = await getInterviewQuestion(session.topic, session.difficulty, previousQuestions);

      await session.save();

      res.json({
        success: true,
        data: {
          evaluation,
          nextQuestion,
          questionNumber: session.answers.length + 1,
          isComplete: false,
        },
      });
    } else {
      // Complete the interview
      const avgScore = session.answers.reduce((sum, a) => sum + a.score, 0) / session.answers.length;
      session.overallScore = Math.round(avgScore);
      session.status = 'completed';
      session.completedAt = new Date();

      const allImprovements = session.answers.flatMap(a => a.improvements);
      const weakMap: Record<string, number> = {};
      allImprovements.forEach(i => { weakMap[i] = (weakMap[i] || 0) + 1; });
      session.weakAreas = Object.entries(weakMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([area]) => area);

      session.overallFeedback = avgScore >= 80
        ? 'Juda yaxshi natija! Bilimingiz mustahkam.'
        : avgScore >= 60
        ? 'Yaxshi natija. Ba\'zi sohalarda bilimingizni chuqurlashtiring.'
        : 'Asosiy tushunchalarni yanada mustahkamlash kerak. Davom eting!';

      await session.save();

      await UserProgress.findOneAndUpdate(
        { userId: req.userId },
        { $inc: { totalInterviews: 1, totalPoints: Math.round(avgScore / 2) } }
      );

      res.json({
        success: true,
        data: {
          evaluation,
          isComplete: true,
          session: session.toObject(),
        },
      });
    }
  } catch {
    res.status(500).json({ success: false, message: 'Javobni saqlashda xato' });
  }
}

export async function getInterviewHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const sessions = await InterviewSession.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: sessions });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function getInterviewSession(req: AuthRequest, res: Response): Promise<void> {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.userId });
    if (!session) {
      res.status(404).json({ success: false, message: 'Sessiya topilmadi' });
      return;
    }
    res.json({ success: true, data: session });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
