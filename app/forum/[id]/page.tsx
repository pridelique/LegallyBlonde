"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeOff, ShieldCheck, Flag, Trash2, Lock } from "lucide-react";
import { PageHeader, Empty, Notice } from "@/components/ui";
import { useStored, readLS, formatDateTime } from "@/lib/store";
import { THREADS_KEY, loadThreads, addAnswer, deleteThread, type Thread } from "@/lib/repos";
import { useAuth, canAnswer, VERIFIED_LABEL } from "@/lib/auth";

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [threads, , ready] = useStored<Thread[]>(THREADS_KEY, []);
  const [answer, setAnswer] = useState("");
  const [mine, setMine] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    loadThreads();
    setMine(readLS<string[]>("my-threads", []).includes(id));
  }, [id]);

  const t = threads.find((x) => x.id === id);

  if (ready && !t) {
    return (
      <div className="container-page py-10">
        <Empty title="ไม่พบกระทู้นี้">
          <Link href="/forum" className="btn-soft mt-2">กลับไปหน้ากระทู้</Link>
        </Empty>
      </div>
    );
  }
  if (!t) return <div className="container-page py-16 text-center text-ink-mute">กำลังโหลด…</div>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canAnswer(user) || answer.trim().length < 10) return;
    addAnswer(t.id, {
      authorName: user.displayName,
      verifiedType: user.verifiedType || "org",
      body: answer.trim(),
    });
    setAnswer("");
  };

  return (
    <>
      <PageHeader title={t.title} crumbs={[{ href: "/forum", label: "กระทู้ถามตอบ" }]}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-mute">
          <EyeOff className="h-3.5 w-3.5" /> ผู้ใช้ไม่ระบุตัวตน · {formatDateTime(t.createdAt)}
          {t.tags.map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
      </PageHeader>

      <div className="container-page mt-6 max-w-3xl space-y-6">
        <article className="card p-6">
          <p className="whitespace-pre-line">{t.body}</p>
          <div className="mt-4 flex gap-2 text-xs">
            <button onClick={() => setReported(true)} disabled={reported} className="btn-ghost !px-2 !py-1 text-ink-mute">
              <Flag className="h-3.5 w-3.5" /> {reported ? "รายงานแล้ว" : "รายงาน"}
            </button>
            {(mine || user?.role === "admin") && (
              <button
                onClick={() => {
                  if (!confirm("ลบกระทู้นี้?")) return;
                  deleteThread(t.id);
                  router.push("/forum");
                }}
                className="btn-ghost !px-2 !py-1 text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" /> ลบกระทู้{mine ? "ของฉัน" : ""}
              </button>
            )}
          </div>
        </article>

        <section>
          <h2 className="mb-3 font-bold">{t.answers.length} คำตอบ</h2>
          <div className="space-y-3">
            {t.answers.length === 0 && <p className="text-sm text-ink-mute">ยังไม่มีคำตอบ ผู้ตอบที่ยืนยันตัวตนแล้วจะได้รับแจ้งเตือน</p>}
            {t.answers.map((a) => (
              <div key={a.id} className="card p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold">{a.authorName}</span>
                  <span className="chip !bg-green-50 !text-ok">
                    <ShieldCheck className="h-3.5 w-3.5" /> {VERIFIED_LABEL[a.verifiedType]}
                  </span>
                  <span className="text-xs text-ink-mute">{formatDateTime(a.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-ink-soft">{a.body}</p>
                {a.verifiedType === "law_student" && <p className="mt-2 text-xs text-warn">คำตอบจากนักศึกษา ยังไม่ผ่านการตรวจโดยทนายความ</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          {canAnswer(user) ? (
            <form onSubmit={submit} className="space-y-3">
              <p className="font-semibold">ตอบในฐานะ {user!.displayName} ({user!.verifiedType ? VERIFIED_LABEL[user!.verifiedType] : "แอดมิน"})</p>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} className="input" placeholder="ให้ข้อมูลทั่วไป ช่องทาง และสิ่งที่ควรเตรียม หลีกเลี่ยงการใส่ช่องทางติดต่อส่วนตัวเพื่อรับว่าความ" />
              <button className="btn-primary" disabled={answer.trim().length < 10}>ส่งคำตอบ</button>
            </form>
          ) : (
            <div className="text-center">
              <Lock className="mx-auto h-6 w-6 text-brand-400" />
              <p className="mt-2 font-semibold">เฉพาะผู้ใช้ที่ยืนยันตัวตนแล้วเท่านั้นที่ตอบได้</p>
              <p className="mt-1 text-sm text-ink-soft">ทนายความ นักศึกษานิติศาสตร์ หรือเจ้าหน้าที่องค์กรพาร์ทเนอร์</p>
              <div className="mt-3 flex justify-center gap-2">
                {user ? <Link href="/verify" className="btn-primary">ยืนยันตัวตน</Link> : <Link href="/login?next=/verify" className="btn-primary">เข้าสู่ระบบเพื่อยืนยันตัวตน</Link>}
              </div>
            </div>
          )}
        </section>

        <Notice>คำตอบในกระทู้เป็นความเห็นเบื้องต้นจากผู้ตอบ ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีเฉพาะ</Notice>
      </div>
    </>
  );
}
