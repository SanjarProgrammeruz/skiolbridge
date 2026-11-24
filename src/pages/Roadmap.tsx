import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Lock, CheckCircle2, Play, ChevronDown, ChevronUp, ArrowRight, Zap } from 'lucide-react';
import api from '../api/client';
import { ProgressBar, Spinner, Badge, EmptyState } from '../components/ui';

interface Phase {
  id: string;
  title: string;
  description: string;
  topics: string[];
  exercises: string[];
  estimatedDays: number;
  status: 'locked' | 'active' | 'completed';
  progress: number;
  order: number;
}

interface Roadmap {
  _id: string;
  phases: Phase[];
  overallProgress: number;
  currentPhaseId: string;
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/roadmap')
      .then(r => setRoadmap(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/roadmap/generate');
      setRoadmap(res.data.data);
    } catch {
      alert('Yo\'l xaritasini yaratishda xato');
    } finally {
      setGenerating(false);
    }
  };

  const updateProgress = async (phaseId: string, progress: number, status?: string) => {
    try {
      const res = await api.patch(`/roadmap/phase/${phaseId}/progress`, { progress, status });
      setRoadmap(res.data.data);
    } catch {
      console.error('Progress update failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  if (!roadmap) {
    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState
          icon={<Map size={28} />}
          title="Yo'l xaritasi yaratilmagan"
          description="Avval bilim baholashdan o'ting, so'ng shaxsiy yo'l xaritangiz yaratiladi."
          action={
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/assessment')} className="btn-primary flex items-center gap-2">
                Baholashga o'tish <ArrowRight size={16} />
              </button>
              <button onClick={generate} disabled={generating} className="btn-secondary flex items-center gap-2">
                {generating ? <Spinner size={16} /> : <Zap size={16} />}
                Baholashsiz yaratish
              </button>
            </div>
          }
        />
      </div>
    );
  }

  const completed = roadmap.phases.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Map size={24} className="text-accent" /> O'quv Yo'l Xaritasi
          </h1>
          <p className="text-text-secondary text-sm mt-1">Frontend Developer · 11 bosqich</p>
        </div>
        <button onClick={generate} disabled={generating} className="btn-secondary flex items-center gap-2 text-sm">
          {generating ? <Spinner size={14} /> : <Zap size={14} />}
          Qayta yaratish
        </button>
      </div>

      {/* Overall progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-text-muted text-xs mb-1">Umumiy progress</p>
            <div className="text-3xl font-black text-accent">{roadmap.overallProgress}%</div>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-xs mb-1">Bajarildi</p>
            <p className="text-lg font-bold">{completed}/{roadmap.phases.length}</p>
          </div>
        </div>
        <ProgressBar value={roadmap.overallProgress} />
        <div className="flex gap-4 mt-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-2" /> Bajarildi ({completed})</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Faol ({roadmap.phases.filter(p => p.status === 'active').length})</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: 'var(--surface-3)' }} /> Qulflangan ({roadmap.phases.filter(p => p.status === 'locked').length})</div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {roadmap.phases.map((phase, idx) => {
          const isExpanded = expanded === phase.id;
          const statusColors = {
            completed: { border: 'rgba(156,205,187,0.3)', bg: 'rgba(156,205,187,0.05)', num: 'bg-accent-2/20 text-accent-2' },
            active: { border: 'rgba(169,155,239,0.3)', bg: 'rgba(169,155,239,0.05)', num: 'bg-accent/20 text-accent' },
            locked: { border: 'rgba(255,255,255,0.08)', bg: 'transparent', num: 'bg-surface-2 text-text-muted' },
          };
          const colors = statusColors[phase.status];

          return (
            <div key={phase.id} className="card transition-all"
              style={{ borderColor: colors.border, background: colors.bg }}>
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : phase.id)}>
                {/* Number/status */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${colors.num}`}>
                  {phase.status === 'completed' ? <CheckCircle2 size={18} /> :
                   phase.status === 'locked' ? <Lock size={16} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${phase.status === 'locked' ? 'text-text-secondary' : ''}`}>
                      {phase.title}
                    </h3>
                    <Badge variant={phase.status === 'completed' ? 'success' : phase.status === 'active' ? 'accent' : 'default'}>
                      {phase.status === 'completed' ? 'Bajarildi' : phase.status === 'active' ? 'Faol' : 'Qulflangan'}
                    </Badge>
                    {phase.status === 'active' && (
                      <Badge variant="default" className="text-text-muted">
                        ~{phase.estimatedDays} kun
                      </Badge>
                    )}
                  </div>
                  {phase.status !== 'locked' && (
                    <div className="mt-2">
                      <ProgressBar value={phase.progress} />
                      <p className="text-xs text-text-muted mt-1">{phase.progress}%</p>
                    </div>
                  )}
                </div>

                {isExpanded ? <ChevronUp size={18} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={18} className="text-text-muted flex-shrink-0" />}
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-white/8 space-y-4">
                  <p className="text-text-secondary text-sm">{phase.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Mavzular</p>
                      <ul className="space-y-1.5">
                        {phase.topics.map(t => (
                          <li key={t} className="text-sm text-text-secondary flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Mashqlar</p>
                      <ul className="space-y-1.5">
                        {phase.exercises.map(e => (
                          <li key={e} className="text-sm text-text-secondary flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-2/60 flex-shrink-0" />{e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {phase.status === 'active' && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => updateProgress(phase.id, Math.min(phase.progress + 10, 100))}
                        className="btn-secondary text-sm flex items-center gap-2">
                        <Play size={14} /> Progress +10%
                      </button>
                      {phase.progress >= 80 && (
                        <button onClick={() => updateProgress(phase.id, 100, 'completed')}
                          className="btn-primary text-sm flex items-center gap-2">
                          <CheckCircle2 size={14} /> Bajarildi deb belgilash
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
