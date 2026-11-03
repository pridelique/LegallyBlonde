import Link from "next/link";
import { notFound } from "next/navigation";
import { BookMarked, CalendarClock, Route, ListChecks } from "lucide-react";
import { PageHeader, Notice, LEGAL_REVIEW_NOTE } from "@/components/ui";
import { KNOWLEDGE, getTopic } from "@/lib/data/knowledge";
import { PROBLEMS } from "@/lib/data/problems";

export function generateStaticParams() {
  return KNOWLEDGE.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = getTopic(params.slug);
  return { title: t ? `${t.title} · Legally Blonde` : "ไม่พบหัวข้อ" };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const t = getTopic(params.slug);
  if (!t) notFound();
  const related = PROBLEMS.filter((p) => p.relatedTopics.includes(t.slug));

  return (
    <>
      <PageHeader
        title={t.title}
        crumbs={[
          { href: `/knowledge?type=${t.type}`, label: t.type === "general" ? "แรงงานทั่วไป" : "แรงงานนอกระบบ" },
          { href: `/knowledge/${t.slug}`, label: t.group },
        ]}
      >
        <span className="flex items-center gap-1 text-xs text-ink-mute">
          <CalendarClock className="h-3.5 w-3.5" /> ปรับปรุงล่าสุด {new Date(t.updated).toLocaleDateString("th-TH", { dateStyle: "long" })}
        </span>
      </PageHeader>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <article className="space-y-6">
          {/* สรุปสั้น */}
          <section className="card bg-gradient-to-br from-white to-brand-50 p-6">
            <h2 className="flex items-center gap-2 font-bold text-brand-800">
              <ListChecks className="h-4 w-4" /> Summary
            </h2>
            <ul className="mt-3 space-y-2">
              {t.short.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* คำอธิบายแบบยาว */}
          <section className="card prose-legal p-6">
            <h2 className="text-lg font-bold">In detail</h2>
            {t.long.map((l) => (
              <div key={l.heading}>
                <h3>{l.heading}</h3>
                <p className="text-ink-soft">{l.body}</p>
              </div>
            ))}
          </section>

          {/* อ้างอิง */}
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <BookMarked className="h-4 w-4" /> References
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {t.refs.map((r) => (
                <li key={r.label}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
                      {r.label}
                    </a>
                  ) : (
                    r.label
                  )}
                </li>
              ))}
            </ul>
          </section>

          <Notice tone="warn">{LEGAL_REVIEW_NOTE}</Notice>
        </article>

        <aside className="space-y-4">
          {related.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold">เจอปัญหานี้อยู่?</p>
              <p className="mt-1 text-sm text-ink-soft">เริ่ม Roadmap เพื่อเช็คสิทธิและเตรียมหลักฐานทีละขั้น</p>
              <div className="mt-3 space-y-2">
                {related.map((p) => (
                  <Link key={p.id} href={`/problems/${p.id}`} className="flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm hover:bg-brand-100">
                    <Route className="h-4 w-4 shrink-0 text-brand-700" />
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="card p-5 text-sm">
            <p className="font-semibold">ยังไม่แน่ใจ?</p>
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/chat" className="btn-soft">ถามน้องบลอนด์</Link>
              <Link href="/forum/new" className="btn-ghost">ตั้งกระทู้ถาม</Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
