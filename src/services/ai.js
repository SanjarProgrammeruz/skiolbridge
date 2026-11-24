const fallback = {
  assessment: 'Javoblaringiz asosida HTML va CSS poydevorini mustahkamlash, keyin JavaScript DOM va React komponentlariga o‘tish tavsiya qilinadi. Har bir mavzudan keyin kichik amaliy loyiha bajaring.',
  roadmap: '1-hafta: HTML semantikasi va accessibility. 2-hafta: CSS layout, Flexbox va Grid. 3-hafta: JavaScript asoslari va DOM. 4-hafta: React komponentlari, props va state. 5-hafta: API bilan ishlash. 6-hafta: portfolio loyihasi va GitHub.',
  interview: 'Yaxshi urinish. Javobingizda avval tushunchani ta’riflang, keyin kichik kod misoli va real loyihadagi qo‘llanishini keltiring. Masalan, React state komponent ichidagi o‘zgaruvchan ma’lumotni boshqaradi.'
};

export async function askAI(kind, prompt) {
  const { AI_API_KEY, AI_BASE_URL = 'https://api.openai.com/v1', AI_MODEL = 'gpt-4o-mini' } = process.env;
  if (!AI_API_KEY) return { text: fallback[kind] || fallback.assessment, mode: 'demo' };
  try {
    const response = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'Sen SkillBridge platformasidagi tajribali frontend mentorisan. O‘zbek tilida aniq, amaliy, qisqa va bosqichma-bosqich javob ber. Foydalanuvchi bilimini faqat bitta javobga qarab qat’iy baholama; noaniqlikni ayt.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5
      })
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || fallback[kind], mode: 'live' };
  } catch (error) {
    console.error('AI request failed:', error.message);
    return { text: fallback[kind] || fallback.assessment, mode: 'demo' };
  }
}
