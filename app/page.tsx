import Link from "next/link";
import { BookOpen, SearchCheck, Route, MessageCircleHeart, MessagesSquare, Phone, ArrowRight } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import BannerCarousel from "@/components/BannerCarousel";
import ContactCard from "@/components/ContactCard";
import { Flower, Blob } from "@/components/Decor";
import { PROBLEMS } from "@/lib/data/problems";
import { CONTACTS } from "@/lib/data/contacts";

const FEATURES = [
  { href: "/knowledge", icon: BookOpen, title: "คลังความรู้", text: "สิทธิแรงงานสรุปสั้น อ่านง่าย มีแหล่งอ้างอิง" },
  { href: "/problems", icon: SearchCheck, title: "ค้นหาปัญหา", text: "พิมพ์ด้วยคำของตัวเอง ระบบหาเรื่องที่ใกล้ที่สุดให้" },
  { href: "/roadmap", icon: Route, title: "Roadmap", text: "พาทำทีละขั้น ตั้งแต่เช็คปัญหาจนยื่นเรื่อง" },
  { href: "/chat", icon: MessageCircleHeart, title: "แชทบอท", text: "กดเลือกคำถาม ได้คำตอบทันที หรือพิมพ์ถามแอดมิน" },
  { href: "/forum", icon: MessagesSquare, title: "กระทู้ถามตอบ", text: "ถามแบบไม่ระบุตัวตน ตอบโดยผู้ใช้ที่ยืนยันตัวตน" },
  { href: "/contacts", icon: Phone, title: "ช่องทางติดต่อ", text: "รวมหน่วยงานรัฐ กฎหมาย และองค์กรแรงงาน" },
];

export default function Home() {
  const featuredProblems = PROBLEMS.slice(0, 6);
  const ministry = CONTACTS.filter((c) => c.sector === "ministry");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream">
        <Blob id="hero-blob" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 opacity-70" />
        <Flower id="hero-f1" size={220} className="pointer-events-none absolute -right-10 top-6 hidden animate-floaty opacity-80 md:block" />
        <Flower id="hero-f2" size={90} petals={5} className="pointer-events-none absolute right-60 top-48 hidden opacity-60 md:block" from="#FDE68A" to="#FB923C" center="#FFF7ED" />
        <Flower id="hero-f3" size={60} petals={8} className="pointer-events-none absolute bottom-6 left-[45%] opacity-50" from="#E9D5FF" to="#F9A8D4" />
        <div className="container-page relative py-14 sm:py-20">
          <span className="chip">สำหรับนักเรียน นักศึกษาทำงานพิเศษ ลูกจ้างรายวัน และคนเริ่มทำงาน</span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            รู้สิทธิ เตรียมหลักฐาน
            <br />
            <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">ไม่ต้องสู้คนเดียว</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            อธิบายกฎหมายแรงงานด้วยภาษาง่าย ๆ และพาเตรียมตัวทีละขั้นจนพร้อมติดต่อหน่วยงาน ใช้ได้โดยไม่ต้องเปิดเผยตัวตน
          </p>
          <div className="mt-6">
            <SearchBox big />
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container-page -mt-4">
        <BannerCarousel />
      </section>

      {/* Features */}
      <section className="container-page mt-14">
        <h2 className="text-xl font-bold sm:text-2xl">ทุกอย่างที่ต้องใช้ อยู่ในที่เดียว</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="card group p-5 transition hover:-translate-y-0.5 hover:ring-brand-200">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800">
                <f.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold">{f.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{f.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Common problems */}
      <section className="container-page mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold sm:text-2xl">ปัญหาที่พบบ่อย</h2>
          <Link href="/problems" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {featuredProblems.map((p) => (
            <Link key={p.id} href={`/problems/${p.id}`} className="card p-5 transition hover:ring-brand-200">
              <span className="chip">{p.group}</span>
              <p className="mt-2 font-semibold">{p.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <section className="container-page mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">ช่องทางติดต่อกระทรวงแรงงาน</h2>
            <p className="mt-1 text-sm text-ink-soft">และหน่วยงานทุกภาคส่วนที่เกี่ยวข้อง</p>
          </div>
          <Link href="/contacts" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {ministry.map((c) => (
            <ContactCard key={c.id} c={c} />
          ))}
        </div>
      </section>
    </>
  );
}
