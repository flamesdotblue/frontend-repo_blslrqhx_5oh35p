import React, { useEffect, useMemo, useRef, useState } from 'react';

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function QuizPlayer({ quiz, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qid: optionIndex }
  const [marked, setMarked] = useState({}); // { qid: true }
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(quiz.durationMinutes * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = quiz.questions[index];

  const navState = useMemo(() => {
    const states = quiz.questions.map(q => {
      const isCurrent = q.id === current.id;
      const isAnswered = answers[q.id] !== undefined;
      const isMarked = !!marked[q.id];
      return { id: q.id, isCurrent, isAnswered, isMarked };
    });
    return states;
  }, [quiz.questions, current, answers, marked]);

  function toggleMark() {
    setMarked(m => ({ ...m, [current.id]: !m[current.id] }));
  }

  function choose(optionIndex) {
    setAnswers(a => ({ ...a, [current.id]: optionIndex }));
  }

  function goto(i) {
    if (i < 0 || i >= quiz.questions.length) return;
    setIndex(i);
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);
  }

  const result = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct += 1;
    });
    const total = quiz.questions.length;
    const score = Math.round((correct / total) * 100);
    const attempted = Object.keys(answers).length;
    const markedCount = Object.values(marked).filter(Boolean).length;
    return { correct, total, score, attempted, markedCount };
  }, [submitted, answers, marked, quiz.questions]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{quiz.title}</h2>
          <p className="text-sm text-slate-600">Time remaining: <span className={`font-medium ${remaining < 30 ? 'text-rose-600' : 'text-slate-800'}`}>{formatTime(remaining)}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMark} className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
            {marked[current.id] ? 'Unmark' : 'Mark for review'}
          </button>
          <button onClick={handleSubmit} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Submit now
          </button>
          <button onClick={onExit} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">Exit</button>
        </div>
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-sm font-medium text-slate-500">Question {index + 1} of {quiz.questions.length}</div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">{current.text}</h3>
              <div className="space-y-2">
                {current.options.map((opt, i) => {
                  const selected = answers[current.id] === i;
                  return (
                    <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition ${selected ? 'border-slate-900 bg-slate-50' : 'hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name={`q-${current.id}`}
                        className="h-4 w-4"
                        checked={selected}
                        onChange={() => choose(i)}
                      />
                      <span className="text-slate-800">{opt}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => goto(index - 1)}
                  disabled={index === 0}
                  className={`rounded-md px-3 py-2 text-sm ${index === 0 ? 'cursor-not-allowed border bg-slate-100 text-slate-400' : 'border hover:bg-slate-50'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => goto(index + 1)}
                  disabled={index === quiz.questions.length - 1}
                  className={`rounded-md px-3 py-2 text-sm ${index === quiz.questions.length - 1 ? 'cursor-not-allowed border bg-slate-100 text-slate-400' : 'border hover:bg-slate-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Question Navigator</h4>
              <div className="grid grid-cols-6 gap-2">
                {navState.map((s, i) => {
                  let cls = 'border text-slate-700 hover:bg-slate-50';
                  if (s.isCurrent) cls = 'bg-slate-900 text-white border-slate-900';
                  else if (s.isMarked) cls = 'bg-amber-100 text-amber-800 border-amber-200';
                  else if (s.isAnswered) cls = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  return (
                    <button
                      key={s.id}
                      onClick={() => goto(i)}
                      className={`h-9 rounded-md border text-sm ${cls}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-900"></span> Current</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-200"></span> Answered</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-200"></span> Marked</div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-sm font-semibold text-slate-900">Progress</h4>
              <p className="text-sm text-slate-700">
                Answered: {Object.keys(answers).length} / {quiz.questions.length}
              </p>
              <p className="text-sm text-slate-700">Marked: {Object.values(marked).filter(Boolean).length}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 text-center shadow-sm">
          <h3 className="mb-2 text-2xl font-semibold text-slate-900">Results</h3>
          <p className="mb-6 text-slate-600">Great job completing the quiz.</p>
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-lg border bg-emerald-50 p-4 text-left">
              <div className="text-sm text-emerald-700">Score</div>
              <div className="text-3xl font-bold text-emerald-900">{result.score}%</div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 text-left">
              <div className="text-sm text-slate-700">Correct</div>
              <div className="text-3xl font-bold text-slate-900">{result.correct}/{result.total}</div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 text-left">
              <div className="text-sm text-slate-700">Attempted</div>
              <div className="text-3xl font-bold text-slate-900">{result.attempted}</div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 text-left">
              <div className="text-sm text-slate-700">Marked</div>
              <div className="text-3xl font-bold text-slate-900">{result.markedCount}</div>
            </div>
          </div>
          <button onClick={onExit} className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Back to quizzes</button>
        </div>
      )}
    </section>
  );
}
