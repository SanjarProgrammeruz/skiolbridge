import { config } from './config';
import { connectDB } from './config/database';
import app from './app';
import { seedTasks } from './controllers/taskController';

async function start() {
  await connectDB();
  await seedTasks();

  app.listen(config.port, () => {
    console.log(`🚀 SkillBridge server: http://localhost:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🤖 AI Mode: ${config.ai.apiKey ? 'Live' : 'Demo'}`);
  });
}

start().catch(console.error);
