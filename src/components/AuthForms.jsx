import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, CheckCircle2, AlertTriangle, LogIn, UserPlus, RefreshCcw } from 'lucide-react';

export default function AuthForms() {
  const { signup, login, reset, loginWithGoogle, passwordStrength, user, emailVerified } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const strength = passwordStrength(password);
        if (strength < 3) {
          setMsg({ type: 'warn', text: 'Password seems weak. Use upper, lower, number, symbol.' });
        }
        await signup(email, password, name);
        setMsg({ type: 'info', text: 'Verification email sent. Please verify before accessing restricted quizzes.' });
      } else if (mode === 'login') {
        await login(email, password);
        setMsg({ type: 'success', text: 'Logged in successfully.' });
      } else if (mode === 'reset') {
        await reset(email);
        setMsg({ type: 'info', text: 'Password reset email sent.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200 backdrop-blur">
      <div className="mb-4 flex items-center justify-center gap-2">
        <button onClick={() => setMode('login')} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${mode==='login'?'bg-sky-500 text-white':'bg-white/10'}`}>
          <LogIn className="h-4 w-4" /> Login
        </button>
        <button onClick={() => setMode('signup')} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${mode==='signup'?'bg-sky-500 text-white':'bg-white/10'}`}>
          <UserPlus className="h-4 w-4" /> Signup
        </button>
        <button onClick={() => setMode('reset')} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${mode==='reset'?'bg-sky-500 text-white':'bg-white/10'}`}>
          <RefreshCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      {msg && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          msg.type==='success'?'bg-emerald-500/20 text-emerald-200':
          msg.type==='info'?'bg-sky-500/20 text-sky-200':
          msg.type==='warn'?'bg-yellow-500/20 text-yellow-200':'bg-rose-500/20 text-rose-200'}`}>
          {msg.type==='success' && <CheckCircle2 className="h-4 w-4" />}
          {msg.type==='info' && <AlertTriangle className="h-4 w-4" />}
          {msg.type==='warn' && <AlertTriangle className="h-4 w-4" />}
          {msg.type==='error' && <AlertTriangle className="h-4 w-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400/40" />
          </div>
        )}
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400/40" />
        </div>
        {mode !== 'reset' && (
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Password" className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400/40" />
          </div>
        )}

        {mode==='signup' && (
          <div className="text-xs text-slate-300">
            Strength: {['Very weak','Weak','Okay','Good','Strong','Very strong'][Math.min(5, passwordStrength(password))]}
          </div>
        )}

        <button disabled={loading} className="mt-2 w-full rounded-xl bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60">
          {loading? 'Please wait...' : mode==='login' ? 'Login' : mode==='signup' ? 'Create account' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-3 text-center text-xs text-slate-400">
        Or continue with
      </div>
      <button onClick={loginWithGoogle} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm text-white hover:bg-white/10">
        Continue with Google
      </button>

      {user && !emailVerified && (
        <div className="mt-3 rounded-lg bg-yellow-500/10 p-3 text-xs text-yellow-200">
          Please verify your email to access restricted quizzes.
        </div>
      )}
    </div>
  );
}
