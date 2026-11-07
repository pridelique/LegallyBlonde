import Link from "next/link";
import {
  Wallet,
  Clock,
  UserX,
  CalendarDays,
  Sprout,
  ShieldPlus,
  HardHat,
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
import { Orb, Arch, Blob } from "@/components/Decor";
import Workspace from "@/components/home/Workspace";
import KnowledgeSwitcher from "@/components/home/KnowledgeSwitcher";
import { CardHead } from "@/components/ui";
import { PROBLEMS } from "@/lib/data/problems";
import { HOME_HOTLINES, getContact } from "@/lib/data/contacts";

const ID_ICON: Record<string, LucideIcon> = {
  "wage-shortfall": Wallet,
  "overtime-holiday-pay": Clock,
  "holiday-leave-rights": CalendarDays,
  "dismissal-severance": UserX,
  "unsafe-workplace": HardHat,
};

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
  const hotlines = HOME_HOTLINES.map(getContact).filter((c): c is NonNullable<typeof c> => !!c?.hotline);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-tint to-page">
        <Blob id="hero-blob" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 opacity-60" />
        <Orb id="hero-orb" size={240} className="pointer-events-none absolute -right-12 top-4 hidden opacity-70 md:block" />
        <Arch id="hero-arch" size={110} className="pointer-events-none absolute bottom-0 right-[30%] hidden opacity-60 md:block" />
        <div className="container-page relative mt-12 sm:mt-20">
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
            รู้สิทธิ เตรียมหลักฐาน
            <br />
            <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">สู่การทำงานที่เป็นธรรม</span>
          </h1>
          <p className="mt-4 max-w-xl sm:text-lg text-ink-soft">
            Understand your rights at work in plain language, then prepare step by step until you’re ready to contact the right agency — anonymously.</p>
          <div className="mt-2 sm:mt-6 max-w-2xl">
            <SearchBox big />
          </div>
        </div>
      </section>

    <div className="container-page">
      <section className="mt-4 sm:mt-8">
        <BannerCarousel />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Workspace />

          <section className="card-tint p-5 sm:p-6" aria-labelledby="pb-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="pb-title" className="text-lg font-bold">Common problems</h2>
              <Link href="/problems" className="text-sm font-semibold text-brand-800 hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {problems.map((p) => (
                <li key={p.id}>
                  <Link href={`/problems/${p.id}`} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition hover:shadow-soft">
                    <IconCircle icon={ID_ICON[p.id] || GROUP_ICON[p.group] || Wallet} tone="tint" size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.title}</span>
                      <span className="block text-xs text-ink-soft">{p.group}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-mute" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <KnowledgeSwitcher />
          <section className="card-petal p-5 sm:p-6" aria-labelledby="hl-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="hl-title" className="text-lg font-bold">Hotlines</h2>
              <Link href="/contacts" className="text-sm font-semibold text-brand-800 hover:underline">
                All contacts
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {hotlines.map((c) => (
                <li key={c.id}>
                  <a href={`tel:${c.hotline!.number}`} className="flex h-full flex-col gap-2.5 rounded-2xl bg-white/80 p-3 transition hover:bg-white sm:gap-3 sm:p-4">
                    <IconCircle icon={Phone} tone="tint" size="sm" />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-1">
                        <span className="text-lg font-bold tabular-nums sm:text-xl">{c.hotline!.number}</span>
                        {c.hotline!.ext && <span className="whitespace-nowrap text-xs font-semibold text-brand-800">{c.hotline!.ext}</span>}
                      </span>
                      <span className="block text-[11px] leading-tight text-ink-soft sm:text-xs">{c.name}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 text-white shadow-pop" aria-labelledby="ask-title">
            <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative">
              <h2 id="ask-title" className="text-xl font-bold text-white">Not sure where to start?</h2>
              <p className="mt-1 text-sm text-white/85">ถาม chatbot เพื่อรับคำตอบทันที หรือตั้งกระทู้โดยไม่ระบุตัวตน</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/chat" className="btn bg-white text-brand-800 hover:bg-brand-50">
                  <MessageCircle className="h-4 w-4" />Ask chatbot
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
    </>
  );
}
