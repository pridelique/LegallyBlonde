import Link from "next/link";
import {
  Wallet,
  Clock,
  UserX,
  CalendarDays,
  Sprout,
  ShieldPlus,
  Laptop,
  ChevronRight,
  Phone,
  MessageCircle,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import SearchBox from "@/components/SearchBox";
import BannerCarousel from "@/components/BannerCarousel";
import IconCircle from "@/components/IconCircle";
import Greeting from "@/components/home/Greeting";
import Workspace from "@/components/home/Workspace";
import KnowledgeSwitcher from "@/components/home/KnowledgeSwitcher";
import { CardHead } from "@/components/ui";
import { PROBLEMS } from "@/lib/data/problems";
import { CONTACTS } from "@/lib/data/contacts";

const GROUP_ICON: Record<string, LucideIcon> = {
  ค่าจ้าง: Wallet,
  เวลาทำงาน: Clock,
  การเลิกจ้าง: UserX,
  วันหยุดและวันลา: CalendarDays,
  เริ่มต้น: Sprout,
  ประกันสังคม: ShieldPlus,
  แรงงานนอกระบบ: Laptop,
};

export default function Home() {
  const problems = PROBLEMS.slice(0, 6);
  const hotlines = CONTACTS.filter((c) => c.sector === "ministry");

  return (
    <div className="container-page pt-2">
      {/* ───────── ส่วนบน ───────── */}
      <section className="grid items-center gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Greeting />
        <SearchBox big />
      </section>

      <section className="mt-6">
        <BannerCarousel />
      </section>

      {/* ───────── Dashboard ───────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Workspace />

          {/* ปัญหาที่พบบ่อย */}
          <section className="card p-5 sm:p-6" aria-labelledby="pb-title">
            <CardHead
              title="Common problems"
              action={
                <Link href="/problems" className="text-sm font-semibold text-brand-800 hover:underline">
                  View all {PROBLEMS.length}
                </Link>
              }
            />
            <ul className="mt-4 space-y-2.5">
              {problems.map((p) => (
                <li key={p.id}>
                  <Link href={`/problems/${p.id}`} className="group flex items-center gap-4 rounded-2xl bg-page px-4 py-3 transition hover:bg-tint">
                    <IconCircle icon={GROUP_ICON[p.group] || Wallet} tone="white" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium leading-snug">{p.title}</span>
                      <span className="block text-xs text-ink-soft">{p.group}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-ink-mute transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <KnowledgeSwitcher />

          {/* สายด่วน */}
          <section className="card p-5 sm:p-6" aria-labelledby="hl-title">
            <CardHead
              title="Hotlines"
              action={
                <Link href="/contacts" className="text-sm font-semibold text-brand-800 hover:underline">
                  All contacts
                </Link>
              }
            />
            <ul className="mt-4 space-y-2.5">
              {hotlines.map((c) => {
                const main = c.id === "dlpw" && c.line ? `LINE ${c.line}` : c.phone || c.line || "";
                return (
                  <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-page px-4 py-3">
                    <IconCircle icon={Phone} tone="tint" size="sm" />
                    <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{c.name}</span>
                    {c.phone && c.id !== "dlpw" ? (
                      <a href={`tel:${c.phone}`} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-base font-bold tabular-nums text-brand-800 shadow-soft hover:bg-brand-50">
                        {main}
                      </a>
                    ) : (
                      <span className="shrink-0 text-sm font-bold text-brand-800">{main}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ถาม */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 text-white shadow-pop" aria-labelledby="ask-title">
            <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative">
              <h2 id="ask-title" className="text-xl font-bold text-white">Not sure where to start?</h2>
              <p className="mt-1 text-sm text-white/85">ถามน้องบลอนด์เพื่อรับคำตอบทันที หรือตั้งกระทู้โดยไม่ต้องบอกว่าเป็นใคร</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/chat" className="btn bg-white text-brand-800 hover:bg-brand-50">
                  <MessageCircle className="h-4 w-4" /> Ask Blonde
                </Link>
                <Link href="/forum/new" className="btn bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25">
                  <MessagesSquare className="h-4 w-4" /> New post
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
