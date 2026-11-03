"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function ChatLauncher() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat") || pathname.startsWith("/forms") || pathname.startsWith("/admin")) return null;
  return (
    <Link
      href="/chat"
      className="no-print fixed bottom-6 right-6 z-30 hidden min-h-[52px] items-center gap-2.5 rounded-full bg-brand-700 py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-pop transition hover:bg-brand-800 md:flex"
      aria-label="Ask Blonde แชทบอท"
    >
      <span className="flex h-9 w-9 rotate-45 items-center justify-center rounded-xl bg-white/20">
        <MessageCircle className="h-5 w-5 -rotate-45" />
      </span>
      Ask Blonde
    </Link>
  );
}
