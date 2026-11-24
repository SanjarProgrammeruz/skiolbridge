import axios from 'axios';
import { config, isDemoMode } from '../../config';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(messages: AIMessage[], temperature = 0.7): Promise<string> {
  if (isDemoMode) {
    throw new Error('DEMO_MODE');
  }

  const response = await axios.post(
    `${config.ai.apiUrl}/chat/completions`,
    {
      model: config.ai.model,
      messages,
      temperature,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${config.ai.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data.choices[0]?.message?.content || '';
}

export async function callAIJSON<T>(messages: AIMessage[], temperature = 0.3): Promise<T> {
  const content = await callAI(
    [
      ...messages,
      {
        role: 'user' as const,
        content: 'Respond ONLY with valid JSON, no markdown, no explanation.',
      },
    ],
    temperature
  );

  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as T;
}

export { isDemoMode };
