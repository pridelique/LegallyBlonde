"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BANNERS } from "@/lib/data/misc";
import { Flower } from "./Decor";

export default function BannerCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = BANNERS.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {BANNERS.map((b, idx) => (
          <div
            key={b.id}
            className="relative flex min-h-[180px] w-full shrink-0 items-center px-6 py-8 sm:px-10"
            style={{ background: `linear-gradient(120deg, ${b.from}, ${b.to})` }}
            aria-hidden={idx !== i}
          >
            <Flower id={`bn-${b.id}`} size={150} className="pointer-events-none absolute -right-6 -bottom-8 opacity-70" />
            <Flower id={`bn2-${b.id}`} size={60} petals={5} className="pointer-events-none absolute right-36 top-4 opacity-50" from="#FDE68A" to="#F9A8D4" />
            <div className="relative max-w-lg">
              <p className="text-xl font-bold sm:text-2xl">{b.title}</p>
              <p className="mt-1 text-ink-soft">{b.text}</p>
              <Link href={b.href} tabIndex={idx === i ? 0 : -1} className="btn-primary mt-4">
                {b.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setI((v) => (v - 1 + n) % n)}
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-brand-800 shadow sm:block"
        aria-label="ก่อนหน้า"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => setI((v) => (v + 1) % n)}
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-brand-800 shadow sm:block"
        aria-label="ถัดไป"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-brand-700" : "w-2 bg-white"}`}
            aria-label={`แบนเนอร์ ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
