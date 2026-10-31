"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Flower } from "@/components/Decor";
import { Notice } from "@/components/ui";
import { applyApprovedToUser } from "@/lib/repos";

function LoginInner() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/account";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // TODO(supabase): supabase.auth.signInWithOtp({ email }) แล้วรอผู้ใช้กดลิงก์ในอีเมล
    setSent(true);
    setTimeout(() => {
      login(email.trim(), name.trim());
      applyApprovedToUser();
      router.push(next);
    }, 700);
  };

  return (
    <div className="container-page relative flex min-h-[70vh] items-center justify-center py-10">
      <Flower id="login-f1" size={180} className="pointer-events-none absolute left-0 top-10 hidden opacity-60 md:block" />
      <Flower id="login-f2" size={110} petals={5} className="pointer-events-none absolute bottom-10 right-10 hidden opacity-60 md:block" from="#FDE68A" to="#F9A8D4" />
      <div className="card relative w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>
        <p className="mt-1 text-sm text-ink-soft">เพื่อเก็บความคืบหน้า Roadmap ไม่ให้หาย และใช้งานได้หลายอุปกรณ์</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">อีเมล</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="name">ชื่อที่แสดง (ไม่ต้องใช้ชื่อจริง)</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="เช่น มะลิ" />
          </div>
          <button className="btn-primary w-full" disabled={!valid || sent}>
            <Mail className="h-4 w-4" /> {sent ? "กำลังเข้าสู่ระบบ…" : "รับลิงก์เข้าสู่ระบบทางอีเมล"}
          </button>
        </form>

        <div className="mt-6">
          <Notice>
            โหมดเดโม: ยังไม่ได้เชื่อมฐานข้อมูล ระบบจะเข้าสู่ระบบทันทีโดยไม่ส่งอีเมล ใช้อีเมลที่ขึ้นต้นด้วย <b>admin@</b> เพื่อทดลองสิทธิ์แอดมิน
          </Notice>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
