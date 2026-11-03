"use client";

import Link from "next/link";
import { useState } from "react";
import { Inbox, ShieldCheck, MessagesSquare, Send, Check, X, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PageHeader, Empty } from "@/components/ui";
import { useStored, formatDateTime } from "@/lib/store";
import {
  TICKETS_KEY,
  VERIFY_KEY,
  THREADS_KEY,
  addTicketMessage,
  closeTicket,
  setVerifyStatus,
  deleteThread,
  type Ticket,
  type VerifyRequest,
  type Thread,
} from "@/lib/repos";

export default function AdminPage() {
  const { user, ready } = useAuth();
  const [tab, setTab] = useState<"tickets" | "verify" | "forum">("tickets");
  const [tickets] = useStored<Ticket[]>(TICKETS_KEY, []);
  const [requests] = useStored<VerifyRequest[]>(VERIFY_KEY, []);
  const [threads] = useStored<Thread[]>(THREADS_KEY, []);
  const [reply, setReply] = useState<Record<string, string>>({});

  if (!ready) return null;
  if (user?.role !== "admin")
    return (
      <div className="container-page py-10">
        <Empty title="สำหรับแอดมินเท่านั้น">
          เดโม: <Link href="/login?next=/admin" className="font-semibold text-brand-700 underline">เข้าสู่ระบบ</Link> ด้วยอีเมลที่ขึ้นต้นด้วย admin@
        </Empty>
      </div>
    );

  // Pro ขึ้นก่อน แล้วเรียงตามเวลา
  const queue = [...tickets].sort((a, b) => Number(b.priority) - Number(a.priority) || a.createdAt.localeCompare(b.createdAt));
  const waiting = queue.filter((t) => t.status === "waiting");
  const pendingReq = requests.filter((r) => r.status === "pending");

  const TABS = [
    { k: "tickets" as const, label: "Chat inbox", icon: Inbox, n: waiting.length },
    { k: "verify" as const, label: "Verifications", icon: ShieldCheck, n: pendingReq.length },
    { k: "forum" as const, label: "Moderation", icon: MessagesSquare, n: threads.length },
  ];

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="ตอบแชท อนุมัติผู้ตอบ และดูแลเนื้อหา" crumbs={[{ href: "/admin", label: "Admin" }]} />
      <div className="container-page mt-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${tab === t.k ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
              <span className={`rounded-full px-1.5 text-xs ${tab === t.k ? "bg-white/20" : "bg-white"}`}>{t.n}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {tab === "tickets" &&
            (queue.length === 0 ? (
              <Empty title="ยังไม่มีข้อความ" />
            ) : (
              queue.map((t) => (
                <div key={t.id} className="card p-5">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold">{t.code}</span>
                    {t.priority && <span className="chip !bg-amber-50 !text-amber-800"><Crown className="h-3 w-3" /> Pro · ตอบภายใน 1 ชม.</span>}
                    <span className="text-xs text-ink-mute">{formatDateTime(t.createdAt)}</span>
                    <span className={`ml-auto text-xs ${t.status === "waiting" ? "text-warn" : t.status === "answered" ? "text-ok" : "text-ink-mute"}`}>
                      {t.status === "waiting" ? "รอตอบ" : t.status === "answered" ? "ตอบแล้ว" : "ปิดแล้ว"}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm">
                    {t.messages.map((m) => (
                      <p key={m.id} className={m.from === "admin" ? "rounded-xl bg-brand-50 p-2" : "rounded-xl bg-gray-50 p-2"}>
                        <b>{m.from === "admin" ? "ทีมงาน" : "ผู้ใช้"}:</b> {m.text}
                      </p>
                    ))}
                  </div>
                  {t.status !== "closed" && (
                    <form
                      className="mt-3 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const r = (reply[t.id] || "").trim();
                        if (!r) return;
                        addTicketMessage(t.id, "admin", r);
                        setReply((p) => ({ ...p, [t.id]: "" }));
                      }}
                    >
                      <input value={reply[t.id] || ""} onChange={(e) => setReply((p) => ({ ...p, [t.id]: e.target.value }))} placeholder="พิมพ์คำตอบ" className="input !py-2 text-sm" />
                      <button className="btn-primary !px-3" aria-label="ส่ง"><Send className="h-4 w-4" /></button>
                      <button type="button" onClick={() => closeTicket(t.id)} className="btn-ghost !px-3 text-xs">ปิดเรื่อง</button>
                    </form>
                  )}
                </div>
              ))
            ))}

          {tab === "verify" &&
            (requests.length === 0 ? (
              <Empty title="ยังไม่มีคำขอ" />
            ) : (
              requests.map((r) => (
                <div key={r.id} className="card flex flex-wrap items-center gap-3 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{r.displayName} <span className="text-xs font-normal text-ink-mute">{r.email}</span></p>
                    <p className="text-sm text-ink-soft">
                      {r.method === "lawyer_license" ? "ทนายความ" : r.method === "university_email" ? "นักศึกษา (อีเมลมหาวิทยาลัย)" : "รหัสเชิญ"} · {r.detail}
                    </p>
                    {r.method === "lawyer_license" && (
                      <a href="https://www.lawyerscouncil.or.th" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-700 underline">
                        ตรวจกับระบบค้นหาทนายของสภาทนายความ
                      </a>
                    )}
                  </div>
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => setVerifyStatus(r.id, "approved")} className="btn bg-green-50 text-ok ring-1 ring-green-200"><Check className="h-4 w-4" /> อนุมัติ</button>
                      <button onClick={() => setVerifyStatus(r.id, "rejected")} className="btn-ghost text-danger"><X className="h-4 w-4" /> ปฏิเสธ</button>
                    </div>
                  ) : (
                    <span className={`chip ${r.status === "approved" ? "!bg-green-50 !text-ok" : "!bg-red-50 !text-danger"}`}>{r.status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว"}</span>
                  )}
                </div>
              ))
            ))}

          {tab === "forum" &&
            threads.map((t) => (
              <div key={t.id} className="card flex items-center gap-3 p-4">
                <Link href={`/forum/${t.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.title}</p>
                  <p className="text-xs text-ink-mute">{t.answers.length} คำตอบ · {formatDateTime(t.createdAt)}</p>
                </Link>
                <button onClick={() => confirm("ลบกระทู้นี้?") && deleteThread(t.id)} className="btn-ghost text-danger">ลบ</button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
