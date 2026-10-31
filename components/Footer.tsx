import Link from "next/link";
import { LogoMark } from "./Decor";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="font-bold text-brand-800">Legally Blonde</span>
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            ผู้ช่วยด้านสิทธิแรงงานสำหรับนักเรียน นักศึกษาที่ทำงานพิเศษ ลูกจ้างรายวัน และคนเริ่มทำงาน
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">เมนู</p>
          <ul className="grid grid-cols-2 gap-1 text-ink-soft">
            <li><Link href="/knowledge" className="hover:text-brand-700">คลังความรู้</Link></li>
            <li><Link href="/problems" className="hover:text-brand-700">ค้นหาปัญหา</Link></li>
            <li><Link href="/roadmap" className="hover:text-brand-700">Roadmap ของฉัน</Link></li>
            <li><Link href="/chat" className="hover:text-brand-700">แชทบอท</Link></li>
            <li><Link href="/forum" className="hover:text-brand-700">กระทู้ถามตอบ</Link></li>
            <li><Link href="/contacts" className="hover:text-brand-700">ช่องทางติดต่อ</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-700">ความเป็นส่วนตัว</Link></li>
          </ul>
        </div>
        <div className="rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-ink-soft">
          <p className="mb-1 font-semibold text-brand-800">ข้อควรทราบ</p>
          ข้อมูลในเว็บไซต์นี้เป็นข้อมูลทั่วไปเพื่อช่วยให้เข้าใจสิทธิและเตรียมตัวเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีเฉพาะ
          และไม่ใช่การตัดสินข้อกฎหมายแทนผู้เชี่ยวชาญ กรุณาตรวจสอบกับหน่วยงานที่เกี่ยวข้องหรือทนายความก่อนดำเนินการ
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-ink-mute">
        © {new Date().getFullYear()} Legally Blonde · โปรเจกต์ต้นแบบสำหรับการแข่งขัน LegalTech
      </div>
    </footer>
  );
}
