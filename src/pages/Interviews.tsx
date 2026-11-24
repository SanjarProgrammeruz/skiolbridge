import { useState } from 'react';
import { Briefcase, ChevronRight, CheckCircle2, XCircle, ArrowRight, Trophy, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { Spinner, Badge, ScoreCircle, EmptyState, DemoModeBanner } from '../components/ui';

interface InterviewSession {
  _id: string;
  topic: string;
  difficulty: string;
  status: string;
  overallScore: number;
  overallFeedback: string;
  weakAreas: string[];
  answers: Array<{ question: string; score: number; feedback: string; strengths: string[]; improvements: string[] }>;
  createdAt: string;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

type Phase = 'select' | 'interview' | 'feedback' | 'history';

const TOPICS = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Frontend'];
const DIFFICULTIES = [
  { value: 'beginner', label: 'Oson', desc: 'Asosiy tushunchalar' },
  { value: 'intermediate', label: 'O\'rta', desc: 'Amaliy ko\'nikmalar' },
  { value: 'advanced', label: 'Qiyin', desc: 'Murakkab masalalar' },
];

export default function Interviews() {
  const [phase, setPhase] = useState<Phase>('select');
  const [topic, setTopic] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('beginner');
  const [sessionId, setSessionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNum, setQuestionNum] = useState(1);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [showEval, setShowEval] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/interviews/start', { topic, difficulty });
      setSessionId(res.data.data.sessionId);
      setCurrentQuestion(res.data.data.question);
      setQuestionNum(1);
      setIsDemo(res.data.data.isDemo);
      setEvaluation(null);
      setAnswer('');
      setShowEval(false);
      setPhase('interview');
    } catch { alert('Intervyuni boshlashda xato'); } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(`/interviews/${sessionId}/answer`, { answer, currentQuestion });
      const { evaluation: eval_, nextQuestion, questionNumber, isComplete } = res.data.data;
      setEvaluation(eval_);
      setShowEval(true);
      if (isComplete) {
        setSession(res.data.data.session);
        setPhase('feedback');
      } else {
        setCurrentQuestion(nextQuestion);
        setQuestionNum(questionNumber);
      }
    } catch { alert('Javobni saqlashda xato'); } finally { setLoading(false); }
  };

  const nextQuestion = () => {
    setAnswer('');
    setEvaluation(null);
    setShowEval(false);
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/interviews/history');
      setHistory(res.data.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
      setPhase('history');
    }
  };

  if (phase === 'select') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase size={24} className="text-accent" />Mock Intervyu</h1>
            <p className="text-text-secondary text-sm mt-1">AI bilan texnik intervyu mashq qiling</p>
          </div>
          <button onClick={loadHistory} className="btn-secondary text-sm">Tarix</button>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Mavzu tanlang</h2>
          <div className="grid grid-cols-3 gap-2">
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${topic === t ? 'border-accent/50 bg-accent/15 text-accent' : 'border-white/8 bg-surface-2 text-text-secondary hover:border-white/20'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Qiyinlik darajasi</h2>
          <div className="space-y-2.5">
            {DIFFICULTIES.map(d => (
              <button key={d.value} onClick={() => setDifficulty(d.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${difficulty === d.value ? 'border-accent/50 bg-accent/10' : 'border-white/8 bg-surface-2 hover:border-white/20'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${difficulty === d.value ? 'border-accent' : 'border-text-muted'}`}>
                  {difficulty === d.value && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{d.label}</p>
                  <p className="text-text-muted text-xs">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'rgba(169,155,239,0.05)', borderColor: 'rgba(169,155,239,0.2)' }}>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-2">
            <AlertCircle size={16} className="text-accent" />
            <span className="font-medium">Qoidalar</span>
          </div>
          <ul className="space-y-1 text-sm text-text-secondary ml-7">
            <li>5 ta savol beriladi</li>
            <li>Har bir javob AI tomonidan baholanadi</li>
            <li>Oxirida batafsil tahlil beriladi</li>
          </ul>
        </div>

        <button onClick={startInterview} disabled={loading}
          className="btn-primary w-full flex items-center gap-2 justify-center py-3.5">
          {loading ? <Spinner size={16} /> : <Briefcase size={16} />}
          {loading ? 'Yuklanmoqda...' : 'Intervyuni boshlash'}
        </button>
      </div>
    );
  }

  if (phase === 'interview') {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="accent">{topic}</Badge>
            <span className="text-text-secondary text-sm">Savol {questionNum}/5</span>
          </div>
          {isDemo && <div className="badge bg-accent/15 text-accent text-xs">Demo</div>}
        </div>

        {isDemo && questionNum === 1 && <DemoModeBanner />}

        <div className="card">
          <p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wide">Savol {questionNum}</p>
          <h2 className="text-lg font-semibold leading-relaxed">{currentQuestion}</h2>
        </div>

        {showEval && evaluation ? (
          <div className="space-y-4">
            <div className={`card ${evaluation.score >= 70 ? 'border-green-500/30' : evaluation.score >= 40 ? 'border-yellow-500/30' : 'border-red-500/30'}`}
              style={{ background: evaluation.score >= 70 ? 'rgba(34,197,94,0.05)' : evaluation.score >= 40 ? 'rgba(234,179,8,0.05)' : 'rgba(239,68,68,0.05)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Baholash natijasi</span>
                <Badge variant={evaluation.score >= 70 ? 'success' : evaluation.score >= 40 ? 'warning' : 'danger'}>
                  {evaluation.score}/100
                </Badge>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{evaluation.feedback}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {evaluation.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-2">Kuchli tomonlar</p>
                    {evaluation.strengths.map(s => (
                      <div key={s} className="flex items-start gap-2 text-sm text-text-secondary mb-1">
                        <CheckCircle2 size={13} className="text-green-400 mt-0.5 flex-shrink-0" />{s}
                      </div>
                    ))}
                  </div>
                )}
                {evaluation.improvements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-2">Yaxshilash kerak</p>
                    {evaluation.improvements.map(s => (
                      <div key={s} className="flex items-start gap-2 text-sm text-text-secondary mb-1">
                        <XCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />{s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {questionNum < 5 && (
              <button onClick={nextQuestion} className="btn-primary w-full flex items-center gap-2 justify-center">
                Keyingi savol <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Javobingizni yozing..."
              rows={6} className="input resize-none w-full" />
            <button onClick={submitAnswer} disabled={!answer.trim() || loading}
              className="btn-primary w-full flex items-center gap-2 justify-center">
              {loading ? <Spinner size={16} /> : <ChevronRight size={16} />}
              {loading ? 'Baholanmoqda...' : 'Javob berish'}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'feedback' && session) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="card text-center py-10">
          <Trophy size={36} className="text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Intervyu yakunlandi!</h1>
          <p className="text-text-secondary text-sm mb-6">Sizning umumiy natijangiz</p>
          <div className="flex justify-center mb-4">
            <ScoreCircle score={session.overallScore} size="lg" />
          </div>
          <p className="text-text-secondary text-sm max-w-md mx-auto">{session.overallFeedback}</p>
        </div>

        {session.weakAreas.length > 0 && (
          <div className="card">
            <h2 className="font-semibold mb-3">Kuchaytirishga muhtoj sohalar</h2>
            <div className="flex flex-wrap gap-2">
              {session.weakAreas.map(w => <Badge key={w} variant="warning">{w}</Badge>)}
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="font-semibold mb-4">Savol-javoblar tahlili</h2>
          <div className="space-y-4">
            {session.answers.map((a, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Savol {i + 1}</p>
                  <Badge variant={a.score >= 70 ? 'success' : a.score >= 40 ? 'warning' : 'danger'}>{a.score}/100</Badge>
                </div>
                <p className="text-xs text-text-muted mb-2">{a.question}</p>
                <p className="text-sm text-text-secondary">{a.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setPhase('select')} className="btn-primary flex-1">Yangi intervyu</button>
          <button onClick={loadHistory} className="btn-secondary flex-1">Tarix</button>
        </div>
      </div>
    );
  }

  if (phase === 'history') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Intervyu tarixi</h1>
          <button onClick={() => setPhase('select')} className="btn-primary flex items-center gap-2 text-sm">
            <Briefcase size={16} /> Yangi intervyu
          </button>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size={28} /></div> :
          history.length === 0 ? (
            <EmptyState icon={<Briefcase size={28} />} title="Hali intervyu yo'q" description="Birinchi mock intervyungizni o'tkazing."
              action={<button onClick={() => setPhase('select')} className="btn-primary mx-auto flex items-center gap-2"><Briefcase size={16} />Boshlash</button>} />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {history.map(s => (
                <div key={s._id} className="card hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="accent">{s.topic}</Badge>
                      <p className="text-xs text-text-muted mt-2">{new Date(s.createdAt).toLocaleDateString('uz-UZ')}</p>
                    </div>
                    <ScoreCircle score={s.overallScore} size="sm" />
                  </div>
                  <p className="text-sm text-text-secondary">{s.overallFeedback}</p>
                  {s.weakAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.weakAreas.map(w => <Badge key={w} variant="warning" className="text-xs">{w}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>
    );
  }

  return null;
}
