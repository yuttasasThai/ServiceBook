import React, { useState } from 'react';
import { ShopProfile, AuthSession } from '../types';
import { checkBranchExpiry } from '../utils/storage';
import { downloadSourceZip } from '../utils/exportSourceZip';
import {
  Phone,
  MessageCircle,
  Camera,
  ShieldCheck,
  Clock,
  LogOut,
  UserCheck,
  GitBranch,
  Sparkles,
  Zap,
  Store,
  User,
  Download,
  Check,
  RotateCcw,
} from 'lucide-react';

interface HeaderBannerProps {
  profile: ShopProfile;
  session: AuthSession;
  activeRevision: string;
  onOpenSettings: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenRevisionModal: () => void;
  onOpenResetModal: () => void;
  onOpenBranchSettings?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  profile,
  session,
  activeRevision,
  onOpenSettings,
  onOpenLoginModal,
  onLogout,
  onOpenRevisionModal,
  onOpenResetModal,
  onOpenBranchSettings,
}) => {
  const expiryStatus = session.expiresAt ? checkBranchExpiry(session.expiresAt) : null;
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = () => {
    const res = downloadSourceZip('khamphi-suadluad-source.zip');
    if (res.success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <header className="header-banner relative bg-[#04060a] text-white shadow-xl overflow-hidden print:hidden border-b border-amber-500/80 select-none">
      {/* =========================================================================
          ดีไซน์ม้วนคัมภีร์อิเล็กทรอนิกส์ (ลายวงจรสีทองบนพื้นสีมืด กะทัดรัดไม่เปลืองพื้นที่)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: ภาพพื้นหลังร้าน (ถ้ามี) แบบมืดสนิทกลมกลืน */}
        {profile.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 filter brightness-40 contrast-125 mix-blend-luminosity"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          />
        )}

        {/* Layer 2: ผืนคัมภีร์สีดำเข้มขอบทอง (Gold-embossed Dark Parchment Gradient) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1f1204 0%, #451a03 1.5%, rgba(6,9,15,0.96) 6%, rgba(3,5,9,0.94) 50%, rgba(6,9,15,0.96) 94%, #451a03 98.5%, #1f1204 100%), linear-gradient(180deg, rgba(217,119,6,0.12) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Layer 3: แกนม้วนคัมภีร์ทอง 3D ฝั่งซ้าย (Left Gold Scroll Rod) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 sm:w-3.5 z-20 border-r border-amber-400/40"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1c0f04 0%, #78350f 18%, #fef08a 45%, #b45309 75%, #451a03 100%)',
            boxShadow: '2px 0 10px rgba(0,0,0,0.9)',
          }}
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-800 rounded-b" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-t from-yellow-200 via-amber-400 to-amber-800 rounded-t" />
        </div>

        {/* Layer 4: แกนม้วนคัมภีร์ทอง 3D ฝั่งขวา (Right Gold Scroll Rod) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 sm:w-3.5 z-20 border-l border-amber-400/40"
          style={{
            backgroundImage:
              'linear-gradient(270deg, #1c0f04 0%, #78350f 18%, #fef08a 45%, #b45309 75%, #451a03 100%)',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.9)',
          }}
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-800 rounded-b" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-t from-yellow-200 via-amber-400 to-amber-800 rounded-t" />
        </div>

        {/* Layer 5: ลายวงจรอิเล็กทรอนิกส์สีทองบนพื้นสีมืด (Golden Electronic Circuit Pattern) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="gold-circuit-pattern"
              width="140"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              {/* ลายเส้นทองแดงทองคำ PCB Traces */}
              <path
                d="M 0 35 L 30 35 L 45 20 L 80 20 L 92 32 L 125 32 L 140 45"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M 15 58 L 52 58 L 65 45 L 98 45 L 110 56 L 140 56"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <path
                d="M 55 8 L 72 8 L 82 16 L 105 16"
                fill="none"
                stroke="#d97706"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />

              {/* จุดบัดกรีและเวียทอง (Gold Via Pads & Solder Points) */}
              <circle cx="30" cy="35" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
              <circle cx="80" cy="20" r="2" fill="#fbbf24" />
              <circle cx="125" cy="32" r="2.2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
              <circle cx="52" cy="58" r="1.8" fill="#f59e0b" />
              <circle cx="98" cy="45" r="2" fill="#fbbf24" />

              {/* สัญลักษณ์: ตัวต้านทานทองคำ (Resistor /\/\/\) */}
              <path
                d="M 6 12 L 13 12 L 16 7 L 20 17 L 24 7 L 28 17 L 32 12 L 39 12"
                fill="none"
                stroke="#facc15"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />

              {/* สัญลักษณ์: ตัวเก็บประจุทอง (Capacitor --||--) */}
              <path
                d="M 92 10 L 100 10 M 100 4 L 100 16 M 103 4 L 103 16 M 103 10 L 111 10"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.1"
              />

              {/* สัญลักษณ์: ไดโอด (Diode -|>|-) */}
              <path
                d="M 38 40 L 45 40 M 45 35 L 52 40 L 45 45 Z M 52 35 L 52 45 M 52 40 L 59 40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeLinejoin="round"
              />

              {/* สัญลักษณ์: กราวด์ทอง (Ground ⏚) */}
              <path
                d="M 75 52 L 75 57 M 69 57 L 81 57 M 71 60 L 79 60 M 73 63 L 77 63"
                fill="none"
                stroke="#eab308"
                strokeWidth="1"
              />

              {/* ชิป IC ขนาดเล็กพร้อมขาสีทอง */}
              <rect x="115" y="6" width="14" height="12" rx="1.5" fill="#1e1b18" stroke="#d97706" strokeWidth="0.8" />
              <line x1="113" y1="8" x2="115" y2="8" stroke="#fef08a" strokeWidth="0.7" />
              <line x1="113" y1="12" x2="115" y2="12" stroke="#fef08a" strokeWidth="0.7" />
              <line x1="113" y1="16" x2="115" y2="16" stroke="#fef08a" strokeWidth="0.7" />
              <line x1="129" y1="8" x2="131" y2="8" stroke="#fef08a" strokeWidth="0.7" />
              <line x1="129" y1="12" x2="131" y2="12" stroke="#fef08a" strokeWidth="0.7" />
              <line x1="129" y1="16" x2="131" y2="16" stroke="#fef08a" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-circuit-pattern)" />
        </svg>

        {/* แสงสปอตไลท์สีทองเรืองรองตรงกลางคัมภีร์ (Subtle Gold Aura) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-20 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 80%)',
          }}
        />

        {/* เส้นขอบทองบางด้านบนและล่างเพิ่มความประณีต */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
      </div>

      {/* =========================================================================
          เนื้อหา HeaderBanner แบบกะทัดรัด (Low Profile Height, ประหยัดพื้นที่หน้าจอ)
         ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        {/* แถบมินิบาร์ด้านบน: Revision, สถานะสาขา/Admin, และปุ่มตั้งค่า (Compact single row) */}
        <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-amber-500/20 text-[10px] sm:text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* ป้ายแสดง Revision */}
            <button
              onClick={onOpenRevisionModal}
              title="คลิกดูประวัติการอัปเดต Source Code"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition cursor-pointer"
            >
              <GitBranch className="w-2.5 h-2.5 text-amber-400" />
              <span className="font-mono font-bold">{activeRevision}</span>
            </button>

            {/* แสดงสถานะ Admin หรือ สาขา */}
            {session.role === 'admin' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 font-semibold">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin</span>
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-semibold">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>สาขา: {session.branchName || 'ผู้ใช้งาน'}</span>
                </span>

                {expiryStatus && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${
                      expiryStatus.isExpired
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                        : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{expiryStatus.displayText}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* ปุ่มรีเซ็ตค่าเริ่มต้น / เคลียร์งานเก่า */}
            <button
              onClick={onOpenResetModal}
              title="เคลียร์งานเก่าทั้งหมดเพื่อเริ่มใหม่ หรือคืนค่าเริ่มต้นโรงงาน"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 text-[10px] sm:text-xs font-semibold transition cursor-pointer hover:border-amber-400"
            >
              <RotateCcw className="w-2.5 h-2.5 text-amber-400" />
              <span className="hidden sm:inline">เคลียร์งาน / </span>รีเซ็ต
            </button>

            {/* ปุ่มดาวน์โหลด Source Code .ZIP - เฉพาะ Admin เท่านั้น */}
            {session.role === 'admin' && (
              <button
                onClick={handleDownloadZip}
                title="ดาวน์โหลด Source Code ทั้งหมดเป็นไฟล์ .ZIP แท้ (สำหรับ GitHub & Vercel)"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] sm:text-xs font-bold transition shadow-xs cursor-pointer ${
                  downloadSuccess
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50 hover:border-amber-400'
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    <span>โหลด .ZIP สำเร็จ!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-2.5 h-2.5 text-amber-400" />
                    <span>โหลด Source (.ZIP)</span>
                  </>
                )}
              </button>
            )}

            {/* ปุ่มแก้ไขข้อมูลร้าน & หน้าปก - เฉพาะ Admin เท่านั้น */}
            {session.role === 'admin' && (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-semibold transition cursor-pointer hover:border-amber-400"
                title="เปลี่ยนรูปหน้าปก & ข้อมูลร้าน (สำนักงานใหญ่)"
              >
                <Camera className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">เปลี่ยนรูปหน้าปก / </span>ข้อมูลร้าน
              </button>
            )}

            {/* ปุ่มตั้งค่าข้อมูลสาขา & รูปหน้าปก - เฉพาะ โหมดสาขา (ไม่เข้าถึงการสร้างลิงก์) */}
            {session.role === 'branch_user' && onOpenBranchSettings && (
              <button
                onClick={onOpenBranchSettings}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 border border-amber-500/50 text-[10px] sm:text-xs font-bold transition cursor-pointer hover:border-amber-400 shadow-xs"
                title="ตั้งค่าภาพหน้าปก ชื่อร้าน เบอร์ และ LINE เฉพาะสาขาของคุณ (ไม่เข้าถึงหน้าสร้างลิงก์)"
              >
                <Camera className="w-3 h-3 text-amber-400" />
                <span>ตั้งค่าหน้าปก / สาขา</span>
              </button>
            )}

            {session.isLoggedIn ? (
              <button
                onClick={onLogout}
                title={
                  session.role === 'branch_user'
                    ? 'ออกจากระบบสาขา (จะยังคงอยู่ในลิงก์สาขานี้ ไม่เด้งเข้า Admin)'
                    : 'ออกจากระบบ / สลับผู้ใช้งาน'
                }
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] sm:text-xs font-bold transition cursor-pointer ${
                  session.role === 'branch_user'
                    ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border-rose-700/60 shadow-xs hover:border-rose-500'
                    : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40'
                }`}
              >
                <LogOut className="w-2.5 h-2.5" />
                <span>
                  {session.role === 'branch_user' ? 'ออกจากระบบสาขา' : 'ออกจากระบบ'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-[10px] sm:text-xs transition cursor-pointer shadow-xs"
              >
                <span>
                  {session.role === 'branch_user' ? 'เข้าสู่ระบบสาขา' : 'เข้าสู่ระบบ'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ส่วนหลัก: ชื่อคัมภีร์ "คัมภีร์ลับซ่างซวดลวด" และชื่อร้าน/เบอร์โทร (Compact Vertical Profile) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          {/* หัวข้อแสดงผลหลัก */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[1.5px] shadow-md shadow-amber-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.3)]">
                คัมภีร์ลับซ่างซวดลวด
              </h1>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2 h-2 text-amber-400" />
                Fix it
              </span>
            </div>
          </div>

          {/* ข้อมูลชื่อร้าน เบอร์โทร และ LINE ดึงมาจาก ShopProfile ใต้/ข้างหัวข้อ */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 text-[11px] sm:text-xs">
            {/* ชื่อร้าน */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-amber-500/40 text-white font-bold shadow-xs">
              <Store className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-[260px]">
                {profile.shopName || 'คัมภีร์ลับซ่างซวดลวด'}
              </span>
            </div>

            {/* ช่าง (ถ้ามี) */}
            {profile.technicianName && (
              <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-700 text-amber-300 text-[10px]">
                <User className="w-2.5 h-2.5 text-amber-400" />
                <span>ช่าง: {profile.technicianName}</span>
              </div>
            )}

            {/* เบอร์โทรศัพท์ */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold transition shadow-xs cursor-pointer"
                title="แตะเพื่อโทรออก"
              >
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>โทร: {profile.phone}</span>
              </a>
            )}

            {/* LINE ID */}
            {profile.lineId && (
              <a
                href={`https://line.me/R/ti/p/~${profile.lineId.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 font-semibold transition shadow-xs cursor-pointer"
                title="แตะเปิด LINE"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>LINE: <strong className="text-white">{profile.lineId}</strong></span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
