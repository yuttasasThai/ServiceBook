# คัมภีร์ลับซ่างซวดลวด (Fix it)

ระบบบันทึกและรวบรวมคลังความรู้งานซ่อมอิเล็กทรอนิกส์, ชี้จุดเสียด่วน (Quick Pinpoint), วิธีถอดและประกอบเครื่อง (Disassembly & Assembly Guides), คลังคัมภีร์สรุปอาการเสีย และระบบจัดการสิทธิ์สาขา/ผู้ดูแลระบบ

---

## 🚀 วิธีติดตั้งและเปิดใช้งานในเครื่อง (Local Setup)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **เปิด Development Server:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

3. **ทดสอบ Build สำหรับ Production:**
   ```bash
   npm run build
   ```

---

## 🐙 วิธีนำโปรเจกต์ขึ้น GitHub

1. เปิด Terminal ในโฟลเดอร์โปรเจกต์นี้
2. เริ่มต้น Git Repository:
   ```bash
   git init
   git branch -M main
   ```
3. เพิ่มไฟล์ทั้งหมดและ Commit:
   ```bash
   git add .
   git commit -m "Initial commit: คัมภีร์ลับซ่างซวดลวด Fix it"
   ```
4. สร้าง Repository ใหม่บน [GitHub](https://github.com/new)
5. เชื่อมต่อและ Push โค้ดขึ้น GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

---

## ⚡ วิธี Deploy ขึ้น Vercel (ฟรี & อัปเดตอัตโนมัติ)

1. เข้าสู่ระบบ [Vercel](https://vercel.com)
2. คลิก **"Add New..."** -> **"Project"**
3. เลือก Repository GitHub ที่เพิ่ง Push ขึ้นไป แล้วคลิก **"Import"**
4. ตรวจสอบการตั้งค่า (Vercel จะตรวจจับอัตโนมัติ):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. คลิก **"Deploy"**
6. ภายใน 1-2 นาที คุณจะได้ลิงก์เว็บไซต์พร้อมใช้งานทั่วโลกทันที! เมื่อมีการ Push โค้ดใหม่ขึ้น GitHub ระบบ Vercel จะอัปเดตเว็บให้อัตโนมัติ

---

## 🛠️ โครงสร้างเทคโนโลยีที่ใช้ (Tech Stack)
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6+
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: Client-Side Persistent Storage (LocalStorage)
