import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import ChatLauncher from "@/components/ChatLauncher";

export const metadata: Metadata = {
  title: "Legally Blonde · รู้สิทธิแรงงาน เตรียมตัวก่อนร้องเรียน",
  description:
    "คลังความรู้สิทธิแรงงานภาษาเข้าใจง่าย ค้นหาปัญหา roadmap เตรียมหลักฐาน แบบฟอร์ม และช่องทางติดต่อหน่วยงาน",
};

export const viewport: Viewport = {
  themeColor: "#BE185D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&family=Sarabun:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <ChatLauncher />
        </Providers>
      </body>
    </html>
  );
}
