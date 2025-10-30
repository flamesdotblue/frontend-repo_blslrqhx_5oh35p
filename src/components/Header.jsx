import React from 'react';
import { User, LogIn, LogOut, Settings, Home } from 'lucide-react';

export default function Header({ onNavigate, currentView, user, onSignInClick, onSignOut }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-slate-800 hover:bg-slate-100"
            aria-label="Go home"
          >
            <Home className="h-5 w-5" />
            <span className="font-semibold">QuizCraft</span>
          </button>
          <nav className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => onNavigate('home')}
              className={`rounded-md px-3 py-2 text-sm ${
                currentView === 'home' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Quizzes
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`rounded-md px-3 py-2 text-sm ${
                currentView === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user?.email ? (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${user.verified ? 'text-emerald-600' : 'text-amber-600'}`}>{
                user.verified ? 'Verified' : 'Unverified'
              }</span>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInClick}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
