"use client";

import { Check, type LucideIcon } from "lucide-react";

export interface TrackStep {
  n: number;
  title: string;
  icon: LucideIcon;
}

export default function StepTrack({
  steps,
  current,
  onSelect,
}: {
  steps: TrackStep[];
  current: number;
  onSelect: (n: number) => void;
}) {
  return (
    <nav aria-label="Roadmap steps" className="card px-4 py-6 sm:px-8">
      <ol className="flex items-start">
        {steps.map((s, i) => {
          const done = current > s.n;
          const now = current === s.n;
          const last = i === steps.length - 1;
          return (
            <li key={s.n} className="relative flex flex-1 flex-col items-center">
              {!last && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-6 h-[3px] w-full -translate-y-1/2 rounded-full ${done ? "bg-brand-600" : "bg-tint"}`}
                />
              )}
              <button
                onClick={() => onSelect(s.n)}
                aria-current={now ? "step" : undefined}
                aria-label={`Step ${s.n}: ${s.title}${done ? " (done)" : now ? " (current)" : ""}`}
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 ${
                  done
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : now
                      ? "bg-brand-500 text-white shadow-pop ring-4 ring-petal"
                      : "bg-page text-ink-mute ring-1 ring-tint hover:bg-tint"
                }`}
              >
                {done ? <Check className="h-5 w-5" strokeWidth={3} /> : <s.icon className="h-5 w-5" />}
              </button>
              <span className={`mt-2.5 text-center text-xs font-semibold sm:text-sm ${done || now ? "text-ink" : "text-ink-mute"}`}>{s.title}</span>
              {now && <span className="text-[11px] font-semibold text-brand-700 sm:text-xs">Current</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
