import React, { useEffect, useState } from 'react';
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
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={(email, verified) => {
            setUser({ email, verified });
            setShowAuth(false);
          }}
        />
      )}

      <footer className="mt-16 border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} QuizCraft</div>
      </footer>
    </div>
  );
}

function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  function handleLogin() {
    setError('');
    if (!email) return setError('Enter your email');
    if (!password) return setError('Enter your password');
    // For demo users, we accept any credentials.
    onAuth(email, true);
  }

  function handleSignup() {
    setError('');
    if (!email) return setError('Enter your email');
    if (!password || password.length < 6) return setError('Use a stronger password (min 6 chars)');
    setVerificationSent(true);
    setMode('verify');
  }

  function handleSimulateVerify() {
    setVerified(true);
  }

  function handleContinueAfterVerify() {
    if (!verified) return setError('Please verify your email to continue');
    onAuth(email, true);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === 'login' && 'Sign in'}
            {mode === 'signup' && 'Create account'}
            {mode === 'verify' && 'Verify your email'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>

        {mode !== 'verify' && (
          <div className="space-y-3">
            <label className="block text-sm text-slate-700">Email
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="you@example.com" />
            </label>
            <label className="block text-sm text-slate-700">Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Enter a strong password" />
            </label>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            {mode === 'login' ? (
              <>
                <button onClick={handleLogin} className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Continue</button>
                <button onClick={() => setMode('signup')} className="w-full rounded-md border px-4 py-2 text-sm hover:bg-slate-50">Don't have an account? Sign up</button>
              </>
            ) : (
              <>
                <button onClick={handleSignup} className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Create account</button>
                <button onClick={() => setMode('login')} className="w-full rounded-md border px-4 py-2 text-sm hover:bg-slate-50">Have an account? Sign in</button>
              </>
            )}
          </div>
        )}

        {mode === 'verify' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">We sent a verification email to <span className="font-medium">{email}</span>. Please verify your email to continue.</p>
            <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">This is a demo environment. Use the buttons below to simulate the verification flow.</div>
            <div className="flex items-center gap-2">
              <button onClick={handleSimulateVerify} className={`rounded-md px-3 py-2 text-sm ${verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>{verified ? 'Verified' : 'Simulate verification'}</button>
              <button onClick={handleContinueAfterVerify} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">Continue</button>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </div>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">Email verification is enforced for restricted quizzes.</p>
      </div>
    </div>
  );
}
