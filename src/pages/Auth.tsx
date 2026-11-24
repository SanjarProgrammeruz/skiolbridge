import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Ism kamida 2 ta belgi'),
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Parollar mos kelmadi', path: ['confirmPassword'] });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap size={18} className="text-bg" />
            </div>
            <span className="font-semibold text-lg">SkillBridge</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="text-text-secondary mt-2 text-sm">{subtitle}</p>
        </div>
        <div className="card">{children}</div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      navigate(user?.onboardingCompleted ? '/dashboard' : '/onboarding');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthLayout title="Xush kelibsiz!" subtitle="Hisobingizga kiring">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-400/10">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="email@example.com" className="input" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Parol</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
          {isLoading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
      <p className="text-center text-text-secondary text-sm mt-5">
        Hisobingiz yo'qmi?{' '}
        <Link to="/register" className="text-accent hover:underline">Ro'yxatdan o'ting</Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    try {
      await authRegister(data.fullName, data.email, data.password);
      navigate('/onboarding');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthLayout title="Ro'yxatdan o'ting" subtitle="Bepul hisob yarating va o'rganishni boshlang">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-400/10">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">To'liq ism</label>
          <input {...register('fullName')} placeholder="Ism Familiya" className="input" />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="email@example.com" className="input" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Parol</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Parolni tasdiqlang</label>
          <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input" />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
          {isLoading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
        </button>
      </form>
      <p className="text-center text-text-secondary text-sm mt-5">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="text-accent hover:underline">Kirish</Link>
      </p>
    </AuthLayout>
  );
}
