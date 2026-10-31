"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { ModeNotice, ProblemItem } from "@/components/ResultLists";
import { PROBLEMS } from "@/lib/data/problems";
import { createIndex } from "@/lib/search";

const index = createIndex(PROBLEMS, (p) => ({
  title: p.title,
  keywords: p.keywords,
  body: `${p.summary} ${p.symptoms.join(" ")}`,
}));

export default function ProblemsPage() {
  const [q, setQ] = useState("");
  const result = useMemo(() => index.search(q, 50), [q]);

  const groups = useMemo(() => {
    const m = new Map<string, typeof PROBLEMS>();
    PROBLEMS.forEach((p) => m.set(p.group, [...(m.get(p.group) || []), p]));
    return [...m.entries()];
  }, []);

  return (
    <>
      <PageHeader
        title="ระบบค้นหาปัญหา"
        subtitle="เล่าปัญหาด้วยคำของคุณเอง ระบบจะเรียงเรื่องที่เกี่ยวข้องที่สุดให้ ถ้าไม่เจอตรง ๆ จะหาเรื่องที่ใกล้เคียงให้แทน"
        crumbs={[{ href: "/problems", label: "ค้นหาปัญหา" }]}
      >
        <label className="relative block max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="เช่น ร้านให้ออกพรุ่งนี้ไม่ต้องมา"
            className="input !rounded-full !pl-10"
            autoFocus
          />
        </label>
      </PageHeader>

      <div className="container-page mt-6 space-y-8">
        {q ? (
          <>
            <ModeNotice mode={result.mode} q={q} />
            <div className="grid gap-3 md:grid-cols-2">
              {result.results.map((r) => (
                <ProblemItem key={r.item.id} p={r.item} />
              ))}
            </div>
          </>
        ) : (
          groups.map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-3 text-lg font-bold">{group}</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProblemItem key={p.id} p={p} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
