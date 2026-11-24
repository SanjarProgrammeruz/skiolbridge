# SkillBridge — AI O'quv Platformasi

> Bilimingizni kasbga, mahoratingizni kelajakka aylantiring.

SkillBridge — bu sun'iy intellekt yordamida Frontend Developer bo'lishga yordam beradigan to'liq full-stack platforma.

---

## 🚀 Tezkor Boshlash

### Talablar
- Node.js v18+
- MongoDB (local yoki Atlas)
- npm v9+

### O'rnatish

```bash
# Reponi klonlang
git clone <repo-url>
cd skillbridge

# Barcha dependencylarni o'rnating
npm run install:all

# Muhit o'zgaruvchilarini sozlang
cp .env.example server/.env
# .env faylini tahrirlang
```

### Muhit O'zgaruvchilari (server/.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
AI_API_KEY=your_openai_api_key
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
CLIENT_URL=http://localhost:5173
```

> **Eslatma:** `AI_API_KEY` bo'lmasa platforma Demo rejimida ishlaydi. Barcha AI funksiyalar namuna ma'lumotlari bilan ishlaydi.

### Ishga tushirish

```bash
# Ikkalasini parallel ishga tushirish
npm run dev

# Alohida:
npm run dev:server   # Backend: http://localhost:5000
npm run dev:client   # Frontend: http://localhost:5173
```

---

## 🏗️ Arxitektura

```
skillbridge/
├── client/                    # React + TypeScript + Vite
│   └── src/
│       ├── api/              # Axios client
│       ├── components/       # UI komponentlar
│       ├── pages/            # Sahifalar
│       └── store/            # Zustand state
├── server/                    # Node.js + Express + TypeScript
│   └── src/
│       ├── config/           # DB va konfiguratsiya
│       ├── controllers/      # Route handlerlari
│       ├── middleware/       # Auth, error handling
│       ├── models/           # Mongoose modellari
│       ├── routes/           # API marshrутlari
│       └── services/ai/      # AI servislar
└── package.json
```

---

## 📋 Funksiyalar

| Funksiya | Tavsif |
|----------|--------|
| 🔐 Autentifikatsiya | JWT, bcrypt, himoyalangan marshrutlar |
| 🎓 Onboarding | 3 bosqichli foydalanuvchi sozlamalari |
| 🧠 AI Baholash | 25+ savol, 6 mavzu, avtomatik hisoblash |
| 🗺️ Yo'l Xaritasi | 11 bosqichli shaxsiy o'quv rejasi |
| 💬 AI Mentor | Real-time suhbat, o'zbek tilida |
| 📝 Vazifalar | 8+ amaliy loyiha, topshirish tizimi |
| 💼 Portfolio | Loyiha CRUD, GitHub/Live havolalar |
| 🎤 Mock Intervyu | 5 savollik AI intervyu, batafsil tahlil |
| 📊 Dashboard | Progress grafik, statistika, faollik |

---

## 🛠️ Texnologiyalar

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- React Router DOM v6
- Zustand (state management)
- React Hook Form + Zod
- Recharts (grafiklar)
- Lucide React (ikonalar)

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + bcryptjs
- Zod (validatsiya)
- Helmet + CORS + Rate Limiting

### AI
- OpenAI-compatible API
- Demo rejimi (API key yo'q bo'lganda)
- Modulli AI servis arxitekturasi

---

## 🌐 API Endpointlar

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
PUT    /api/v1/users/profile
POST   /api/v1/users/onboarding

POST   /api/v1/assessment/start
POST   /api/v1/assessment/submit
GET    /api/v1/assessment/history
GET    /api/v1/assessment/latest

POST   /api/v1/roadmap/generate
GET    /api/v1/roadmap
PATCH  /api/v1/roadmap/phase/:phaseId/progress

POST   /api/v1/ai/chat
GET    /api/v1/ai/conversations
GET    /api/v1/ai/conversations/:id
DELETE /api/v1/ai/conversations/:id

GET    /api/v1/tasks
GET    /api/v1/tasks/:id
POST   /api/v1/tasks/:id/submit

GET    /api/v1/portfolio
POST   /api/v1/portfolio
PUT    /api/v1/portfolio/:id
DELETE /api/v1/portfolio/:id

POST   /api/v1/interviews/start
POST   /api/v1/interviews/:id/answer
GET    /api/v1/interviews/history
GET    /api/v1/interviews/:id

GET    /api/v1/dashboard
GET    /api/v1/progress
```

---

## 🔒 Xavfsizlik

- Parollar bcrypt bilan hash qilinadi
- JWT tokenlar server tomonida tekshiriladi
- API kalitlar faqat backend da saqlanadi
- Rate limiting AI endpointlarga qo'llaniladi
- Helmet HTTP headerlarini himoya qiladi
- CORS sozlangan

---

## 🤖 AI Demo Rejimi

`AI_API_KEY` sozlanmagan bo'lsa, platforma demo rejimida ishlaydi:
- Mentor suhbatlari namuna javoblar qaytaradi
- Intervyu savollari oldindan yozilgan savollar
- Baholash natijalari haqiqiy algorithm bilan hisoblanadi
- Dashboard da "Demo" belgisi ko'rsatiladi

Haqiqiy AI uchun OpenAI API kalitini `.env` ga qo'shing.

---

## 📦 Deploy

```bash
# Production build
cd client && npm run build
cd ../server && npm run build

# Server ishga tushirish
NODE_ENV=production node dist/server.js
```

---

## 📝 Litsenziya

MIT © 2024 SkillBridge
