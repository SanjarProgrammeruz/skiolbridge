import { Loader2 } from 'lucide-react';

export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-accent" />;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <Spinner size={32} />
        <p className="text-text-muted mt-3 text-sm">Yuklanmoqda...</p>
      </div>
    </div>
  );
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export function Badge({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  className?: string;
}) {
  const styles = {
    default: 'bg-surface-2 text-text-secondary',
    success: 'bg-green-500/15 text-green-400',
    warning: 'bg-yellow-500/15 text-yellow-400',
    danger: 'bg-red-500/15 text-red-400',
    accent: 'bg-accent/15 text-accent',
  };
  return (
    <span className={`badge ${styles[variant]} ${className}`}>{children}</span>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-muted"
        style={{ background: 'var(--surface-2)' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

export function DemoModeBanner() {
  return (
    <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
      style={{ background: 'rgba(169,155,239,0.1)', border: '1px solid rgba(169,155,239,0.2)', color: 'var(--accent)' }}>
      <span>🤖</span>
      <span>Demo rejimi: AI javobi namunasi ko'rsatilmoqda. Haqiqiy AI uchun .env faylida API kalitini kiriting.</span>
    </div>
  );
}

export function ScoreCircle({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-16 h-16 text-lg', md: 'w-24 h-24 text-2xl', lg: 'w-32 h-32 text-3xl' };
  const color = score >= 80 ? '#9CCDBB' : score >= 60 ? '#A99BEF' : score >= 40 ? '#FBBF24' : '#F87171';
  
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold relative`}
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--surface-2) 0deg)` }}>
      <div className="absolute inset-1.5 rounded-full flex items-center justify-center"
        style={{ background: 'var(--surface)' }}>
        <span style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}
