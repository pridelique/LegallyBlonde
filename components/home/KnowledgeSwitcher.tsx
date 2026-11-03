"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { KNOWLEDGE } from "@/lib/data/knowledge";
import type { WorkerType } from "@/lib/data/types";
import { Segmented } from "../smart";

export default function KnowledgeSwitcher() {
  const [type, setType] = useState<WorkerType>("general");
  const list = KNOWLEDGE.filter((t) => t.type === type).slice(0, 5);

  return (
    <section className="card-tint p-5 sm:p-6" aria-labelledby="kn-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="kn-title" className="text-lg font-bold">Knowledge</h2>
        <Link href={`/knowledge?type=${type}`} className="text-sm font-semibold text-brand-800 hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4">
        <Segmented
          label="Worker type"
          value={type}
          onChange={setType}
          options={[
            { value: "general", label: "Employee" },
            { value: "informal", label: "Informal" },
          ]}
        />
      </div>
      <ul className="mt-4 space-y-2" role="tabpanel">
        {list.map((t) => (
          <li key={t.slug}>
            <Link href={`/knowledge/${t.slug}`} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition hover:shadow-soft">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{t.title}</span>
                <span className="block text-xs text-ink-soft">{t.group}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-mute" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
