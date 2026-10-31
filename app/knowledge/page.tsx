"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Briefcase, Bike } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { ModeNotice, TopicItem } from "@/components/ResultLists";
import { KNOWLEDGE } from "@/lib/data/knowledge";
import type { WorkerType } from "@/lib/data/types";
import { createIndex } from "@/lib/search";

const index = createIndex(KNOWLEDGE, (t) => ({
  title: t.title,
  keywords: t.keywords,
  body: `${t.short.join(" ")} ${t.long.map((l) => l.body).join(" ")}`,
}));

function KnowledgeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const type = (params.get("type") as WorkerType | null) || null;
  const [q, setQ] = useState("");

  const setType = (t: WorkerType | null) => router.replace(t ? `/knowledge?type=${t}` : "/knowledge", { scroll: false });

  const result = useMemo(() => index.search(q, 50), [q]);
  const list = result.results.map((r) => r.item).filter((t) => !type || t.type === type);

  const groups = useMemo(() => {
    const m = new Map<string, typeof list>();
    list.forEach((t) => m.set(t.group, [...(m.get(t.group) || []), t]));
    return [...m.entries()];
  }, [list]);

  return (
    <>
      <PageHeader
        title="คลังความรู้ด้านสิทธิแรงงาน"
        subtitle="เลือกประเภทแรงงานก่อน แล้วเลือกเรื่องที่อยากรู้ ทุกหัวข้อมีสรุปสั้น คำอธิบายแบบละเอียด และแหล่งอ้างอิง"
        crumbs={[{ href: "/knowledge", label: "คลังความรู้" }]}
      />
      <div className="container-page mt-6">
        {/* Step 1: เลือกประเภทแรงงาน */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { t: "general" as const, icon: Briefcase, title: "แรงงานทั่วไป (ลูกจ้าง)", text: "part-time ร้านอาหาร คาเฟ่ ร้านค้า บริษัท ลูกจ้างรายวัน/รายเดือน" },
            { t: "informal" as const, icon: Bike, title: "แรงงานนอกระบบ", text: "ฟรีแลนซ์ รับงานไปทำที่บ้าน ไรเดอร์ ค้าขายอิสระ" },
          ].map((o) => (
            <button
              key={o.t}
              onClick={() => setType(type === o.t ? null : o.t)}
              className={`card flex items-start gap-3 p-5 text-left transition ${type === o.t ? "!ring-2 !ring-brand-500" : "hover:ring-brand-200"}`}
              aria-pressed={type === o.t}
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800">
                <o.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold">{o.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{o.text}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <label className="relative mt-6 block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาในคลังความรู้" className="input !rounded-full !pl-10" />
        </label>
        {q && (
          <div className="mt-3">
            <ModeNotice mode={result.mode} q={q} />
          </div>
        )}

        {/* Step 2: เลือกเรื่อง */}
        <div className="mt-6 space-y-8">
          {q ? (
            <div className="grid gap-3 md:grid-cols-2">
              {list.map((t) => (
                <TopicItem key={t.slug} t={t} />
              ))}
            </div>
          ) : (
            groups.map(([group, items]) => (
              <section key={group}>
                <h2 className="mb-3 text-lg font-bold">{group}</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((t) => (
                    <TopicItem key={t.slug} t={t} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={null}>
      <KnowledgeInner />
    </Suspense>
  );
}
