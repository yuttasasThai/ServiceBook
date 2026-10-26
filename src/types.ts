export interface SymptomRecord {
  id: string;
  symptomTitle: string; // อาการเสีย
  visualCheck: string; // พบจุดเสียด้วยสายตาตรวจสอบ
  functionCheck: string; // ต้องจ่ายไฟถึงจะทราบ
  checkTechnique: string; // เทคนิคแนวทางตรวจสอบ (การตั้งค่า, การวัด)
  rootCause: string; // สาเหตุ (root cause) อุปกรณ์เสีย
  replacedParts?: string; // รายการอะไหล่ที่เปลี่ยน
  postRepairTest: string; // ผลทดสอบหลังการซ่อม
  photos: string[]; // ภาพถ่ายประกอบงานซ่อม 2-3 รูป (data URLs or URLs)
  circuitDiagram?: string; // วงจรหากมี (data URL or URL)
}

export interface RepairEntry {
  id: string;
  code: string; // รหัสใบงาน เช่น FIX-2026-001
  category: string; // สินค้า / หมวดหมู่ เช่น บอร์ดเครื่องซักผ้า, ทีวี, มอเตอร์ปั๊มน้ำ, ตู้เย็นอินเวอร์เตอร์
  brand: string; // ยี่ห้อ
  model: string; // รุ่น
  serialNumber?: string; // หมายเลขเครื่อง
  technicianName: string; // ช่างผู้ซ่อม
  branchName: string; // สาขา
  repairDate: string; // วันที่ซ่อม
  status: 'completed' | 'in_progress' | 'waiting_parts';
  symptoms: SymptomRecord[]; // อาการเสียที่ 1, 2, ...
  estimatedCost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProfile {
  shopName: string; // ชื่อร้าน / โปรไฟล์
  technicianName: string; // ชื่อช่าง
  phone: string; // เบอร์โทร
  lineId: string; // LINE ID
  address: string; // ที่อยู่ร้าน
  slogan: string;
  coverImage: string; // รูปร้านหน้าปก
  logoImage?: string;
}

export interface BranchUser {
  id: string;
  name: string; // ชื่อสาขา / ผู้ใช้งาน
  phone: string; // เบอร์โทร
  branchCode: string; // รหัสสาขา
  shareUrl: string; // ลิงก์สาขา
  username: string; // ชื่อผู้ใช้สำหรับ login
  password: string; // รหัสผ่าน (admin กำหนด)
  expiryDate: string; // วันหมดอายุ (YYYY-MM-DDTHH:mm:ss หรือ YYYY-MM-DD)
  isActive: boolean;
  createdAt: string;
  notes?: string;
}

export interface RevisionRecord {
  revision: string; // e.g. "Rev 1.0.0", "Rev 1.0.1"
  date: string;
  description: string;
  details: string[];
}

export interface AuthSession {
  isLoggedIn: boolean;
  role: 'admin' | 'branch_user' | 'guest';
  branchId?: string;
  branchName?: string;
  username?: string;
  expiresAt?: string;
}

// 1) ข้อมูลชี้จุดเสีย แบบซวดลวดรวดเร็ว
export interface QuickPinpointRecord {
  id: string;
  model: string; // รุ่น
  brand?: string; // ยี่ห้อ
  symptom: string; // อาการ
  photo: string; // ภาพถ่ายจุดเสีย
  photoDescription: string; // พิมพ์ อธิบาย ข้างภาพ
  replacedWhat: string; // เปลี่ยนอะไร (อะไหล่/ชิ้นส่วนที่เปลี่ยน)
  createdAt: string;
  author?: string;
}

// 2) ข้อมูลวิธีถอดเครื่อง/วิธีประกอบเครื่อง
export interface GuideStep {
  id: string;
  stepNumber: number;
  photo: string; // รูปถ่ายขั้นตอน
  description: string; // คำอธิบายขั้นตอน
}

export interface DisassemblyGuide {
  id: string;
  model: string; // รุ่น
  symptom: string; // อาการ
  type: 'disassembly' | 'assembly' | 'both'; // วิธีถอด หรือ วิธีประกอบ
  steps: GuideStep[]; // รูปขั้นตอน 1 - 10 รูป พร้อมคำอธิบาย
  createdAt: string;
  author?: string;
}
