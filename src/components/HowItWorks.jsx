import React from 'react';
import { UserPlus, PlayCircle, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create your account',
      desc: 'Sign up to unlock restricted quizzes. Verify your email for full access.',
    },
    {
      icon: PlayCircle,
      title: 'Attempt quizzes',
      desc: 'You can submit anytime before timeout. Some quizzes are open; others require signup.',
    },
    {
      icon: BarChart3,
      title: 'Analyze results',
      desc: 'Get detailed breakdowns, accuracy, and insights to improve.',
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto mt-4 max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur">
        <h2 className="text-center text-2xl font-bold text-white">How It Works</h2>
        <p className="mx-auto mt-1 max-w-2xl text-center text-sm text-slate-300">
          A smooth flow from signup to insights. Designed for speed, clarity, and accuracy.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
                  <Icon className="h-5 w-5 text-sky-300" />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
