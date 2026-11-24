export interface Question {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  // HTML
  {
    id: 'html-1',
    skill: 'HTML',
    question: 'HTML\'da semantik element bo\'lmagan teg qaysi?',
    options: ['<article>', '<div>', '<section>', '<header>'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '<div> semantik bo\'lmagan element. Qolganlar mazmunni tavsiflaydi.',
  },
  {
    id: 'html-2',
    skill: 'HTML',
    question: '`<meta charset="UTF-8">` nima uchun ishlatiladi?',
    options: [
      'Sahifa rangini belgilash',
      'Belgilar kodlashini belgilash',
      'Sahifa kengligini belgilash',
      'CSS faylni ulash',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'charset atributi sahifada ishlatiladigan belgilar kodlashini (encoding) belgilaydi.',
  },
  {
    id: 'html-3',
    skill: 'HTML',
    question: 'HTML formada foydalanuvchi kiritgan ma\'lumotni serverga yuborish uchun qaysi atribut kerak?',
    options: ['method', 'action', 'type', 'name'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'action atributi formaning ma\'lumotlari yuborilishi kerak bo\'lgan URL manzilini belgilaydi.',
  },
  {
    id: 'html-4',
    skill: 'HTML',
    question: 'Qaysi HTML tegi rasm qo\'shish uchun ishlatiladi?',
    options: ['<picture>', '<image>', '<img>', '<src>'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: '<img> tegi rasmlar uchun ishlatiladi va src hamda alt atributlarini talab qiladi.',
  },
  {
    id: 'html-5',
    skill: 'HTML',
    question: 'HTML5 da audio faylni qo\'shish uchun qaysi teg ishlatiladi?',
    options: ['<sound>', '<music>', '<audio>', '<media>'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: '<audio> tegi HTML5 da ovozli fayllar uchun ishlatiladi.',
  },

  // CSS
  {
    id: 'css-1',
    skill: 'CSS',
    question: 'CSS da elementni markazga joylashtirish uchun Flexbox da qaysi xususiyatlar ishlatiladi?',
    options: [
      'align: center',
      'justify-content: center va align-items: center',
      'margin: auto',
      'position: center',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'justify-content: center (gorizontal) va align-items: center (vertikal) Flexbox\'da markazlashtirish uchun.',
  },
  {
    id: 'css-2',
    skill: 'CSS',
    question: 'CSS specificity qoidasida qaysi selektor eng yuqori ustuvorlikka ega?',
    options: ['Element selektori', 'Klass selektori', 'ID selektori', 'Inline stil'],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'Inline stil (style="") eng yuqori ustuvorlikka ega, keyin ID, klass va element selektorlari.',
  },
  {
    id: 'css-3',
    skill: 'CSS',
    question: 'CSS\'da `box-sizing: border-box` nima qiladi?',
    options: [
      'Elementga chegara qo\'shadi',
      'Width va heightga padding va border\'ni kiritadi',
      'Elementni ko\'rinmas qiladi',
      'Faqat border stilini o\'zgartiradi',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'border-box bilan width/height qiymatlari padding va border\'ni ham o\'z ichiga oladi.',
  },
  {
    id: 'css-4',
    skill: 'CSS',
    question: 'Media query da qaysi breakpoint mobil qurilmalar uchun keng tarqalgan?',
    options: ['max-width: 480px', 'max-width: 768px', 'max-width: 1024px', 'max-width: 320px'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '768px - bu planshetlar va kichik ekranlar uchun keng tarqalgan breakpoint.',
  },
  {
    id: 'css-5',
    skill: 'CSS',
    question: 'CSS Grid\'da `grid-template-columns: repeat(3, 1fr)` nima qiladi?',
    options: [
      '3 ta teng ustun yaratadi',
      'Bitta ustun 3 marta takrorlanadi',
      '3 ta satr yaratadi',
      'Elementni 3 marta ko\'paytiradi',
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'repeat(3, 1fr) 3 ta teng kenglikdagi ustun yaratadi, har biri mavjud bo\'shliqdning 1/3 qismini egallaydi.',
  },

  // JavaScript
  {
    id: 'js-1',
    skill: 'JavaScript',
    question: 'JavaScript\'da `typeof null` nima qaytaradi?',
    options: ['null', 'undefined', 'object', 'boolean'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Bu JavaScript\'dagi mashhur xato. typeof null "object" qaytaradi, lekin null aslida object emas.',
  },
  {
    id: 'js-2',
    skill: 'JavaScript',
    question: 'Quyidagi kod nima chiqaradi? `console.log(1 + "2")`',
    options: ['3', '"12"', 'NaN', 'Error'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'JavaScript raqamni stringga aylantiradi va birlashtiradi. 1 + "2" = "12".',
  },
  {
    id: 'js-3',
    skill: 'JavaScript',
    question: 'Arrow function va oddiy function o\'rtasidagi asosiy farq?',
    options: [
      'Arrow function tezroq ishlaydi',
      'Arrow function o\'z this kontekstiga ega emas',
      'Arrow function parametr qabul qilmaydi',
      'Arrow function return qilmaydi',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Arrow function o\'z this kontekstini yaratmaydi. U tashqi scope\'dan this ni oladi (lexical this).',
  },
  {
    id: 'js-4',
    skill: 'JavaScript',
    question: '`Promise.all([])` nima qaytaradi?',
    options: [
      'Birinchi bajarilgan promise',
      'Barcha promise\'lar bajarilganda natijalar massivi',
      'Birinchi rad etilgan promise',
      'undefined',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Promise.all barcha promise\'lar bajarilganda ularning natijalarini massiv sifatida qaytaradi.',
  },
  {
    id: 'js-5',
    skill: 'JavaScript',
    question: 'JavaScript\'da closure nima?',
    options: [
      'Funksiyani yopish',
      'Funksiyaning tashqi scope\'dagi o\'zgaruvchilarga kirish imkoniyati',
      'Kod blokirovkasi',
      'Loop tugatish',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Closure - ichki funksiyaning tashqi funksiya o\'zgaruvchilariga kirish imkoniyati (tashqi funksiya tugagandan keyin ham).',
  },

  // TypeScript
  {
    id: 'ts-1',
    skill: 'TypeScript',
    question: 'TypeScript\'da interface va type o\'rtasidagi asosiy farq?',
    options: [
      'interface faqat ob\'ektlar uchun, type barcha uchun',
      'type kengaytirilib bo\'lmaydi',
      'interface tezroq ishlaydi',
      'Hech qanday farq yo\'q',
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'interface asosan ob\'ekt tuzilishi uchun, type esa union, intersection va primitive tiplar uchun ham ishlatiladi.',
  },
  {
    id: 'ts-2',
    skill: 'TypeScript',
    question: 'TypeScript\'da `?` belgisi nima qiladi? Masalan: `name?: string`',
    options: [
      'Qiymatni null qiladi',
      'Xususiyatni ixtiyoriy qiladi',
      'Qiymatni undefined qiladi',
      'Xususiyatni o\'chiradi',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '? belgisi xususiyatni ixtiyoriy (optional) qiladi. Bu qiymat bo\'lishi ham, bo\'lmasligi ham mumkin.',
  },
  {
    id: 'ts-3',
    skill: 'TypeScript',
    question: 'TypeScript generics nima uchun ishlatiladi?',
    options: [
      'Kod tezligini oshirish',
      'Turli tiplarga moslashuvchan komponentlar yaratish',
      'Tiplarni o\'chirish',
      'Funksiyalarni yashirish',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Generics (T) turli tiplarda ishlaydigan qayta foydalanish mumkin bo\'lgan funksiya va komponentlar yaratishga imkon beradi.',
  },

  // React
  {
    id: 'react-1',
    skill: 'React',
    question: 'React\'da Virtual DOM nima?',
    options: [
      'Haqiqiy DOM ning nusxasi',
      'Real DOM ning yengil JavaScript ko\'rinishi',
      'Server tomonida DOM',
      'CSS stillar ro\'yxati',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Virtual DOM - haqiqiy DOM ning yengil JavaScript ko\'rinishi. React o\'zgarishlarni avval shu erda sinab ko\'radi.',
  },
  {
    id: 'react-2',
    skill: 'React',
    question: 'useState hook qanday ishlatiladi?',
    options: [
      'const state = useState(0)',
      'const [state, setState] = useState(0)',
      'const {state, setState} = useState(0)',
      'useState(state, 0)',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'useState destructuring orqali [joriy qiymat, o\'zgartiruvchi funksiya] juftligini qaytaradi.',
  },
  {
    id: 'react-3',
    skill: 'React',
    question: 'useEffect hook qachon ishga tushadi?',
    options: [
      'Faqat komponent yaratilganda',
      'Faqat unmount bo\'lganda',
      'Render bo\'lgandan keyin va dependency o\'zgarganda',
      'Faqat state o\'zgarganda',
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'useEffect har render dan keyin ishga tushadi. Dependency array bilan faqat ko\'rsatilgan qiymatlar o\'zgarganda.',
  },

  // Git
  {
    id: 'git-1',
    skill: 'Git',
    question: 'Git commit nima?',
    options: [
      'Faylni o\'chirish',
      'O\'zgarishlarni saqlash va tarixini qayd etish',
      'Branch yaratish',
      'Remote ga yuborish',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'git commit joriy indeksdagi o\'zgarishlarni repository tarixiga saqlaydi.',
  },
  {
    id: 'git-2',
    skill: 'Git',
    question: 'Remote repoga o\'zgarishlarni yuborish uchun qaysi buyruq ishlatiladi?',
    options: ['git send', 'git push', 'git upload', 'git commit -r'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'git push lokal commitlarni remote repository ga yuboradi.',
  },
];

export function getQuestionsBySkill(skill: string): Question[] {
  return ASSESSMENT_QUESTIONS.filter(q => q.skill.toLowerCase() === skill.toLowerCase());
}

export function getRandomQuestions(count = 20): Question[] {
  const shuffled = [...ASSESSMENT_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
