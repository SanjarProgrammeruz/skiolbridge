import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatConversation } from '../models/Chat';
import { User } from '../models/User';
import { Roadmap } from '../models/Roadmap';
import { Assessment } from '../models/Assessment';
import { getMentorResponse } from '../services/ai/mentorAI';
import { isDemoMode } from '../config';

export async function sendMessage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { conversationId, message } = req.body;

    // Get user context
    const [user, roadmap, assessment] = await Promise.all([
      User.findById(req.userId).select('-password'),
      Roadmap.findOne({ userId: req.userId }),
      Assessment.findOne({ userId: req.userId, status: 'completed' }).sort({ createdAt: -1 }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
      return;
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await ChatConversation.findOne({ _id: conversationId, userId: req.userId });
    }

    if (!conversation) {
      conversation = await ChatConversation.create({
        userId: req.userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });

    // Get AI response
    const currentPhase = roadmap?.phases.find(p => p.id === roadmap.currentPhaseId);
    const aiResponse = await getMentorResponse(
      message,
      conversation.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      {
        careerPath: user.careerPath,
        experienceLevel: user.experienceLevel,
        currentPhase: currentPhase?.title,
        assessmentScore: assessment?.overallScore,
      }
    );

    // Add assistant response
    conversation.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
    await conversation.save();

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        message: aiResponse,
        isDemo: isDemoMode,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Xabar yuborishda xato' });
  }
}

export async function getConversations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const conversations = await ChatConversation.find({ userId: req.userId })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json({ success: true, data: conversations });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function getConversation(req: AuthRequest, res: Response): Promise<void> {
  try {
    const conversation = await ChatConversation.findOne({ _id: req.params.id, userId: req.userId });
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Suhbat topilmadi' });
      return;
    }
    res.json({ success: true, data: conversation });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function deleteConversation(req: AuthRequest, res: Response): Promise<void> {
  try {
    await ChatConversation.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: 'Suhbat o\'chirildi' });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
