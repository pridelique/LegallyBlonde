import type { FormType } from "./data/types";

/**
 * แบบฟอร์มที่กรอกและแก้ไขในเว็บได้ (F_03 step 3)
 * ไม่ใช่แบบฟอร์มทางการ: เป็นแบบเตรียมข้อมูลเพื่อนำไปกรอกแบบฟอร์มของหน่วยงาน หรือใช้ประกอบการขอคำปรึกษา
 */

export type FieldType = "text" | "textarea" | "date" | "number" | "select" | "multi";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  half?: boolean;
}

export interface FormSchema {
  type: FormType;
  title: string;
  description: string;
  sections: { title: string; fields: Field[] }[];
  layout: "sheet" | "letter";
}

export const FORM_LABEL: Record<FormType, string> = {
  "kr7-prep": "แบบเตรียมข้อมูลคำร้องของลูกจ้าง (คร.7)",
  "demand-letter": "หนังสือทวงถามค่าจ้าง/ค่าตอบแทน",
  "civil-claim-prep": "แบบเตรียมข้อมูลปรึกษาคดีแพ่ง (ฟรีแลนซ์)",
};

const CLAIMS = [
  "ค่าจ้าง",
  "ค่าล่วงเวลา",
  "ค่าทำงานในวันหยุด",
  "ค่าชดเชย",
  "ค่าจ้างแทนการบอกกล่าวล่วงหน้า",
  "เงินที่ถูกหัก / เงินประกัน",
  "อื่น ๆ",
];

export const FORMS: Record<FormType, FormSchema> = {
  "kr7-prep": {
    type: "kr7-prep",
    title: FORM_LABEL["kr7-prep"],
    description:
      "รวบรวมข้อมูลที่มักต้องใช้ตอนยื่นคำร้องต่อพนักงานตรวจแรงงาน กรอกไว้ล่วงหน้าแล้วนำไปกรอกแบบฟอร์มทางการหรือยื่นออนไลน์ได้สะดวกขึ้น",
    layout: "sheet",
    sections: [
      {
        title: "ข้อมูลผู้ร้อง (ลูกจ้าง)",
        fields: [
          { name: "name", label: "ชื่อ-นามสกุล", type: "text", half: true },
          { name: "age", label: "อายุ", type: "number", half: true },
          { name: "address", label: "ที่อยู่ที่ติดต่อได้", type: "textarea" },
          { name: "phone", label: "เบอร์โทรศัพท์", type: "text", half: true },
          { name: "position", label: "ตำแหน่ง/ลักษณะงาน", type: "text", half: true, placeholder: "เช่น พนักงานหน้าร้าน part-time" },
          { name: "startDate", label: "วันที่เริ่มทำงาน", type: "date", half: true },
          { name: "endDate", label: "วันที่ทำงานวันสุดท้าย (ถ้ามี)", type: "date", half: true },
          { name: "wage", label: "อัตราค่าจ้าง (บาท)", type: "number", half: true },
          { name: "wageUnit", label: "ต่อ", type: "select", options: ["ชั่วโมง", "วัน", "เดือน", "ชิ้นงาน"], half: true },
          { name: "payCycle", label: "กำหนดจ่ายค่าจ้าง", type: "text", placeholder: "เช่น ทุกวันที่ 1 และ 16 / ทุกสิ้นเดือน" },
        ],
      },
      {
        title: "ข้อมูลนายจ้างและสถานที่ทำงาน",
        fields: [
          { name: "employer", label: "ชื่อนายจ้าง/บริษัท", type: "text", half: true },
          { name: "shop", label: "ชื่อร้าน/สาขา", type: "text", half: true },
          { name: "workplace", label: "ที่ตั้งสถานที่ทำงาน", type: "textarea", placeholder: "ใช้ระบุสำนักงานที่ต้องไปยื่น" },
          { name: "business", label: "ประเภทกิจการ", type: "text", half: true, placeholder: "เช่น ร้านอาหาร คาเฟ่" },
          { name: "manager", label: "ผู้สั่งงาน/ผู้จัดการ", type: "text", half: true },
        ],
      },
      {
        title: "สิ่งที่ต้องการเรียกร้อง",
        fields: [
          { name: "claims", label: "เลือกได้มากกว่า 1 ข้อ", type: "multi", options: CLAIMS },
          { name: "amount", label: "จำนวนเงินโดยประมาณ (บาท)", type: "number", half: true },
          { name: "period", label: "ช่วงเวลาที่เกี่ยวข้อง", type: "text", half: true, placeholder: "เช่น 1 ส.ค. – 30 ก.ย. 2569" },
        ],
      },
      {
        title: "ข้อเท็จจริงโดยสรุป",
        fields: [
          {
            name: "facts",
            label: "เล่าเหตุการณ์เรียงตามเวลา",
            type: "textarea",
            placeholder: "เช่น 1 ส.ค. เริ่มงาน ตกลงค่าจ้างชั่วโมงละ ... / 1 ต.ค. ถึงกำหนดจ่ายแต่ไม่ได้รับ / 5 ต.ค. ทวงถามทางไลน์ ...",
          },
          { name: "evidence", label: "หลักฐานที่มี", type: "textarea" },
        ],
      },
    ],
  },
  "demand-letter": {
    type: "demand-letter",
    title: FORM_LABEL["demand-letter"],
    description: "หนังสือทวงถามแบบสุภาพ ใช้ส่งให้นายจ้างหรือผู้ว่าจ้างก่อนดำเนินการต่อ และเก็บไว้เป็นหลักฐานว่าได้ทวงถามแล้ว",
    layout: "letter",
    sections: [
      {
        title: "ผู้ส่ง",
        fields: [
          { name: "name", label: "ชื่อ-นามสกุล", type: "text", half: true },
          { name: "contact", label: "ช่องทางติดต่อกลับ", type: "text", half: true },
          { name: "place", label: "เขียนที่", type: "text", half: true, placeholder: "เช่น กรุงเทพมหานคร" },
          { name: "date", label: "วันที่", type: "date", half: true },
        ],
      },
      {
        title: "ผู้รับ",
        fields: [
          { name: "to", label: "เรียน (ชื่อนายจ้าง/ผู้ว่าจ้าง)", type: "text", half: true },
          { name: "toOrg", label: "ร้าน/บริษัท", type: "text", half: true },
        ],
      },
      {
        title: "รายละเอียด",
        fields: [
          { name: "work", label: "งานที่ทำ", type: "text", placeholder: "เช่น พนักงาน part-time / ออกแบบโลโก้" },
          { name: "period", label: "ช่วงเวลาที่ทำงาน/ส่งงาน", type: "text", half: true },
          { name: "amount", label: "จำนวนเงินที่ค้าง (บาท)", type: "number", half: true },
          { name: "detail", label: "รายละเอียดเพิ่มเติม", type: "textarea", placeholder: "เช่น ค่าจ้างงวด 16–31 ต.ค. จำนวน 40 ชั่วโมง" },
          { name: "dueDays", label: "ขอให้ชำระภายใน (วัน)", type: "number", half: true },
          { name: "payTo", label: "ช่องทางรับชำระ", type: "text", half: true, placeholder: "เช่น โอนเข้าบัญชีเดิมที่เคยรับค่าจ้าง" },
        ],
      },
    ],
  },
  "civil-claim-prep": {
    type: "civil-claim-prep",
    title: FORM_LABEL["civil-claim-prep"],
    description: "รวบรวมข้อมูลสำหรับขอคำปรึกษาจากทนายหรือหน่วยงานช่วยเหลือทางกฎหมาย กรณีผู้ว่าจ้างไม่จ่ายค่างาน",
    layout: "sheet",
    sections: [
      {
        title: "คู่สัญญา",
        fields: [
          { name: "name", label: "ชื่อของคุณ", type: "text", half: true },
          { name: "client", label: "ชื่อผู้ว่าจ้าง/บริษัท", type: "text", half: true },
          { name: "clientContact", label: "ช่องทางติดต่อผู้ว่าจ้างที่มี", type: "textarea" },
        ],
      },
      {
        title: "งานและค่าตอบแทน",
        fields: [
          { name: "scope", label: "ขอบเขตงานที่ตกลง", type: "textarea" },
          { name: "price", label: "ราคาที่ตกลง (บาท)", type: "number", half: true },
          { name: "paid", label: "ได้รับแล้ว (บาท)", type: "number", half: true },
          { name: "agreedDate", label: "วันที่ตกลงงาน", type: "date", half: true },
          { name: "deliveredDate", label: "วันที่ส่งงาน", type: "date", half: true },
        ],
      },
      {
        title: "การทวงถามและหลักฐาน",
        fields: [
          { name: "followUps", label: "การทวงถามที่ทำไปแล้ว", type: "textarea", placeholder: "วันที่ / ช่องทาง / คำตอบที่ได้" },
          { name: "evidence", label: "หลักฐานที่มี", type: "textarea" },
        ],
      },
    ],
  },
};

export const CLAIM_BY_PROBLEM: Record<string, string[]> = {
  "unpaid-wages": ["ค่าจ้าง"],
  "below-minimum": ["ค่าจ้าง"],
  "unpaid-ot": ["ค่าล่วงเวลา"],
  "holiday-work": ["ค่าทำงานในวันหยุด"],
  "unfair-deduction": ["เงินที่ถูกหัก / เงินประกัน"],
  "fired-no-severance": ["ค่าชดเชย"],
  "fired-no-notice": ["ค่าจ้างแทนการบอกกล่าวล่วงหน้า"],
  "leave-denied": ["ค่าจ้าง"],
  "minor-overwork": ["ค่าล่วงเวลา", "ค่าทำงานในวันหยุด"],
  "no-social-security": ["อื่น ๆ"],
};
