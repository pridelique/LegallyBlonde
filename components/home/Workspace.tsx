"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Route, FolderCheck, CalendarClock, ArrowRight, Plus } from "lucide-react";
import { useStored, formatDate } from "@/lib/store";
import { ROADMAP_KEY, type RoadmapProgress } from "@/lib/repos";
import { getProblem } from "@/lib/data/problems";
import IconCircle from "../IconCircle";
import { TodayLabel } from "./Greeting";

const STEP_LABELS = ["Check", "Status", "Evidence", "Contact"];

export default function Workspace() {
  const [all, , ready] = useStored<Record<string, RoadmapProgress>>(ROADMAP_KEY, {});

  const data = useMemo(() => {
    const list = Object.values(all).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const active = list.filter((r) => r.step < 5);
    let evDone = 0;
    let evTotal = 0;
    let next: { date: Date; title: string } | null = null;
    for (const r of active) {
      const p = getProblem(r.problemId);
      if (!p) continue;
      evDone += r.evidence.length;
      evTotal += p.evidence.length;
      if (r.status.lastIncidentDate && p.prescription.years > 0) {
        const d = new Date(r.status.lastIncidentDate);
        d.setFullYear(d.getFullYear() + p.prescription.years);
        if (d.getTime() > Date.now() && (!next || d < next.date)) next = { date: d, title: p.title };
      }
    }
    return { active, current: active[0], evDone, evTotal, next };
  }, [all]);

  const cur = data.current;
  const curProblem = cur ? getProblem(cur.problemId) : undefined;
  const doneSteps = cur ? Math.min(cur.step - 1, 4) : 0;
  const pct = doneSteps * 25;

  return (
    <div className="grid gap-4">
      <section className="card-petal p-5 sm:p-6" aria-labelledby="ws-title">
        <div className="flex items-center justify-between gap-3">
          <h2 id="ws-title" className="text-lg font-bold">
            <TodayLabel />
          </h2>
          <Link href="/roadmap" className="text-sm font-semibold text-brand-800 hover:underline">
            My roadmaps
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Tile icon={Route} value={ready ? String(data.active.length) : "–"} label="Active roadmaps" href="/roadmap" />
          <Tile icon={FolderCheck} value={ready ? (data.evTotal ? `${data.evDone}/${data.evTotal}` : "0") : "–"} label="Evidence ready" href="/roadmap" />
          <Tile
            icon={CalendarClock}
            value={ready && data.next ? formatDate(data.next.date.toISOString()) : "–"}
            label="Next deadline"
            href={cur ? `/roadmap/${cur.problemId}` : "/problems"}
            small
          />
        </div>
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="cont-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{cur ? "Continue" : "Get started"}</p>
            <h2 id="cont-title" className="mt-1 text-xl font-bold leading-snug">
              {curProblem ? curProblem.title : "ยังไม่มี Roadmap ที่ทำค้างไว้"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {cur ? `Step ${Math.min(cur.step, 4)} of 4 · ${STEP_LABELS[Math.min(cur.step, 4) - 1]}` : "เลือกปัญหาที่เจอ แล้วระบบจะพาทำทีละขั้น"}
            </p>
          </div>
          <Link href={cur ? `/roadmap/${cur.problemId}` : "/problems"} className="btn-primary shrink-0">
            {cur ? (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Start a roadmap
              </>
            )}
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-tint bg-tint p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold">ความคืบหน้าโดยรวม</span>
            <span className="font-bold text-brand-700">{pct}%</span>
          </div>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-petal"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="ความคืบหน้าโดยรวม"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-center text-sm text-ink-soft">{doneSteps} of 4 ขั้นที่เสร็จสิ้น</p>
        </div>
      </section>
    </div>
  );
}

function Tile({
  icon,
  value,
  label,
  href,
  small = false,
}: {
  icon: typeof Route;
  value: string;
  label: string;
  href: string;
  small?: boolean;
}) {
  return (
    <Link href={href} className="flex flex-col gap-3 rounded-2xl bg-white/80 p-3.5 transition hover:bg-white sm:p-4">
      <IconCircle icon={icon} tone="tint" size="sm" />
      <span>
        <span className={`block font-bold tabular-nums ${small ? "text-sm sm:text-base" : "text-xl"}`}>{value}</span>
        <span className="block text-[11px] leading-tight text-ink-soft sm:text-xs">{label}</span>
      </span>
    </Link>
  );
}
