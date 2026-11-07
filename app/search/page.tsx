"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui";
import SearchBox from "@/components/SearchBox";
import { ModeNotice, ProblemItem, TopicItem } from "@/components/ResultLists";
import { createIndex } from "@/lib/search";
import { PROBLEMS } from "@/lib/data/problems";
import { KNOWLEDGE } from "@/lib/data/knowledge";

const problemIndex = createIndex(PROBLEMS, (p) => ({
  title: p.title,
  keywords: p.keywords,
  body: `${p.summary} ${p.detail ?? ""} ${p.roadmap?.checklist.join(" ") ?? ""}`,
}));
const topicIndex = createIndex(KNOWLEDGE, (t) => ({
  title: t.title,
  keywords: t.keywords,
  body: `${t.short.join(" ")} ${t.long.map((l) => l.body).join(" ")}`,
}));

function Results() {
  const q = useSearchParams().get("q") || "";
  const problems = useMemo(() => problemIndex.search(q, 6), [q]);
  const topics = useMemo(() => topicIndex.search(q, 6), [q]);
  const mode = problems.mode === "match" || topics.mode === "match" ? "match" : problems.mode === "similar" || topics.mode === "similar" ? "similar" : "none";

  return (
    <>
      <PageHeader title={q ? `Results for “${q}”` : "Search"} crumbs={[{ href: "/search", label: "Search" }]}>
        <SearchBox />
      </PageHeader>
      <div className="container-page mt-6 space-y-8">
        {q && <ModeNotice mode={mode} q={q} />}
        {problems.results.length > 0 && problems.mode !== "empty" && (
          <section>
            <h2 className="mb-3 text-lg font-bold">Related problems</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {problems.results.map((r) => (
                <ProblemItem key={r.item.id} p={r.item} />
              ))}
            </div>
          </section>
        )}
        {topics.results.length > 0 && topics.mode !== "empty" && (
          <section>
            <h2 className="mb-3 text-lg font-bold">Related knowledge</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {topics.results.map((r) => (
                <TopicItem key={r.item.slug} t={r.item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-10">กำลังค้นหา…</div>}>
      <Results />
    </Suspense>
  );
}
