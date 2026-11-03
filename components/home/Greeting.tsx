"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LogoMark } from "../Decor";

function greet(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Greeting() {
  const { user } = useAuth();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-petal text-brand-800">
          <UserRound className="h-6 w-6" />
        </span>
      ) : (
        <LogoMark size={48} id="logo-greet" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink-soft">{now ? greet(now.getHours()) : "Hello"}</p>
        <p className="truncate text-lg font-bold">{user ? user.displayName : "Welcome to Legally Blonde"}</p>
      </div>
      <Link href="/chat" className="icon-btn" aria-label="Messages">
        <Bell className="h-5 w-5" />
      </Link>
    </div>
  );
}

export function TodayLabel() {
  const [txt, setTxt] = useState("Today");
  useEffect(() => {
    setTxt(
      "Today, " +
        new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    );
  }, []);
  return <>{txt}</>;
}
