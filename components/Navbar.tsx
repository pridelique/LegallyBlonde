"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, UserRound, ShieldCheck } from "lucide-react";
import { LogoMark } from "./Decor";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/knowledge", label: "คลังความรู้" },
  { href: "/problems", label: "ค้นหาปัญหา" },
  { href: "/roadmap", label: "Roadmap ของฉัน" },
  { href: "/chat", label: "แชทบอท" },
  { href: "/forum", label: "กระทู้ถามตอบ" },
  { href: "/contacts", label: "ช่องทางติดต่อ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="หน้าแรก">
          <LogoMark size={34} />
          <span className="text-lg font-bold tracking-tight text-brand-800">Legally Blonde</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                isActive(l.href) ? "bg-brand-50 font-semibold text-brand-800" : "text-ink-soft hover:bg-brand-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden md:block lg:ml-0">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหา เช่น โดนไล่ออก"
              className="w-56 rounded-full border border-brand-100 bg-brand-50/50 py-2 pl-9 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user ? (
            <Link href="/account" className="btn-soft !px-3 !py-2" title="บัญชีของฉัน">
              {user.role === "verified" || user.role === "admin" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <UserRound className="h-4 w-4" />
              )}
              <span className="hidden max-w-[8rem] truncate sm:inline">{user.displayName}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn-primary !px-4 !py-2">
              เข้าสู่ระบบ
            </Link>
          )}
          <button
            className="btn-ghost !p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white lg:hidden">
          <div className="container-page space-y-3 py-4">
            <form onSubmit={submit}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาสิทธิหรือปัญหา" className="input" />
            </form>
            <nav className="grid grid-cols-2 gap-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm ${
                    isActive(l.href) ? "bg-brand-100 font-semibold text-brand-800" : "bg-brand-50/60 text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
