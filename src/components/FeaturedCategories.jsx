import React, { useEffect, useMemo, useState } from 'react';
import { Search, Lock, BookOpen, Timer, Layers, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ALL_TABS = ['All', 'SSC', 'RRB', 'Banking', 'Railways'];

const sampleQuizzes = [
  { id: 'q1', title: 'SSC CGL General Awareness', category: 'SSC', difficulty: 'Medium', duration: 20, requireSignup: true },
  { id: 'q2', title: 'RRB NTPC Reasoning Set', category: 'RRB', difficulty: 'Easy', duration: 15, requireSignup: false },
  { id: 'q3', title: 'Banking Quantitative Aptitude', category: 'Banking', difficulty: 'Hard', duration: 30, requireSignup: true },
  { id: 'q4', title: 'Railways GK Booster', category: 'Railways', difficulty: 'Medium', duration: 25, requireSignup: false },
  { id: 'q5', title: 'SSC CHSL English Practice', category: 'SSC', difficulty: 'Easy', duration: 10, requireSignup: true },
];

function QuizCard({ quiz, isAuthedAndVerified }) {
  const locked = quiz.requireSignup && !isAuthedAndVerified;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur transition hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Layers className="h-4 w-4 text-sky-300" />
          {quiz.category}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Timer className="h-4 w-4 text-emerald-300" />
          {quiz.duration}m
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white">{quiz.title}</h3>
      <div className="mt-2 text-sm text-slate-300">Difficulty: {quiz.difficulty}</div>

      {/* Overlay */}
      {locked ? (
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-0 transition group-hover:opacity-100">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <Lock className="h-4 w-4" />
            Sign up to attempt
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <button className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-400">Start</button>
        </div>
      )}
    </div>
  );
}

export default function FeaturedCategories() {
  const { user, emailVerified } = useAuth();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [stored, setStored] = useState([]);

  useEffect(() => {
    try {
      const q = JSON.parse(localStorage.getItem('quizzes') || '[]');
      if (Array.isArray(q) && q.length) setStored(q);
    } catch {}
  }, []);

  const quizzes = stored.length ? stored.map(q => ({
    id: q.id,
    title: q.title,
    category: (JSON.parse(localStorage.getItem('categories')||'[]').find(c=>c.id===q.categoryId)?.name) || 'General',
    difficulty: q.difficulty,
    duration: q.duration,
    requireSignup: !!q.requireSignup,
  })) : sampleQuizzes;

  const filtered = useMemo(() => {
    return quizzes.filter((q) =>
      (tab === 'All' || q.category === tab) &&
      q.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [tab, query, quizzes]);

  const isAuthedAndVerified = !!user && !!emailVerified;

  return (
    <section id="featured" className="relative mx-auto max-w-7xl px-6 pb-12 pt-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Quizzes</h2>
            <p className="text-sm text-slate-300">Browse by category and start practicing.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quizzes"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 backdrop-blur focus:border-sky-400/40"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                tab === t
                  ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                  : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => (
            <QuizCard key={q.id} quiz={q} isAuthedAndVerified={isAuthedAndVerified} />
          ))}
        </div>

        {/* Highlights */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[{ icon: BookOpen, label: 'Topic wise' }, { icon: Timer, label: 'Timed & auto-submit' }, { icon: Trophy, label: 'Detailed results' }].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200 backdrop-blur">
              <Icon className="h-5 w-5 text-sky-300" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
