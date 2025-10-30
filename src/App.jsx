import React from 'react';
import Hero from './components/Hero';
import FeaturedCategories from './components/FeaturedCategories';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { User } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="#" className="text-lg font-bold tracking-tight">QuizVerse</a>
          <nav className="flex items-center gap-3 text-sm text-slate-300">
            <a href="#featured" className="rounded-lg px-3 py-1 transition hover:bg-white/5">Quizzes</a>
            <a href="#how-it-works" className="rounded-lg px-3 py-1 transition hover:bg-white/5">How it works</a>
            <button className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-white backdrop-blur transition hover:bg-white/10">
              <User className="h-4 w-4" />
              Sign in
            </button>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <FeaturedCategories />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
