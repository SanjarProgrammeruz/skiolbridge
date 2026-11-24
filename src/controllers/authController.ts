import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
      return;
    }

    const user = await User.create({ fullName, email, password });
    await UserProgress.create({ userId: user._id });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
          careerPath: user.careerPath,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ro\'yxatdan o\'tishda xato' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Email yoki parol noto\'g\'ri' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Email yoki parol noto\'g\'ri' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
          careerPath: user.careerPath,
          experienceLevel: user.experienceLevel,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Tizimga kirishda xato' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
      return;
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Profilni yangilashda xato' });
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { careerPath, experienceLevel, learningGoal, dailyLearningTime } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { careerPath, experienceLevel, learningGoal, dailyLearningTime, onboardingCompleted: true },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Onboarding xatosi' });
  }
}
