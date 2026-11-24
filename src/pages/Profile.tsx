import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Shield, Bell, Save, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      learningGoal: user?.learningGoal || '',
      dailyLearningTime: user?.dailyLearningTime || 1,
    },
  });

  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: pwdErrors }, reset: resetPwd } = useForm<{
    currentPassword: string; newPassword: string; confirmPassword: string;
  }>();

  const saveProfile = async (data: { fullName: string; learningGoal: string; dailyLearningTime: number }) => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', data);
      updateUser(res.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert('Saqlashda xato'); } finally { setSaving(false); }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) { alert('Parollar mos kelmadi'); return; }
    setSaving(true);
    try {
      await api.put('/users/profile', { password: data.newPassword });
      resetPwd();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert('Parolni o\'zgartirishda xato'); } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'password', icon: Shield, label: 'Parol' },
    { id: 'preferences', icon: Bell, label: 'Sozlamalar' },
  ] as const;

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profil va Sozlamalar</h1>

      {/* Avatar */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-bg"
          style={{ background: 'var(--accent)' }}>
          {initials}
        </div>
        <div>
          <h2 className="font-semibold text-lg">{user?.fullName}</h2>
          <p className="text-text-secondary text-sm">{user?.email}</p>
          <p className="text-text-muted text-xs mt-1">{user?.careerPath} · {user?.experienceLevel}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center gap-2 justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            style={activeTab === tab.id ? { background: 'var(--surface-2)' } : {}}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(saveProfile)} className="card space-y-5">
          <h2 className="font-semibold">Shaxsiy ma'lumotlar</h2>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">To'liq ism</label>
            <input {...register('fullName', { required: 'Ism majburiy' })} className="input" />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
            <input value={user?.email} disabled className="input opacity-50" />
            <p className="text-text-muted text-xs mt-1">Email o'zgartirilmaydi</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Kasb yo'nalishi</label>
            <input value={user?.careerPath} disabled className="input opacity-50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">O'quv maqsadi</label>
            <textarea {...register('learningGoal')} rows={3} className="input resize-none" placeholder="Maqsadingizni yozing..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Kunlik o'quv vaqti (soat)</label>
            <select {...register('dailyLearningTime', { valueAsNumber: true })} className="input">
              <option value={0.5}>30 daqiqa</option>
              <option value={1}>1 soat</option>
              <option value={2}>2 soat</option>
              <option value={3}>3+ soat</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Spinner size={16} /> : saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
              {saved ? 'Saqlandi!' : 'Saqlash'}
            </button>
          </div>
        </form>
      )}

      {/* Password tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePwd(changePassword)} className="card space-y-5">
          <h2 className="font-semibold">Parolni o'zgartirish</h2>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Joriy parol</label>
            <input {...regPwd('currentPassword', { required: 'Joriy parol kiritilishi shart' })} type="password" className="input" placeholder="••••••••" />
            {pwdErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Yangi parol</label>
            <input {...regPwd('newPassword', { required: true, minLength: { value: 6, message: 'Kamida 6 ta belgi' } })} type="password" className="input" placeholder="••••••••" />
            {pwdErrors.newPassword && <p className="text-red-400 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Yangi parolni tasdiqlang</label>
            <input {...regPwd('confirmPassword', { required: true })} type="password" className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Spinner size={16} /> : <Shield size={16} />}
            Parolni yangilash
          </button>
        </form>
      )}

      {/* Preferences tab */}
      {activeTab === 'preferences' && (
        <div className="card space-y-5">
          <h2 className="font-semibold">Sozlamalar</h2>
          <div className="space-y-4">
            {[
              { label: 'Bildirishnomalar', desc: 'Yangi kurs va vazifalar haqida' },
              { label: 'Haftalik hisobot', desc: 'Haftalik progress hisoboti' },
              { label: 'AI tavsiyalari', desc: 'Shaxsiy o\'quv tavsiyalari' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-text-muted text-xs mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-surface-3 peer-checked:bg-accent rounded-full transition-all peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-white/8">
            <h3 className="font-medium text-sm mb-3 text-text-secondary">Interfeys tili</h3>
            <select className="input w-auto text-sm">
              <option value="uz">O'zbek tili</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
