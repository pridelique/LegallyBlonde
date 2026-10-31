"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, ShieldAlert } from "lucide-react";
import { PageHeader, Notice } from "@/components/ui";
import { createThread } from "@/lib/repos";
import { maskPII } from "@/lib/store";

const TAGS = ["ค่าจ้าง", "ค่าแรงขั้นต่ำ", "OT", "วันหยุด/วันลา", "เลิกจ้าง", "หักเงิน", "ประกันสังคม", "ฟรีแลนซ์", "ลูกจ้างเด็ก", "part-time"];

export default function NewThread() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  const piiWarning = maskPII(title + " " + body).masked;
  const valid = title.trim().length >= 8 && body.trim().length >= 20 && agree;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // TODO(supabase): ส่งผ่าน API route ที่ตรวจ Cloudflare Turnstile + rate limit ก่อนบันทึก
    const t = createThread(title.trim(), body.trim(), tags);
    router.push(`/forum/${t.id}`);
  };

  return (
    <>
      <PageHeader title="ตั้งกระทู้ใหม่" subtitle="ไม่ต้องเข้าสู่ระบบ และจะไม่แสดงชื่อของคุณ" crumbs={[{ href: "/forum", label: "กระทู้ถามตอบ" }, { href: "/forum/new", label: "ตั้งกระทู้" }]} />
      <form onSubmit={submit} className="container-page mt-6 max-w-3xl space-y-5">
        <div className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="title">หัวข้อ</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="input" placeholder="เช่น ทำงาน part-time 3 เดือน โดนไล่ออกไม่บอกล่วงหน้า" />
          </div>
          <div>
            <label className="label" htmlFor="body">รายละเอียด</label>
            <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={7} maxLength={3000} className="input" placeholder="เล่าสถานการณ์ เช่น ทำงานมานานแค่ไหน ได้ค่าจ้างแบบไหน เกิดอะไรขึ้น" />
            <p className="mt-1 text-right text-xs text-ink-mute">{body.length}/3000</p>
          </div>
          <div>
            <p className="label">หมวดหมู่</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t].slice(0, 3))}
                    className={`rounded-full px-3 py-1.5 text-sm ${on ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {piiWarning && (
          <Notice tone="warn">
            <span className="flex items-start gap-1">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              ดูเหมือนจะมีเลขบัตร เบอร์โทร หรืออีเมลในข้อความ ระบบจะซ่อนให้อัตโนมัติเมื่อโพสต์
            </span>
          </Notice>
        )}

        <div className="card space-y-3 p-5 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <EyeOff className="h-4 w-4 text-brand-700" /> ก่อนโพสต์
          </p>
          <ul className="list-disc space-y-1 pl-5 text-ink-soft">
            <li>อย่าใส่ชื่อจริง ชื่อร้าน หรือข้อมูลที่ระบุตัวบุคคลได้</li>
            <li>เล่าตามข้อเท็จจริง หลีกเลี่ยงการกล่าวหาหรือใช้ถ้อยคำที่อาจเป็นการหมิ่นประมาท</li>
            <li>คำตอบในกระทู้เป็นความเห็นเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีเฉพาะ</li>
          </ul>
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-brand-700" />
            <span>ฉันเข้าใจและยอมรับกติกาการใช้งาน</span>
          </label>
        </div>

        <button className="btn-primary w-full sm:w-auto" disabled={!valid}>
          โพสต์กระทู้
        </button>
        {!valid && <p className="text-xs text-ink-mute">หัวข้ออย่างน้อย 8 ตัวอักษร รายละเอียดอย่างน้อย 20 ตัวอักษร และยอมรับกติกา</p>}
      </form>
    </>
  );
}
