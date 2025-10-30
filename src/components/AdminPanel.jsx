import React, { useEffect, useMemo, useState } from 'react';
import { Lock, Plus, Save, Trash2, Layers, FolderTree, ListChecks, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@1234';

function useStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export default function AdminPanel() {
  const [authorized, setAuthorized] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const [categories, setCategories] = useStorage('categories', []);
  const [subcategories, setSubcategories] = useStorage('subcategories', []);
  const [quizzes, setQuizzes] = useStorage('quizzes', []);

  const [catForm, setCatForm] = useState({ name: '', slug: '', icon: 'Layers', order: 0 });
  const [subForm, setSubForm] = useState({ name: '', slug: '', categoryId: '' });
  const [quizForm, setQuizForm] = useState({ title: '', categoryId: '', subcategoryId: '', difficulty: 'Easy', duration: 10, requireSignup: true, published: true });

  const subOptions = useMemo(() => subcategories.filter(s => s.categoryId === quizForm.categoryId), [subcategories, quizForm.categoryId]);

  function handleAdminLogin(e) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      setAuthorized(true);
      setMessage({ type: 'success', text: 'Admin access granted.' });
    } else {
      setMessage({ type: 'error', text: 'Invalid admin credentials.' });
    }
  }

  function addCategory(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    setCategories([...categories, { id, ...catForm }]);
    setCatForm({ name: '', slug: '', icon: 'Layers', order: 0 });
  }
  function addSubcategory(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    setSubcategories([...subcategories, { id, ...subForm }]);
    setSubForm({ name: '', slug: '', categoryId: '' });
  }
  function addQuiz(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    setQuizzes([...quizzes, { id, ...quizForm }]);
    setQuizForm({ title: '', categoryId: '', subcategoryId: '', difficulty: 'Easy', duration: 10, requireSignup: true, published: true });
  }
  function removeItem(type, id) {
    if (type === 'cat') setCategories(categories.filter(c => c.id !== id));
    if (type === 'sub') setSubcategories(subcategories.filter(s => s.id !== id));
    if (type === 'quiz') setQuizzes(quizzes.filter(q => q.id !== id));
  }

  if (!authorized) {
    return (
      <section className="mx-auto my-10 max-w-md px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold"><Shield className="h-5 w-5 text-sky-300" /> Admin Login</div>
          {message && (
            <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${message.type==='success'?'bg-emerald-500/20 text-emerald-200':'bg-rose-500/20 text-rose-200'}`}>{message.text}</div>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Admin email" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-400" />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-400" />
            <button className="w-full rounded-xl bg-sky-500 py-2 font-semibold">Sign in</button>
            <div className="text-center text-xs text-slate-400">Use {ADMIN_EMAIL} / {ADMIN_PASSWORD}</div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto my-10 max-w-6xl px-6">
      <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      <p className="text-sm text-slate-300">Manage categories, subcategories, and quizzes. Set whether a quiz requires signup.</p>

      {/* Categories */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
          <div className="mb-3 flex items-center gap-2 font-semibold"><FolderTree className="h-4 w-4 text-sky-300" /> Add Category</div>
          <form className="space-y-3" onSubmit={addCategory}>
            <input value={catForm.name} onChange={e=>setCatForm(v=>({...v, name:e.target.value}))} placeholder="Name" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <input value={catForm.slug} onChange={e=>setCatForm(v=>({...v, slug:e.target.value}))} placeholder="Slug" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <input value={catForm.icon} onChange={e=>setCatForm(v=>({...v, icon:e.target.value}))} placeholder="Icon (e.g., Layers)" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <input type="number" value={catForm.order} onChange={e=>setCatForm(v=>({...v, order:Number(e.target.value)}))} placeholder="Order" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add</button>
          </form>
          <div className="mt-4 space-y-2 text-sm">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span>{c.name} <span className="text-xs text-slate-400">({c.slug})</span></span>
                <button onClick={()=>removeItem('cat', c.id)} className="text-rose-300 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
          <div className="mb-3 flex items-center gap-2 font-semibold"><Layers className="h-4 w-4 text-sky-300" /> Add Subcategory</div>
          <form className="space-y-3" onSubmit={addSubcategory}>
            <input value={subForm.name} onChange={e=>setSubForm(v=>({...v, name:e.target.value}))} placeholder="Name" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <input value={subForm.slug} onChange={e=>setSubForm(v=>({...v, slug:e.target.value}))} placeholder="Slug" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <select value={subForm.categoryId} onChange={e=>setSubForm(v=>({...v, categoryId:e.target.value}))} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add</button>
          </form>
          <div className="mt-4 space-y-2 text-sm">
            {subcategories.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span>{s.name} <span className="text-xs text-slate-400">({s.slug})</span></span>
                <button onClick={()=>removeItem('sub', s.id)} className="text-rose-300 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
          <div className="mb-3 flex items-center gap-2 font-semibold"><ListChecks className="h-4 w-4 text-sky-300" /> Add Quiz</div>
          <form className="space-y-3" onSubmit={addQuiz}>
            <input value={quizForm.title} onChange={e=>setQuizForm(v=>({...v, title:e.target.value}))} placeholder="Title" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <select value={quizForm.categoryId} onChange={e=>setQuizForm(v=>({...v, categoryId:e.target.value, subcategoryId:''}))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none">
                <option value="">Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={quizForm.subcategoryId} onChange={e=>setQuizForm(v=>({...v, subcategoryId:e.target.value}))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none">
                <option value="">Subcategory</option>
                {subOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={quizForm.difficulty} onChange={e=>setQuizForm(v=>({...v, difficulty:e.target.value}))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none">
                {['Easy','Medium','Hard'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" min={5} value={quizForm.duration} onChange={e=>setQuizForm(v=>({...v, duration:Number(e.target.value)}))} placeholder="Duration (min)" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={quizForm.requireSignup} onChange={e=>setQuizForm(v=>({...v, requireSignup:e.target.checked}))} />
              Require signup to attempt
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={quizForm.published} onChange={e=>setQuizForm(v=>({...v, published:e.target.checked}))} />
              Published
            </label>
            <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold"><Save className="h-4 w-4" /> Save Quiz</button>
          </form>

          <div className="mt-4 space-y-2 text-sm">
            {quizzes.map(q => (
              <div key={q.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span>{q.title} <span className="text-xs text-slate-400">{q.requireSignup ? '(Signup required)' : '(Open)'}</span></span>
                <button onClick={()=>removeItem('quiz', q.id)} className="text-rose-300 hover:text-rose-200"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
