import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import routes from './routes/index';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Rate limiting
app.use('/api/v1/ai', rateLimit({ windowMs: 60 * 1000, max: 20, message: { success: false, message: 'Juda ko\'p so\'rov' } }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
