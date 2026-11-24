import { ISkillScore } from '../../models/Assessment';
import { IRoadmapPhase } from '../../models/Roadmap';

function getLevel(score: number): string {
  if (score >= 80) return 'advanced';
  if (score >= 50) return 'intermediate';
  return 'beginner';
}

export function generateRoadmapFromAssessment(skillScores: ISkillScore[]): IRoadmapPhase[] {
  const scoreMap: Record<string, number> = {};
  skillScores.forEach(s => {
    scoreMap[s.skill.toLowerCase()] = s.score;
  });

  const phases: IRoadmapPhase[] = [
    {
      id: 'phase-1',
      title: 'HTML Asoslari',
      description: 'Veb-sahifalarning tuzilishini o\'rganing',
      topics: ['HTML tuzilishi', 'Semantik teglar', 'Formalar', 'Jadvallar', 'Multimedia'],
      exercises: ['Oddiy veb-sahifa yarating', 'Resume HTML sahifasi', 'Forma yarating'],
      estimatedDays: scoreMap['html'] >= 70 ? 3 : 10,
      status: 'active',
      progress: Math.min(scoreMap['html'] || 0, 100),
      order: 1,
    },
    {
      id: 'phase-2',
      title: 'CSS va Responsive Dizayn',
      description: 'Sahifalarni stillashtiring va moslashuvchan qiling',
      topics: ['CSS selektorlar', 'Flexbox', 'Grid', 'Media queries', 'Animatsiyalar'],
      exercises: ['Landing page dizayni', 'Responsive navbar', 'Portfolio sahifasi'],
      estimatedDays: scoreMap['css'] >= 70 ? 5 : 14,
      status: scoreMap['html'] >= 70 ? 'active' : 'locked',
      progress: Math.min(scoreMap['css'] || 0, 100),
      order: 2,
    },
    {
      id: 'phase-3',
      title: 'JavaScript Asoslari',
      description: 'Dasturlash mantiqini o\'rganing',
      topics: ['O\'zgaruvchilar', 'Funksiyalar', 'Massivlar', 'Ob\'ektlar', 'DOM'],
      exercises: ['Kalkulyator', 'Todo dastur', 'API ma\'lumotlarini ko\'rsatish'],
      estimatedDays: scoreMap['javascript'] >= 70 ? 7 : 21,
      status: 'locked',
      progress: Math.min(scoreMap['javascript'] || 0, 100),
      order: 3,
    },
    {
      id: 'phase-4',
      title: 'JavaScript Ilg\'or',
      description: 'Asinxron dasturlash va zamonaviy JavaScript',
      topics: ['Promise', 'Async/Await', 'Fetch API', 'ES6+', 'Modullar'],
      exercises: ['Ob\'havo dasturi', 'GitHub profil ko\'ruvchisi', 'Rasm galereya'],
      estimatedDays: 14,
      status: 'locked',
      progress: 0,
      order: 4,
    },
    {
      id: 'phase-5',
      title: 'TypeScript',
      description: 'JavaScript\'ga tip tizimini qo\'shing',
      topics: ['Tiplar', 'Interfeylar', 'Generiklar', 'Enum', 'Dekoratorlar'],
      exercises: ['TypeScript bilan Todo', 'API tiplar', 'Klass yaratish'],
      estimatedDays: scoreMap['typescript'] >= 70 ? 5 : 10,
      status: 'locked',
      progress: Math.min(scoreMap['typescript'] || 0, 100),
      order: 5,
    },
    {
      id: 'phase-6',
      title: 'React Asoslari',
      description: 'Komponent asosida UI yarating',
      topics: ['Komponentlar', 'Props', 'State', 'useState', 'useEffect'],
      exercises: ['Todo dastur', 'Hisob-kitob', 'Maqolalar ro\'yxati'],
      estimatedDays: scoreMap['react'] >= 70 ? 7 : 18,
      status: 'locked',
      progress: Math.min(scoreMap['react'] || 0, 100),
      order: 6,
    },
    {
      id: 'phase-7',
      title: 'React Ilg\'or',
      description: 'Murakkab React patternslarni o\'rganing',
      topics: ['Context API', 'useReducer', 'Custom Hooks', 'React Router', 'Performance'],
      exercises: ['E-commerce sayt', 'Chat dastur', 'Dashboard'],
      estimatedDays: 18,
      status: 'locked',
      progress: 0,
      order: 7,
    },
    {
      id: 'phase-8',
      title: 'API Integratsiya',
      description: 'Backend bilan ishlashni o\'rganing',
      topics: ['REST API', 'Axios', 'JWT Auth', 'Error handling', 'Loading states'],
      exercises: ['Login tizimi', 'Mahsulotlar ro\'yxati', 'Foydalanuvchi profili'],
      estimatedDays: 10,
      status: 'locked',
      progress: 0,
      order: 8,
    },
    {
      id: 'phase-9',
      title: 'Git va GitHub',
      description: 'Versiya boshqaruv tizimini o\'rganing',
      topics: ['Git asoslari', 'Branch', 'Merge', 'Pull Request', 'GitHub Actions'],
      exercises: ['Portfolio repository', 'Open source contribution', 'CI/CD'],
      estimatedDays: scoreMap['git'] >= 70 ? 3 : 7,
      status: 'locked',
      progress: Math.min(scoreMap['git'] || 0, 100),
      order: 9,
    },
    {
      id: 'phase-10',
      title: 'Portfolio Loyihalar',
      description: 'Professional portfolio yarating',
      topics: ['Loyiha rejalashtirish', 'Dizayn', 'Deploy', 'README', 'Prezentatsiya'],
      exercises: ['Personal sayt', 'Kompleks dastur', 'Open source'],
      estimatedDays: 20,
      status: 'locked',
      progress: 0,
      order: 10,
    },
    {
      id: 'phase-11',
      title: 'Intervyu Tayyorgarligi',
      description: 'Ish uchun intervyuga tayyorlaning',
      topics: ['Texnik savollar', 'Algoritmlar', 'Soft skills', 'Portfolio taqdimoti', 'Negotiation'],
      exercises: ['Mock intervyu', 'LeetCode masalalari', 'Portfolio taqdimoti'],
      estimatedDays: 14,
      status: 'locked',
      progress: 0,
      order: 11,
    },
  ];

  // Set first phase as active based on scores
  const firstWeakPhase = phases.find(p => p.progress < 70);
  if (firstWeakPhase) {
    phases.forEach((p, i) => {
      if (p.order < firstWeakPhase.order) {
        p.status = 'completed';
        p.progress = 100;
      } else if (p.order === firstWeakPhase.order) {
        p.status = 'active';
      }
    });
  }

  return phases;
}

export function calculateOverallProgress(phases: IRoadmapPhase[]): number {
  if (phases.length === 0) return 0;
  const total = phases.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(total / phases.length);
}
