"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, UserRound, ShieldCheck } from "lucide-react";
import { LogoMark } from "./Decor";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/problems", label: "Problems" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/forum", label: "Forum" },
  { href: "/contacts", label: "Contacts" },
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-40 bg-page/85 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Legally Blonde home">
          <LogoMark size={36} id="logo-nav" />
          <span className="text-lg font-bold tracking-tight">Legally Blonde</span>
        </Link>

        {/* เมนูแบบแคปซูล */}
        <nav aria-label="Main" className="mx-auto hidden items-center rounded-full bg-white p-1 shadow-soft lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(l.href) ? "bg-petal font-semibold text-brand-900" : "text-ink-soft hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <form onSubmit={submit} className="hidden md:block">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="h-11 w-44 rounded-full bg-white pl-10 pr-4 text-sm shadow-soft transition focus:w-56 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </label>
          </form>
          {user ? (
            <Link href="/account" className="icon-btn" title={user.displayName} aria-label="My account">
              {user.role === "verified" || user.role === "admin" ? <ShieldCheck className="h-5 w-5 text-brand-700" /> : <UserRound className="h-5 w-5" />}
            </Link>
          ) : (
            <Link href="/login" className="btn-primary !px-5">
              Sign in
            </Link>
          )}
          <button className="icon-btn lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="container-page pb-4">
            <div className="card space-y-3 p-4">
              <form onSubmit={submit}>
                <label className="sr-only" htmlFor="m-search">Search</label>
                <input id="m-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rights or problems" className="input !bg-page !shadow-none" />
              </form>
              <nav aria-label="Main (mobile)" className="grid grid-cols-2 gap-2">
                {[...LINKS, { href: "/chat", label: "Chatbot" }].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm ${isActive(l.href) ? "bg-petal font-semibold text-brand-900" : "bg-page text-ink"}`}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
