"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Bot, Headphones, Clock, CheckCheck, Crown, ArrowRight } from "lucide-react";
import { CHAT_START, CHAT_TREE, type ChatOption } from "@/lib/data/chatbot";
import { PROBLEMS } from "@/lib/data/problems";
import { createIndex } from "@/lib/search";
import { useAuth } from "@/lib/auth";
import { useStored, formatDateTime, deviceId } from "@/lib/store";
import { TICKETS_KEY, createTicket, addTicketMessage, type Ticket } from "@/lib/repos";
import { LogoMark } from "@/components/Decor";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
  options?: ChatOption[];
  refs?: string[];
  links?: { href: string; label: string }[];
}

const problemIndex = createIndex(PROBLEMS, (p) => ({ title: p.title, keywords: p.keywords, body: p.summary }));

let counter = 0;
const botMsg = (node: string): Msg => {
  const n = CHAT_TREE[node];
  return { id: ++counter, from: "bot", text: n.text, options: n.options, refs: n.refs };
};

export default function ChatPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"bot" | "admin">("bot");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [tickets] = useStored<Ticket[]>(TICKETS_KEY, []);
  const [owner, setOwner] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([botMsg(CHAT_START)]);
  }, []);
  useEffect(() => {
    setOwner(user?.id || deviceId());
  }, [user]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, tab]);

  const myTickets = useMemo(() => tickets.filter((t) => t.ownerId === owner), [tickets, owner]);
  const unread = myTickets.filter((t) => t.status === "answered").length;
  const isPro = user?.plan === "pro";

  const choose = (o: ChatOption) => {
    if (o.href) return; // จัดการด้วย <Link>
    if (!o.next) return;
    setMsgs((m) => [...m, { id: ++counter, from: "user", text: o.label }, botMsg(o.next!)]);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    const t = createTicket(q, owner, isPro);
    const related = problemIndex.search(q, 3);
    setMsgs((m) => [
      ...m,
      { id: ++counter, from: "user", text: q },
      {
        id: ++counter,
        from: "bot",
        text: `ส่งคำถามถึงทีมงานแล้วค่ะ (รหัส ${t.code}) ${
          isPro ? "สมาชิก Pro จะได้รับคำตอบภายใน 1 ชั่วโมง" : "ปกติทีมงานจะตอบภายใน 48 ชั่วโมง"
        } ดูคำตอบได้ที่แท็บ “Messages”${related.mode === "match" ? "\n\nระหว่างรอ ลองดูเรื่องที่อาจเกี่ยวข้องค่ะ" : ""}`,
        links: related.mode === "match" ? related.results.map((r) => ({ href: `/problems/${r.item.id}`, label: r.item.title })) : undefined,
        options: [{ label: "กลับไปเมนูหลัก", next: CHAT_START }],
      },
    ]);
    setText("");
  };

  return (
    <div className="container-page py-6">
      <div className="card mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-brand-100 bg-gradient-to-r from-brand-50 to-white px-5 py-3">
          <LogoMark id="chat-avatar" size={40} />
          <div className="flex-1">
            <p className="font-semibold">Blonde · Assistant</p>
            <p className="text-xs text-ink-mute">ตอบจากข้อมูลที่ทีมงานเตรียมไว้ · ไม่ใช่คำปรึกษาทางกฎหมาย</p>
          </div>
        </div>
        <div className="flex border-b border-brand-100 text-sm">
          <button onClick={() => setTab("bot")} className={`flex flex-1 items-center justify-center gap-1 py-2.5 ${tab === "bot" ? "border-b-2 border-brand-700 font-semibold text-brand-800" : "text-ink-mute"}`}>
            <Bot className="h-4 w-4" /> Chatbot
          </button>
          <button onClick={() => setTab("admin")} className={`flex flex-1 items-center justify-center gap-1 py-2.5 ${tab === "admin" ? "border-b-2 border-brand-700 font-semibold text-brand-800" : "text-ink-mute"}`}>
            <Headphones className="h-4 w-4" /> Messages
            {unread > 0 && <span className="rounded-full bg-brand-700 px-1.5 text-[10px] text-white">{unread}</span>}
          </button>
        </div>

        {/* body */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-cream p-4">
          {tab === "bot" ? (
            msgs.map((m, idx) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${m.from === "user" ? "rounded-2xl rounded-br-sm bg-brand-700 px-4 py-2.5 text-white" : ""}`}>
                  {m.from === "bot" ? (
                    <div>
                      <div className="whitespace-pre-line rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-brand-100">
                        {m.text}
                        {m.refs && <p className="mt-2 text-xs text-ink-mute">อ้างอิง: {m.refs.join(", ")}</p>}
                      </div>
                      {m.links && (
                        <div className="mt-2 space-y-1.5">
                          {m.links.map((l) => (
                            <Link key={l.href} href={l.href} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-brand-100 hover:bg-brand-50">
                              {l.label} <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}
                      {m.options && idx === msgs.length - 1 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.options.map((o) =>
                            o.href ? (
                              <Link key={o.label} href={o.href} className="rounded-full bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800">
                                {o.label}
                              </Link>
                            ) : (
                              <button key={o.label} onClick={() => choose(o)} className="rounded-full bg-white px-3 py-1.5 text-sm text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
                                {o.label}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))
          ) : (
            <AdminThreads tickets={myTickets} />
          )}
          <div ref={endRef} />
        </div>

        {/* input */}
        {tab === "bot" && (
          <form onSubmit={send} className="border-t border-brand-100 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="พิมพ์คำถามเพื่อส่งให้ทีมงานตอบ"
                className="input !rounded-full"
                maxLength={1000}
              />
              <button className="btn-primary !p-3" aria-label="ส่ง" disabled={!text.trim()}>
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 flex items-center gap-1 px-2 text-[11px] text-ink-mute">
              <Clock className="h-3 w-3" />
              {isPro ? "Pro: ตอบภายใน 1 ชั่วโมง" : "ทีมงานตอบภายใน 48 ชั่วโมง"} · อย่าใส่ชื่อจริง เลขบัตร หรือเบอร์โทร (ระบบจะซ่อนให้อัตโนมัติ)
              {!isPro && (
                <Link href="/account" className="ml-auto flex items-center gap-0.5 font-semibold text-brand-700">
                  <Crown className="h-3 w-3" /> Pro
                </Link>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function AdminThreads({ tickets }: { tickets: Ticket[] }) {
  const [reply, setReply] = useState<Record<string, string>>({});
  if (!tickets.length)
    return <p className="py-10 text-center text-sm text-ink-mute">ยังไม่มีข้อความถึงแอดมิน พิมพ์คำถามในแท็บแชทบอทได้เลย</p>;
  return (
    <div className="space-y-4">
      {tickets.map((t) => (
        <div key={t.id} className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-800">
              {t.code} {t.priority && <span className="chip ml-1 !py-0">Pro</span>}
            </span>
            <span className={t.status === "answered" ? "flex items-center gap-1 text-ok" : "flex items-center gap-1 text-warn"}>
              {t.status === "answered" ? <CheckCheck className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {t.status === "answered" ? "ตอบแล้ว" : t.status === "closed" ? "ปิดแล้ว" : "รอแอดมินตอบ"}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {t.messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-brand-700 text-white" : "bg-brand-50"}`}>
                  {m.from === "admin" && <p className="mb-0.5 text-[11px] font-semibold text-brand-800">ทีมงาน</p>}
                  <p className="whitespace-pre-line">{m.text}</p>
                  <p className={`mt-0.5 text-[10px] ${m.from === "user" ? "text-brand-100" : "text-ink-mute"}`}>{formatDateTime(m.at)}</p>
                </div>
              </div>
            ))}
          </div>
          {t.status !== "closed" && (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const r = (reply[t.id] || "").trim();
                if (!r) return;
                addTicketMessage(t.id, "user", r);
                setReply((p) => ({ ...p, [t.id]: "" }));
              }}
            >
              <input value={reply[t.id] || ""} onChange={(e) => setReply((p) => ({ ...p, [t.id]: e.target.value }))} placeholder="ส่งข้อความเพิ่มเติม" className="input !py-2 text-sm" />
              <button className="btn-soft !px-3" aria-label="ส่ง">
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
