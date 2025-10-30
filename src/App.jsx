import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FeaturedCategories from './components/FeaturedCategories';
import HowItWorks from './components/HowItWorks';
import AuthForms from './components/AuthForms';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';

function Header() {
  const { user, logout, emailVerified } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-white">
        <Link to="/" className="text-lg font-bold tracking-tight">QuizVerse</Link>
        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <Link to="/#featured" className="rounded-lg px-3 py-1 transition hover:bg-white/5">Quizzes</Link>
          <Link to="/#how-it-works" className="rounded-lg px-3 py-1 transition hover:bg-white/5">How it works</Link>
          <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white backdrop-blur transition hover:bg-white/10">
            <Shield className="h-4 w-4" /> Admin
          </Link>
          {user ? (
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-white backdrop-blur transition hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-white backdrop-blur transition hover:bg-white/10">
              <User className="h-4 w-4" /> Sign in
            </Link>
          )}
        </nav>
      </div>
      {!emailVerified && user && (
        <div className="bg-yellow-500/10 py-2 text-center text-xs text-yellow-200">Please verify your email to access restricted quizzes.</div>
      )}
    </header>
  );
}

function HomePage() {
  return (
    <>
      <FeaturedCategories />
      <HowItWorks />
    </>
  );
}

function AuthPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <AuthForms />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
