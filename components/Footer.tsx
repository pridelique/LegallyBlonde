import Link from "next/link";
import { LogoMark } from "./Decor";

const COLS = [
  {
    title: "Explore",
    links: [
      { href: "/knowledge", label: "Knowledge" },
      { href: "/problems", label: "Problems" },
      { href: "/roadmap", label: "My Roadmaps" },
    ],
  },
  {
    title: "Ask",
    links: [
      { href: "/chat", label: "Chatbot" },
      { href: "/forum", label: "Forum" },
      { href: "/verify", label: "Become a responder" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/contacts", label: "Contacts" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="container-page mt-20 pb-32 md:pb-6">      
      <div className="card grid gap-10 p-8 md:grid-cols-[1.4fr_repeat(3,1fr)] md:p-10">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} id="logo-ft" />
            <span className="text-lg font-bold">Legally Blonde</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            ผู้ช่วยด้านสิทธิแรงงานสำหรับนักเรียน นักศึกษาที่ทำงานพิเศษ ลูกจ้างรายวัน และคนเริ่มทำงาน
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title} className="text-sm">
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-ink-soft">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 rounded-3xl bg-tint px-6 py-4 text-xs text-ink-soft md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl">
          ข้อมูลในเว็บไซต์นี้เป็นข้อมูลทั่วไป ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีเฉพาะ และไม่ใช่การตัดสินข้อกฎหมายแทนผู้เชี่ยวชาญ
        </p>
        <p className="shrink-0">© {new Date().getFullYear()} Legally Blonde</p>
      </div>
    </footer>
  );
}
