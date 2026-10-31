import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { Flower } from "./Decor";

export function PageHeader({
  title,
  subtitle,
  crumbs,
  children,
}: {
  title: string;
  subtitle?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream">
      <Flower id="ph1" size={140} className="pointer-events-none absolute -right-8 -top-6 opacity-60" />
      <Flower id="ph2" size={70} petals={5} className="pointer-events-none absolute right-28 top-16 opacity-40" from="#FDE68A" to="#F9A8D4" />
      <div className="container-page relative py-10">
        {crumbs && (
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-ink-mute">
            <Link href="/" className="hover:text-brand-700">หน้าแรก</Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                <Link href={c.href} className="hover:text-brand-700">{c.label}</Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-ink-soft">{subtitle}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-brand-50 text-brand-900 ring-brand-100";
  return (
    <div className={`flex gap-2 rounded-xl p-3 text-sm ring-1 ${cls}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <Flower id="empty" size={64} petals={5} className="mb-3 opacity-80" />
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-soft">{children}</div>}
    </div>
  );
}

export const LEGAL_REVIEW_NOTE =
  "ร่างเนื้อหาสำหรับต้นแบบ ต้องให้ทีมกฎหมายตรวจทานตัวเลข มาตรา และช่องทางติดต่อก่อนเผยแพร่จริง";
