import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Task, TaskSubmission } from '../models/Task';
import { UserProgress } from '../models/UserProgress';

// Seed tasks on first run
export async function seedTasks(): Promise<void> {
  const count = await Task.countDocuments();
  if (count > 0) return;

  await Task.insertMany([
    {
      title: 'Birinchi HTML sahifa',
      description: 'Oddiy shaxsiy veb-sahifa yarating',
      difficulty: 'beginner',
      technologies: ['HTML'],
      requirements: ['Sarlavha', 'Rasm', 'Ro\'yxat', 'Havola'],
      instructions: 'index.html fayl yarating. Unda o\'zingiz haqida ma\'lumot bering: ism, foto, qiziqishlar ro\'yxati va aloqa havolalari.',
      expectedResult: 'Brauzerda ochilgan va to\'g\'ri ko\'rsatilgan HTML sahifa',
      phase: 'phase-1',
      order: 1,
    },
    {
      title: 'CV sahifasi',
      description: 'HTML bilan professional resume yarating',
      difficulty: 'beginner',
      technologies: ['HTML'],
      requirements: ['Shaxsiy ma\'lumot', 'Ta\'lim', 'Ko\'nikmalar', 'Tajriba'],
      instructions: 'Semantik HTML teglardan foydalanib to\'liq resume sahifasi yarating. <article>, <section>, <header> va boshqa semantik teglardan foydalaning.',
      expectedResult: 'Professional ko\'rinishli HTML resume sahifasi',
      phase: 'phase-1',
      order: 2,
    },
    {
      title: 'CSS bilan stil bering',
      description: 'HTML sahifangizni CSS bilan bezang',
      difficulty: 'beginner',
      technologies: ['HTML', 'CSS'],
      requirements: ['Ranglar', 'Shriftlar', 'Flexbox layout'],
      instructions: 'Avvalgi HTML sahifangizga CSS fayl ulang. Rang sxemasi tanlang, Flexbox yordamida layout yarating.',
      expectedResult: 'Stillashtirigan va chiroyli ko\'rinishdagi veb-sahifa',
      phase: 'phase-2',
      order: 1,
    },
    {
      title: 'Responsive Landing Page',
      description: 'Barcha qurilmalarda yaxshi ko\'rinadigan sahifa yarating',
      difficulty: 'intermediate',
      technologies: ['HTML', 'CSS'],
      requirements: ['Mobile first', 'Media queries', 'Grid layout'],
      instructions: 'Mahsulot yoki xizmat uchun landing page yarating. Mobile first yondashuvi bilan boshlang. Media queries bilan responsive qiling.',
      expectedResult: 'Mobil va desktop da yaxshi ko\'rinadigan landing page',
      phase: 'phase-2',
      order: 2,
    },
    {
      title: 'JavaScript Kalkulyator',
      description: 'Oddiy matematik kalkulyator yarating',
      difficulty: 'beginner',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      requirements: ['Qo\'shish', 'Ayirish', 'Ko\'paytirish', 'Bo\'lish'],
      instructions: 'HTML, CSS va JavaScript bilan kalkulyator yarating. Tugmalar bilan ishlash, hisob-kitob va natija ko\'rsatish.',
      expectedResult: 'Ishlayotgan kalkulyator ilovasi',
      phase: 'phase-3',
      order: 1,
    },
    {
      title: 'Todo Dasturi',
      description: 'Vazifalar ro\'yxatini boshqarish ilovasi',
      difficulty: 'intermediate',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      requirements: ['Qo\'shish', 'O\'chirish', 'Bajarildi belgisi', 'LocalStorage'],
      instructions: 'Todo ilova yarating. Yangi vazifa qo\'shish, bajarildi/bajarilmadi belgilash, o\'chirish funksiyalari. LocalStorage da saqlang.',
      expectedResult: 'Sahifa yangilansa ham ma\'lumotlarni saqlaydigan Todo ilova',
      phase: 'phase-3',
      order: 2,
    },
    {
      title: 'GitHub Profil Ko\'ruvchi',
      description: 'GitHub API orqali foydalanuvchi ma\'lumotlarini ko\'rsating',
      difficulty: 'intermediate',
      technologies: ['JavaScript', 'API', 'Fetch'],
      requirements: ['GitHub API', 'Fetch', 'Loading state', 'Error handling'],
      instructions: 'Input ga GitHub username kiriting va GitHub API orqali profil ma\'lumotlarini (ism, bio, repos soni, followers) ko\'rsating.',
      expectedResult: 'GitHub profil ma\'lumotlarini API dan oluvchi ilova',
      phase: 'phase-4',
      order: 1,
    },
    {
      title: 'React Counter va Form',
      description: 'React hooks bilan interaktiv komponentlar',
      difficulty: 'beginner',
      technologies: ['React', 'JavaScript'],
      requirements: ['useState', 'Event handling', 'Form validation'],
      instructions: 'React loyiha yarating. Counter komponent (oshirish/kamaytirish/reset). Ro\'yxatdan o\'tish formi (ism, email, parol validatsiya bilan).',
      expectedResult: 'Ishlayotgan React komponentlar',
      phase: 'phase-6',
      order: 1,
    },
  ]);

  console.log('✅ Tasks seeded');
}

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { phase, difficulty } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (phase && typeof phase === 'string') filter.phase = phase;
    if (difficulty && typeof difficulty === 'string') filter.difficulty = difficulty;

    const tasks = await Task.find(filter).sort({ phase: 1, order: 1 });

    // Get user submissions
    const submissions = await TaskSubmission.find({ userId: req.userId }).select('taskId status');
    const submissionMap: Record<string, string> = {};
    submissions.forEach(s => { submissionMap[s.taskId.toString()] = s.status; });

    const tasksWithStatus = tasks.map(t => ({
      ...t.toObject(),
      userStatus: submissionMap[t._id.toString()] || 'not_started',
    }));

    res.json({ success: true, data: tasksWithStatus });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function getTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Vazifa topilmadi' });
      return;
    }

    const submission = await TaskSubmission.findOne({ userId: req.userId, taskId: task._id });
    res.json({ success: true, data: { ...task.toObject(), submission } });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}

export async function submitTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { solution } = req.body;
    const { id: taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ success: false, message: 'Vazifa topilmadi' });
      return;
    }

    let submission = await TaskSubmission.findOne({ userId: req.userId, taskId: task._id });
    if (submission) {
      submission.solution = solution;
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await TaskSubmission.create({
        userId: req.userId,
        taskId: task._id,
        solution,
        status: 'submitted',
      });

      // Update progress
      await UserProgress.findOneAndUpdate(
        { userId: req.userId },
        { $inc: { totalTasksCompleted: 1, totalPoints: 50 } }
      );
    }

    res.json({ success: true, data: submission });
  } catch {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
}
