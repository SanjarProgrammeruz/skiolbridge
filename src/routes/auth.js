import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Ism, email va kamida 8 belgili parol kiriting' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Bu email allaqachon ro‘yxatdan o‘tgan' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, track: user.track } });
  } catch (error) { res.status(500).json({ message: 'Ro‘yxatdan o‘tishda xatolik' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Email yoki parol noto‘g‘ri' });
    res.json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, track: user.track } });
  } catch { res.status(500).json({ message: 'Kirishda xatolik' }); }
});

router.get('/me', protect, (req, res) => res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, track: req.user.track, level: req.user.level, completedTasks: req.user.completedTasks } }));
export default router;
