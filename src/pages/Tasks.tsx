import { useEffect, useState } from 'react';
import { Code2, CheckCircle2, ArrowRight, Send, X } from 'lucide-react';
import api from '../api/client';
import { Spinner, Badge, EmptyState, ProgressBar } from '../components/ui';

interface Task {
  _id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  requirements: string[];
  instructions: string;
  expectedResult: string;
  phase: string;
  userStatus: 'not_started' | 'submitted' | 'reviewed';
  submission?: { solution: string; status: string; submittedAt: string };
}

const difficultyLabel: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  beginner: { label: 'Oson', variant: 'success' },
  intermediate: { label: 'O\'rta', variant: 'warning' },
  advanced: { label: 'Qiyin', variant: 'danger' },
};

const phaseLabel: Record<string, string> = {
  'phase-1': 'HTML',
  'phase-2': 'CSS',
  'phase-3': 'JavaScript',
  'phase-4': 'JS Ilg\'or',
  'phase-5': 'TypeScript',
  'phase-6': 'React',
  'phase-7': 'React Ilg\'or',
  'phase-8': 'API',
  'phase-9': 'Git',
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Task | null>(null);
  const [solution, setSolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterPhase, setFilterPhase] = useState('');
  const [filterDiff, setFilterDiff] = useState('');

  useEffect(() => {
    loadTasks();
  }, [filterPhase, filterDiff]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterPhase) params.set('phase', filterPhase);
      if (filterDiff) params.set('difficulty', filterDiff);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const openTask = async (task: Task) => {
    try {
      const res = await api.get(`/tasks/${task._id}`);
      setSelected({ ...task, ...res.data.data });
      setSolution(res.data.data.submission?.solution || '');
    } catch {
      setSelected(task);
    }
  };

  const submitTask = async () => {
    if (!selected || !solution.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/tasks/${selected._id}/submit`, { solution });
      setSelected(null);
      setSolution('');
      loadTasks();
    } catch {
      alert('Topshirishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  const completed = tasks.filter(t => t.userStatus === 'submitted' || t.userStatus === 'reviewed').length;

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code2 size={24} className="text-accent" /> Amaliy Vazifalar
        </h1>
        <p className="text-text-secondary text-sm mt-1">Ko'nikmalaringizni amaliyotda mustahkamlang</p>
      </div>

      {/* Stats */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-secondary">{completed}/{tasks.length} bajarildi</span>
          <span className="text-sm font-bold text-accent">{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</span>
        </div>
        <ProgressBar value={tasks.length ? (completed / tasks.length) * 100 : 0} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)}
          className="input w-auto text-sm py-2">
          <option value="">Barcha mavzular</option>
          {Object.entries(phaseLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
          className="input w-auto text-sm py-2">
          <option value="">Barcha darajalar</option>
          <option value="beginner">Oson</option>
          <option value="intermediate">O'rta</option>
          <option value="advanced">Qiyin</option>
        </select>
      </div>

      {/* Tasks grid */}
      {tasks.length === 0 ? (
        <EmptyState icon={<Code2 size={28} />} title="Vazifa topilmadi" description="Hali vazifalar qo'shilmagan." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => {
            const diff = difficultyLabel[task.difficulty];
            const isDone = task.userStatus !== 'not_started';
            return (
              <div key={task._id} className={`card hover:border-white/20 transition-all cursor-pointer group ${isDone ? 'border-accent-2/20' : ''}`}
                onClick={() => openTask(task)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={diff.variant}>{diff.label}</Badge>
                    <Badge variant="default">{phaseLabel[task.phase] || task.phase}</Badge>
                  </div>
                  {isDone && <CheckCircle2 size={18} className="text-accent-2 flex-shrink-0" />}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">{task.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">{task.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.technologies.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>{t}</span>
                  ))}
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${isDone ? 'text-accent-2' : 'text-accent'}`}>
                  {isDone ? (
                    <><CheckCircle2 size={14} /> Topshirilgan</>
                  ) : (
                    <><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> Boshlash</>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">{selected.title}</h2>
                <Badge variant={difficultyLabel[selected.difficulty].variant}>{difficultyLabel[selected.difficulty].label}</Badge>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-1.5">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <p className="text-text-secondary text-sm leading-relaxed">{selected.description}</p>

              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Talablar</h3>
                <ul className="space-y-1.5">
                  {selected.requirements.map(r => (
                    <li key={r} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Ko'rsatmalar</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{selected.instructions}</p>
              </div>

              <div className="p-4 rounded-xl border border-accent-2/20" style={{ background: 'rgba(156,205,187,0.05)' }}>
                <h3 className="text-xs font-semibold text-accent-2 uppercase tracking-wide mb-2">Kutilgan natija</h3>
                <p className="text-sm text-text-secondary">{selected.expectedResult}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Yechimingiz (GitHub URL yoki tavsif)</h3>
                <textarea
                  value={solution}
                  onChange={e => setSolution(e.target.value)}
                  placeholder="GitHub repository URL, CodePen havolasi yoki yechimingiz tavsifini kiriting..."
                  rows={5}
                  className="input resize-none w-full text-sm"
                />
              </div>
            </div>

            <div className="p-5 border-t border-white/8 flex gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">
                Yopish
              </button>
              <button onClick={submitTask} disabled={!solution.trim() || submitting}
                className="btn-primary flex-1 flex items-center gap-2 justify-center">
                {submitting ? <Spinner size={16} /> : <Send size={16} />}
                {selected.userStatus !== 'not_started' ? 'Yangilash' : 'Topshirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
