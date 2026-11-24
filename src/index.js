import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import learningRoutes from './routes/learning.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 180, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'SkillBridge API' }));
app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Serverda kutilmagan xatolik' }); });

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`SkillBridge API running on ${port}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
