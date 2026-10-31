import Link from "next/link";
import type { KnowledgeTopic, Problem } from "@/lib/data/types";
import type { SearchMode } from "@/lib/search";
import { Notice } from "./ui";

export function ModeNotice({ mode, q }: { mode: SearchMode; q: string }) {
  if (mode === "similar")
    return <Notice>ไม่พบผลที่ตรงกับ “{q}” โดยตรง นี่คือเรื่องที่ใกล้เคียงที่สุด</Notice>;
  if (mode === "none")
    return (
      <Notice tone="warn">
        ไม่พบเรื่องที่เกี่ยวกับ “{q}” ลองใช้คำอื่น หรือ <Link href="/chat" className="font-semibold underline">ถามในแชท</Link> /{" "}
        <Link href="/forum/new" className="font-semibold underline">ตั้งกระทู้</Link>
      </Notice>
    );
  return null;
}

export function ProblemItem({ p }: { p: Problem }) {
  return (
    <Link href={`/problems/${p.id}`} className="card block p-5 transition hover:ring-brand-200">
      <span className="chip">{p.group}</span>
      <p className="mt-2 font-semibold">{p.title}</p>
      <p className="mt-1 text-sm text-ink-soft">{p.summary}</p>
    </Link>
  );
}

export function TopicItem({ t }: { t: KnowledgeTopic }) {
  return (
    <Link href={`/knowledge/${t.slug}`} className="card block p-5 transition hover:ring-brand-200">
      <div className="flex flex-wrap gap-2">
        <span className="chip">{t.type === "general" ? "แรงงานทั่วไป" : "แรงงานนอกระบบ"}</span>
        <span className="chip !bg-white ring-1 ring-brand-100">{t.group}</span>
      </div>
      <p className="mt-2 font-semibold">{t.title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{t.short[0]}</p>
    </Link>
  );
}
