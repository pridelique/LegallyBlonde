import { Suspense } from "react";
import { notFound } from "next/navigation";
import FormEditor from "@/components/FormEditor";
import { FORMS } from "@/lib/forms";
import type { FormType } from "@/lib/data/types";

export function generateStaticParams() {
  return Object.keys(FORMS).map((type) => ({ type }));
}

export default function FormPage({ params }: { params: { type: string } }) {
  if (!(params.type in FORMS)) notFound();
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-ink-mute">กำลังโหลดแบบฟอร์ม…</div>}>
      <FormEditor type={params.type as FormType} />
    </Suspense>
  );
}
