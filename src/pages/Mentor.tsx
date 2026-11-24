import { useEffect, useRef, useState } from 'react';
import { Send, MessageSquare, Plus, Trash2, Bot, User } from 'lucide-react';
import api from '../api/client';
import { Spinner, DemoModeBanner } from '../components/ui';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function Mentor() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await api.get('/ai/conversations');
      setConversations(res.data.data);
    } catch { /* ignore */ }
  };

  const loadConversation = async (id: string) => {
    try {
      const res = await api.get(`/ai/conversations/${id}`);
      setMessages(res.data.data.messages);
      setActiveId(id);
    } catch { /* ignore */ }
  };

  const newConversation = () => {
    setActiveId(null);
    setMessages([]);
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations(c => c.filter(cv => cv._id !== id));
      if (activeId === id) newConversation();
    } catch { /* ignore */ }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', content: text, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { conversationId: activeId, message: text });
      const { conversationId, message, isDemo: demo } = res.data.data;
      setIsDemo(demo);
      if (!activeId) {
        setActiveId(conversationId);
        loadConversations();
      }
      setMessages(m => [...m, { role: 'assistant', content: message, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Xabar yuborishda xato. Iltimos qayta urinib ko\'ring.', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'HTML semantik teglar nima?',
    'CSS Flexbox qanday ishlaydi?',
    'JavaScript closure tushuntiring',
    'React useState hook nima?',
    'TypeScript interfeyslar va tipler farqi?',
    'Git rebase va merge farqi?',
  ];

  return (
    <div className="flex gap-5 h-[calc(100vh-9rem)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-3">
        <button onClick={newConversation} className="btn-primary flex items-center gap-2 justify-center text-sm">
          <Plus size={16} /> Yangi suhbat
        </button>
        <div className="card flex-1 overflow-y-auto space-y-1 p-3">
          <p className="text-xs text-text-muted px-2 pb-2 font-medium uppercase tracking-wide">Suhbatlar</p>
          {conversations.length === 0 && (
            <p className="text-text-muted text-xs px-2 py-4 text-center">Hali suhbat yo'q</p>
          )}
          {conversations.map(cv => (
            <div key={cv._id} onClick={() => loadConversation(cv._id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer group transition-all ${activeId === cv._id ? 'bg-accent/15 text-accent' : 'hover:bg-surface-2 text-text-secondary'}`}>
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="text-xs truncate flex-1">{cv.title}</span>
              <button onClick={(e) => deleteConversation(cv._id, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col card p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(169,155,239,0.12)' }}>
            <Bot size={18} className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Mentor</p>
            <p className="text-text-muted text-xs">O'zbek tilida yordam beradi</p>
          </div>
          {isDemo && <div className="ml-auto badge bg-accent/15 text-accent text-xs">Demo</div>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(169,155,239,0.12)' }}>
                <Bot size={28} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">AI Mentor bilan suhbat boshlang</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-xs">
                Frontend dasturlash bo'yicha har qanday savolga o'zbek tilida javob beraman.
              </p>
              {isDemo && <DemoModeBanner />}
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {suggestions.map(s => (
                  <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                    className="text-left p-3 rounded-lg text-xs text-text-secondary border border-white/8 hover:border-white/20 hover:text-text-primary transition-all"
                    style={{ background: 'var(--surface-2)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-accent/15' : 'bg-surface-2'
              }`}>
                {msg.role === 'assistant' ? <Bot size={16} className="text-accent" /> : <User size={16} className="text-text-secondary" />}
              </div>
              <div className={`max-w-[75%] p-3.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-tr-sm text-text-primary'
                  : 'rounded-tl-sm text-text-secondary'
              }`} style={msg.role === 'user' ? { background: 'var(--accent)', color: '#101216' } : { background: 'var(--surface-2)' }}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/15">
                <Bot size={16} className="text-accent" />
              </div>
              <div className="p-3.5 rounded-xl rounded-tl-sm" style={{ background: 'var(--surface-2)' }}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/8">
          {isDemo && messages.length === 0 && null}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Savolingizni yozing... (Enter — yuborish, Shift+Enter — yangi qator)"
              rows={1}
              className="input resize-none flex-1"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="btn-primary p-3 flex-shrink-0">
              {loading ? <Spinner size={16} /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
