import { Phone, Globe, MessageCircle, Mail, Facebook, Info, ChevronDown, type LucideIcon } from "lucide-react";
import type { Contact, ContactChannel } from "@/lib/data/types";

const ICON: Record<ContactChannel["kind"], LucideIcon> = {
  phone: Phone,
  line: MessageCircle,
  web: Globe,
  email: Mail,
  facebook: Facebook,
  note: Info,
};

export default function ContactCard({ c }: { c: Contact }) {
  return (
    <article className="card flex h-full flex-col p-5 sm:p-6">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold text-brand-800">{c.no}</span>
          <h3 className="min-w-0 flex-1 pt-1.5 font-bold leading-snug">{c.name}</h3>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-brand-800 transition group-hover:bg-tint"
          >
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </span>
          <span className="sr-only">แสดงรายละเอียดหน่วยงาน</span>
        </summary>
        <p className="mt-3 rounded-2xl bg-page p-4 text-sm text-ink-soft">{c.description}</p>
      </details>

      {c.hotline && (
        <a
          href={`tel:${c.hotline.number}`}
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-petal px-4 py-3 transition hover:bg-bloom/60"
        >
          <span className="text-xs font-medium text-brand-900">{c.hotline.label}</span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-brand-900">{c.hotline.number}</span>
            {c.hotline.ext && <span className="text-sm font-semibold text-brand-800">{c.hotline.ext}</span>}
          </span>
        </a>
      )}

      <ul className="mt-4 space-y-2 text-sm">
        {c.channels.map((ch, i) => {
          const Icon = ICON[ch.kind];
          const body = (
            <>
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <span className="min-w-0">
                {ch.label && <span className="block text-xs text-ink-soft">{ch.label}</span>}
                <span className={`block break-words ${ch.href ? "font-medium text-brand-800" : "text-ink"}`}>{ch.value}</span>
              </span>
            </>
          );
          return (
            <li key={i}>
              {ch.href ? (
                <a
                  href={ch.href}
                  {...(ch.kind === "web" || ch.kind === "facebook" || ch.kind === "line" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-page"
                >
                  {body}
                </a>
              ) : (
                <div className="flex gap-2.5 px-2 py-1.5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
