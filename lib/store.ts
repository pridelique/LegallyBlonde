"use client";

/**
 * ชั้นเก็บข้อมูลชั่วคราว (localStorage)
 * ----------------------------------------------------------------
 * ตอนนี้ทุกอย่างเก็บในเครื่องผู้ใช้ เพื่อให้เดโมได้โดยไม่ต้องมี database
 * เวลาต่อ Supabase ให้แก้เฉพาะไฟล์ใน lib/ (store.ts, auth.tsx, repos.ts)
 * หน้าเว็บเรียกผ่านฟังก์ชันเหล่านี้อย่างเดียว จะได้ไม่ต้องรื้อ UI
 */

import { useCallback, useEffect, useState } from "react";

const PREFIX = "lb:";
const EVENT = "lb-store-change";

export function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  } catch {
    /* storage เต็มหรือถูกปิด: ข้ามไป */
  }
}

export function removeLS(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  } catch {
    /* ignore */
  }
}

/** hook อ่าน/เขียน localStorage ที่ sync กันทุก component และทุกแท็บ */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(readLS(key, fallback));
    setReady(true);
    const onChange = (e: Event) => {
      const k = (e as CustomEvent).detail;
      if (k === key) setValue(readLS(key, fallback));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFIX + key) setValue(readLS(key, fallback));
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readLS(key, fallback);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeLS(key, resolved);
      setValue(resolved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, update, ready] as const;
}

export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

/** รหัสเครื่อง (ใช้แทน user id ตอนยังไม่ login) */
export function deviceId(): string {
  let id = readLS<string>("device", "");
  if (!id) {
    id = uid("dev_");
    writeLS("device", id);
  }
  return id;
}

/** ปิดข้อมูลส่วนตัวที่พิมพ์มาโดยไม่ตั้งใจ: เลขบัตร ปชช., เบอร์โทร, อีเมล */
export function maskPII(text: string): { text: string; masked: boolean } {
  let masked = false;
  const rules: [RegExp, string][] = [
    [/\b\d[\s-]?\d{4}[\s-]?\d{5}[\s-]?\d{2}[\s-]?\d\b/g, "[เลขบัตรถูกซ่อน]"],
    [/\b0\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}\b/g, "[เบอร์โทรถูกซ่อน]"],
    [/[\w.+-]+@[\w-]+\.[\w.]+/g, "[อีเมลถูกซ่อน]"],
  ];
  let out = text;
  for (const [re, rep] of rules) {
    if (re.test(out)) masked = true;
    out = out.replace(re, rep);
  }
  return { text: out, masked };
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
