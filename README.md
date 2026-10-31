# Legally Blonde · ต้นแบบเว็บสิทธิแรงงาน

Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
ยังไม่มี database: ข้อมูลทั้งหมดเก็บใน `localStorage` ของเบราว์เซอร์ เพื่อให้เดโมได้ทันที

## เริ่มใช้งาน

```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

ต้องใช้ Node.js 18.17 ขึ้นไป

## บัญชีเดโม

| ต้องการทดลอง | ทำอย่างไร |
|---|---|
| ผู้ใช้ทั่วไป | `/login` ใส่อีเมลอะไรก็ได้ |
| แอดมิน (ตอบแชท, อนุมัติผู้ตอบ, ลบกระทู้) | `/login` ด้วยอีเมลที่ขึ้นต้นด้วย `admin@` |
| ผู้ตอบกระทู้ (verified) | `/verify` → องค์กรพาร์ทเนอร์ → รหัสเชิญ `LB-PARTNER-2026` |
| นักศึกษานิติ | `/verify` → อีเมล `@student.chula.ac.th` → OTP `123456` → รอแอดมินอนุมัติ |
| Pro | หน้า `/account` → ทดลองเปิด Pro (แชทถึงแอดมินจะถูกจัดเป็นคิวด่วน) |

> ทุกอย่างอยู่ในเบราว์เซอร์เดียว ถ้าอยากทดลองแอดมินตอบแชท ให้ส่งข้อความจาก `/chat` → ออกจากระบบ → เข้าด้วย `admin@...` → `/admin`

## ฟีเจอร์ตาม Feature sheet

| ID | ฟีเจอร์ | ไฟล์หลัก |
|---|---|---|
| F_00 | Navbar, ค้นหา, banner เลื่อน, ช่องทางติดต่อกระทรวง/ทุกภาคส่วน, โลโก้ | `app/page.tsx`, `components/Navbar.tsx`, `components/BannerCarousel.tsx`, `app/contacts` |
| F_01 | คลังความรู้: เลือกแรงงานทั่วไป/นอกระบบ → เลือกเรื่อง, สรุปสั้น + อธิบายยาว + อ้างอิง | `app/knowledge`, `lib/data/knowledge.ts` |
| F_02 | ค้นหาปัญหา เรียงตามความเกี่ยวข้อง ถ้าไม่เจอหาสิ่งที่คล้ายกัน | `app/problems`, `lib/search.ts` |
| F_03 | Roadmap 4 ขั้น + Completed + ประวัติ, template ต่อปัญหา, แบบฟอร์มแก้ในเว็บ/autosave/PDF/เซฟไฟล์ | `components/RoadmapRunner.tsx`, `lib/data/problems.ts`, `components/FormEditor.tsx`, `lib/forms.ts` |
| F_04 | Rule-based chatbot + พิมพ์ถามแล้วรอแอดมินตอบ | `app/chat`, `lib/data/chatbot.ts`, `app/admin` |
| F_05 | กระทู้ ถามแบบ anonymous ตอบเฉพาะ verified | `app/forum` |
| F_06 | Login (จำลอง) | `lib/auth.tsx`, `app/login` |
| F_07 | Role + verification (ทนาย / อีเมลมหาลัย / รหัสเชิญ) + Pro | `app/verify`, `app/account`, `app/admin` |

## แก้เนื้อหา (สำหรับทีม legal)

เนื้อหาทั้งหมดอยู่ใน `lib/data/` แก้ได้โดยไม่ต้องแตะ UI

- `knowledge.ts` หัวข้อความรู้
- `problems.ts` ปัญหา + template Roadmap (อาการ, อายุความ, หลักฐาน, หน่วยงาน, สิ่งที่ทำระหว่างรอ)
- `chatbot.ts` ต้นไม้คำถาม-คำตอบของแชทบอท
- `contacts.ts` ช่องทางติดต่อ
- `misc.ts` banner, ตารางคำพ้องของ search, กระทู้ตัวอย่าง

⚠️ เนื้อหากฎหมาย ตัวเลข อายุความ และช่องทางติดต่อเป็น **ร่างสำหรับต้นแบบ** ต้องให้ทีมกฎหมายตรวจทานก่อนเผยแพร่จริง

## ต่อ Supabase

หน้าเว็บเรียกข้อมูลผ่าน `lib/auth.tsx`, `lib/repos.ts`, `lib/store.ts` เท่านั้น ตอนต่อ Supabase ให้แก้แค่ไฟล์ใน `lib/` ดูแผนตารางและ RLS ได้ที่ `docs/supabase-plan.md`
