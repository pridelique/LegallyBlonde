"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, GraduationCap, Building, CheckCircle2, Clock } from "lucide-react";
import { useAuth, type VerifiedType } from "@/lib/auth";
import { PageHeader, Notice } from "@/components/ui";
import { useStored } from "@/lib/store";
import { ALLOWED_UNI_DOMAINS, INVITE_CODES, VERIFY_KEY, submitVerify, applyApprovedToUser, type VerifyRequest } from "@/lib/repos";

type Method = VerifyRequest["method"];

const METHODS: { m: Method; type: VerifiedType; icon: typeof Scale; title: string; text: string }[] = [
  { m: "lawyer_license", type: "lawyer", icon: Scale, title: "ทนายความ", text: "กรอกเลขใบอนุญาตทนายความ" },
  { m: "university_email", type: "law_student", icon: GraduationCap, title: "นักศึกษานิติศาสตร์", text: "ยืนยันด้วยอีเมลมหาวิทยาลัย (ส่งรหัส OTP)" },
  { m: "invite_code", type: "org", icon: Building, title: "องค์กรพาร์ทเนอร์", text: "ใช้รหัสเชิญที่ได้รับจากองค์กร" },
];

export default function VerifyPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [requests] = useStored<VerifyRequest[]>(VERIFY_KEY, []);
  const [method, setMethod] = useState<Method>("lawyer_license");
  const [detail, setDetail] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/verify");
  }, [ready, user, router]);

  if (!user) return <div className="container-page py-16 text-center text-ink-mute">กำลังโหลด…</div>;

  const mine = requests.filter((r) => r.userId === user.id);
  const pending = mine.find((r) => r.status === "pending");
  const cfg = METHODS.find((x) => x.m === method)!;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const base = { userId: user.id, displayName: user.displayName, email: user.email, method, type: cfg.type };

    if (method === "invite_code") {
      const org = INVITE_CODES[detail.trim().toUpperCase()];
      if (!org) return setError("รหัสเชิญไม่ถูกต้อง (เดโม: LB-PARTNER-2026)");
      submitVerify({ ...base, detail: detail.trim().toUpperCase(), org }, true);
      applyApprovedToUser();
      return;
    }

    if (method === "university_email") {
      const domain = detail.split("@")[1]?.toLowerCase();
      if (!domain || !ALLOWED_UNI_DOMAINS.includes(domain)) return setError("ใช้ได้เฉพาะอีเมลมหาวิทยาลัยที่อยู่ในรายชื่อ");
      if (!otpSent) {
        // TODO(supabase): ส่ง OTP ไปที่อีเมลมหาวิทยาลัย
        setOtpSent(true);
        return;
      }
      if (otp !== "123456") return setError("รหัส OTP ไม่ถูกต้อง (เดโม: 123456)");
      // อีเมลยืนยันแล้ว แต่ยังต้องให้แอดมินตรวจว่าเรียนนิติศาสตร์
      submitVerify({ ...base, detail: detail.trim() }, false);
      return;
    }

    if (!/^\d{1,6}\/\d{2,4}$|^\d{3,8}$/.test(detail.trim()) || fullName.trim().length < 4)
      return setError("กรอกชื่อ-นามสกุลตามใบอนุญาต และเลขใบอนุญาต เช่น 12345/2560");
    submitVerify({ ...base, detail: `${fullName.trim()} · ใบอนุญาต ${detail.trim()}` }, false);
  };

  return (
    <>
      <PageHeader
        title="Verify your identity"
        subtitle="ผู้ตอบกระทู้ต้องยืนยันตัวตน"
        crumbs={[{ href: "/forum", label: "Forum" }, { href: "/verify", label: "Verify" }]}
      />
      <div className="container-page mt-6 max-w-3xl space-y-5">
        {user.role !== "user" ? (
          <div className="card p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-ok" />
            <p className="mt-2 text-lg font-bold">ยืนยันตัวตนแล้ว</p>
            <Link href="/forum" className="btn-primary mt-4">ไปตอบกระทู้</Link>
          </div>
        ) : pending ? (
          <div className="card p-8 text-center">
            <Clock className="mx-auto h-10 w-10 text-warn" />
            <p className="mt-2 text-lg font-bold">รอแอดมินตรวจสอบ</p>
            <p className="mt-1 text-sm text-ink-soft">{pending.detail}</p>
            <p className="mt-3 text-xs text-ink-mute">เดโม: เข้าสู่ระบบด้วยอีเมล admin@… แล้วอนุมัติที่หน้าแดชบอร์ดแอดมิน</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {METHODS.map((x) => (
                <button
                  key={x.m}
                  onClick={() => {
                    setMethod(x.m);
                    setDetail("");
                    setError("");
                    setOtpSent(false);
                  }}
                  className={`card p-4 text-left ${method === x.m ? "!ring-2 !ring-brand-500" : ""}`}
                  aria-pressed={method === x.m}
                >
                  <x.icon className="h-5 w-5 text-brand-700" />
                  <p className="mt-2 font-semibold">{x.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{x.text}</p>
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="card space-y-4 p-6">
              {method === "lawyer_license" && (
                <>
                  <div>
                    <label className="label" htmlFor="fn">ชื่อ-นามสกุล (ตามใบอนุญาต)</label>
                    <input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="label" htmlFor="lic">เลขใบอนุญาตทนายความ</label>
                    <input id="lic" value={detail} onChange={(e) => setDetail(e.target.value)} className="input" placeholder="เช่น 12345/2560" />
                  </div>
                </>
              )}
              {method === "university_email" && (
                <>
                  <div>
                    <label className="label" htmlFor="uem">อีเมลมหาวิทยาลัย</label>
                    <input id="uem" type="email" value={detail} onChange={(e) => setDetail(e.target.value)} className="input" placeholder="65xxxxxxxx@student.chula.ac.th" disabled={otpSent} />
                    <p className="mt-1 text-xs text-ink-mute">โดเมนที่รองรับ (ตัวอย่าง): {ALLOWED_UNI_DOMAINS.join(", ")}</p>
                  </div>
                  {otpSent && (
                    <div>
                      <label className="label" htmlFor="otp">รหัส OTP ที่ส่งไปทางอีเมล</label>
                      <input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="input max-w-[12rem]" inputMode="numeric" placeholder="123456" />
                    </div>
                  )}
                </>
              )}
              {method === "invite_code" && (
                <div>
                  <label className="label" htmlFor="code">รหัสเชิญ</label>
                  <input id="code" value={detail} onChange={(e) => setDetail(e.target.value)} className="input uppercase" placeholder="LB-PARTNER-2026" />
                </div>
              )}
              {error && <p className="text-sm text-danger">{error}</p>}
              <button className="btn-primary">
                {method === "university_email" && !otpSent ? "ส่งรหัส OTP" : method === "invite_code" ? "ยืนยัน" : "ส่งคำขอ"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
