"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  UserCheck,
  FolderOpen,
  Building2,
  PartyPopper,
  AlertTriangle,
  FileText,
  ExternalLink,
  RotateCcw,
  Phone,
  Hourglass,
} from "lucide-react";
import { getProblem } from "@/lib/data/problems";
import type { Problem, RoadmapTemplate, StatusOption } from "@/lib/data/types";
import { useStored, formatDate } from "@/lib/store";
import { newProgress, ROADMAP_KEY, type RoadmapProgress } from "@/lib/repos";
import { useAuth } from "@/lib/auth";
import { PageHeader, Notice, LEGAL_REVIEW_NOTE } from "./ui";
import StepTrack from "./Steptrack";
import { FORM_LABEL } from "@/lib/forms";

const STEPS = [
  { n: 1, title: "Check", icon: ClipboardCheck },
  { n: 2, title: "Status", icon: UserCheck },
  { n: 3, title: "Evidence", icon: FolderOpen },
  { n: 4, title: "Contact", icon: Building2 },
];

export default function RoadmapRunner({ problemId }: { problemId: string }) {
  const p = getProblem(problemId)!;
  const { user } = useAuth();
  const [all, setAll, ready] = useStored<Record<string, RoadmapProgress>>(ROADMAP_KEY, {});
  const prog = all[problemId];

  useEffect(() => {
    if (ready && !prog) setAll((prev) => ({ ...prev, [problemId]: newProgress(problemId) }));
  }, [ready, prog, problemId, setAll]);

  const update = (patch: Partial<RoadmapProgress>) =>
    setAll((prev) => ({
      ...prev,
      [problemId]: { ...(prev[problemId] || newProgress(problemId)), ...patch, updatedAt: new Date().toISOString() },
    }));

  const toggle = (arr: number[], i: number) => (arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]);

  if (!ready || !prog) {
    return <div className="container-page py-16 text-center text-ink-mute">กำลังโหลด Roadmap…</div>;
  }

  const step = prog.step;
  const go = (n: number) => {
    update({ step: n });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const rm = p.roadmap;
  const complete = () => {
    update({ step: 5, completedAt: new Date().toISOString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader
        title={p.title}
        subtitle="Roadmap จะพาทำทีละขั้น ความคืบหน้าบันทึกอัตโนมัติ"
        crumbs={[
          { href: "/roadmap", label: "My Roadmaps" },
          { href: `/roadmap/${p.id}`, label: "Steps" },
        ]}
      />

      <div className="container-page mt-6">
        {!user && (
          <div className="mb-4">
          </div>
        )}

        <StepTrack steps={STEPS} current={step} onSelect={go} />

        <div className="mt-6">
          {step <= 4 && !rm && (
            <NoData
              step={step}
              back={step > 1 ? () => go(step - 1) : undefined}
              next={step < 4 ? () => go(step + 1) : undefined}
              complete={step === 4 ? complete : undefined}
            />
          )}
          {rm && step === 1 && <Step1 rm={rm} prog={prog} onToggle={(i) => update({ symptoms: toggle(prog.symptoms, i) })} next={() => go(2)} />}
          {rm && step === 2 && <Step2 rm={rm} prog={prog} update={update} back={() => go(1)} next={() => go(3)} />}
          {rm && step === 3 && (
            <Step3 rm={rm} p={p} prog={prog} onToggle={(i) => update({ evidence: toggle(prog.evidence, i) })} back={() => go(2)} next={() => go(4)} />
          )}
          {rm && step === 4 && <Step4 rm={rm} back={() => go(3)} complete={complete} />}
          {step >= 5 && (
            <Completed
              rm={rm}
              prog={prog}
              reopen={() => update({ step: 4, completedAt: undefined })}
              restart={() => setAll((prev) => ({ ...prev, [problemId]: newProgress(problemId) }))}
            />
          )}
        </div>

        <div className="mt-8">
          <Notice tone="warn">{LEGAL_REVIEW_NOTE}</Notice>
        </div>
      </div>
    </>
  );
}

function Nav({ back, next, nextLabel = "Next step", disabled = false }: { back?: () => void; next?: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {back ? (
        <button onClick={back} className="btn-ghost">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button onClick={next} disabled={disabled} className="btn-primary">
          {nextLabel} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function CheckRow({ checked, onClick, children, sub }: { checked: boolean; onClick: () => void; children: React.ReactNode; sub?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition ${checked ? "bg-petal" : "bg-page hover:bg-tint"}`}
      role="checkbox"
      aria-checked={checked}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checked ? "bg-brand-700 text-white" : "bg-white ring-1 ring-brand-200"}`}>
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span>
        <span className="block">{children}</span>
        {sub && <span className="mt-0.5 block text-xs text-ink-soft">{sub}</span>}
      </span>
    </button>
  );
}

function CompleteBox({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 rounded-2xl bg-tint p-5 text-center">
      <p className="font-semibold">ยื่นเรื่องหรือดำเนินการเรียบร้อยแล้ว?</p>
      <button onClick={onClick} className="btn-primary mt-3">
        <Check className="h-4 w-4" /> ดำเนินการเรียบร้อยแล้ว
      </button>
    </div>
  );
}

function NoData({ step, back, next, complete }: { step: number; back?: () => void; next?: () => void; complete?: () => void }) {
  const titles = ["เช็คปัญหา", "เช็คสถานะ", "เตรียมหลักฐาน", "ติดต่อหน่วยงาน"];
  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">
        ขั้นที่ {step}: {titles[step - 1]}
      </h2>
      <div className="mt-4 flex flex-col items-center rounded-2xl bg-page px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-brand-700">
          <Hourglass className="h-5 w-5" />
        </span>
        <p className="mt-3 font-semibold">ยังไม่มีข้อมูลสำหรับขั้นนี้</p>
        <p className="mt-1 text-sm text-ink-soft">ข้อมูลของปัญหานี้อยู่ระหว่างจัดทำ</p>
      </div>
      {complete && <CompleteBox onClick={complete} />}
      <Nav back={back} next={next} />
    </section>
  );
}

function Step1({ rm, prog, onToggle, next }: { rm: RoadmapTemplate; prog: RoadmapProgress; onToggle: (i: number) => void; next: () => void }) {
  const n = prog.symptoms.length;
  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 1: เช็กลิสต์ประเมินเบื้องต้นว่ากำลังเจอปัญหานี้จริงไหม</h2>
      <p className="mt-1 text-sm text-ink-soft">ติ๊กข้อที่ตรงกับสถานการณ์ของคุณ</p>
      <div className="mt-4 space-y-2">
        {rm.checklist.map((s, i) => (
          <CheckRow key={i} checked={prog.symptoms.includes(i)} onClick={() => onToggle(i)}>
            {s}
          </CheckRow>
        ))}
      </div>
      <div className="mt-4">
        {n === 0 ? (
          <Notice>
            ยังไม่ได้เลือกข้อไหน ถ้าไม่ตรงเลย ลอง <Link href="/problems" className="font-semibold underline">ค้นหาปัญหาอื่น</Link>
          </Notice>
        ) : (
          <Notice>
            ตรงกับ {n} จาก {rm.checklist.length} ข้อ ไปเช็คสถานะต่อได้เลย
          </Notice>
        )}
      </div>
      <Nav next={next} disabled={n === 0} />
    </section>
  );
}

const TONE: Record<StatusOption["tone"], string> = {
  ok: "bg-green-50 text-ok",
  info: "bg-tint text-brand-900",
  warn: "bg-amber-50 text-amber-900",
  stop: "bg-red-50 text-danger",
};

function Step2({
  rm,
  prog,
  update,
  back,
  next,
}: {
  rm: RoadmapTemplate;
  prog: RoadmapProgress;
  update: (x: Partial<RoadmapProgress>) => void;
  back: () => void;
  next: () => void;
}) {
  const s = prog.status;
  const answers = s.answers || {};
  const setAnswer = (id: string, i: number) => update({ status: { ...s, answers: { ...answers, [id]: i } } });

  const deadline = useMemo(() => {
    if (!s.lastIncidentDate || rm.prescription.years <= 0) return null;
    const d = new Date(s.lastIncidentDate);
    d.setFullYear(d.getFullYear() + rm.prescription.years);
    const monthsLeft = Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44));
    return { date: d, monthsLeft };
  }, [s.lastIncidentDate, rm.prescription.years]);

  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 2: เช็คสถานะตนเองว่าสามารถร้องเรียนได้ไหม</h2>

      <div className="mt-5 space-y-6">
        {rm.questions.map((q, qi) => {
          const picked = answers[q.id];
          const opt = picked !== undefined ? q.options[picked] : undefined;
          return (
            <div key={q.id}>
              <p className="font-semibold">
                Q{qi + 1} {q.question}
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {q.options.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setAnswer(q.id, i)}
                    aria-pressed={picked === i}
                    className={`rounded-2xl px-4 py-2.5 text-left text-sm transition ${
                      picked === i ? "bg-brand-700 font-semibold text-white" : "bg-page text-ink hover:bg-tint"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {opt && <p className={`mt-2 rounded-2xl px-4 py-3 text-sm font-medium ${TONE[opt.tone]}`}>{opt.result}</p>}
            </div>
          );
        })}

        <div>
          <p className="font-semibold">อายุความ</p>
          <p className="mt-1 text-sm text-ink-soft">{rm.prescription.text}</p>
          <label className="label mt-3" htmlFor="incident">
            วันที่ค่าล่วงเวลาถึงกำหนดจ่าย (งวดที่ไม่ได้รับ)
          </label>
          <input
            id="incident"
            type="date"
            value={s.lastIncidentDate || ""}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => update({ status: { ...s, lastIncidentDate: e.target.value } })}
            className="input max-w-xs"
          />
          {deadline &&
            (deadline.monthsLeft >= 0 ? (
              <p className={`mt-3 text-sm font-semibold ${deadline.monthsLeft <= 3 ? "text-danger" : "text-ok"}`}>
                ควรดำเนินการก่อน {formatDate(deadline.date.toISOString())} (เหลือประมาณ {deadline.monthsLeft} เดือน)
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" /> อาจเกินอายุความแล้ว ควรปรึกษาผู้เชี่ยวชาญโดยเร็ว
              </p>
            ))}
        </div>
      </div>
      <Nav back={back} next={next} />
    </section>
  );
}

function Step3({
  rm,
  p,
  prog,
  onToggle,
  back,
  next,
}: {
  rm: RoadmapTemplate;
  p: Problem;
  prog: RoadmapProgress;
  onToggle: (i: number) => void;
  back: () => void;
  next: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="card p-6">
        <h2 className="text-lg font-bold">ขั้นที่ 3: เตรียมหลักฐาน แบบฟอร์ม และเอกสาร</h2>
        <p className="mt-1 text-sm text-ink-soft">
          ติ๊กสิ่งที่มีแล้ว · พร้อมแล้ว {prog.evidence.length}/{rm.evidence.length}
        </p>
        <div className="mt-4 space-y-2">
          {rm.evidence.map((e, i) => (
            <CheckRow key={i} checked={prog.evidence.includes(i)} onClick={() => onToggle(i)} sub={e.examples}>
              {i + 1}. {e.item}
            </CheckRow>
          ))}
        </div>
        <Nav back={back} next={next} />
      </section>

      {rm.forms.length > 0 && (
        <aside className="space-y-4">
          <div className="card p-5">
            <p className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4 text-brand-700" /> แบบฟอร์ม
            </p>
            <div className="mt-3 space-y-2">
              {rm.forms.map((f) => (
                <Link key={f} href={`/forms/${f}?problem=${p.id}`} className="flex items-center justify-between rounded-2xl bg-page p-3 text-sm hover:bg-tint">
                  {FORM_LABEL[f]}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function Step4({ rm, back, complete }: { rm: RoadmapTemplate; back: () => void; complete: () => void }) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 4: ช่องทางติดต่อหน่วยงานที่เกี่ยวข้อง</h2>
      <ol className="mt-4 space-y-3">
        {rm.contacts.map((c, i) => (
          <li key={c.title} className="flex gap-4 rounded-2xl bg-page p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold text-brand-800">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{c.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{c.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="btn-primary !min-h-[40px] !px-4 !py-2">
                    <Phone className="h-4 w-4" /> โทร {c.phone}
                  </a>
                )}
                {c.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-soft !min-h-[40px] max-w-full !px-4 !py-2 [overflow-wrap:anywhere]">
                    <span className="min-w-0">{l.label}</span> <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <CompleteBox onClick={complete} />
      <Nav back={back} />
    </section>
  );
}

function Completed({
  rm,
  prog,
  reopen,
  restart,
}: {
  rm?: RoadmapTemplate;
  prog: RoadmapProgress;
  reopen: () => void;
  restart: () => void;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="bg-petal p-6 text-center">
        <PartyPopper className="mx-auto h-10 w-10 text-brand-700" />
        <h2 className="mt-2 text-xl font-bold">ทำครบทุกขั้นแล้ว</h2>
        <p className="mt-1 text-sm text-ink-soft">บันทึกไว้ในประวัติเมื่อ {prog.completedAt ? formatDate(prog.completedAt) : "-"}</p>
      </div>
      <div className="p-6">
        {rm && (
          <>
            <h3 className="font-semibold">สิ่งที่ควรทำระหว่างรอ</h3>
            <ol className="mt-3 space-y-2">
              {rm.whileWaiting.map((w, i) => (
                <li key={w} className="flex gap-3 text-ink-soft">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tint text-xs font-bold text-brand-800">{i + 1}</span>
                  {w}
                </li>
              ))}
            </ol>
          </>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/roadmap" className="btn-primary">
            ดูประวัติทั้งหมด
          </Link>
          <button onClick={reopen} className="btn-soft">
            กลับไปแก้ขั้นที่ 4
          </button>
          <button
            onClick={() => {
              if (confirm("เริ่ม Roadmap นี้ใหม่ทั้งหมด? ความคืบหน้าเดิมจะหายไป")) restart();
            }}
            className="btn-ghost"
          >
            <RotateCcw className="h-4 w-4" /> เริ่มใหม่
          </button>
        </div>
      </div>
    </section>
  );
}
