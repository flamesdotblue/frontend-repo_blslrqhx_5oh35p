import React, { useEffect, useMemo, useState } from 'react';
import { Lock, Play, Timer } from 'lucide-react';

function ensureSeedData() {
  const existing = localStorage.getItem('quizzes');
  if (existing) return;
  const sample = [
    {
      id: 'sample-1',
      title: 'General Knowledge Basics',
      category: 'general',
      difficulty: 'Easy',
      durationMinutes: 10,
      requireSignup: true,
      published: true,
      questions: Array.from({ length: 10 }).map((_, i) => ({
        id: `q${i + 1}`,
        text: `Sample question ${i + 1}: Which option is correct?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: (i % 4),
      })),
    },
    {
      id: 'sample-2',
      title: 'JavaScript Fundamentals',
      category: 'programming',
      difficulty: 'Medium',
      durationMinutes: 15,
      requireSignup: false,
      published: true,
      questions: Array.from({ length: 12 }).map((_, i) => ({
        id: `js-${i + 1}`,
        text: `JS question ${i + 1}: Choose the right answer.`,
        options: ['let', 'var', 'const', 'function'],
        correctIndex: (i % 4),
      })),
    },
  ];
  localStorage.setItem('quizzes', JSON.stringify(sample));
}

export default function QuizList({ user, onStart }) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    ensureSeedData();
    try {
      const data = JSON.parse(localStorage.getItem('quizzes') || '[]');
      setItems(data.filter(q => q.published));
    } catch {
      setItems([]);
    }
  }, []);

  const filtered = useMemo(() => {
    return items.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
      const matchesDiff = difficulty ? q.difficulty === difficulty : true;
      return matchesSearch && matchesDiff;
    });
  }, [items, search, difficulty]);

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold text-slate-900">Browse Quizzes</h2>
        <div className="flex flex-1 items-center justify-end gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          >
            <option value="">All levels</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(q => {
          const locked = q.requireSignup && !(user?.email && user?.verified);
          return (
            <article key={q.id} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{q.title}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{q.difficulty}</span>
              </div>
              <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-1"><Timer className="h-4 w-4" /> {q.durationMinutes}m</div>
                {q.requireSignup && (
                  <div className="flex items-center gap-1 text-amber-600"><Lock className="h-4 w-4" /> Signup required</div>
                )}
              </div>
              <button
                onClick={() => onStart(q)}
                disabled={locked}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  locked
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Play className="h-4 w-4" /> Start
              </button>
              {locked && (
                <p className="mt-2 text-center text-xs text-slate-500">Sign in and verify email to unlock.</p>
              )}
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-md border border-dashed p-8 text-center text-slate-500">No quizzes found.</div>
        )}
      </div>
    </section>
  );
}
