import { callAI, callAIJSON, isDemoMode } from './baseAI';

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}

interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextQuestion?: string;
}

const DEMO_QUESTIONS: Record<string, string[]> = {
  HTML: [
    'HTML nima va u nima uchun ishlatiladi?',
    'Semantik HTML elementlari nima? Misollar keltiring.',
    'HTML formalarida qanday input turlari mavjud?',
    '`<div>` va `<span>` o\'rtasidagi farq nima?',
    'HTML5 da yangi qo\'shilgan elementlar qaysilar?',
  ],
  CSS: [
    'CSS Flexbox va Grid o\'rtasidagi farqni tushuntiring.',
    'CSS specificity nima va u qanday ishlaydi?',
    'Responsive dizayn nima? Media queries qanday ishlatiladi?',
    'CSS animatsiyalar va transitions o\'rtasidagi farq?',
    'CSS preprocessorlar (SASS/LESS) nima?',
  ],
  JavaScript: [
    'JavaScript\'da `var`, `let` va `const` o\'rtasidagi farq?',
    'Promise va Async/Await nima? Misollar keltiring.',
    'Event loop nima va u qanday ishlaydi?',
    'Closure nima? Misollar bilan tushuntiring.',
    '`==` va `===` o\'rtasidagi farq?',
  ],
  React: [
    'React Virtual DOM nima va u qanday ishlaydi?',
    'useState va useEffect Hook\'larini tushuntiring.',
    'Props va State o\'rtasidagi farq?',
    'React lifecycle nima?',
    'Context API nima va qachon ishlatiladi?',
  ],
};

const DEMO_EVALUATIONS: AnswerEvaluation[] = [
  {
    score: 75,
    feedback: 'Yaxshi javob! Asosiy tushunchalarni tushunsangiz ham, chuqurroq tushuntirish kerak edi.',
    strengths: ['Asosiy ta\'rifni to\'g\'ri bildingiz', 'Sodda tilda tushuntirish'],
    improvements: ['Misollar keltirish kerak edi', 'Amaliy qo\'llanilishini ko\'rsating'],
  },
  {
    score: 60,
    feedback: 'Qisman to\'g\'ri. Ba\'zi muhim jihatlarni o\'tkazib yubordingiz.',
    strengths: ['To\'g\'ri yo\'nalishda fikrladingiz'],
    improvements: ['Texnik terminologiyani o\'rganing', 'Amaliy mashqlar qiling', 'Hujjatlarni o\'qing'],
  },
  {
    score: 90,
    feedback: 'Ajoyib javob! Mavzuni yaxshi tushungansiz.',
    strengths: ['To\'liq va aniq tushuntirish', 'Misollar keltirdingiz', 'Texnik terminologiyadan to\'g\'ri foydalandingiz'],
    improvements: ['Edge case\'larni ham ko\'rib chiqing'],
  },
];

let demoEvalIndex = 0;
let demoQIndex = 0;

export async function getInterviewQuestion(topic: string, difficulty: string, previousQuestions: string[] = []): Promise<string> {
  if (isDemoMode) {
    const questions = DEMO_QUESTIONS[topic] || DEMO_QUESTIONS['JavaScript'];
    const q = questions[demoQIndex % questions.length];
    demoQIndex++;
    return q;
  }

  const prompt = `Siz Frontend Developer intervyu o'tkazuvchisiz.
Mavzu: ${topic}
Qiyinlik: ${difficulty}
Oldingi savollar: ${previousQuestions.join(', ')}

Yangi texnik savol bering. Faqat savol matni, boshqa hech narsa yo'q.
O'zbek tilida yozing.`;

  try {
    return await callAI([{ role: 'user', content: prompt }], 0.8);
  } catch {
    const questions = DEMO_QUESTIONS[topic] || DEMO_QUESTIONS['JavaScript'];
    return questions[demoQIndex++ % questions.length];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  topic: string
): Promise<AnswerEvaluation> {
  if (isDemoMode) {
    const eval_ = DEMO_EVALUATIONS[demoEvalIndex % DEMO_EVALUATIONS.length];
    demoEvalIndex++;
    return eval_;
  }

  const prompt = `Siz Frontend Developer intervyu baholovchisiz.
Savol: ${question}
Foydalanuvchi javobi: ${answer}
Mavzu: ${topic}

Javobni baholang va JSON formatda qaytaring:
{
  "score": 0-100,
  "feedback": "batafsil fikr-mulohaza o'zbek tilida",
  "strengths": ["kuchli tomonlar"],
  "improvements": ["yaxshilash kerak bo'lgan jihatlar"]
}`;

  try {
    return await callAIJSON<AnswerEvaluation>([{ role: 'user', content: prompt }]);
  } catch {
    return DEMO_EVALUATIONS[demoEvalIndex++ % DEMO_EVALUATIONS.length];
  }
}
