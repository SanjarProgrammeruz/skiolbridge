import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Map, ArrowRight, Flame, Trophy, Target, Code2, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ProgressBar, Spinner, Badge } from '../components/ui';
import api from '../api/client';

interface DashboardData {
  progress: { totalPoints: number; currentStreak: number; level: number; totalTasksCompleted: number };
  assessment: { overallScore: number; overallLevel: string } | null;
  roadmap: { overallProgress: number; currentPhase: { title: string; description: string } | null; totalPhases: number; completedPhases: number } | null;
  weeklyActivity: Array<{ day: string; minutesSpent: number }>;
  recentActivity: { tasks: number; interviews: number };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p className="text-text-secondary text-sm mt-1">{user?.careerPath} · {user?.experienceLevel}</p>
        </div>
        <div className="flex gap-2">
          {!data?.assessment && (
            <Link to="/assessment" className="btn-primary flex items-center gap-2 text-sm">
              <Brain size={16} /> Baholashni boshlash
            </Link>
          )}
          {data?.assessment && !data?.roadmap && (
            <Link to="/roadmap" className="btn-primary flex items-center gap-2 text-sm">
              <Map size={16} /> Yo'l xaritasini yarating
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'Ball', value: data?.progress.totalPoints || 0, color: 'text-yellow-400', bg: 'rgba(251,191,36,0.1)' },
          { icon: Flame, label: 'Streak', value: `${data?.progress.currentStreak || 0} kun`, color: 'text-orange-400', bg: 'rgba(251,146,60,0.1)' },
          { icon: Target, label: 'Daraja', value: data?.progress.level || 1, color: 'text-accent', bg: 'rgba(169,155,239,0.1)' },
          { icon: Code2, label: 'Vazifalar', value: data?.progress.totalTasksCompleted || 0, color: 'text-accent-2', bg: 'rgba(156,205,187,0.1)' },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: stat.bg }}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-text-muted text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Haftalik faollik
            </h2>
            <span className="text-text-muted text-xs">Daqiqalar</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data?.weeklyActivity || []}>
              <XAxis dataKey="day" tick={{ fill: '#636775', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#191D24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F2F1F7' }}
                itemStyle={{ color: '#A99BEF' }}
              />
              <Bar dataKey="minutesSpent" fill="#A99BEF" radius={[4, 4, 0, 0]} name="Daqiqa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assessment */}
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Brain size={18} className="text-accent" /> Baholash natijasi
          </h2>
          {data?.assessment ? (
            <div className="text-center">
              <div className="text-4xl font-black mb-1" style={{ color: 'var(--accent)' }}>
                {data.assessment.overallScore}%
              </div>
              <Badge variant={data.assessment.overallScore >= 70 ? 'success' : data.assessment.overallScore >= 40 ? 'warning' : 'danger'}>
                {data.assessment.overallLevel}
              </Badge>
              <Link to="/assessment" className="btn-secondary w-full text-sm mt-4 block text-center">
                Qayta baholash
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-text-muted text-sm mb-4">Hali baholanmagan</div>
              <Link to="/assessment" className="btn-primary text-sm w-full block text-center">
                Baholashni boshlash
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Roadmap */}
      {data?.roadmap && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <Map size={18} className="text-accent" /> Joriy yo'l xaritasi
            </h2>
            <Link to="/roadmap" className="btn-ghost text-sm flex items-center gap-1">
              Ko'rish <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-black" style={{ color: 'var(--accent)' }}>
              {data.roadmap.overallProgress}%
            </div>
            <div className="flex-1">
              <ProgressBar value={data.roadmap.overallProgress} />
              <p className="text-text-muted text-xs mt-1">
                {data.roadmap.completedPhases}/{data.roadmap.totalPhases} bosqich bajarildi
              </p>
            </div>
          </div>
          {data.roadmap.currentPhase && (
            <div className="p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <p className="text-xs text-text-muted mb-1">Joriy bosqich</p>
              <p className="font-medium">{data.roadmap.currentPhase.title}</p>
              <p className="text-text-secondary text-sm mt-1">{data.roadmap.currentPhase.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold mb-4">Tezkor harakatlar</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/assessment', icon: Brain, label: 'Baholash', desc: 'Bilimingizni aniqlang', color: '#A99BEF' },
            { href: '/roadmap', icon: Map, label: 'Yo\'l xaritasi', desc: 'Rejangizni ko\'ring', color: '#9CCDBB' },
            { href: '/mentor', icon: MessageSquare, label: 'AI Mentor', desc: 'Savol bering', color: '#A99BEF' },
            { href: '/interviews', icon: Briefcase, label: 'Mock Intervyu', desc: 'Mashq qiling', color: '#9CCDBB' },
          ].map(action => (
            <Link key={action.href} to={action.href} className="card hover:border-white/15 transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${action.color}18` }}>
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-text-muted text-xs mt-1">{action.desc}</p>
              <ArrowRight size={14} className="text-text-muted mt-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
