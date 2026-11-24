import { callAI, isDemoMode, AIMessage } from './baseAI';

interface MentorContext {
  careerPath: string;
  experienceLevel: string;
  currentPhase?: string;
  assessmentScore?: number;
}

const DEMO_RESPONSES = [
  'Bu ajoyib savol! HTML - bu veb-sahifalarning asosi. U sahifaning tuzilishini belgilaydi. Masalan, `<h1>` sarlavha, `<p>` paragraf, `<div>` bo\'lim uchun ishlatiladi.',
  'JavaScript - bu brauzerda ishlaydigan dasturlash tili. U HTML va CSS bilan birgalikda interaktiv veb-sahifalar yaratishga imkon beradi. Asosiy tushunchalar: o\'zgaruvchilar, funksiyalar, ob\'ektlar va massivlar.',
  'CSS (Cascading Style Sheets) - bu HTML elementlarini stillashtirish uchun ishlatiladi. Ranglar, shriftlar, o\'lchamlar va joylashuv CSS orqali boshqariladi. Flexbox va Grid - eng muhim CSS layout usullari.',
  'React - bu Facebook tomonidan yaratilgan JavaScript kutubxonasi. U komponent asosida ishlaydi va Virtual DOM orqali samarali yangilanishlarni ta\'minlaydi. `useState` va `useEffect` - eng ko\'p ishlatiladigan Hook\'lar.',
  'TypeScript - bu JavaScript ustiga qo\'shilgan tip tizimi. U kodni xavfsizroq va tushunarli qiladi. Asosiy farq: TypeScript o\'zgaruvchi turlarini oldindanoq belgilashga majbur qiladi.',
];

let demoIndex = 0;

export async function getMentorResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: MentorContext
): Promise<string> {
  if (isDemoMode) {
    const response = DEMO_RESPONSES[demoIndex % DEMO_RESPONSES.length];
    demoIndex++;
    return `[Demo rejimi] ${response}`;
  }

  const systemPrompt = `Siz SkillBridge platformasining AI Mentori (ustozi) siz. 
Foydalanuvchi haqida ma'lumot:
- Kasb yo'nalishi: ${context.careerPath}
- Tajriba darajasi: ${context.experienceLevel}
- Joriy bosqich: ${context.currentPhase || 'Noma\'lum'}
- Baholash natijasi: ${context.assessmentScore || 'Baholanmagan'}

Qoidalar:
1. Faqat o'zbek tilida javob bering (lotin alifbosi)
2. Tushunarli va sodda tilda tushuntiring
3. Kod misollari ko'rsating (kerak bo'lsa)
4. Darhol to'liq yechim bermang - yo'naltiring
5. Qisqa va aniq bo'ling`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userMessage },
  ];

  try {
    return await callAI(messages);
  } catch {
    return `[Demo rejimi] Sizning savolingizga javob: Frontend dasturlash sohasi uchun HTML, CSS va JavaScript asoslarini o'rganishdan boshlash tavsiya etiladi. Qaysi mavzu haqida ko'proq bilmoqchisiz?`;
  }
}
