"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, PenLine, MessageSquare, ShieldCheck, EyeOff } from "lucide-react";
import { PageHeader, Empty } from "@/components/ui";
import { ModeNotice } from "@/components/ResultLists";
import { useStored, formatDate } from "@/lib/store";
import { THREADS_KEY, loadThreads, type Thread } from "@/lib/repos";
import { createIndex } from "@/lib/search";

export default function ForumPage() {
  const [threads] = useStored<Thread[]>(THREADS_KEY, []);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unanswered">("all");

  useEffect(() => {
    loadThreads(); // seed ครั้งแรก
  }, []);

  const index = useMemo(() => createIndex(threads, (t) => ({ title: t.title, keywords: t.tags, body: t.body })), [threads]);
  const result = useMemo(() => index.search(q, 100), [index, q]);
  const list = (q ? result.results.map((r) => r.item) : threads).filter((t) => filter === "all" || t.answers.length === 0);

  return (
    <>
      <PageHeader
        title="Community Forum"
        subtitle="Your question, your privacy. Real answers from people who know labor law."
        crumbs={[{ href: "/forum", label: "Forum" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Link href="/forum/new" className="btn-primary">
            <PenLine className="h-4 w-4" /> New anonymous post
          </Link>
          <Link href="/verify" className="btn-soft">
            <ShieldCheck className="h-4 w-4" /> Become a responder
          </Link>
        </div>
      </PageHeader>

      <div className="container-page mt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" className="input !rounded-full !pl-10" />
          </label>
          <div className="flex gap-2">
            {(["all", "unanswered"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm ${filter === f ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900"}`}
              >
                {f === "all" ? "All" : "Unanswered"}
              </button>
            ))}
          </div>
        </div>
        {q && (
          <div className="mt-3">
            <ModeNotice mode={result.mode} q={q} />
          </div>
        )}

        <div className="mt-5 space-y-3">
          {list.length === 0 ? (
            <Empty title="No posts yet">
              <Link href="/forum/new" className="btn-primary mt-2">Create the first post</Link>
            </Empty>
          ) : (
            list.map((t) => (
              <Link key={t.id} href={`/forum/${t.id}`} className="card block p-5 transition hover:ring-brand-200">
                <div className="flex items-center gap-2 text-xs text-ink-mute">
                  <EyeOff className="h-3.5 w-3.5" /> ผู้ใช้ไม่ระบุตัวตน · {formatDate(t.createdAt)}
                </div>
                <p className="mt-1 font-semibold">{t.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{t.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {t.tags.map((tag) => (
                    <span key={tag} className="chip">{tag}</span>
                  ))}
                  <span className={`ml-auto flex items-center gap-1 text-xs ${t.answers.length ? "text-ok" : "text-ink-mute"}`}>
                    <MessageSquare className="h-3.5 w-3.5" /> {t.answers.length} คำตอบ
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
