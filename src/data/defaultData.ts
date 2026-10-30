import { RepairEntry, ShopProfile, BranchUser, RevisionRecord } from '../types';

export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  shopName: "คัมภีร์ยุทธซ่างซวดลวดFix it (สำนักงานใหญ่)",
  technicianName: "ช่างยุทธ ยุทธการงานซ่อม",
  phone: "089-765-4321",
  lineId: "@yutt-fixit",
  address: "168/9 ถ.ช่างทอง แขวงพัฒนาการ เขตสวนหลวง กรุงเทพมหานคร 10250",
  slogan: "คู่มือคัมภีร์งานซ่อมมือโปร วิเคราะห์ละเอียด Visual & Function Check เจาะลึกถึงวงจรและ Root Cause",
  coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
};

export const PRESET_COVERS = [
  {
    id: 'electronics_lab',
    name: 'ห้องทดลองอิเล็กทรอนิกส์ & แผงวงจร',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'soldering_iron',
    name: 'งานบัดกรี & ชิปเมนบอร์ด',
    url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'oscilloscope_tech',
    name: 'เครื่องมือวัดสโคป & มัลติมิเตอร์',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'workshop_motor',
    name: 'ศูนย์ซ่อมขดลวดมอเตอร์ & เครื่องกล',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
  },
];

export const COMMON_CATEGORIES = [
  "บอร์ดเครื่องซักผ้า",
  "สมาร์ททีวี / แอลอีดีทีวี",
  "ตู้เย็นอินเวอร์เตอร์",
  "มอเตอร์ & ปั๊มน้ำ",
  "เตาอบไมโครเวฟ",
  "เครื่องปรับอากาศ / บอร์ดคอยล์ร้อน",
  "ตู้เชื่อมอินเวอร์เตอร์",
  "เครื่องเสียง & แอมป์ขยาย",
  "เครื่องมือช่างไฟฟ้า (สว่าน/หินเจียร์)",
  "พาวเวอร์ซัพพลายสวิทชิ่ง",
];

export const COMMON_SYMPTOMS = [
  "เปิดไม่ติด ไฟสแตนด์บายไม่สว่าง",
  "เปิดติดแล้วดับตัดวงจรป้องกัน (Protection)",
  "มีควันขึ้น มีกลิ่นไหม้",
  "มอเตอร์ไม่หมุน มีเสียงฮัม",
  "มอเตอร์หมุนกระตุก Error รหัสข้อผิดพลาด",
  "มีเสียงไม่มีภาพ จอดำ",
  "ไฟตก วัดแรงดันไฟไม่ออก",
  "บอร์ดไม่สั่งงาน รีเลย์ไม่ดึง",
  "เครื่องทำงานตลอดเวลาไม่ยอมตัด",
  "ไฟรั่วลงโครงช็อตเบรกเกอร์ตัด",
  "น้ำไม่เข้า / ไม่เดรนน้ำทิ้ง",
];

export const INITIAL_REPAIRS: RepairEntry[] = [
  {
    id: 'rep-001',
    code: 'FIX-202610-001',
    category: 'บอร์ดเครื่องซักผ้า',
    brand: 'LG',
    model: 'WF-T1465TD (Inverter Direct Drive)',
    serialNumber: 'LG-DD892401',
    technicianName: 'ช่างยุทธ',
    branchName: 'สำนักงานใหญ่',
    repairDate: '2026-10-20',
    status: 'completed',
    estimatedCost: 1450,
    notes: 'ลูกค้าแจ้งไฟดับกะทันหันแล้วเครื่องดับสนิท ซ่อมแผงสวิทชิ่งและเช็คขดลวดมอเตอร์ DD เรียบร้อย',
    createdAt: '2026-10-20T10:30:00Z',
    updatedAt: '2026-10-20T16:45:00Z',
    symptoms: [
      {
        id: 'sym-001-1',
        symptomTitle: 'เปิดไม่ติด ไฟหน้าปัดไม่ติด ไม่มีเสียงเพลงสตาร์ท',
        visualCheck: 'ส่องดูซิลิโคนเรซิ่นหลังบอร์ด พบรอยไหม้เกรียมบริเวณไอซีสวิทชิ่ง TOP246YN ขา 5-7 ขาดกระเด็น และ C 450V 150uF หัวบวมปริออก',
        functionCheck: 'จ่ายไฟ 220VAC เข้าไลน์ L-N บอร์ดเงียบสนิท วัดไฟ DC Bus 300Vdc ตกเหลือ 0V เนื่องจากฟิวส์บริดจ์ขาด',
        checkTechnique: 'ขูดเรซิ่นออกอย่างระมัดระวัง ใช้มิเตอร์ตั้งย่านโอห์มเช็คไดโอดบริดจ์ D1-D4 พบ D2 ช็อตทะลุ, ใช้สโคปตรวจเช็คขดหม้อแปลง Switching ไม่ไหม้',
        rootCause: 'เสิร์จแรงดันไฟกระชากช่วงพายุฝนทำให้ไดโอดบริดจ์ช็อตทะลุ ส่งไฟกระแสสลับเข้า C ฟิลเตอร์ระเบิดและทำลายไอซี Switching TOP246YN',
        replacedParts: 'IC TOP246YN, Capacitor 150uF/450V 105°C, Diode 1N4007 x4, Fuse Ceramic 3.15A',
        postRepairTest: 'ต่อไฟผ่านหลอดอนุกรม 100W วัดไฟขาออก 15Vdc เลี้ยงบอร์ด IPM และ 5Vdc เลี้ยง MCU นิ่งสนิท ไฟหน้าปัดติดพร้อมเสียงร้องปกติ',
        photos: [
          'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        ],
        circuitDiagram: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'sym-001-2',
        symptomTitle: 'มอเตอร์หมุนกระตุก โค้ดแจ้งเตือน Error LE (Locked Motor)',
        visualCheck: 'ส่องตรวจขั้วต่อ Hall Sensor มอเตอร์ พบสายไฟสีเหลืองมีรอยหนูกัดแทะทองแดงแตะโดนโครงถัง',
        functionCheck: 'สั่งซัก ปั่นหมาด มอเตอร์ขยับซ้ายขวา 2 ครั้งแล้วหน้าจอขึ้น LE ร้องเตือนตัดการทำงาน',
        checkTechnique: 'วัดไฟ 5V เลี้ยงเซนเซอร์ Hall Effect และหมุนจานซักด้วยมือวัดพัลส์สัญญาณ Hall A / Hall B บนสโคป พัลส์ B ขาดหาย',
        rootCause: 'สายสัญญาณ Hall Sensor ขาด ทำให้ MCU ไม่สามารถตรวจจับรอบหมุนของโรเตอร์แม่เหล็กถาวรได้ จึงสั่งตัดการทำงานป้องกันมอเตอร์ไหม้',
        replacedParts: 'ซ่อมแซมสายสัญญาณหุ้มท่อหด 2 ชั้น และเปลี่ยน Hall Sensor บอร์ดเล็กแท้ LG เบอร์ 6501KW2002A',
        postRepairTest: 'รันโหมดซัก 35 นาที และปั่นหมาดความเร็วสูงสุด 1200 RPM หมุนเงียบ ไร้การสั่นสะเทือน โค้ด LE หายขาด',
        photos: [
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
  },
  {
    id: 'rep-002',
    code: 'FIX-202610-002',
    category: 'สมาร์ททีวี / แอลอีดีทีวี',
    brand: 'Samsung',
    model: 'UA55NU7100 (55 นิ้ว 4K UHD)',
    serialNumber: 'SAM-NU55-7832',
    technicianName: 'ช่างยุทธ',
    branchName: 'สำนักงานใหญ่',
    repairDate: '2026-10-18',
    status: 'completed',
    estimatedCost: 2200,
    notes: 'อาการยอดฮิตของรุ่น NU7100 แบ็คไลท์เสื่อม ดัดแปลงดรอปกระแส Backlight LED เพื่อความทนทาน 3-5 ปี',
    createdAt: '2026-10-18T09:15:00Z',
    updatedAt: '2026-10-18T15:20:00Z',
    symptoms: [
      {
        id: 'sym-002-1',
        symptomTitle: 'มีเสียงปกติ สั่งงานรีโมทได้ แต่หน้าจอมืดสนิท ไม่มีแสง Backlight',
        visualCheck: 'เปิดฝาหลังดูบอร์ด Power Supply ไม่พบคราบไหม้ แต่เมื่อแกะเปิดชั้นกรองแสงพบแถบหลอด LED ขอบล่างไหม้เกรียม 4 จุด เม็ดเลนส์หลุด',
        functionCheck: 'เสียบปลั๊กไฟ LED หน้าเครื่องกระพริบ 2 ครั้งแล้วติดค้าง ได้ยินเสียงเมนูทีวี ส่องไฟฉายจ่อที่จอเห็นโลโก้ Samsung ลางๆ',
        checkTechnique: 'ใช้เครื่องวัดหลอด LED Tester วัดไฟแถบหลอด แถบซ้ายกินไฟ 148V (ปกติ 128V) แถบขวาไม่ติด วงจร Driver ตัด Protect',
        rootCause: 'หลอด LED แบบ Edge-lit ระบายความร้อนสะสม ทำให้ชิป LED เสื่อมสภาพและช็อตขาด วงจร LED Driver ตรวจพบกระแสผิดปกติจึงตัดไฟทั้งหมด',
        replacedParts: 'เปลี่ยนแถบไฟ LED Backlight ขอบล่างแท้อลูมิเนียมเกรด A จำนวน 2 เส้น (แถบละ 40 เม็ด 6V) พร้อมปรับเปลี่ยนตัวต้านทาน R-Sense บนบอร์ดจ่ายไฟ',
        postRepairTest: 'วัดกระแสขับ LED หลังปรับแต่งลดลงจาก 420mA เหลือ 310mA แสงสว่างเต็มตา ลดความร้อนสะสม เทสต์ภาพ 4K ต่อเนื่อง 4 ชั่วโมงผ่านฉลุย',
        photos: [
          'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        ],
        circuitDiagram: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'rep-003',
    code: 'FIX-202610-003',
    category: 'มอเตอร์ & ปั๊มน้ำ',
    brand: 'Mitsubishi',
    model: 'IP-505B Inverter ปั๊มน้ำแรงดันคงที่ 500W',
    serialNumber: 'MIT-PUMP-505-99',
    technicianName: 'ช่างเอก (สาขาขอนแก่น)',
    branchName: 'สาขาขอนแก่น',
    repairDate: '2026-10-15',
    status: 'completed',
    estimatedCost: 1800,
    notes: 'ตรวจเช็ค Pressure Transducer และซีลยางกันน้ำ เปลี่ยนบอร์ดเซนเซอร์',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-15T14:30:00Z',
    symptoms: [
      {
        id: 'sym-003-1',
        symptomTitle: 'ปั๊มน้ำเดินไม่หยุด ไม่ยอมตัดการทำงาน ท่อร้อนจัด',
        visualCheck: 'ส่องดูตัวเรือนปั๊มไม่มีน้ำรั่ว แต่ตรงขั้วปลั๊ก Pressure Transducer มีคราบเกลือและสนิมเขียวจับ',
        functionCheck: 'ปิดก๊อกน้ำทุกจุดในบ้าน ปั๊มยังคงรันที่รอบสูง 3500 RPM ตลอดเวลา หน้าจอไฟ Error E-03 ขึ้นเตือน',
        checkTechnique: 'วัดแรงดันไฟขาออกของเซนเซอร์แรงดัน (0.5V - 4.5V) พบว่าส่งค่า 0.6V คงที่ ไม่เปลี่ยนแปลงตามแรงดันจริงในถัง',
        rootCause: 'แผ่นไดอะแฟรมด้านใน Pressure Sensor รั่วซึมทำให้คอยล์ตรวจจับแรงดันช็อต ส่งค่าแรงดันต่ำหลอกกล่องควบคุมว่าไม่มีแรงดันในระบบ',
        replacedParts: 'เปลี่ยนเซนเซอร์แรงดัน Pressure Transducer 0-5 Bar แท้ Mitsubishi + เปลี่ยนโอริงกันน้ำรั่ว',
        postRepairTest: 'ตั้งค่าแรงดันตัดที่ 2.8 Bar ต่อที่ 2.2 Bar ปั๊มตัดต่อแม่นยำ มอเตอร์เร่ง-หรี่รอบตามการเปิดก๊อกน้ำนุ่มนวลสมบูรณ์แบบ',
        photos: [
          'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
        ],
        circuitDiagram: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export const INITIAL_BRANCH_USERS: BranchUser[] = [
  {
    id: 'branch-01',
    name: 'สาขาพระราม 2 (ช่างตั้ม)',
    phone: '081-234-5678',
    branchCode: 'B-RAMA2',
    shareUrl: '?branch=B-RAMA2',
    username: 'rama2_tech',
    password: 'password123',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 วันข้างหน้า
    isActive: true,
    createdAt: '2026-10-01',
    notes: 'สาขาหลักฝั่งธนบุรี บริการซ่อมบอร์ดอินเวอร์เตอร์และเครื่องใช้ไฟฟ้า',
  },
  {
    id: 'branch-02',
    name: 'สาขาขอนแก่น (ช่างเอก)',
    phone: '086-987-6543',
    branchCode: 'B-KKN',
    shareUrl: '?branch=B-KKN',
    username: 'kkn_tech',
    password: 'kknpass2026',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 วันข้างหน้า
    isActive: true,
    createdAt: '2026-10-05',
    notes: 'ตัวแทนภาคอีสาน ศูนย์ซ่อมปั๊มน้ำ มอเตอร์ และตู้เชื่อม',
  },
  {
    id: 'branch-03',
    name: 'สาขาเชียงใหม่ (ช่างเปี๊ยก)',
    phone: '082-345-6789',
    branchCode: 'B-CNX',
    shareUrl: '?branch=B-CNX',
    username: 'cnx_tech',
    password: 'cnxpass999',
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // หมดอายุไปแล้ว 2 วัน (สำหรับทดสอบการแจ้งเตือน & ต่ออายุ)
    isActive: true,
    createdAt: '2026-09-10',
    notes: 'สาขาภาคเหนือ (สถานะ: รอต่ออายุสิทธิ์เข้าใช้งานระบบ)',
  },
];

export const INITIAL_QUICK_PINPOINTS: import('../types').QuickPinpointRecord[] = [
  {
    id: 'pin-001',
    model: 'บอร์ดเครื่องซักผ้า Samsung WA16J6750SP (Inverter)',
    brand: 'Samsung',
    symptom: 'เปิดไม่ติด ไฟไม่เข้าสวิทชิ่งเงียบสนิท ฟิวส์ขาด',
    photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    photoDescription: 'จุดเสียช็อตทะลุ: ตรวจบริเวณเพาเวอร์ซัพพลาย พบไดโอดบริดจ์ D101 ช็อตทะลุ และ R-Fuse 10 โอห์มขาดลอย ส่งผลให้ไฟ 300Vdc ไม่เข้าหม้อแปลงสวิทชิ่ง',
    replacedWhat: 'เปลี่ยน Diode Bridge 4A/600V และ R-Fuse กระเบื้อง 10Ω 5W บอร์ดจ่ายไฟ 15V และ 5V นิ่งสนิท จบงานใน 15 นาที',
    createdAt: '2026-10-23T14:00:00Z',
    author: 'ช่างยุทธ',
  },
  {
    id: 'pin-002',
    model: 'สมาร์ททีวี TCL 55T6 (4K UHD)',
    brand: 'TCL',
    symptom: 'มีเสียงภาพมืด แสง Backlight ไม่ติด',
    photo: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
    photoDescription: 'จุดเสียหลอดขาด: เม็ด LED แถบที่ 2 เม็ดที่ 5 ช็อตขาด ทำให้วงจร LED Driver ตัดระบบป้องกันทันทีที่เปิดเครื่อง',
    replacedWhat: 'เปลี่ยนชุดแถบไฟ LED Backlight ขอบอลูมิเนียมแท้ 4 เส้น ยกชุด พร้อมปรับแต่งลดกระแสขับ 15% เพื่อความทนทาน 3-5 ปี',
    createdAt: '2026-10-22T11:30:00Z',
    author: 'ช่างยุทธ',
  },
];

export const INITIAL_DISASSEMBLY_GUIDES: import('../types').DisassemblyGuide[] = [
  {
    id: 'guide-001',
    model: 'แอร์ติดผนัง Daikin Inverter FTKQ-UV2S',
    symptom: 'ขั้นตอนการถอดชุดถาดน้ำทิ้งและมอเตอร์พัดลมกรงกระรอกคอยล์เย็น',
    type: 'disassembly',
    steps: [
      {
        id: 'step-01',
        stepNumber: 1,
        photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        description: 'ปิดเบรกเกอร์แอร์ ถอดหน้ากากฟิลเตอร์กรองอากาศออก แล้วขันสกรู 3 ตัวบริเวณขอบล่างของหน้ากากครอบตัวเครื่อง',
      },
      {
        id: 'step-02',
        stepNumber: 2,
        photo: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        description: 'ปลดสลักล็อกถาดน้ำทิ้งด้านซ้ายและขวา ปลดท่อน้ำทิ้งและขั้วมอเตอร์สวิง ดึงถาดน้ำทิ้งลงด้านล่างตรงๆ',
      },
      {
        id: 'step-03',
        stepNumber: 3,
        photo: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
        description: 'ใช้ประแจหกเหลี่ยมเบอร์ 2.5 คลายสกรูล็อกแกนพัดลมกรงกระรอก ยกแผงรังผึ้งคอยล์เย็นขึ้น 30 องศา แล้วสไลด์พัดลมและมอเตอร์ออกมาได้โดยไม่ต้องตัดท่อน้ำยา',
      },
    ],
    createdAt: '2026-10-21T09:00:00Z',
    author: 'ช่างยุทธ',
  },
];

export const INITIAL_REVISIONS: RevisionRecord[] = [
  {
    revision: 'Rev 1.4.0',
    date: '2026-10-27',
    description: 'ปลดล็อกระบบ Deployment 100% ไร้ Error บน Vercel และ GitHub',
    details: [
      'แก้ไขระบบ Build ของ Vite ไม่ต้องพึ่งพาสคริปต์ภายนอก ("build": "vite build")',
      'ตัดการพึ่งพาโมดูลชั่วคราว sourceBundleBase64 ใน exportSourceZip แก้ปัญหา [UNRESOLVED_IMPORT] บน Vercel ถาวร',
      'รวมไฟล์โครงสร้างระบบทั้งหมด (.npmrc, vercel.json, vite.config.ts, src/, public/, scripts/) ครบ 100% ใน Source Code ZIP ชุดใหม่',
      'ลดขนาด Bundle ลดภาระแรมและเวลา Build เหลือเพียง 400ms พร้อมคู่มือการอัปเดตไฟล์ขึ้น GitHub แบบละเอียด',
    ],
  },
  {
    revision: 'Rev 1.3.0',
    date: '2026-10-23',
    description: 'ปรับปุ่ม 3D มีเฉพาะไอคอน (จิ้มนิ้ว/ประแจ/สมองอิเล็กทรอนิกส์) & ชื่อหัวข้อใต้ปุ่ม',
    details: [
      'ในปุ่มใส่เฉพาะไอคอนขนาดใหญ่โดดเด่น: 1) ไอคอนจิ้มนิ้วชี้จุดเสีย (เล่มแดง), 2) ไอคอนรูปประแจ (เล่มเหลือง), 3) ไอคอนสมองอิเล็กทรอนิกส์ (เล่มเขียว)',
      'ย้ายคำบรรยายมาไว้ใต้ปุ่ม โดยแสดงเฉพาะชื่อหัวข้อสั้นกระชับ ตัดข้อความยาวๆ ออกตามคำขอเพื่อประหยัดพื้นที่',
      'รองรับการจัดวางแนวนอน และสลับเป็นแนวตั้งอัตโนมัติหากพื้นที่หน้าจอแคบ',
    ],
  },
  {
    revision: 'Rev 1.2.0',
    date: '2026-10-23',
    description: 'ดีไซน์ปุ่มคัมภีร์สมุดนูน 3D แยก 3 สี (แดง/เหลือง/เขียว) & หน้าหลักกระชับสูงสุด',
    details: [
      'แปลงปุ่มเมนูหลักเป็นรูปเล่มสมุดคัมภีร์นูนแบบ 3D สวยงามสมจริง พร้อมสันปก ริบบิ้นคั่นหน้า และสันกระดาษ',
      'เล่มที่ 1: สีแดง (ชี้จุดเสีย แบบซวดลวดรวดเร็ว)',
      'เล่มที่ 2: สีเหลืองทอง (วิธีถอดเครื่อง / วิธีประกอบเครื่อง)',
      'เล่มที่ 3: สีเขียวมรกต (คลังคัมภีร์ซวดรวดรวมอาการเสีย ตารางเดิม)',
      'ประหยัดพื้นที่หน้าจอ: หลังจากปุ่มกดไม่มีข้อมูลต่อท้ายค้างบนหน้าหลัก เมื่อคลิกจะเปิดเข้าสู่คัมภีร์เล่มนั้นทันที พร้อมปุ่มย้อนกลับ',
    ],
  },
  {
    revision: 'Rev 1.1.0',
    date: '2026-10-23',
    description: 'ปรับโฉมหน้าหลักสไตล์ม้วนคัมภีร์อิเล็กทรอนิกส์ & 3 ปุ่มเมนูลัดซวดลวด',
    details: [
      'หน้าปกกะทัดรัดไม่กินพื้นที่ ออกแบบเป็นรูปม้วนคัมภีร์คลี่ออก (Unfurled Scroll) ลายแผงวงจรอิเล็กทรอนิกส์และสัญลักษณ์อุปกรณ์ R, C, L, Diode, Transistor',
      'ข้อความหน้าปกหลัก "คัมภีร์ลับซ่างซวดลวด" พร้อมชื่อร้าน/เบอร์/ไลน์ ด้านใต้ ปรับเปลี่ยนได้ที่หน้าตั้งค่า',
      'ลบข้อความเดิมที่ไม่จำเป็นออกตามสั่ง เพื่อให้พื้นที่หน้าจอกระชับ ใช้งานคล่องตัว',
      'เพิ่ม 3 ปุ่มเมนูหลักส่วนกลาง: 1) ชี้จุดเสีย แบบซวดลวดรวดเร็ว (รูป+อธิบายข้างภาพ+เปลี่ยนอะไร), 2) วิธีถอด/ประกอบเครื่อง (1-10 รูป+อธิบายขั้นตอน), 3) คลังคัมภีร์ซวดรวดรวมอาการเสีย (ตารางเดิม)',
    ],
  },
  {
    revision: 'Rev 1.0.0',
    date: '2026-10-23',
    description: 'เปิดตัวคัมภีร์ยุทธซ่างซวดลวดFix it เวอร์ชันปฐมฤกษ์',
    details: [
      'ส่วนที่ 1: หน้าแรก แบนเนอร์หน้าปก ระบบโปรไฟล์ร้าน ช่าง เบอร์โทร ไลน์ ปรับแต่งและเปลี่ยนรูปหน้าปกได้',
      'ส่วนที่ 2: ฟอร์มบันทึกอาการเสีย 1, 2, ... แบบไดนามิก บันทึก Visual Check, Function Check, แนวทางวัดค่า, Root Cause, อะไหล่, ผลทดสอบ, ถ่ายรูป 2-3 ภาพ และแนบวงจร',
      'ส่วนที่ 3: ตารางรวมสรุปอาการเสีย คัดกรองและแยกตามประเภทสินค้า ค้นหาเร็ว และปุ่มกดเปิดดู Sheet',
      'ส่วนที่ 4: Technical Sheet แยกละเอียด ดูลึกทุกอาการเสียและรูปถ่าย พร้อมระบบ Print / Export',
      'ระบบ Admin & สาขา: สร้างลิงก์สาขา กำหนดวันหมดอายุ ตรวจสอบอายุ ต่ออายุโดยซ่อนรหัสผ่านในช่องพิมพ์ ระบบ Login ป้องกันการต่ออายุเอง',
    ],
  },
];
