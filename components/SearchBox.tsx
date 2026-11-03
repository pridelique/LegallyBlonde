"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const SUGGESTIONS = ["โดนไล่ออก", "ไม่ได้ค่า OT", "ค่าแรงต่ำ", "ลาป่วยโดนหักเงิน", "ฟรีแลนซ์ไม่ได้เงิน"];

export default function SearchBox({ big = false }: { big?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (text: string) => {
    if (!text.trim()) return;
    router.push(`/search?q=${encodeURIComponent(text.trim())}`);
  };
  const id = big ? "hero-search" : "page-search";
  return (
    <div>
      <div className="flex items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 shadow-soft focus-within:ring-4 focus-within:ring-brand-100"
        >
          <Search className="h-5 w-5 shrink-0 text-ink-mute" />
          <label htmlFor={id} className="sr-only">
            Search
          </label>
          <input
            id={id}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search… เช่น เจ้านายไม่จ่ายเงิน"
            className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-ink-mute focus:outline-none"
          />
          <button className="btn-primary shrink-0 !min-h-[40px] !px-5">Search</button>
        </form>
        {big && (
          <Link href="/problems" className="icon-btn !h-[52px] !w-[52px]" aria-label="Browse all problems">
            <SlidersHorizontal className="h-5 w-5" />
          </Link>
        )}
      </div>
      {big && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-soft">Popular:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => go(s)} className="rounded-full bg-white/70 px-3 py-1.5 text-ink-soft transition hover:bg-white hover:text-brand-800">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
