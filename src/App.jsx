import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import QuizList from './components/QuizList';
import QuizPlayer from './components/QuizPlayer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'admin' | 'play'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  function handleStart(q) {
    if (q.requireSignup && !(user?.email && user?.verified)) {
      setShowAuth(true);
      return;
    }
    setActiveQuiz(q);
    setView('play');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header
        currentView={view}
        onNavigate={setView}
        user={user}
        onSignInClick={() => setShowAuth(true)}
        onSignOut={() => setUser(null)}
      />

      <main className="pb-12">
        {view === 'home' && (
          <>
            <section className="mx-auto max-w-6xl px-4 pt-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sharpen your skills with bite‑size quizzes</h1>
              <p className="mt-2 max-w-2xl text-slate-600">Attempt open quizzes instantly or sign in to unlock restricted ones. Timed sessions, clean navigation, and instant results.</p>
            </section>
            <QuizList user={user} onStart={handleStart} />
            <section className="mx-auto mt-10 max-w-6xl px-4">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">How it works</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-1 font-medium text-slate-900">1. Pick</h3>
                  <p className="text-sm text-slate-600">Choose from curated quizzes by difficulty and category.</p>
                </div>
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-1 font-medium text-slate-900">2. Attempt</h3>
                  <p className="text-sm text-slate-600">Answer with a focused timer and mark questions for review.</p>
                </div>
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-1 font-medium text-slate-900">3. Analyze</h3>
                  <p className="text-sm text-slate-600">Submit anytime and see your score and correctness instantly.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'admin' && <AdminPanel user={user} />}

        {view === 'play' && activeQuiz && (
          <QuizPlayer quiz={activeQuiz} onExit={() => { setActiveQuiz(null); setView('home'); }} />
        )}
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuth={(email, verified) => { setUser({ email, verified }); setShowAuth(false); }} />
      )}

      <footer className="mt-16 border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} QuizCraft</div>
      </footer>
    </div>
  );
}

function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-700">Email
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="you@example.com" />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />
            I confirm my email is verified
          </label>
          <button
            onClick={() => onAuth(email || 'user@example.com', verified)}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {mode === 'login' ? 'Continue' : 'Create account'}
          </button>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">This demo simulates auth. Backend and Firebase can be wired in next step.</p>
      </div>
    </div>
  );
}
