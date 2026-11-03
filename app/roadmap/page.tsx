"use client";

import Link from "next/link";
import { Route, CheckCircle2, ArrowRight, Trash2 } from "lucide-react";
import { PageHeader, Empty, Notice } from "@/components/ui";
import { useStored, formatDate } from "@/lib/store";
import { ROADMAP_KEY, type RoadmapProgress } from "@/lib/repos";
import { getProblem } from "@/lib/data/problems";
import { useAuth } from "@/lib/auth";

export default function MyRoadmaps() {
  const { user } = useAuth();
  const [all, setAll, ready] = useStored<Record<string, RoadmapProgress>>(ROADMAP_KEY, {});
  const list = Object.values(all).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const active = list.filter((r) => r.step < 5);
  const done = list.filter((r) => r.step >= 5);

  const remove = (id: string) => {
    if (!confirm("ลบ Roadmap นี้ออกจากประวัติ?")) return;
    setAll((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const Item = ({ r }: { r: RoadmapProgress }) => {
    const p = getProblem(r.problemId);
    if (!p) return null;
    const pct = Math.min(r.step - 1, 4) * 25;
    return (
      <div className="card flex items-center gap-4 p-5">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${r.step >= 5 ? "bg-green-50 text-ok" : "bg-brand-100 text-brand-800"}`}>
          {r.step >= 5 ? <CheckCircle2 className="h-5 w-5" /> : <Route className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{p.title}</p>
          <p className="text-xs text-ink-mute">
            {r.step >= 5 ? `เสร็จเมื่อ ${formatDate(r.completedAt || r.updatedAt)}` : `ขั้นที่ ${r.step}/4 · อัปเดต ${formatDate(r.updatedAt)}`}
          </p>
          {r.step < 5 && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full bg-brand-600" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <Link href={`/roadmap/${r.problemId}`} className="btn-soft !px-3" aria-label="เปิด">
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button onClick={() => remove(r.problemId)} className="btn-ghost !px-2 text-ink-mute" aria-label="ลบ">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <>
      <PageHeader title="My Roadmaps" subtitle="Every case you’re working on, all in one place. Pick up right where you left off." crumbs={[{ href: "/roadmap", label: "My Roadmaps" }]} />
      <div className="container-page mt-6 space-y-8">
        {!user && (
          <Notice>
            ประวัติเก็บในเครื่องนี้เท่านั้น <Link href="/login" className="font-semibold underline">เข้าสู่ระบบ</Link> เพื่อไม่ให้ความคืบหน้าหาย (เมื่อเชื่อมฐานข้อมูลแล้ว)
          </Notice>
        )}
        {ready && list.length === 0 ? (
          <Empty title="No roadmaps yet">
            <Link href="/problems" className="btn-primary mt-2">Pick a problem to start</Link>
          </Empty>
        ) : (
          <>
            {active.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold">In progress</h2>
                <div className="space-y-3">{active.map((r) => <Item key={r.problemId} r={r} />)}</div>
              </section>
            )}
            {done.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold">Completed</h2>
                <div className="space-y-3">{done.map((r) => <Item key={r.problemId} r={r} />)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
