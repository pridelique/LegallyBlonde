"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleHeart } from "lucide-react";

export default function ChatLauncher() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat") || pathname.startsWith("/forms") || pathname.startsWith("/admin")) return null;
  return (
    <Link
      href="/chat"
      className="no-print fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-800"
      aria-label="เปิดแชทบอท"
    >
      <MessageCircleHeart className="h-5 w-5" />
      <span className="hidden sm:inline">ถามน้องบลอนด์</span>
    </Link>
  );
}
