import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p aria-hidden="true" className="text-7xl font-bold text-brand-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-ink-soft">ลองค้นหาเรื่องที่ต้องการจากหน้าแรก</p>
      <Link href="/" className="btn-primary mt-5">Back to home</Link>
    </div>
  );
}
