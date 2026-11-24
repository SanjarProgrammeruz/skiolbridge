import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2, XCircle, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { ProgressBar, Spinner, Badge, ScoreCircle } from '../components/ui';

interface Question {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  explanation: string;
}

interface AssessmentResult {
  overallScore: number;
  overallLevel: string;
  knowledgeGaps: string[];
  skillScores: Array<{ skill: string; score: number; level: string; correctAnswers: number; totalQuestions: number }>;
}

type Phase = 'intro' | 'quiz' | 'result';

export default function Assessment() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessmentId, setAssessmentId] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || showFeedback) return;
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleNext(true);
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, phase, showFeedback]);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/assessment/start');
      setQuestions(res.data.data.questions);
      setAssessmentId(res.data.data.assessmentId);
      setPhase('quiz');
    } catch {
      alert('Baholashni boshlashda xato');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (showFeedback || selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    setAnswers(prev => ({ ...prev, [questions[current].id]: idx }));
  };

  const handleNext = (timeout = false) => {
    if (!timeout && selected === null) return;
    setShowFeedback(false);
    setSelected(null);
    if (current + 1 >= questions.length) {
      submitAssessment();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    setPhase('result');
    try {
      const payload = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] ?? -1,
      }));
      const res = await api.post('/assessment/submit', { assessmentId, answers: payload });
      setResult(res.data.data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const goToRoadmap = async () => {
    try {
      await api.post('/roadmap/generate');
      navigate('/roadmap');
    } catch {
      navigate('/roadmap');
    }
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(169,155,239,0.12)' }}>
            <Brain size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Bilim Baholash</h1>
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            20 ta savol orqali HTML, CSS, JavaScript, TypeScript, React va Git bilimlaringiz aniqlanadi. Natijalar asosida shaxsiy yo'l xaritasi yaratiladi.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
            {[
              { label: '20 savol', icon: '📝' },
              { label: '30 sek/savol', icon: '⏱️' },
              { label: '6 mavzu', icon: '📚' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs text-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={startAssessment} disabled={loading}
            className="btn-primary flex items-center gap-2 mx-auto">
            {loading ? <Spinner size={16} /> : <Brain size={16} />}
            {loading ? 'Yuklanmoqda...' : 'Baholashni boshlash'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[current];
    const progress = ((current + 1) / questions.length) * 100;
    const isCorrect = selected === q.correctAnswer;

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{current + 1}/{questions.length}</span>
            <Badge variant="accent">{q.skill}</Badge>
            <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'}>
              {q.difficulty === 'easy' ? 'Oson' : q.difficulty === 'medium' ? 'O\'rta' : 'Qiyin'}
            </Badge>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${timeLeft <= 10 ? 'text-red-400' : 'text-text-secondary'}`}>
            <Clock size={14} />
            {timeLeft}s
          </div>
        </div>

        <ProgressBar value={progress} />

        {/* Question */}
        <div className="card">
          <h2 className="text-lg font-semibold leading-relaxed mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = 'border-white/8 bg-surface-2 hover:border-white/20 cursor-pointer';
              if (showFeedback) {
                if (i === q.correctAnswer) style = 'border-green-500/50 bg-green-500/10';
                else if (i === selected && i !== q.correctAnswer) style = 'border-red-500/50 bg-red-500/10';
                else style = 'border-white/8 bg-surface-2 opacity-50';
              } else if (selected === i) {
                style = 'border-accent/50 bg-accent/10';
              }

              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    showFeedback && i === q.correctAnswer ? 'bg-green-500/20 text-green-400' :
                    showFeedback && i === selected && i !== q.correctAnswer ? 'bg-red-500/20 text-red-400' :
                    'bg-surface-3 text-text-muted'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm">{opt}</span>
                  {showFeedback && i === q.correctAnswer && <CheckCircle2 size={16} className="ml-auto text-green-400 flex-shrink-0" />}
                  {showFeedback && i === selected && i !== q.correctAnswer && <XCircle size={16} className="ml-auto text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`card flex items-start gap-3 ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}
            style={{ background: isCorrect ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)' }}>
            {isCorrect
              ? <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
              : <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <p className={`font-medium text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'To\'g\'ri!' : 'Noto\'g\'ri'}
              </p>
              <p className="text-text-secondary text-sm mt-1">{q.explanation}</p>
            </div>
            <button onClick={() => handleNext()}
              className="btn-primary text-sm flex items-center gap-1.5 flex-shrink-0">
              {current + 1 >= questions.length ? 'Tugatish' : 'Keyingisi'} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'result') {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size={32} />
        <p className="text-text-secondary">Natijalar hisoblanmoqda...</p>
      </div>
    );

    if (!result) return (
      <div className="card text-center py-12">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
        <p className="text-text-secondary">Natijalarni olishda xato</p>
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="card text-center py-10">
          <h1 className="text-2xl font-bold mb-2">Baholash yakunlandi! 🎉</h1>
          <p className="text-text-secondary text-sm mb-6">Sizning umumiy natijangiz</p>
          <div className="flex justify-center mb-6">
            <ScoreCircle score={result.overallScore} size="lg" />
          </div>
          <Badge variant={result.overallScore >= 70 ? 'success' : result.overallScore >= 40 ? 'warning' : 'danger'} className="text-sm px-4 py-1.5">
            {result.overallLevel}
          </Badge>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Mavzular bo'yicha natija</h2>
          <div className="space-y-4">
            {result.skillScores.map(skill => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">{skill.correctAnswers}/{skill.totalQuestions}</span>
                    <Badge variant={skill.score >= 70 ? 'success' : skill.score >= 40 ? 'warning' : 'danger'} className="text-xs">
                      {skill.score}%
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={skill.score} />
              </div>
            ))}
          </div>
        </div>

        {result.knowledgeGaps.length > 0 && (
          <div className="card border-yellow-500/20" style={{ background: 'rgba(234,179,8,0.05)' }}>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-yellow-400" /> Bilim bo'shliqlari
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.knowledgeGaps.map(gap => (
                <Badge key={gap} variant="warning">{gap}</Badge>
              ))}
            </div>
            <p className="text-text-secondary text-sm mt-3">Yo'l xaritasi bu sohalarga e'tibor qaratadi.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={goToRoadmap} className="btn-primary flex-1 flex items-center gap-2 justify-center">
            <ArrowRight size={16} /> Yo'l xaritasini yarating
          </button>
          <button onClick={() => { setPhase('intro'); setAnswers({}); setCurrent(0); setSelected(null); setResult(null); }}
            className="btn-secondary flex-1">
            Qayta baholash
          </button>
        </div>
      </div>
    );
  }

  return null;
}
