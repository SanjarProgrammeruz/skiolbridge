import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { askAI } from '../services/ai.js';

const router = Router();
const questions = [
  { q: 'HTML nima uchun ishlatiladi?', options: ['Sahifa tuzilmasi uchun', 'Faqat dizayn uchun', 'Ma’lumotlar bazasi uchun'], answer: 0, topic: 'HTML' },
  { q: 'CSS Flexbox asosan nimani boshqaradi?', options: ['Server so‘rovlarini', 'Elementlarni bir o‘lchamli joylashtirishni', 'Ma’lumotlar bazasini'], answer: 1, topic: 'CSS' },
  { q: 'JavaScript’da const nimani anglatadi?', options: ['Qiymati qayta tayinlanmaydigan binding', 'Funksiya', 'HTML elementi'], answer: 0, topic: 'JavaScript' },
  { q: 'React’da props nima?', options: ['Komponentga uzatiladigan ma’lumot', 'CSS fayli', 'Backend server'], answer: 0, topic: 'React' },
  { q: 'HTTP 404 nimani bildiradi?', options: ['Server ishlayapti', 'Resurs topilmadi', 'So‘rov muvaffaqiyatli'], answer: 1, topic: 'Web' }
];

router.get('/questions', protect, (req, res) => res.json({ questions: questions.map(({ q, options, topic }, id) => ({ id, q, options, topic })) }));
router.post('/assessment', protect, async (req, res) => {
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const score = questions.reduce((sum, q, i) => sum + (Number(answers[i]) === q.answer ? 1 : 0), 0);
  const result = await askAI('assessment', `Frontend boshlang‘ich diagnostikasi: ${score}/${questions.length}. Javoblar: ${JSON.stringify(answers)}. O‘quvchiga keyingi qadamni tavsiya qil.`);
  await Progress.findOneAndUpdate({ user: req.user.id }, { assessment: answers }, { upsert: true, new: true });
  res.json({ score, total: questions.length, percentage: Math.round(score / questions.length * 100), recommendation: result.text, aiMode: result.mode });
});

router.post('/roadmap', protect, async (req, res) => {
  const { level = 'beginner', hours = 6, goal = 'Frontend developer bo‘lish' } = req.body;
  const result = await askAI('roadmap', `Frontend uchun ${level} darajadagi o‘quvchiga, haftasiga ${hours} soat ajrata oladigan, maqsadi: ${goal}. 6 haftalik aniq roadmap tuz. Har hafta mavzu va deliverable bo‘lsin.`);
  await User.findByIdAndUpdate(req.user.id, { level, goal, track: 'frontend' });
  res.json({ roadmap: result.text, aiMode: result.mode });
});

router.post('/interview', protect, async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Savol va javob kerak' });
  const result = await askAI('interview', `Frontend mock interview. Savol: ${question}\nNomzod javobi: ${answer}\nJavobni kuchli jihat, kamchilik va yaxshilangan javob namunasi bo‘yicha bahola.`);
  const progress = await Progress.findOneAndUpdate({ user: req.user.id }, { $push: { interviewHistory: { question, answer, feedback: result.text } } }, { upsert: true, new: true });
  res.json({ feedback: result.text, aiMode: result.mode, interviewCount: progress.interviewHistory.length });
});

router.post('/tasks/:taskId/complete', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { $addToSet: { completedTasks: req.params.taskId } }, { new: true });
  res.json({ completedTasks: user.completedTasks });
});

router.get('/progress', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const progress = await Progress.findOne({ user: req.user.id });
  res.json({ completedTasks: user.completedTasks, assessment: progress?.assessment || [], interviewCount: progress?.interviewHistory?.length || 0 });
});

export default router;
