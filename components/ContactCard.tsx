import { Phone, Globe, MessageCircle } from "lucide-react";
import type { Contact } from "@/lib/data/types";

export default function ContactCard({ c, compact = false }: { c: Contact; compact?: boolean }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <p className="font-semibold">{c.name}</p>
      {!compact && <p className="mt-1 text-sm text-ink-soft">{c.description}</p>}
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {c.phone && (
          <a href={`tel:${c.phone}`} className="chip !bg-brand-700 !text-white hover:!bg-brand-800">
            <Phone className="h-3.5 w-3.5" /> {c.phone}
          </a>
        )}
        {c.line && (
          <span className="chip">
            <MessageCircle className="h-3.5 w-3.5" /> LINE {c.line}
          </span>
        )}
        {c.website && (
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="chip hover:bg-brand-100">
            <Globe className="h-3.5 w-3.5" /> เว็บไซต์
          </a>
        )}
        {!c.phone && !c.line && !c.website && <span className="text-xs text-ink-mute">ข้อมูลติดต่ออยู่ระหว่างรวบรวม</span>}
      </div>
      {!compact && c.handles.length > 0 && (
        <div className="mt-auto pt-3 text-xs text-ink-mute">ดูแลเรื่อง: {c.handles.join(" · ")}</div>
      )}
    </div>
  );
}
