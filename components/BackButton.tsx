"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="icon-btn" aria-label="Back">
      <ChevronLeft className="h-5 w-5" />
    </button>
  );
}
