import { useEffect, useState } from 'react';
import { Plus, ExternalLink, GitBranch, Trash2, Edit2, X, Save, Star } from 'lucide-react';
import api from '../api/client';
import { Spinner, EmptyState, Badge } from '../components/ui';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

const TECH_OPTIONS = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'MongoDB', 'Git', 'Tailwind CSS', 'REST API'];

const emptyForm = { title: '', description: '', technologies: [] as string[], githubUrl: '', liveUrl: '', imageUrl: '', featured: false };

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get('/portfolio');
      setProjects(res.data.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, technologies: p.technologies, githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', imageUrl: p.imageUrl || '', featured: p.featured });
    setEditId(p._id);
    setModal('edit');
  };

  const toggleTech = (tech: string) => {
    setForm(f => ({
      ...f,
      technologies: f.technologies.includes(tech) ? f.technologies.filter(t => t !== tech) : [...f.technologies, tech],
    }));
  };

  const save = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      if (modal === 'edit' && editId) {
        await api.put(`/portfolio/${editId}`, form);
      } else {
        await api.post('/portfolio', form);
      }
      setModal(null);
      loadProjects();
    } catch { alert('Saqlashda xato'); } finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Loyihani o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setProjects(p => p.filter(pr => pr._id !== id));
    } catch { alert('O\'chirishda xato'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-text-secondary text-sm mt-1">Loyihalaringizni professional tarzda taqdim eting</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Loyiha qo'shish
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<Star size={28} />}
          title="Hali loyiha yo'q"
          description="Birinchi loyihangizni qo'shing va portfoliongizni to'ldiring."
          action={<button onClick={openAdd} className="btn-primary flex items-center gap-2 mx-auto"><Plus size={16} />Qo'shish</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p._id} className="card group hover:border-white/20 transition-all flex flex-col">
              {/* Image placeholder */}
              <div className="h-36 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--surface-2)' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">{p.title.charAt(0).toUpperCase()}</div>
                )}
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold group-hover:text-accent transition-colors">{p.title}</h3>
                {p.featured && <Star size={15} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.technologies.slice(0, 4).map(t => <Badge key={t} variant="default">{t}</Badge>)}
                {p.technologies.length > 4 && <Badge variant="default">+{p.technologies.length - 4}</Badge>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/8">
                <div className="flex gap-3">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors">
                      <GitBranch size={16} />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="btn-ghost p-1.5 text-text-muted hover:text-accent">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => deleteProject(p._id)} className="btn-ghost p-1.5 text-text-muted hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h2 className="font-semibold">{modal === 'add' ? 'Loyiha qo\'shish' : 'Loyihani tahrirlash'}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost p-1.5"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Loyiha nomi *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Mening portfoliom" className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Tavsif *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Loyiha haqida..." rows={3} className="input resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Texnologiyalar</label>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTech(t)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${form.technologies.includes(t) ? 'border-accent/50 bg-accent/15 text-accent' : 'border-white/8 bg-surface-2 text-text-secondary hover:border-white/20'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">GitHub URL</label>
                <input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Live Demo URL</label>
                <input value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Rasm URL (ixtiyoriy)</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className="input" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-accent" />
                <span className="text-sm text-text-secondary">Asosiy loyiha sifatida belgilash</span>
              </label>
            </div>
            <div className="p-5 border-t border-white/8 flex gap-3">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Bekor qilish</button>
              <button onClick={save} disabled={saving || !form.title || !form.description}
                className="btn-primary flex-1 flex items-center gap-2 justify-center">
                {saving ? <Spinner size={16} /> : <Save size={16} />} Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
