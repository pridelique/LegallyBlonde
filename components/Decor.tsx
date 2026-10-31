type DecoProps = {
  id: string;
  size?: number;
  className?: string;
  from?: string;
  to?: string;
};

export function Orb({ id, size = 120, className = "", from = "#FBCFE8", to = "#EC4899" }: DecoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-g`} cx="34%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="28%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </radialGradient>
        <radialGradient id={`${id}-h`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-g)`} />
      <ellipse cx="36" cy="30" rx="16" ry="10" fill={`url(#${id}-h)`} transform="rotate(-30 36 30)" />
    </svg>
  );
}

export function Sparkle({ id, size = 80, className = "", from = "#FDE68A", to = "#F472B6" }: DecoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M50 4 C53 33 67 47 96 50 C67 53 53 67 50 96 C47 67 33 53 4 50 C33 47 47 33 50 4Z" fill={`url(#${id}-g)`} />
    </svg>
  );
}

export function Arch({ id, size = 80, className = "", from = "#E9D5FF", to = "#F9A8D4" }: DecoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d="M16 96 V50 A34 34 0 0 1 84 50 V96 Z" fill={`url(#${id}-g)`} />
    </svg>
  );
}

export function Flower({
  id,
  size = 120,
  className = "",
  petals = 6,
  from,
  to,
}: DecoProps & { petals?: number; center?: string }) {
  if (petals === 5) return <Sparkle id={id} size={size * 0.7} className={className} from={from} to={to} />;
  if (petals === 8) return <Arch id={id} size={size} className={className} from={from} to={to} />;
  return <Orb id={id} size={size} className={className} from={from} to={to} />;
}

export function Blob({ className = "", id, from = "#FCE7F3", to = "#FBCFE8" }: { className?: string; id: string; from?: string; to?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M44.6,-58.3C57.4,-49.7,67.2,-36.1,71.8,-20.7C76.4,-5.3,75.9,11.8,69.1,25.9C62.3,40,49.2,51.1,34.6,58.7C20,66.3,3.9,70.4,-12.6,69C-29.1,67.6,-46,60.7,-57.6,48.4C-69.2,36.1,-75.5,18.1,-74.6,1C-73.7,-16.1,-65.6,-32.2,-53.7,-41.1C-41.8,-50,-26.1,-51.7,-11.2,-57.2C3.7,-62.7,31.8,-66.9,44.6,-58.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function LogoMark({ size = 32, id = "logo" }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="26" fill={`url(#${id}-g)`} />
      <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 28 V70 H50" strokeWidth="10" />
        <path d="M58 28 V72 M58 28 H64 a10 10 0 0 1 0 20 H58 M58 48 H66 a12 12 0 0 1 0 24 H58" strokeWidth="8" />
      </g>
    </svg>
  );
}