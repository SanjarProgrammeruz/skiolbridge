import { Link } from 'react-router-dom';
import { Zap, Brain, Map, Code2, Briefcase, Star, ArrowRight, CheckCircle2, Users, TrendingUp, Award, MessageSquare } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)' }} className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/8 sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(16,18,22,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap size={16} className="text-bg" />
            </div>
            <span className="font-semibold text-lg">SkillBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Kirish</Link>
            <Link to="/register" className="btn-primary text-sm">Boshlash</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-text-secondary mb-8"
          style={{ background: 'var(--surface)' }}>
          <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse" />
          AI yordamida o'rganish platformasi
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Bilimingizni{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            kasbga
          </span>
          ,<br />mahoratingizni{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent-2), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            kelajakka
          </span>{' '}
          aylantiring.
        </h1>
        
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          SkillBridge sizga bilim darajangizni aniqlash, individual o'quv reja tuzish va professional faoliyatingizni boshlashda yordam beradi.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5">
            Bepul boshlash <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
            Kirish
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-text-muted">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent-2" /><span>Bepul boshlash</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent-2" /><span>AI yo'riqnoma</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent-2" /><span>Sertifikat</span></div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, label: 'Foydalanuvchilar', value: '2,400+' },
            { icon: TrendingUp, label: 'Muvaffaqiyat darajasi', value: '87%' },
            { icon: Code2, label: 'Amaliy vazifalar', value: '150+' },
            { icon: Award, label: 'Ish topganlar', value: '340+' },
          ].map(stat => (
            <div key={stat.label}>
              <stat.icon size={24} className="text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-text-muted text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Qanday ishlaydi?</h2>
          <p className="text-text-secondary max-w-xl mx-auto">4 ta oddiy qadam bilan frontend developer bo'ling</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', icon: Brain, title: 'Baholash', desc: 'AI sizning bilim darajangizni aniq baholaydi va kuchli/zaif tomonlarni aniqlaydi.' },
            { step: '02', icon: Map, title: 'Yo\'l xaritasi', desc: 'Natijalar asosida sizga mos shaxsiy o\'quv reja yaratiladi.' },
            { step: '03', icon: Code2, title: 'Amaliyot', desc: 'Haqiqiy loyihalar va vazifalar orqali ko\'nikmalaringizni mustahkamlang.' },
            { step: '04', icon: Briefcase, title: 'Intervyu', desc: 'AI mock intervyu bilan ish uchun tayyor bo\'ling va portfolio tuzing.' },
          ].map(item => (
            <div key={item.step} className="card relative">
              <div className="text-5xl font-black mb-4" style={{ color: 'rgba(169,155,239,0.12)' }}>{item.step}</div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'rgba(169,155,239,0.12)' }}>
                <item.icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Platform imkoniyatlari</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Sizning muvaffaqiyatingiz uchun barcha kerakli vositalar</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Brain, title: 'AI Baholash', desc: 'HTML, CSS, JavaScript, TypeScript, React va Git bilimlaringiz aniq baholanadi.', color: '#A99BEF' },
            { icon: Map, title: 'Shaxsiy Roadmap', desc: 'Natijalaringiz asosida 11 bosqichli individual o\'quv rejasi yaratiladi.', color: '#9CCDBB' },
            { icon: MessageSquare, title: 'AI Mentor', desc: '24/7 ishlaydi. O\'zbek tilida dasturlash savollaringizga javob beradi.', color: '#A99BEF' },
            { icon: Code2, title: 'Amaliy Vazifalar', desc: 'Haqiqiy loyihalar asosida portfoliongizni to\'ldiring.', color: '#9CCDBB' },
            { icon: Briefcase, title: 'Mock Intervyu', desc: 'AI bilan texnik intervyu mashq qiling va batafsil tahlil oling.', color: '#A99BEF' },
            { icon: Award, title: 'Portfolio Builder', desc: 'Professional portfolio sahifangizni platformada yarating.', color: '#9CCDBB' },
          ].map(f => (
            <div key={f.title} className="card hover:border-white/15 transition-all group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18` }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">O'quv yo'l xaritasi</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Frontend Developer bo'lish uchun 11 bosqichli yo'l</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          {['HTML Asoslari','CSS va Responsive','JavaScript Asoslari','JavaScript Ilg\'or','TypeScript','React Asoslari','React Ilg\'or','API Integratsiya','Git va GitHub','Portfolio Loyihalar','Intervyu Tayyorgarligi'].map((phase, i) => (
            <div key={phase} className="card flex items-center gap-3 py-3.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: i < 3 ? 'rgba(156,205,187,0.2)' : 'var(--surface-2)', color: i < 3 ? 'var(--accent-2)' : 'var(--text-muted)' }}>
                {i + 1}
              </div>
              <span className="text-sm font-medium">{phase}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Foydalanuvchilar fikri</h2>
          <p className="text-text-muted text-sm">(Namuna sharhlar)</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Aziz Karimov', role: 'Frontend Developer @ TechCorp', text: 'SkillBridge orqali 6 oyda frontend developer bo\'ldim. AI mentor va amaliy vazifalar juda yordam berdi.', stars: 5 },
            { name: 'Nilufar Rahimova', role: 'React Developer @ StartupUz', text: 'Bilim bo\'shliqlari aniqlab berildi va shaxsiy o\'quv reja tuzildi. Intervyu mashqlari juda samarali.', stars: 5 },
            { name: 'Jasur Toshmatov', role: 'Junior Developer @ IT Company', text: 'Portfolio builder bilan professonal portfoliom tayyor. Ish topishda katta yordam bo\'ldi.', stars: 5 },
          ].map(t => (
            <div key={t.name} className="card">
              <div className="flex gap-1 mb-4">{Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-text-muted text-xs mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Narxlar</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Bepul', price: "0", period: '', features: ['AI Baholash', 'Asosiy yo\'l xaritasi', '5 ta vazifa', 'AI Mentor (cheklangan)'], accent: false },
            { name: 'Pro', price: "99,000", period: '/oy', features: ['Barcha bepul imkoniyatlar', 'Cheksiz AI suhbat', 'Barcha vazifalar', 'Mock intervyu', 'Portfolio builder', 'Sertifikat'], accent: true },
            { name: 'Kurs', price: "499,000", period: '/bir martalik', features: ['Barcha Pro imkoniyatlar', 'Mentor qo\'llab-quvvatlash', 'Ish topishda yordam', 'Kafolat'], accent: false },
          ].map(plan => (
            <div key={plan.name} className={`card ${plan.accent ? 'border-accent/30' : ''}`}
              style={plan.accent ? { background: 'rgba(169,155,239,0.05)' } : {}}>
              {plan.accent && <div className="badge bg-accent/15 text-accent mb-4">Eng mashhur</div>}
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="text-2xl font-bold mb-1">{plan.price} <span className="text-sm font-normal text-text-secondary">so'm{plan.period}</span></div>
              <ul className="space-y-2.5 mt-5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 size={14} className="text-accent-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={plan.accent ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}>
                Boshlash
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="card text-center py-16" style={{ background: 'linear-gradient(135deg, rgba(169,155,239,0.08), rgba(156,205,187,0.08))', borderColor: 'rgba(169,155,239,0.2)' }}>
          <h2 className="text-3xl font-bold mb-4">Bugun boshlang</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">Minglab ishtirokchilar bilan qo'shiling va frontend kariryerangizni boshlang.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5">
            Bepul ro'yxatdan o'ting <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">Ko'p so'raladigan savollar</h2>
        <div className="space-y-4">
          {[
            { q: 'SkillBridge kimlar uchun mo\'ljallangan?', a: 'Asosan frontend dasturchi bo\'lishni istagan boshlovchilar uchun. Oldindan tajriba shart emas.' },
            { q: 'AI mentor qanday tilda gaplashadi?', a: 'AI mentor o\'zbek tilida (lotin alifbosi) javob beradi va tushuntiradi.' },
            { q: 'Qancha vaqt o\'rganish kerak?', a: 'Har kuni 1-2 soat vaqt ajratsangiz, 6-9 oyda frontend developer darajasiga etishishingiz mumkin.' },
            { q: 'Sertifikat beriladi?', a: 'Ha, kurs tugagandan so\'ng raqamli sertifikat beriladi.' },
          ].map(faq => (
            <div key={faq.q} className="card">
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center text-text-muted text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Zap size={12} className="text-bg" />
          </div>
          <span className="font-medium text-text-secondary">SkillBridge</span>
        </div>
        <p>© 2024 SkillBridge. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
