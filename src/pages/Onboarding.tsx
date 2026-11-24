import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';

const goals = [
  'Ish topish va karyera boshlash',
  'Freelance loyihalar olish',
  'Shaxsiy loyihalar yaratish',
  'Bilimlarni chuqurlashtirish',
  'Kurs topshirish va sertifikat olish',
];

const times = [
  { value: 0.5, label: '30 daqiqa' },
  { value: 1, label: '1 soat' },
  { value: 2, label: '2 soat' },
  { value: 3, label: '3+ soat' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [time, setTime] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = ['Maqsadingiz', 'Vaqt', 'Tayyor'];

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await api.post('/users/onboarding', {
        careerPath: 'Frontend Developer',
        experienceLevel: 'Beginner',
        learningGoal: goal,
        dailyLearningTime: time,
      });
      updateUser(res.data.data);
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap size={18} className="text-bg" />
            </div>
            <span className="font-semibold text-lg">SkillBridge</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-accent' : 'bg-surface-2'}`} />
              <p className={`text-xs mt-1.5 ${i === step ? 'text-accent' : 'text-text-muted'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="card">
          {step === 0 && (
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(169,155,239,0.12)' }}>
                <Target size={24} className="text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-2">Asosiy maqsadingiz nima?</h2>
              <p className="text-text-secondary text-sm mb-6">O'quv rejangiz shunga moslashtiriladi</p>
              <div className="space-y-2.5">
                {goals.map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${goal === g ? 'border-accent/50 bg-accent/10' : 'border-white/8 bg-surface-2 hover:border-white/15'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${goal === g ? 'border-accent' : 'border-text-muted'}`}>
                      {goal === g && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                    <span className="text-sm">{g}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} disabled={!goal}
                className="btn-primary w-full mt-6 flex items-center gap-2 justify-center">
                Davom etish <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(156,205,187,0.12)' }}>
                <Clock size={24} className="text-accent-2" />
              </div>
              <h2 className="text-xl font-bold mb-2">Kunlik o'quv vaqtingiz?</h2>
              <p className="text-text-secondary text-sm mb-6">Izchillik muvaffaqiyat kalitidir</p>
              <div className="grid grid-cols-2 gap-3">
                {times.map(t => (
                  <button key={t.value} onClick={() => setTime(t.value)}
                    className={`p-4 rounded-xl border transition-all text-center ${time === t.value ? 'border-accent/50 bg-accent/10' : 'border-white/8 bg-surface-2 hover:border-white/15'}`}>
                    <div className={`text-lg font-bold ${time === t.value ? 'text-accent' : ''}`}>{t.label}</div>
                    <div className="text-xs text-text-muted mt-1">kuniga</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full mt-6 flex items-center gap-2 justify-center">
                Davom etish <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(156,205,187,0.12)' }}>
                <CheckCircle2 size={32} className="text-accent-2" />
              </div>
              <h2 className="text-xl font-bold mb-2">Hammasi tayyor!</h2>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Siz Frontend Developer yo'nalishida o'rganasiz.<br />
                <strong className="text-text-primary">{goal}</strong> maqsadingiz bor.<br />
                Kuniga <strong className="text-text-primary">{time === 0.5 ? '30 daqiqa' : `${time} soat`}</strong> o'qishni rejalashtirgansiz.
              </p>
              <div className="card mb-6" style={{ background: 'var(--surface-2)' }}>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-accent-2" />
                  <span>Avval bilim darajangiz baholanadi</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary mt-3">
                  <CheckCircle2 size={16} className="text-accent-2" />
                  <span>Shaxsiy yo'l xaritasi yaratiladi</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary mt-3">
                  <CheckCircle2 size={16} className="text-accent-2" />
                  <span>O'rganishni boshlaysiz</span>
                </div>
              </div>
              <button onClick={handleFinish} disabled={loading} className="btn-primary w-full flex items-center gap-2 justify-center">
                {loading ? 'Yuklanmoqda...' : 'Dashboardga o\'tish'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
