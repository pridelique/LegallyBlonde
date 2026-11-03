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
} from "lucide-react";
import { getProblem } from "@/lib/data/problems";
import { getContact } from "@/lib/data/contacts";
import type { FormType } from "@/lib/data/types";
import { useStored, formatDate } from "@/lib/store";
import { newProgress, ROADMAP_KEY, type RoadmapProgress } from "@/lib/repos";
import { useAuth } from "@/lib/auth";
import { PageHeader, Notice, LEGAL_REVIEW_NOTE } from "./ui";
import ContactCard from "./ContactCard";
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
            <Notice>
              ยังไม่ได้เข้าสู่ระบบ ความคืบหน้าจะเก็บไว้ในเครื่องนี้เท่านั้น ถ้าล้างข้อมูลเบราว์เซอร์อาจหายได้{" "}
              <Link href="/login" className="font-semibold underline">เข้าสู่ระบบ</Link>
            </Notice>
          </div>
        )}

        <StepTrack steps={STEPS} current={step} onSelect={go} />

        <div className="mt-6">
          {step === 1 && <Step1 prog={prog} p={p} onToggle={(i) => update({ symptoms: toggle(prog.symptoms, i) })} next={() => go(2)} />}
          {step === 2 && <Step2 prog={prog} p={p} update={update} back={() => go(1)} next={() => go(3)} />}
          {step === 3 && (
            <Step3 prog={prog} p={p} onToggle={(i) => update({ evidence: toggle(prog.evidence, i) })} back={() => go(2)} next={() => go(4)} />
          )}
          {step === 4 && (
            <Step4
              prog={prog}
              p={p}
              onContact={(id) =>
                update({ contacted: prog.contacted.includes(id) ? prog.contacted.filter((x) => x !== id) : [...prog.contacted, id] })
              }
              back={() => go(3)}
              complete={() => {
                update({ step: 5, completedAt: new Date().toISOString() });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
          {step >= 5 && (
            <Completed
              prog={prog}
              p={p}
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

type P = NonNullable<ReturnType<typeof getProblem>>;

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
      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
        checked ? "bg-petal" : "bg-page hover:bg-tint"
      }`}
      role="checkbox"
      aria-checked={checked}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
          checked ? "bg-brand-700 text-white" : "bg-white ring-1 ring-brand-200"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span>
        <span className="block">{children}</span>
        {sub && <span className="mt-0.5 block text-xs text-ink-mute">{sub}</span>}
      </span>
    </button>
  );
}

function Step1({ prog, p, onToggle, next }: { prog: RoadmapProgress; p: P; onToggle: (i: number) => void; next: () => void }) {
  const n = prog.symptoms.length;
  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 1: ตรงกับสถานการณ์ของคุณไหม</h2>
      <p className="mt-1 text-sm text-ink-soft">ติ๊กข้อที่ตรงกับคุณ เพื่อประเมินเบื้องต้นว่ากำลังเจอปัญหานี้จริงหรือไม่</p>
      <div className="mt-4 space-y-2">
        {p.symptoms.map((s, i) => (
          <CheckRow key={i} checked={prog.symptoms.includes(i)} onClick={() => onToggle(i)}>
            {s}
          </CheckRow>
        ))}
      </div>
      <div className="mt-4">
        {n === 0 ? (
          <Notice>ยังไม่ได้เลือกข้อไหน ถ้าไม่ตรงเลย ลอง <Link href="/problems" className="font-semibold underline">ค้นหาปัญหาอื่น</Link></Notice>
        ) : (
          <Notice>
            ตรงกับ {n} จาก {p.symptoms.length} ข้อ {n >= Math.ceil(p.symptoms.length / 2) ? "มีแนวโน้มว่ากำลังเจอปัญหานี้" : "อาจเจอปัญหานี้บางส่วน"} ไปเช็คสถานะต่อได้เลย
          </Notice>
        )}
      </div>
      <Nav next={next} disabled={n === 0} />
    </section>
  );
}

function Choice<T extends string>({ value, options, onChange }: { value?: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-4 py-2 text-sm transition ${value === o.v ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900 hover:bg-brand-100"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Step2({ prog, p, update, back, next }: { prog: RoadmapProgress; p: P; update: (x: Partial<RoadmapProgress>) => void; back: () => void; next: () => void }) {
  const s = prog.status;
  const setS = (patch: Partial<RoadmapProgress["status"]>) => update({ status: { ...s, ...patch } });

  const deadline = useMemo(() => {
    if (!s.lastIncidentDate || p.prescription.years <= 0) return null;
    const d = new Date(s.lastIncidentDate);
    d.setFullYear(d.getFullYear() + p.prescription.years);
    const monthsLeft = Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44));
    return { date: d, monthsLeft };
  }, [s.lastIncidentDate, p.prescription.years]);

  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 2: เช็คสถานะตัวเองและอายุความ</h2>
      <p className="mt-1 text-sm text-ink-soft">คำตอบในขั้นนี้ใช้บอกว่าร้องเรียนช่องทางไหนได้ และยังทันเวลาหรือไม่</p>

      <div className="mt-5 space-y-5">
        {p.needsEmployeeStatus && (
          <div>
            <p className="label">นายจ้างเป็นคนกำหนดเวลาทำงานและสั่งงานคุณใช่ไหม</p>
            <Choice
              value={s.isEmployee}
              onChange={(v) => setS({ isEmployee: v })}
              options={[
                { v: "yes", label: "ใช่ (น่าจะเป็นลูกจ้าง)" },
                { v: "no", label: "ไม่ใช่ รับงานเป็นชิ้น" },
                { v: "unsure", label: "ไม่แน่ใจ" },
              ]}
            />
            {s.isEmployee === "no" && (
              <div className="mt-2">
                <Notice tone="warn">
                  ถ้าเป็นการจ้างทำของ (ฟรีแลนซ์) จะร้องเรียนผ่านพนักงานตรวจแรงงานไม่ได้ ลองดู{" "}
                  <Link href="/roadmap/freelance-unpaid" className="font-semibold underline">Roadmap ฟรีแลนซ์</Link>
                </Notice>
              </div>
            )}
            {s.isEmployee === "unsure" && (
              <div className="mt-2">
                <Notice>
                  อ่าน <Link href="/knowledge/am-i-employee" className="font-semibold underline">เราเป็นลูกจ้างหรือเปล่า</Link> หรือทำต่อไปก่อนก็ได้ แล้วค่อยสอบถามเจ้าหน้าที่ตอนยื่นเรื่อง
                </Notice>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="label">ตอนที่ทำงาน คุณอายุต่ำกว่า 18 ปีไหม</p>
          <Choice value={s.under18} onChange={(v) => setS({ under18: v })} options={[{ v: "yes", label: "ใช่" }, { v: "no", label: "ไม่ใช่" }]} />
          {s.under18 === "yes" && (
            <div className="mt-2">
              <Notice>
                ลูกจ้างเด็กได้รับความคุ้มครองเพิ่ม เช่น ห้ามทำงานกลางคืนและห้ามทำ OT อ่าน{" "}
                <Link href="/knowledge/young-workers" className="font-semibold underline">สิทธิลูกจ้างเด็ก</Link> และควรมีผู้ปกครองหรือผู้ใหญ่ที่ไว้ใจช่วยดำเนินการ
              </Notice>
            </div>
          )}
        </div>

        <div>
          <p className="label">ตอนนี้ยังทำงานที่นั่นอยู่ไหม</p>
          <Choice value={s.stillWorking} onChange={(v) => setS({ stillWorking: v })} options={[{ v: "yes", label: "ยังทำอยู่" }, { v: "no", label: "ออกแล้ว" }]} />
          {s.stillWorking === "yes" && (
            <div className="mt-2">
              <Notice>เก็บหลักฐาน (แคปแชท สลิป ตารางกะ) ไว้ก่อนแจ้งนายจ้างหรือก่อนลาออก เพราะหลังจากนั้นอาจเข้าถึงไม่ได้แล้ว</Notice>
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="incident">วันที่เกิดปัญหาครั้งล่าสุด (เช่น วันที่ควรได้เงิน หรือวันที่ถูกให้ออก)</label>
          <input
            id="incident"
            type="date"
            value={s.lastIncidentDate || ""}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setS({ lastIncidentDate: e.target.value })}
            className="input max-w-xs"
          />
          <div className="mt-3 rounded-xl bg-brand-50 p-4 text-sm">
            <p className="font-semibold text-brand-900">อายุความ</p>
            <p className="mt-1 text-ink-soft">{p.prescription.note}</p>
            {deadline &&
              (deadline.monthsLeft >= 0 ? (
                <p className={`mt-2 font-semibold ${deadline.monthsLeft <= 3 ? "text-danger" : "text-ok"}`}>
                  ควรดำเนินการก่อน {formatDate(deadline.date.toISOString())} (เหลือประมาณ {deadline.monthsLeft} เดือน)
                </p>
              ) : (
                <p className="mt-2 flex items-center gap-1 font-semibold text-danger">
                  <AlertTriangle className="h-4 w-4" /> อาจเกินอายุความแล้ว ควรปรึกษาผู้เชี่ยวชาญโดยเร็ว
                </p>
              ))}
          </div>
        </div>
      </div>
      <Nav back={back} next={next} />
    </section>
  );
}

function Step3({ prog, p, onToggle, back, next }: { prog: RoadmapProgress; p: P; onToggle: (i: number) => void; back: () => void; next: () => void }) {
  const requiredIdx = p.evidence.map((e, i) => (e.required ? i : -1)).filter((i) => i >= 0);
  const requiredDone = requiredIdx.filter((i) => prog.evidence.includes(i)).length;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="card p-6">
        <h2 className="text-lg font-bold">ขั้นที่ 3: เตรียมหลักฐานและเอกสาร</h2>
        <p className="mt-1 text-sm text-ink-soft">
          ติ๊กสิ่งที่มีแล้ว รายการนี้เป็นแนวทางเบื้องต้น ไม่ใช่การรับรองว่าหลักฐานทุกชิ้นจำเป็นหรือเพียงพอสำหรับทุกกรณี
        </p>
        <p className="mt-3 text-sm font-semibold text-brand-800">
          รายการสำคัญ: {requiredDone}/{requiredIdx.length} · ทั้งหมด: {prog.evidence.length}/{p.evidence.length}
        </p>
        <div className="mt-3 space-y-2">
          {p.evidence.map((e, i) => (
            <CheckRow key={i} checked={prog.evidence.includes(i)} onClick={() => onToggle(i)} sub={e.tip}>
              {e.item} {e.required && <span className="ml-1 rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-800">สำคัญ</span>}
            </CheckRow>
          ))}
        </div>
        <Nav back={back} next={next} />
      </section>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4 text-brand-700" /> แบบฟอร์มที่แก้ในเว็บได้
          </p>
          <p className="mt-1 text-xs text-ink-soft">กรอกในเว็บ บันทึกอัตโนมัติ แล้วดาวน์โหลดเป็น PDF หรือเซฟเป็นไฟล์เก็บไว้ได้</p>
          <div className="mt-3 space-y-2">
            {p.forms.map((f: FormType) => (
              <Link key={f} href={`/forms/${f}?problem=${p.id}`} className="flex items-center justify-between rounded-xl bg-brand-50 p-3 text-sm hover:bg-brand-100">
                {FORM_LABEL[f]}
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-5 text-sm">
          <p className="font-semibold">แบบฟอร์มเปล่าจากหน่วยงาน</p>
          <p className="mt-1 text-xs text-ink-soft">ดาวน์โหลดแบบฟอร์มฉบับล่าสุดจากเว็บไซต์ทางการเสมอ</p>
          <a href="https://www.labour.go.th" target="_blank" rel="noopener noreferrer" className="btn-soft mt-3 w-full">
            เว็บไซต์กรมสวัสดิการฯ <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}

function Step4({ prog, p, onContact, back, complete }: { prog: RoadmapProgress; p: P; onContact: (id: string) => void; back: () => void; complete: () => void }) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">ขั้นที่ 4: ติดต่อหน่วยงานที่เกี่ยวข้อง</h2>
      <p className="mt-1 text-sm text-ink-soft">{p.agencyNote}</p>
      <p className="mt-1 text-xs text-ink-mute">เว็บไซต์นี้แนะนำช่องทางเท่านั้น ไม่ได้ส่งเรื่องแทนคุณ</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {p.agencies.map((id) => {
          const c = getContact(id);
          if (!c) return null;
          const done = prog.contacted.includes(id);
          return (
            <div key={id} className="flex flex-col gap-2">
              <ContactCard c={c} />
              <button onClick={() => onContact(id)} className={done ? "btn bg-green-50 text-ok ring-1 ring-green-200" : "btn-soft"}>
                {done ? <><Check className="h-4 w-4" /> ติดต่อแล้ว</> : "ทำเครื่องหมายว่าติดต่อแล้ว"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-50 to-amber-50 p-5 text-center">
        <p className="font-semibold">ยื่นเรื่องหรือดำเนินการเรียบร้อยแล้ว?</p>
        <button onClick={complete} className="btn-primary mt-3">
          <Check className="h-4 w-4" /> ดำเนินการเรียบร้อยแล้ว
        </button>
      </div>
      <Nav back={back} />
    </section>
  );
}

function Completed({ prog, p, reopen, restart }: { prog: RoadmapProgress; p: P; reopen: () => void; restart: () => void }) {
  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-r from-brand-100 via-brand-50 to-amber-50 p-6 text-center">
        <PartyPopper className="mx-auto h-10 w-10 text-brand-700" />
        <h2 className="mt-2 text-xl font-bold">เก่งมาก! ทำครบทุกขั้นแล้ว</h2>
        <p className="mt-1 text-sm text-ink-soft">บันทึกไว้ในประวัติเมื่อ {prog.completedAt ? formatDate(prog.completedAt) : "-"}</p>
      </div>
      <div className="p-6">
        <h3 className="font-semibold">สิ่งที่ควรทำระหว่างรอ</h3>
        <ul className="mt-3 space-y-2">
          {p.whileWaiting.map((w) => (
            <li key={w} className="flex gap-2 text-ink-soft">
              <Check className="mt-1 h-4 w-4 shrink-0 text-ok" /> {w}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-brand-50 p-3">ตรงกับอาการ {prog.symptoms.length} ข้อ</div>
          <div className="rounded-xl bg-brand-50 p-3">หลักฐานพร้อม {prog.evidence.length}/{p.evidence.length} รายการ</div>
          <div className="rounded-xl bg-brand-50 p-3">ติดต่อแล้ว {prog.contacted.length} หน่วยงาน</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/roadmap" className="btn-primary">ดูประวัติทั้งหมด</Link>
          <button onClick={reopen} className="btn-soft">กลับไปแก้ขั้นที่ 4</button>
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
