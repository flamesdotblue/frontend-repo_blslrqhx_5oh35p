import React from 'react';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 py-10 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div>
          <div className="text-lg font-semibold text-white">QuizVerse</div>
          <div className="text-xs">Practice smarter. Achieve faster.</div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur transition hover:bg-white/10"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
