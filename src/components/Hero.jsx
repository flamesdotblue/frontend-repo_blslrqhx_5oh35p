import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, ShieldCheck, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlays that don't block interactions */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-28 text-center sm:pt-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span className="text-xs text-slate-200">Verified quizzes • Real-time results</span>
        </div>

        <h1 className="mt-6 bg-gradient-to-br from-white via-sky-100 to-sky-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Master Competitive Exams with Interactive Quizzes
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          Practice SSC, RRB, Banking and more. Take timed quizzes, mark for review, and track your progress with rich analytics.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#featured"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:translate-y-[-1px] hover:bg-sky-400"
          >
            <Rocket className="h-5 w-5" />
            Explore Quizzes
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            <Star className="h-5 w-5 text-yellow-300" />
            How it works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 grid w-full max-w-3xl grid-cols-3 gap-4">
          {[
            { label: 'Quizzes', value: '2k+' },
            { label: 'Questions', value: '50k+' },
            { label: 'Avg. Rating', value: '4.9/5' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs uppercase tracking-wide text-slate-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
