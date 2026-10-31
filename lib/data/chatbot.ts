/**
 * F_04 Rule-based chatbot
 * - ทุกคำตอบเขียนเตรียมไว้แล้ว ไม่เรียก LLM
 * - ทีม legal แก้เนื้อหาได้จากไฟล์นี้ (หรือย้ายไปเก็บใน Supabase ทีหลัง)
 */

export interface ChatOption {
  label: string;
  next?: string;
  href?: string;
}

export interface ChatNode {
  text: string;
  options: ChatOption[];
  refs?: string[];
}

export const CHAT_START = "start";

export const CHAT_TREE: Record<string, ChatNode> = {
  start: {
    text: "สวัสดีค่ะ น้องบลอนด์เองค่ะ 🌸 ตอนนี้เจอปัญหาเรื่องไหนอยู่คะ เลือกด้านล่างได้เลย หรือพิมพ์คำถามเพื่อส่งให้ทีมงานตอบ",
    options: [
      { label: "เรื่องเงิน/ค่าจ้าง", next: "money" },
      { label: "เวลาทำงาน/OT/วันหยุด", next: "time" },
      { label: "โดนให้ออก", next: "fired" },
      { label: "ฉันเป็นลูกจ้างไหม", next: "status" },
      { label: "อยากร้องเรียน ต้องทำยังไง", next: "complain" },
    ],
  },
  money: {
    text: "เรื่องเงินแบบไหนคะ",
    options: [
      { label: "ยังไม่ได้เงิน / จ่ายช้า", next: "money_unpaid" },
      { label: "ได้น้อยกว่าค่าแรงขั้นต่ำ", next: "money_min" },
      { label: "โดนหักเงิน / เก็บมัดจำ", next: "money_deduct" },
      { label: "← กลับ", next: "start" },
    ],
  },
  money_unpaid: {
    text: "นายจ้างต้องจ่ายค่าจ้างตามกำหนดที่ตกลง อย่างน้อยเดือนละครั้ง ถ้าจ่ายช้าต้องเสียดอกเบี้ย และถ้าจงใจไม่จ่ายอาจต้องจ่ายเงินเพิ่มตามกฎหมาย ลูกจ้างยื่นคำร้องต่อพนักงานตรวจแรงงานได้ฟรีค่ะ\n\nแนะนำให้เริ่ม Roadmap เพื่อเช็คอายุความและเตรียมหลักฐาน",
    refs: ["พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541"],
    options: [
      { label: "เริ่ม Roadmap ค่าจ้างค้าง", href: "/roadmap/unpaid-wages" },
      { label: "อ่านเรื่องค่าจ้างแบบละเอียด", href: "/knowledge/wages" },
      { label: "← กลับ", next: "money" },
    ],
  },
  money_min: {
    text: "ค่าจ้างขั้นต่ำใช้กับลูกจ้างทุกคน รวมถึงนักเรียนนักศึกษาและช่วงทดลองงาน อัตราต่างกันตามจังหวัด ถ้าได้รายชั่วโมง ให้เทียบกับอัตรารายวันหาร 8 ค่ะ",
    options: [
      { label: "เริ่ม Roadmap ค่าแรงต่ำกว่าขั้นต่ำ", href: "/roadmap/below-minimum" },
      { label: "อ่านเรื่องค่าจ้างขั้นต่ำ", href: "/knowledge/minimum-wage" },
      { label: "← กลับ", next: "money" },
    ],
  },
  money_deduct: {
    text: "นายจ้างหักค่าจ้างได้เฉพาะบางกรณี เช่น ภาษีหรือเงินสมทบประกันสังคม ส่วนการหักค่าปรับมาสายหรือค่าของเสียหายต้องมีความยินยอมเป็นหนังสือและมีเพดาน การเก็บเงินประกันทำได้เฉพาะงานบางประเภทเท่านั้นค่ะ",
    options: [
      { label: "เริ่ม Roadmap ถูกหักเงิน", href: "/roadmap/unfair-deduction" },
      { label: "อ่านรายละเอียด", href: "/knowledge/deductions-deposit" },
      { label: "← กลับ", next: "money" },
    ],
  },
  time: {
    text: "เรื่องเวลาแบบไหนคะ",
    options: [
      { label: "ทำ OT ไม่ได้เงิน", next: "time_ot" },
      { label: "ทำงานวันหยุด", next: "time_holiday" },
      { label: "อายุต่ำกว่า 18 ทำงานดึก", next: "time_minor" },
      { label: "← กลับ", next: "start" },
    ],
  },
  time_ot: {
    text: "OT ในวันทำงานต้องได้ไม่น้อยกว่า 1.5 เท่าของค่าจ้างรายชั่วโมง และ OT ในวันหยุดไม่น้อยกว่า 3 เท่า การตกลงว่า “ไม่มีค่า OT” ไม่ทำให้สิทธิหายไปค่ะ",
    options: [
      { label: "เริ่ม Roadmap OT", href: "/roadmap/unpaid-ot" },
      { label: "อ่านเรื่อง OT", href: "/knowledge/overtime" },
      { label: "← กลับ", next: "time" },
    ],
  },
  time_holiday: {
    text: "ทำงานในวันหยุด ลูกจ้างรายวันหรือรายชั่วโมงต้องได้ไม่น้อยกว่า 2 เท่าของค่าจ้าง ลูกจ้างรายเดือนได้เพิ่มอีกไม่น้อยกว่า 1 เท่า และต้องมีวันหยุดประจำสัปดาห์อย่างน้อยสัปดาห์ละ 1 วันค่ะ",
    options: [
      { label: "เริ่ม Roadmap ทำงานวันหยุด", href: "/roadmap/holiday-work" },
      { label: "← กลับ", next: "time" },
    ],
  },
  time_minor: {
    text: "ลูกจ้างอายุต่ำกว่า 18 ปี ห้ามทำงานระหว่าง 22.00–06.00 น. (เว้นแต่ได้รับอนุญาตบางกรณี) ห้ามทำ OT และห้ามทำงานในวันหยุดค่ะ ถ้าเจอแบบนี้ ลองคุยกับผู้ปกครองหรือผู้ใหญ่ที่ไว้ใจ แล้วแจ้งกรมสวัสดิการฯ ได้",
    options: [
      { label: "เริ่ม Roadmap ลูกจ้างเด็ก", href: "/roadmap/minor-overwork" },
      { label: "อ่านเรื่องลูกจ้างเด็ก", href: "/knowledge/young-workers" },
      { label: "← กลับ", next: "time" },
    ],
  },
  fired: {
    text: "ถูกให้ออกแบบไหนคะ",
    options: [
      { label: "ให้ออกทันที ไม่บอกล่วงหน้า", next: "fired_notice" },
      { label: "ทำมานานแต่ไม่ได้ค่าชดเชย", next: "fired_severance" },
      { label: "← กลับ", next: "start" },
    ],
  },
  fired_notice: {
    text: "การจ้างที่ไม่มีกำหนดระยะเวลา นายจ้างต้องบอกล่วงหน้าอย่างน้อย 1 งวดการจ่ายค่าจ้าง ถ้าไม่บอก ต้องจ่ายค่าจ้างแทนการบอกกล่าวล่วงหน้าค่ะ",
    options: [
      { label: "เริ่ม Roadmap ไล่ออกทันที", href: "/roadmap/fired-no-notice" },
      { label: "← กลับ", next: "fired" },
    ],
  },
  fired_severance: {
    text: "ถ้าทำงานติดต่อกันครบ 120 วันขึ้นไปและถูกเลิกจ้างโดยไม่ได้ทำผิดร้ายแรง มีสิทธิได้ค่าชดเชยตามอายุงาน เริ่มที่ 30 วันของค่าจ้างอัตราสุดท้ายค่ะ",
    options: [
      { label: "เริ่ม Roadmap ค่าชดเชย", href: "/roadmap/fired-no-severance" },
      { label: "ดูตารางค่าชดเชย", href: "/knowledge/severance" },
      { label: "← กลับ", next: "fired" },
    ],
  },
  status: {
    text: "ลองตอบคำถามนี้ค่ะ: นายจ้างเป็นคนกำหนดเวลาทำงานและสั่งงานเราใช่ไหม",
    options: [
      { label: "ใช่ มีกะ/เวลาเข้างาน", next: "status_employee" },
      { label: "ไม่ใช่ รับงานเป็นชิ้น ทำเมื่อไหร่ก็ได้", next: "status_freelance" },
      { label: "ไม่แน่ใจ", href: "/knowledge/am-i-employee" },
    ],
  },
  status_employee: {
    text: "มีแนวโน้มเป็น “ลูกจ้าง” ค่ะ ได้รับความคุ้มครองตามกฎหมายคุ้มครองแรงงาน แม้ไม่มีสัญญาเป็นลายลักษณ์อักษร",
    options: [
      { label: "ดูปัญหาที่พบบ่อย", href: "/problems" },
      { label: "← เริ่มใหม่", next: "start" },
    ],
  },
  status_freelance: {
    text: "มีแนวโน้มเป็น “จ้างทำของ” หรือฟรีแลนซ์ค่ะ เรียกร้องตามสัญญาและกฎหมายแพ่ง ไม่ใช่ผ่านพนักงานตรวจแรงงาน",
    options: [
      { label: "Roadmap ฟรีแลนซ์ไม่ได้เงิน", href: "/roadmap/freelance-unpaid" },
      { label: "อ่านเรื่องแรงงานนอกระบบ", href: "/knowledge?type=informal" },
      { label: "← เริ่มใหม่", next: "start" },
    ],
  },
  complain: {
    text: "ขั้นตอนคร่าว ๆ: ① เช็คว่าเจอปัญหานั้นจริง ② เช็คสถานะและอายุความ ③ เตรียมหลักฐานและแบบฟอร์ม ④ ยื่นต่อหน่วยงาน ระบบ Roadmap จะพาทำทีละขั้นค่ะ",
    options: [
      { label: "เลือกปัญหาแล้วเริ่ม Roadmap", href: "/problems" },
      { label: "ดูช่องทางติดต่อหน่วยงาน", href: "/contacts" },
      { label: "← กลับ", next: "start" },
    ],
  },
};
