import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Brain, Code2, Briefcase, MessageSquare, User, LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { href: '/assessment', icon: Brain, label: 'Baholash' },
  { href: '/roadmap', icon: Map, label: 'Yo\'l xaritasi' },
  { href: '/tasks', icon: Code2, label: 'Vazifalar' },
  { href: '/mentor', icon: MessageSquare, label: 'AI Mentor' },
  { href: '/interviews', icon: Briefcase, label: 'Intervyu' },
  { href: '/portfolio', icon: User, label: 'Portfolio' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
        border-r border-white/8 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ background: 'var(--surface)' }}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap size={16} className="text-bg" />
            </div>
            <span className="font-semibold text-text-primary">SkillBridge</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${active
                    ? 'text-text-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  }
                `}
                style={active ? { background: 'rgba(169,155,239,0.12)', color: 'var(--accent)' } : {}}
              >
                <item.icon size={18} className={active ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'} />
                <span className="text-sm">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-accent/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/8">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 transition-all mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-bg"
              style={{ background: 'var(--accent)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.fullName}</p>
              <p className="text-xs text-text-muted truncate">{user?.careerPath}</p>
            </div>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-sm">
            <LogOut size={16} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-white/8 sticky top-0 z-10" style={{ background: 'var(--surface)' }}>
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-1.5">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap size={12} className="text-bg" />
            </div>
            <span className="font-semibold text-sm">SkillBridge</span>
          </div>
        </div>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
