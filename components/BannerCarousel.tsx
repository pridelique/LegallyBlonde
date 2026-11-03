"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BANNERS } from "@/lib/data/misc";

export default function BannerCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = BANNERS.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Highlights"
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {BANNERS.map((b, idx) => (
          <div
            key={b.id}
            className="relative flex min-h-[176px] w-full shrink-0 items-center px-6 py-8 sm:px-10"
            style={{ background: `linear-gradient(120deg, ${b.from}, ${b.to})` }}
            aria-hidden={idx !== i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${n}`}
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/35" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/25" />
            <div className="relative flex w-full flex-wrap items-center justify-between gap-5">
              <div className="max-w-xl">
                <p className="text-xl font-bold sm:text-2xl">{b.title}</p>
                <p className="mt-1 text-ink-soft">{b.text}</p>
              </div>
              <Link href={b.href} tabIndex={idx === i ? 0 : -1} className="btn-soft">
                {b.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3.5 left-6 flex gap-1.5 sm:left-10">
        {BANNERS.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-brand-700" : "w-2 bg-white"}`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
          />
        ))}
      </div>
      <div className="absolute right-4 top-4 hidden gap-1.5 sm:flex">
        <button onClick={() => setI((v) => (v - 1 + n) % n)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white" aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => setI((v) => (v + 1) % n)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white" aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
