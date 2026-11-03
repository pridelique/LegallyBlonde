import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { PROBLEMS, getProblem } from "@/lib/data/problems";
import { getTopic } from "@/lib/data/knowledge";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }));
}

const STEPS = [
  "เช็คว่าเจอปัญหานี้จริงไหม",
  "เช็คสถานะตัวเองและอายุความ",
  "เตรียมหลักฐานและแบบฟอร์ม",
  "ติดต่อหน่วยงานที่เกี่ยวข้อง",
];

export default function ProblemPage({ params }: { params: { id: string } }) {
  const p = getProblem(params.id);
  if (!p) notFound();
  const topics = p.relatedTopics.map(getTopic).filter(Boolean);

  return (
    <>
      <PageHeader title={p.title} subtitle={p.summary} crumbs={[{ href: "/problems", label: "Problems" }]}>
        <Link href={`/roadmap/${p.id}`} className="btn-primary">
          Start Roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-bold">สัญญาณที่บอกว่าอาจเจอปัญหานี้</h2>
            <ul className="mt-3 space-y-2">
              {p.symptoms.map((s) => (
                <li key={s} className="flex gap-2 text-ink-soft">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-500" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-bold">Roadmap จะพาทำอะไรบ้าง</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-ink-soft">{p.agencyNote}</p>
          </section>
        </div>

        <aside className="space-y-4">
          {topics.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold">ความรู้ที่เกี่ยวข้อง</p>
              <div className="mt-3 space-y-2">
                {topics.map((t) => (
                  <Link key={t!.slug} href={`/knowledge/${t!.slug}`} className="flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm hover:bg-brand-100">
                    <BookOpen className="h-4 w-4 shrink-0 text-brand-700" />
                    {t!.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
