import Link from "next/link";
import { Flower } from "@/components/Decor";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Flower id="nf" size={100} />
      <h1 className="mt-4 text-2xl font-bold">ไม่พบหน้านี้</h1>
      <p className="mt-1 text-ink-soft">ลองค้นหาเรื่องที่ต้องการจากหน้าแรก</p>
      <Link href="/" className="btn-primary mt-5">กลับหน้าแรก</Link>
    </div>
  );
}
