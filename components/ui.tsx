import Link from "next/link";
import { ChevronRight, Info, Inbox } from "lucide-react";
import BackButton from "./BackButton";

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
    <section className="container-page pt-2">
      <div className="card-petal relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-bloom/50" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/40" />
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <BackButton />
            {crumbs && (
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-ink-soft">
                <Link href="/" className="hover:text-brand-800">Home</Link>
                {crumbs.map((c) => (
                  <span key={c.href} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    <Link href={c.href} className="hover:text-brand-800">{c.label}</Link>
                  </span>
                ))}
              </nav>
            )}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-ink-soft">{subtitle}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "bg-amber-50 text-amber-900" : "bg-tint text-brand-900";
  return (
    <div className={`flex gap-2.5 rounded-2xl p-4 text-sm ${cls}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tint text-brand-700">
        <Inbox className="h-6 w-6" />
      </span>
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-soft">{children}</div>}
    </div>
  );
}

/** หัวข้อการ์ด: ชื่อด้านซ้าย ลิงก์/ปุ่มด้านขวา */
export function CardHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {action}
    </div>
  );
}

export const LEGAL_REVIEW_NOTE =
  "ร่างเนื้อหาสำหรับต้นแบบ ต้องให้ทีมกฎหมายตรวจทานตัวเลข มาตรา และช่องทางติดต่อก่อนเผยแพร่จริง";
