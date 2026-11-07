export type WorkerType = "general" | "informal";

export interface Ref {
  label: string;
  url?: string;
}

export interface KnowledgeTopic {
  slug: string;
  type: WorkerType;
  group: string;
  title: string;
  /** สรุปสั้นเป็นข้อ ๆ */
  short: string[];
  /** คำอธิบายแบบยาว แบ่งเป็นหัวข้อย่อย */
  long: { heading: string; body: string }[];
  refs: Ref[];
  keywords: string[];
  updated: string;
}

export type FormType = "kr7-prep" | "demand-letter" | "civil-claim-prep";

export interface StatusOption {
  label: string;
  result: string;
  tone: "ok" | "info" | "warn" | "stop";
}

export interface StatusQuestion {
  id: string;
  question: string;
  options: StatusOption[];
}

export interface ContactStep {
  title: string;
  detail: string;
  phone?: string;
  links?: { label: string; href: string }[];
}

export interface RoadmapTemplate {
  checklist: string[];
  questions: StatusQuestion[];
  prescription: { years: number; text: string };
  evidence: { item: string; examples: string }[];
  forms: FormType[];
  contacts: ContactStep[];
  whileWaiting: string[];
}

export interface Problem {
  id: string;
  title: string;
  summary: string;
  detail?: string;
  group: string;
  keywords: string[];
  relatedTopics: string[];
  roadmap?: RoadmapTemplate;
}

export type ContactSector = "labour" | "legal" | "rights" | "civil" | "workplace";

export interface ContactChannel {
  kind: "phone" | "line" | "web" | "email" | "facebook" | "note";
  label: string;
  value: string;
  href?: string;
}

export interface Contact {
  id: string;
  no: number;
  name: string;
  sector: ContactSector;
  description: string;
  hotline?: { number: string; ext?: string; label: string };
  channels: ContactChannel[];
}
