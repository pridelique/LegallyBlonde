"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, Download, Upload, Trash2, CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import { FORMS, CLAIM_BY_PROBLEM, type Field, type FormSchema } from "@/lib/forms";
import type { FormType } from "@/lib/data/types";
import { getProblem } from "@/lib/data/problems";
import { readLS, writeLS, removeLS, formatDate, formatDateTime } from "@/lib/store";
import { ROADMAP_KEY, type RoadmapProgress } from "@/lib/repos";
import { PageHeader, Notice } from "./ui";

type Values = Record<string, string | string[]>;
interface Draft {
  values: Values;
  savedAt: string;
}

export default function FormEditor({ type }: { type: FormType }) {
  const schema = FORMS[type];
  const problemId = useSearchParams().get("problem") || "general";
  const problem = getProblem(problemId);
  const key = `form:${type}:${problemId}`;

  const [values, setValues] = useState<Values>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const draft = readLS<Draft | null>(key, null);
    if (draft) {
      setValues(draft.values);
      setSavedAt(draft.savedAt);
    } else if (problem) {
      const prog = readLS<Record<string, RoadmapProgress>>(ROADMAP_KEY, {})[problem.id];
      const evidence = prog && problem.roadmap ? prog.evidence.map((i) => "- " + problem.roadmap!.evidence[i]?.item).join("\n") : "";
      setValues({
        claims: CLAIM_BY_PROBLEM[problem.id] || [],
        evidence,
        endDate: "",
        date: new Date().toISOString().slice(0, 10),
        dueDays: "7",
      });
    } else {
      setValues({ date: new Date().toISOString().slice(0, 10), dueDays: "7" });
    }
    setLoaded(true);
  }, [key, problem]);

  // autosave
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      const now = new Date().toISOString();
      writeLS<Draft>(key, { values, savedAt: now });
      setSavedAt(now);
    }, 600);
    return () => clearTimeout(t);
  }, [values, key, loaded]);

  const set = (name: string, v: string | string[]) => setValues((prev) => ({ ...prev, [name]: v }));

  const exportFile = () => {
    const blob = new Blob([JSON.stringify({ type, problemId, values, exportedAt: new Date().toISOString() }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legally-blonde-${type}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (data?.values && typeof data.values === "object") setValues(data.values);
      else alert("ไฟล์ไม่ถูกต้อง");
    } catch {
      alert("อ่านไฟล์ไม่ได้");
    }
  };

  const clear = () => {
    if (!confirm("ล้างข้อมูลในแบบฟอร์มนี้ทั้งหมด?")) return;
    removeLS(key);
    setValues({});
  };

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={schema.title}
          subtitle={schema.description}
          crumbs={[
            ...(problem ? [{ href: `/roadmap/${problem.id}`, label: "Roadmap" }] : []),
            { href: `/forms/${type}`, label: "แบบฟอร์ม" },
          ]}
        />
      </div>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-2">
        <section className="no-print space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {problem && (
              <Link href={`/roadmap/${problem.id}`} className="btn-ghost !px-3">
                <ArrowLeft className="h-4 w-4" /> กลับ Roadmap
              </Link>
            )}
            <span className="flex items-center gap-1 text-xs text-ok">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {savedAt ? `บันทึกอัตโนมัติ ${formatDateTime(savedAt)}` : "ยังไม่ได้บันทึก"}
            </span>
          </div>

          <Notice>
            <span className="flex items-start gap-1">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ข้อมูลที่กรอกเก็บไว้ในเครื่องของคุณเท่านั้น ไม่ได้ส่งขึ้นเซิร์ฟเวอร์
            </span>
          </Notice>

          {schema.sections.map((sec) => (
            <fieldset key={sec.title} className="card p-5">
              <legend className="px-1 font-semibold text-brand-800">{sec.title}</legend>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {sec.fields.map((f) => (
                  <FieldInput key={f.name} f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
                ))}
              </div>
            </fieldset>
          ))}

          <div className="card flex flex-wrap gap-2 p-4">
            <button onClick={() => window.print()} className="btn-primary">
              <Printer className="h-4 w-4" /> ดาวน์โหลด PDF / พิมพ์
            </button>
            <button onClick={exportFile} className="btn-soft">
              <Download className="h-4 w-4" /> เซฟเป็นไฟล์
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn-soft">
              <Upload className="h-4 w-4" /> เปิดไฟล์ที่เซฟไว้
            </button>
            <button onClick={clear} className="btn-ghost text-danger">
              <Trash2 className="h-4 w-4" /> ล้างข้อมูล
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importFile(f);
                e.target.value = "";
              }}
            />
            <p className="w-full text-xs text-ink-mute">ปุ่ม PDF จะเปิดหน้าพิมพ์ของเบราว์เซอร์ ให้เลือกปลายทางเป็น “บันทึกเป็น PDF”</p>
          </div>
        </section>

        <section className="lg:sticky lg:top-20 lg:self-start">
          <p className="no-print mb-2 text-sm font-semibold text-ink-soft">ตัวอย่างเอกสาร</p>
          <div className="print-doc card bg-white p-5 font-doc [overflow-wrap:anywhere] sm:p-8 text-[15px] leading-relaxed text-black">
            {schema.layout === "letter" ? <LetterPreview v={values} /> : <SheetPreview schema={schema} v={values} />}
          </div>
        </section>
      </div>
    </>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: string | string[] | undefined; onChange: (v: string | string[]) => void }) {
  const id = `f-${f.name}`;
  const span = f.half ? "" : "sm:col-span-2";
  if (f.type === "multi") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className={span}>
        <p className="label">{f.label}</p>
        <div className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const on = arr.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])}
                className={`rounded-full px-3 py-1.5 text-sm ${on ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900 hover:bg-brand-100"}`}
                aria-pressed={on}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  const v = typeof value === "string" ? value : "";
  return (
    <div className={span}>
      <label htmlFor={id} className="label">{f.label}</label>
      {f.type === "textarea" ? (
        <textarea id={id} rows={4} value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} className="input" />
      ) : f.type === "select" ? (
        <select id={id} value={v} onChange={(e) => onChange(e.target.value)} className="input">
          <option value="">เลือก</option>
          {f.options!.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={f.type}
          inputMode={f.type === "number" ? "decimal" : undefined}
          value={v}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      )}
    </div>
  );
}

const show = (v: string | string[] | undefined, type?: string) => {
  if (Array.isArray(v)) return v.length ? v.join(", ") : "";
  if (!v) return "";
  if (type === "date") return formatDate(v);
  if (type === "number" && !isNaN(Number(v))) return Number(v).toLocaleString("th-TH");
  return v;
};

const Blank = ({ children }: { children: React.ReactNode }) =>
  children ? <>{children}</> : <span className="text-gray-400">..............................</span>;

function SheetPreview({ schema, v }: { schema: FormSchema; v: Values }) {
  return (
    <div>
      <p className="text-center text-lg font-bold">{schema.title}</p>
      <p className="mt-1 text-center text-xs text-gray-500">เอกสารเตรียมข้อมูลจาก Legally Blonde · ไม่ใช่แบบฟอร์มทางการของหน่วยงาน</p>
      {schema.sections.map((sec) => (
        <div key={sec.title} className="mt-5">
          <p className="border-b border-gray-300 pb-1 font-bold">{sec.title}</p>
          <dl className="mt-2 grid grid-cols-[38%_minmax(0,1fr)] gap-x-3 gap-y-1.5">
            {sec.fields.map((f) => (
              <div key={f.name} className="contents">
                <dt className="text-gray-600">{f.type === "multi" ? "รายการ" : f.label}</dt>
                <dd className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                  <Blank>{show(v[f.name], f.type)}</Blank>
                  {f.name === "wage" && v.wageUnit ? ` / ${v.wageUnit}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <p className="mt-8 text-right">ลงชื่อ ...................................... ผู้ร้อง</p>
      <p className="text-right">({show(v.name) || "......................................"})</p>
    </div>
  );
}

function LetterPreview({ v }: { v: Values }) {
  const due = show(v.dueDays) || "7";
  return (
    <div>
      <p className="text-right">
        เขียนที่ <Blank>{show(v.place)}</Blank>
        <br />
        วันที่ <Blank>{show(v.date, "date")}</Blank>
      </p>
      <p className="mt-4">
        <b>เรื่อง</b> ขอให้ชำระค่าจ้าง/ค่าตอบแทนที่ค้างชำระ
      </p>
      <p>
        <b>เรียน</b> <Blank>{show(v.to)}</Blank>
        {v.toOrg ? ` (${show(v.toOrg)})` : ""}
      </p>
      <p className="mt-4 indent-10">
        ตามที่ข้าพเจ้า <Blank>{show(v.name)}</Blank> ได้ทำงานในฐานะ <Blank>{show(v.work)}</Blank> ในช่วง{" "}
        <Blank>{show(v.period)}</Blank> นั้น ปัจจุบันข้าพเจ้ายังไม่ได้รับค่าจ้าง/ค่าตอบแทนเป็นจำนวนเงิน{" "}
        <Blank>{show(v.amount, "number")}</Blank> บาท
      </p>
      {v.detail && <p className="mt-2 indent-10 whitespace-pre-wrap">{show(v.detail)}</p>}
      <p className="mt-2 indent-10">
        ข้าพเจ้าจึงขอให้ท่านชำระเงินจำนวนดังกล่าวภายใน {due} วันนับแต่วันที่ได้รับหนังสือนี้ โดย <Blank>{show(v.payTo)}</Blank>{" "}
        หากพ้นกำหนดดังกล่าว ข้าพเจ้าอาจพิจารณาดำเนินการตามช่องทางที่กฎหมายกำหนดต่อไป
      </p>
      <p className="mt-2 indent-10">จึงเรียนมาเพื่อโปรดดำเนินการ</p>
      <p className="mt-8 text-right">
        ขอแสดงความนับถือ
        <br />
        <br />
        ...................................... <br />( <Blank>{show(v.name)}</Blank> )
        <br />
        ติดต่อกลับ: <Blank>{show(v.contact)}</Blank>
      </p>
    </div>
  );
}
