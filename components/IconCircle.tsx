import type { LucideIcon } from "lucide-react";

/* ───────── ไอคอนในวงกลม ───────── */
export default function IconCircle({
  icon: Icon,
  tone = "tint",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "white" | "tint" | "petal" | "brand";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    white: "bg-white text-brand-700",
    tint: "bg-tint text-brand-700",
    petal: "bg-petal text-brand-800",
    brand: "bg-brand-700 text-white",
  };
  const sizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };
  const icons = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full ${tones[tone]} ${sizes[size]}`}>
      <Icon className={icons[size]} />
    </span>
  );
}

