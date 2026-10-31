"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SUGGESTIONS = ["โดนไล่ออก", "ไม่ได้ค่า OT", "ค่าแรงต่ำ", "ลาป่วยโดนหักเงิน", "ฟรีแลนซ์ไม่ได้เงิน"];

export default function SearchBox({ big = false }: { big?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (text: string) => {
    if (!text.trim()) return;
    router.push(`/search?q=${encodeURIComponent(text.trim())}`);
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className={`flex items-center gap-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-brand-100 ${big ? "max-w-xl" : ""}`}
      >
        <Search className="ml-3 h-5 w-5 shrink-0 text-brand-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="พิมพ์ปัญหาด้วยคำของคุณเอง เช่น เจ้านายไม่จ่ายเงิน"
          className="min-w-0 flex-1 bg-transparent py-2 text-base focus:outline-none"
          aria-label="ค้นหา"
        />
        <button className="btn-primary shrink-0">ค้นหา</button>
      </form>
      {big && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => go(s)} className="chip hover:bg-brand-100">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
