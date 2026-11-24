import { Router } from 'express';
import { authenticate } from '../middleware/auth';

// Auth
import { register, login, getMe, updateProfile, completeOnboarding } from '../controllers/authController';
// Assessment
import { startAssessment, submitAssessment, getAssessmentHistory, getLatestAssessment } from '../controllers/assessmentController';
// Roadmap
import { generateRoadmap, getRoadmap, updatePhaseProgress } from '../controllers/roadmapController';
// Chat
import { sendMessage, getConversations, getConversation, deleteConversation } from '../controllers/chatController';
// Tasks
import { getTasks, getTask, submitTask } from '../controllers/taskController';
// Portfolio
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/portfolioController';
// Interview
import { startInterview, submitAnswer, getInterviewHistory, getInterviewSession } from '../controllers/interviewController';
// Progress
import { getDashboardData, getProgress } from '../controllers/progressController';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);
router.put('/users/profile', authenticate, updateProfile);
router.post('/users/onboarding', authenticate, completeOnboarding);

// Assessment routes
router.post('/assessment/start', authenticate, startAssessment);
router.post('/assessment/submit', authenticate, submitAssessment);
router.get('/assessment/history', authenticate, getAssessmentHistory);
router.get('/assessment/latest', authenticate, getLatestAssessment);

// Roadmap routes
router.post('/roadmap/generate', authenticate, generateRoadmap);
router.get('/roadmap', authenticate, getRoadmap);
router.patch('/roadmap/phase/:phaseId/progress', authenticate, updatePhaseProgress);

// AI Chat routes
router.post('/ai/chat', authenticate, sendMessage);
router.get('/ai/conversations', authenticate, getConversations);
router.get('/ai/conversations/:id', authenticate, getConversation);
router.delete('/ai/conversations/:id', authenticate, deleteConversation);

// Task routes
router.get('/tasks', authenticate, getTasks);
router.get('/tasks/:id', authenticate, getTask);
router.post('/tasks/:id/submit', authenticate, submitTask);

// Portfolio routes
router.get('/portfolio', authenticate, getProjects);
router.post('/portfolio', authenticate, createProject);
router.put('/portfolio/:id', authenticate, updateProject);
router.delete('/portfolio/:id', authenticate, deleteProject);

// Interview routes
router.post('/interviews/start', authenticate, startInterview);
router.post('/interviews/:id/answer', authenticate, submitAnswer);
router.get('/interviews/history', authenticate, getInterviewHistory);
router.get('/interviews/:id', authenticate, getInterviewSession);

// Progress/Dashboard
router.get('/dashboard', authenticate, getDashboardData);
router.get('/progress', authenticate, getProgress);

export default router;
