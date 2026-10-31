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

export interface Problem {
  id: string;
  title: string;
  summary: string;
  group: string;
  keywords: string[];
  relatedTopics: string[];
  /** Step 1: ข้อความให้ติ๊กว่าตรงกับสถานการณ์ไหม */
  symptoms: string[];
  /** Step 2: ใช้กฎหมายคุ้มครองแรงงาน (ต้องเป็นลูกจ้าง) หรือไม่ */
  needsEmployeeStatus: boolean;
  prescription: { years: number; note: string };
  /** Step 3 */
  evidence: { item: string; tip?: string; required?: boolean }[];
  forms: FormType[];
  /** Step 4: id ใน contacts */
  agencies: string[];
  agencyNote: string;
  /** หลังกด completed */
  whileWaiting: string[];
}

export interface Contact {
  id: string;
  name: string;
  sector: "ministry" | "government" | "legal" | "civil";
  description: string;
  phone?: string;
  line?: string;
  website?: string;
  handles: string[];
}
