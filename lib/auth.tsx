"use client";

/**
 * ระบบ login จำลอง (F_06) + role (F_07)
 * ----------------------------------------------------------------
 * TODO(supabase): เปลี่ยน login/logout เป็น supabase.auth.signInWithOtp()
 * และอ่าน role จากตาราง profiles (ตั้ง RLS ให้แก้ role ได้เฉพาะ admin)
 */

import { createContext, useContext, type ReactNode } from "react";
import { useStored } from "./store";

export type Role = "user" | "verified" | "admin";
export type VerifiedType = "lawyer" | "law_student" | "org";
export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  verifiedType?: VerifiedType;
  verifiedOrg?: string;
  plan: Plan;
  createdAt: string;
}

interface AuthCtx {
  user: User | null;
  ready: boolean;
  login: (email: string, displayName: string) => User;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, ready] = useStored<User | null>("user", null);

  const login = (email: string, displayName: string) => {
    const u: User = {
      id: "u_" + email.toLowerCase().replace(/[^a-z0-9]/g, ""),
      email,
      displayName: displayName || email.split("@")[0],
      // เดโม: อีเมลที่ขึ้นต้นด้วย admin@ จะได้สิทธิ์แอดมิน
      role: email.toLowerCase().startsWith("admin@") ? "admin" : "user",
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    return u;
  };

  const logout = () => setUser(null);

  const updateUser = (patch: Partial<User>) => setUser((prev) => (prev ? { ...prev, ...patch } : prev));

  return <Ctx.Provider value={{ user, ready, login, logout, updateUser }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const VERIFIED_LABEL: Record<VerifiedType, string> = {
  lawyer: "ทนายความ",
  law_student: "นักศึกษานิติศาสตร์",
  org: "เจ้าหน้าที่องค์กรพาร์ทเนอร์",
};

export function canAnswer(user: User | null) {
  return !!user && (user.role === "verified" || user.role === "admin");
}
