"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Route, MessagesSquare, MessageCircle } from "lucide-react";

const LEFT = [
  { href: "/", label: "Home", icon: Home },
  { href: "/knowledge", label: "Learn", icon: BookOpen },
];
const RIGHT = [
  { href: "/roadmap", label: "Roadmap", icon: Route },
  { href: "/forum", label: "Forum", icon: MessagesSquare },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/forms") || pathname.startsWith("/chat")) return null;
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  const Item = ({ href, label, icon: Icon }: (typeof LEFT)[number]) => {
    const on = active(href);
    return (
      <Link href={href} className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${on ? "font-semibold text-brand-700" : "text-ink-soft"}`} aria-current={on ? "page" : undefined}>
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  };

  return (
    <nav aria-label="เมนูล่าง" className="no-print fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-3 mb-3 flex items-center rounded-[28px] bg-white px-2 shadow-[0_-4px_30px_-10px_rgba(131,24,67,0.25)]">
        {LEFT.map((x) => (
          <Item key={x.href} {...x} />
        ))}
        <div className="flex flex-1 justify-center">
          <Link
            href="/chat"
            aria-label="แชทบอท"
            className="-mt-8 flex h-14 w-14 rotate-45 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-pop ring-4 ring-page transition hover:bg-brand-800"
          >
            <MessageCircle className="h-6 w-6 -rotate-45" />
          </Link>
        </div>
        {RIGHT.map((x) => (
          <Item key={x.href} {...x} />
        ))}
      </div>
    </nav>
  );
}
