import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

export default function AdminPanel({ user }) {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setCategories(read('categories', []));
    setQuizzes(read('quizzes', []));
  }, []);

  function addCategory(name) {
    const next = [...categories, { id: uid('cat'), name }];
    setCategories(next);
    write('categories', next);
  }
  function removeCategory(id) {
    const next = categories.filter(c => c.id !== id);
    setCategories(next); write('categories', next);
  }

  function addQuiz() {
    const q = {
      id: uid('quiz'),
      title: 'Untitled quiz',
      category: categories[0]?.id || null,
      difficulty: 'Easy',
      durationMinutes: 10,
      requireSignup: false,
      published: false,
      questions: [
        { id: uid('q'), text: 'Example question?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
      ],
    };
    const next = [q, ...quizzes];
    setQuizzes(next); write('quizzes', next);
  }

  function updateQuiz(id, patch) {
    const next = quizzes.map(q => (q.id === id ? { ...q, ...patch } : q));
    setQuizzes(next); write('quizzes', next);
  }

  function removeQuiz(id) {
    const next = quizzes.filter(q => q.id !== id);
    setQuizzes(next); write('quizzes', next);
  }

  function addQuestion(quizId) {
    const next = quizzes.map(q => {
      if (q.id !== quizId) return q;
      const nq = { ...q, questions: [...q.questions, { id: uid('q'), text: 'New question', options: ['A','B','C','D'], correctIndex: 0 }] };
      return nq;
    });
    setQuizzes(next); write('quizzes', next);
  }

  function updateQuestion(quizId, qId, patch) {
    const next = quizzes.map(q => {
      if (q.id !== quizId) return q;
      const qs = q.questions.map(qq => (qq.id === qId ? { ...qq, ...patch } : qq));
      return { ...q, questions: qs };
    });
    setQuizzes(next); write('quizzes', next);
  }

  function removeQuestion(quizId, qId) {
    const next = quizzes.map(q => {
      if (q.id !== quizId) return q;
      return { ...q, questions: q.questions.filter(qq => qq.id !== qId) };
    });
    setQuizzes(next); write('quizzes', next);
  }

  const canEdit = !!user?.email; // simple gate for demo

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Admin Panel</h2>
        <div className="text-sm text-slate-600">Signed in as: {user?.email || 'guest'}</div>
      </div>

      {!canEdit ? (
        <div className="rounded-lg border bg-amber-50 p-4 text-amber-800">Sign in to manage quizzes.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Categories</h3>
              <CategoryForm onAdd={addCategory} />
              <ul className="mt-3 space-y-2">
                {categories.map(c => (
                  <li key={c.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="text-sm text-slate-800">{c.name}</span>
                    <button onClick={() => removeCategory(c.id)} className="text-slate-500 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="text-sm text-slate-500">No categories yet.</li>
                )}
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Quizzes</h3>
                <button onClick={addQuiz} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> New quiz
                </button>
              </div>
              <div className="space-y-4">
                {quizzes.map(q => (
                  <div key={q.id} className="rounded-lg border p-3">
                    <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-600">Title
                        <input value={q.title} onChange={e => updateQuiz(q.id, { title: e.target.value })} className="mt-1 w-full rounded-md border px-2 py-1 text-sm" />
                      </label>
                      <label className="text-xs text-slate-600">Difficulty
                        <select value={q.difficulty} onChange={e => updateQuiz(q.id, { difficulty: e.target.value })} className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </label>
                      <label className="text-xs text-slate-600">Duration (minutes)
                        <input type="number" value={q.durationMinutes} onChange={e => updateQuiz(q.id, { durationMinutes: Number(e.target.value) })} className="mt-1 w-full rounded-md border px-2 py-1 text-sm" />
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" checked={q.requireSignup} onChange={e => updateQuiz(q.id, { requireSignup: e.target.checked })} />
                        Require signup
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" checked={q.published} onChange={e => updateQuiz(q.id, { published: e.target.checked })} />
                        Published
                      </label>
                    </div>
                    <div className="mb-2 text-xs font-medium text-slate-700">Questions</div>
                    <div className="space-y-3">
                      {q.questions.map(qq => (
                        <div key={qq.id} className="rounded-md border p-2">
                          <div className="mb-2 flex items-start gap-2">
                            <input value={qq.text} onChange={e => updateQuestion(q.id, qq.id, { text: e.target.value })} className="w-full rounded-md border px-2 py-1 text-sm" />
                            <button onClick={() => removeQuestion(q.id, qq.id)} className="text-slate-500 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {qq.options.map((opt, idx) => (
                              <label key={idx} className="text-xs text-slate-600">Option {idx + 1}
                                <input value={opt} onChange={e => {
                                  const next = [...qq.options]; next[idx] = e.target.value;
                                  updateQuestion(q.id, qq.id, { options: next });
                                }} className="mt-1 w-full rounded-md border px-2 py-1 text-sm" />
                              </label>
                            ))}
                          </div>
                          <label className="mt-2 block text-xs text-slate-600">Correct answer
                            <select value={qq.correctIndex} onChange={e => updateQuestion(q.id, qq.id, { correctIndex: Number(e.target.value) })} className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
                              <option value={0}>Option 1</option>
                              <option value={1}>Option 2</option>
                              <option value={2}>Option 3</option>
                              <option value={3}>Option 4</option>
                            </select>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button onClick={() => addQuestion(q.id)} className="rounded-md border px-3 py-2 text-xs hover:bg-slate-50">Add question</button>
                      <button onClick={() => removeQuiz(q.id)} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 hover:bg-rose-100">Delete quiz</button>
                    </div>
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-slate-500">No quizzes yet. Create one to get started.</div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-6 text-slate-700 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">How it works</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm">
                <li>Create one or more categories.</li>
                <li>Create a quiz; set duration, difficulty, and whether signup is required.</li>
                <li>Add questions with four options and mark the correct answer.</li>
                <li>Publish the quiz to make it visible to users.</li>
              </ol>
              <p className="mt-3 text-xs text-slate-500">Note: This demo stores data in your browser. Backend integration can be added later.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CategoryForm({ onAdd }) {
  const [name, setName] = useState('');
  return (
    <div className="flex gap-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" className="flex-1 rounded-md border px-2 py-1 text-sm" />
      <button onClick={() => { if (!name.trim()) return; onAdd(name.trim()); setName(''); }} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">Add</button>
    </div>
  );
}
