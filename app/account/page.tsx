"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Crown, LogOut, Route, LayoutDashboard, Check } from "lucide-react";
import { useAuth, VERIFIED_LABEL } from "@/lib/auth";
import { PageHeader, Notice } from "@/components/ui";
import { applyApprovedToUser } from "@/lib/repos";

const ROLE_LABEL = { user: "ผู้ใช้ทั่วไป", verified: "ผู้ใช้ยืนยันตัวตน", admin: "แอดมิน" } as const;

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout, updateUser } = useAuth();

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/account");
    if (ready && user) applyApprovedToUser();
  }, [ready, user, router]);

  if (!user) return <div className="container-page py-16 text-center text-ink-mute">กำลังโหลด…</div>;

  return (
    <>
      <PageHeader title={`สวัสดี ${user.displayName}`} subtitle={user.email} crumbs={[{ href: "/account", label: "บัญชีของฉัน" }]} />
      <div className="container-page mt-6 grid gap-4 md:grid-cols-2">
        <section className="card p-6">
          <p className="text-sm text-ink-mute">สถานะบัญชี</p>
          <p className="mt-1 flex items-center gap-2 text-lg font-bold">
            {user.role !== "user" && <ShieldCheck className="h-5 w-5 text-ok" />}
            {ROLE_LABEL[user.role]}
          </p>
          {user.verifiedType && (
            <p className="mt-1 text-sm text-ink-soft">
              {VERIFIED_LABEL[user.verifiedType]}
              {user.verifiedOrg ? ` · ${user.verifiedOrg}` : ""}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {user.role === "user" && (
              <Link href="/verify" className="btn-soft">
                <ShieldCheck className="h-4 w-4" /> ยืนยันตัวตนเพื่อตอบกระทู้
              </Link>
            )}
            {user.role === "admin" && (
              <Link href="/admin" className="btn-primary">
                <LayoutDashboard className="h-4 w-4" /> แดชบอร์ดแอดมิน
              </Link>
            )}
            <Link href="/roadmap" className="btn-soft">
              <Route className="h-4 w-4" /> Roadmap ของฉัน
            </Link>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-100 to-amber-50 p-6">
            <p className="flex items-center gap-2 text-lg font-bold">
              <Crown className="h-5 w-5 text-amber-600" /> Legally Blonde Pro
            </p>
            <p className="text-sm text-ink-soft">{user.plan === "pro" ? "คุณเป็นสมาชิก Pro" : "แพ็กเกจเสริม (ตัวอย่างสำหรับต้นแบบ)"}</p>
          </div>
          <div className="p-6">
            <ul className="space-y-1.5 text-sm">
              {["แอดมินตอบแชทภายใน 1 ชั่วโมง", "คิวตอบกระทู้แบบเร่งด่วน", "สำรองข้อมูล Roadmap และแบบฟอร์มบนคลาวด์ (เข้ารหัส)"].map((b) => (
                <li key={b} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {b}
                </li>
              ))}
            </ul>
            <button onClick={() => updateUser({ plan: user.plan === "pro" ? "free" : "pro" })} className="btn-primary mt-4">
              {user.plan === "pro" ? "ยกเลิก Pro (เดโม)" : "ทดลองเปิด Pro (เดโม)"}
            </button>
            <p className="mt-2 text-xs text-ink-mute">ยังไม่มีระบบชำระเงิน · TODO: เชื่อม Omise/Stripe (PromptPay)</p>
          </div>
        </section>

        <div className="md:col-span-2">
          <Notice>ข้อมูลที่ใช้ในเดโมนี้เก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น</Notice>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="btn-ghost mt-4 text-danger"
          >
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </div>
      </div>
    </>
  );
}
