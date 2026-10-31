/**
 * Search engine ฝั่ง client (ไม่ต้องมี server, ไม่มีค่าใช้จ่าย)
 * ----------------------------------------------------------------
 * 1) ตัดคำไทยด้วย Intl.Segmenter (มีในเบราว์เซอร์และ Node อยู่แล้ว)
 * 2) ขยายคำค้นด้วยตารางคำพ้อง (ภาษาชาวบ้าน ⇄ ศัพท์กฎหมาย)
 * 3) ให้คะแนนแบบ TF-IDF ถ่วงน้ำหนักตาม field แล้วเรียงตามความเกี่ยวข้อง
 * 4) ถ้าไม่เจอเลย → หา "สิ่งที่คล้ายกัน" ด้วยความคล้ายของตัวอักษร (bigram)
 *
 * อนาคต: เพิ่ม semantic search (embedding) แล้วรวมคะแนนแบบ hybrid ได้ที่ฟังก์ชัน search()
 */

import { SYNONYMS } from "./data/misc";

const STOPWORDS = new Set([
  "ได้", "ที่", "และ", "การ", "ของ", "ให้", "เป็น", "มี", "ใน", "จะ", "แล้ว", "ว่า", "คือ", "ยัง", "กับ",
  "หรือ", "ค่ะ", "ครับ", "คะ", "นะ", "ไหม", "มั้ย", "อะไร", "ยังไง", "ทำไม", "เรา", "ฉัน", "ผม", "หนู",
  "บ้าง", "อยาก", "รู้", "ต้อง", "ทำ", "แบบ", "นี้", "นั้น", "the", "a", "of",
]);

let segmenter: Intl.Segmenter | null = null;
function getSegmenter() {
  if (segmenter) return segmenter;
  try {
    segmenter = new Intl.Segmenter("th", { granularity: "word" });
  } catch {
    segmenter = null;
  }
  return segmenter;
}

export function normalize(s: string) {
  return s.toLowerCase().replace(/[​-‍﻿]/g, "").replace(/\s+/g, " ").trim();
}

export function tokenize(text: string): string[] {
  const s = normalize(text);
  const seg = getSegmenter();
  let tokens: string[];
  if (seg) {
    tokens = [];
    for (const part of seg.segment(s)) {
      if (part.isWordLike) tokens.push(part.segment);
    }
  } else {
    tokens = s.split(/[\s,.;:!?()"'“”]+/);
  }
  return tokens.filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function expandQuery(q: string): string[] {
  const nq = normalize(q);
  const extra = new Set<string>();
  for (const group of SYNONYMS) {
    if (group.some((w) => nq.includes(normalize(w)))) {
      group.forEach((w) => extra.add(normalize(w)));
    }
  }
  return [...extra];
}

function bigrams(s: string): string[] {
  const t = normalize(s).replace(/\s/g, "");
  if (t.length < 2) return t ? [t] : [];
  const out: string[] = [];
  for (let i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2));
  return out;
}

/** Dice coefficient ของ bigram: 0 = ไม่เหมือนเลย, 1 = เหมือนกัน */
export function similarity(a: string, b: string): number {
  const A = bigrams(a);
  const B = bigrams(b);
  if (!A.length || !B.length) return 0;
  const counts = new Map<string, number>();
  A.forEach((g) => counts.set(g, (counts.get(g) || 0) + 1));
  let inter = 0;
  for (const g of B) {
    const c = counts.get(g) || 0;
    if (c > 0) {
      inter++;
      counts.set(g, c - 1);
    }
  }
  return (2 * inter) / (A.length + B.length);
}

export interface SearchFields {
  title: string;
  keywords?: string[];
  body?: string;
}

interface IndexedDoc<T> {
  item: T;
  fields: { text: string; tokens: Map<string, number>; weight: number }[];
  titleAndKeys: string[];
}

export type SearchMode = "match" | "similar" | "none" | "empty";

export interface SearchResult<T> {
  mode: SearchMode;
  results: { item: T; score: number }[];
}

export function createIndex<T>(items: T[], getFields: (item: T) => SearchFields) {
  const docs: IndexedDoc<T>[] = items.map((item) => {
    const f = getFields(item);
    const mk = (text: string, weight: number) => {
      const tokens = new Map<string, number>();
      tokenize(text).forEach((t) => tokens.set(t, (tokens.get(t) || 0) + 1));
      return { text: normalize(text), tokens, weight };
    };
    return {
      item,
      fields: [mk(f.title, 3), mk((f.keywords || []).join(" "), 2.5), mk(f.body || "", 1)],
      titleAndKeys: [f.title, ...(f.keywords || [])],
    };
  });

  // document frequency สำหรับ idf
  const df = new Map<string, number>();
  for (const d of docs) {
    const seen = new Set<string>();
    d.fields.forEach((f) => f.tokens.forEach((_, t) => seen.add(t)));
    seen.forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  }
  const N = docs.length || 1;
  const idf = (t: string) => Math.log(1 + N / (1 + (df.get(t) || 0)));

  function search(query: string, limit = 20): SearchResult<T> {
    const q = normalize(query);
    if (!q) return { mode: "empty", results: items.slice(0, limit).map((item) => ({ item, score: 0 })) };

    const baseTokens = [...new Set(tokenize(q))];
    const expansions = expandQuery(q);
    const expTokens = [...new Set(expansions.flatMap(tokenize))].filter((t) => !baseTokens.includes(t));

    const scored = docs.map((d) => {
      let score = 0;
      for (const f of d.fields) {
        for (const t of baseTokens) {
          const tf = f.tokens.get(t) || 0;
          if (tf) score += idf(t) * f.weight * Math.min(tf, 3);
          else if (t.length >= 3 && f.text.includes(t)) score += idf(t) * f.weight * 0.5; // คำที่ตัดคำไม่ตรงกัน
        }
        for (const t of expTokens) {
          const tf = f.tokens.get(t) || 0;
          if (tf) score += idf(t) * f.weight * 0.6 * Math.min(tf, 2);
        }
        if (f.text.includes(q)) score += 6 * f.weight; // เจอทั้งวลี
        for (const e of expansions) if (e.length >= 3 && f.text.includes(e)) score += 1.5 * f.weight;
      }
      return { item: d.item, score };
    });

    const matches = scored.filter((s) => s.score > 0.5).sort((a, b) => b.score - a.score);
    if (matches.length) return { mode: "match", results: matches.slice(0, limit) };

    // ไม่เจอเลย → หาสิ่งที่คล้ายกัน
    const similar = docs
      .map((d) => ({
        item: d.item,
        score: Math.max(...d.titleAndKeys.map((s) => similarity(q, s))),
      }))
      .filter((s) => s.score >= 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(limit, 6));

    return similar.length ? { mode: "similar", results: similar } : { mode: "none", results: [] };
  }

  return { search };
}
