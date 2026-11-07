"use client";

/**
 * Repository ของแต่ละฟีเจอร์ (ตอนนี้ใช้ localStorage)
 * TODO(supabase): แทนที่ฟังก์ชันในไฟล์นี้ด้วย query ไป Supabase
 *   roadmaps        → ตาราง roadmap_progress (user_id, problem_id, data jsonb)
 *   tickets         → ตาราง chat_tickets + chat_messages
 *   threads/answers → ตาราง forum_threads + forum_answers (RLS: insert answers เฉพาะ role verified)
 *   verify requests → ตาราง verification_requests
 *   form drafts     → เก็บในเครื่องต่อไปได้ (ข้อมูลอ่อนไหว)
 */

import { readLS, writeLS, uid, deviceId, maskPII } from "./store";
import { SEED_THREADS } from "./data/misc";
import type { VerifiedType } from "./auth";

/* ───────────── Roadmap (F_03) ───────────── */

export interface RoadmapProgress {
  problemId: string;
  startedAt: string;
  updatedAt: string;
  /** 1–4 = ขั้นที่กำลังทำ, 5 = เสร็จแล้ว */
  step: number;
  symptoms: number[];
  status: {
    answers?: Record<string, number>;
    lastIncidentDate?: string;
  };
  evidence: number[];
  contacted: string[];
  completedAt?: string;
}

export const ROADMAP_KEY = "roadmaps";

export function newProgress(problemId: string): RoadmapProgress {
  const now = new Date().toISOString();
  return { problemId, startedAt: now, updatedAt: now, step: 1, symptoms: [], status: {}, evidence: [], contacted: [] };
}

/* ───────────── Chat tickets (F_04) ───────────── */

export interface TicketMessage {
  id: string;
  from: "user" | "admin";
  text: string;
  at: string;
}

export interface Ticket {
  id: string;
  code: string;
  ownerId: string;
  status: "waiting" | "answered" | "closed";
  priority: boolean;
  createdAt: string;
  messages: TicketMessage[];
}

export const TICKETS_KEY = "tickets";

export function createTicket(text: string, ownerId: string, priority: boolean): Ticket {
  const { text: safe } = maskPII(text);
  const now = new Date().toISOString();
  const t: Ticket = {
    id: uid("tk_"),
    code: "LB-" + Math.floor(1000 + Math.random() * 9000),
    ownerId,
    status: "waiting",
    priority,
    createdAt: now,
    messages: [{ id: uid("m_"), from: "user", text: safe, at: now }],
  };
  writeLS(TICKETS_KEY, [t, ...readLS<Ticket[]>(TICKETS_KEY, [])]);
  return t;
}

export function addTicketMessage(ticketId: string, from: "user" | "admin", text: string) {
  const { text: safe } = maskPII(text);
  const list = readLS<Ticket[]>(TICKETS_KEY, []).map((t) =>
    t.id === ticketId
      ? {
          ...t,
          status: from === "admin" ? ("answered" as const) : ("waiting" as const),
          messages: [...t.messages, { id: uid("m_"), from, text: safe, at: new Date().toISOString() }],
        }
      : t
  );
  writeLS(TICKETS_KEY, list);
}

export function closeTicket(ticketId: string) {
  writeLS(
    TICKETS_KEY,
    readLS<Ticket[]>(TICKETS_KEY, []).map((t) => (t.id === ticketId ? { ...t, status: "closed" as const } : t))
  );
}

export { deviceId };

/* ───────────── Forum (F_05) ───────────── */

export interface Answer {
  id: string;
  authorName: string;
  verifiedType: VerifiedType;
  body: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  answers: Answer[];
  /** token ให้เจ้าของกระทู้ (anonymous) ลบ/แก้ได้ */
  ownerToken?: string;
}

export const THREADS_KEY = "threads";

export function loadThreads(): Thread[] {
  const stored = readLS<Thread[] | null>(THREADS_KEY, null);
  if (stored) return stored;
  writeLS(THREADS_KEY, SEED_THREADS);
  return SEED_THREADS as Thread[];
}

export function createThread(title: string, body: string, tags: string[]) {
  const ownerToken = uid("own_");
  const t: Thread = {
    id: uid("t_"),
    title: maskPII(title).text,
    body: maskPII(body).text,
    tags,
    createdAt: new Date().toISOString(),
    answers: [],
    ownerToken,
  };
  writeLS(THREADS_KEY, [t, ...loadThreads()]);
  // เก็บ token ของกระทู้ตัวเองไว้ในเครื่อง
  writeLS("my-threads", [...readLS<string[]>("my-threads", []), t.id]);
  return t;
}

export function addAnswer(threadId: string, a: Omit<Answer, "id" | "createdAt">) {
  const list = loadThreads().map((t) =>
    t.id === threadId
      ? { ...t, answers: [...t.answers, { ...a, body: maskPII(a.body).text, id: uid("a_"), createdAt: new Date().toISOString() }] }
      : t
  );
  writeLS(THREADS_KEY, list);
}

export function deleteThread(threadId: string) {
  writeLS(
    THREADS_KEY,
    loadThreads().filter((t) => t.id !== threadId)
  );
}

/* ───────────── Verification (F_07) ───────────── */

export interface VerifyRequest {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  method: "lawyer_license" | "university_email" | "invite_code";
  type: VerifiedType;
  detail: string;
  org?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const VERIFY_KEY = "verify-requests";

/** เดโม: invite code ขององค์กรพาร์ทเนอร์ */
export const INVITE_CODES: Record<string, string> = {
  "LB-PARTNER-2026": "องค์กรพาร์ทเนอร์ (ตัวอย่าง)",
  "LAWCLINIC-2026": "คลินิกกฎหมาย (ตัวอย่าง)",
};

/** โดเมนอีเมลมหาวิทยาลัยที่อนุญาต (ตัวอย่าง) */
export const ALLOWED_UNI_DOMAINS = ["student.chula.ac.th", "chula.ac.th", "tu.ac.th", "dome.tu.ac.th", "ku.th", "cmu.ac.th"];

export function submitVerify(req: Omit<VerifyRequest, "id" | "status" | "createdAt">, autoApprove = false) {
  const r: VerifyRequest = {
    ...req,
    id: uid("vr_"),
    status: autoApprove ? "approved" : "pending",
    createdAt: new Date().toISOString(),
  };
  writeLS(VERIFY_KEY, [r, ...readLS<VerifyRequest[]>(VERIFY_KEY, [])]);
  return r;
}

export function setVerifyStatus(id: string, status: VerifyRequest["status"]) {
  writeLS(
    VERIFY_KEY,
    readLS<VerifyRequest[]>(VERIFY_KEY, []).map((r) => (r.id === id ? { ...r, status } : r))
  );
}

/** ให้ผลการอนุมัติไปอัปเดต user ที่ login อยู่ (ในเดโมทุกอย่างอยู่ในเครื่องเดียว) */
export function applyApprovedToUser() {
  const user = readLS<import("./auth").User | null>("user", null);
  if (!user || user.role === "admin") return;
  const approved = readLS<VerifyRequest[]>(VERIFY_KEY, []).find((r) => r.userId === user.id && r.status === "approved");
  if (approved && user.role !== "verified") {
    writeLS("user", { ...user, role: "verified", verifiedType: approved.type, verifiedOrg: approved.org });
  }
}
