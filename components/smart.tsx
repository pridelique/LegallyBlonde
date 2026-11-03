"use client";

/**
 * ชิ้นส่วน UI แบบ "dashboard" ใช้ซ้ำได้ทั้งเว็บ
 * ProgressRing · Segmented · StepBars (IconCircle อยู่ใน IconCircle.tsx เพื่อให้ server component ใช้ได้)
 */


/* ───────── วงแหวนความคืบหน้า ───────── */
export function ProgressRing({
  value,
  size = 132,
  stroke = 12,
  label,
  sub,
  id = "ring",
}: {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
  sub?: React.ReactNode;
  id?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const angle = (v / 100) * 2 * Math.PI - Math.PI / 2;
  const kx = size / 2 + r * Math.cos(angle);
  const ky = size / 2 + r * Math.sin(angle);
  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }} role="img" aria-label={`ความคืบหน้า ${Math.round(v)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F7E6EF" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
        {v > 0 && <circle cx={kx} cy={ky} r={stroke / 2 + 3} fill="#FFFFFF" stroke="#BE185D" strokeWidth={3} />}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label !== undefined ? label : <span className="text-2xl font-bold tabular-nums">{Math.round(v)}%</span>}
        {sub && <span className="text-xs text-ink-soft">{sub}</span>}
      </div>
    </div>
  );
}

/* ───────── ตัวเลือกแบบแคปซูล ───────── */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex rounded-full bg-white p-1 shadow-soft">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`min-h-[40px] flex-1 rounded-full px-4 text-sm font-medium transition ${
              on ? "bg-petal font-semibold text-brand-900" : "text-ink-soft hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── แท่งความคืบหน้า 4 ขั้น ───────── */
export function StepBars({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div>
      <div className="flex h-16 items-end gap-2" aria-hidden="true">
        {labels.map((_, i) => {
          const n = i + 1;
          const h = n < step ? 100 : n === step ? 70 : 28;
          return (
            <span key={i} className="relative flex-1 overflow-hidden rounded-xl bg-tint" style={{ height: "100%" }}>
              <span
                className={`absolute inset-x-0 bottom-0 rounded-xl ${n < step ? "bg-brand-400" : n === step ? "bg-brand-600" : "bg-petal"}`}
                style={{ height: `${h}%` }}
              />
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 text-center text-[11px] text-ink-soft">
        {labels.map((l, i) => (
          <span key={l} className={`flex-1 ${i + 1 === step ? "font-semibold text-brand-800" : ""}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
