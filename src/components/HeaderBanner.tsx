import React from 'react';
import { ShopProfile, AuthSession, GlobalThemeSettings } from '../types';
import { checkBranchExpiry } from '../utils/storage';
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  LogOut,
  UserCheck,
  GitBranch,
  Sparkles,
  Zap,
  Store,
  User,
} from 'lucide-react';

interface HeaderBannerProps {
  profile: ShopProfile;
  session: AuthSession;
  activeRevision: string;
  theme?: GlobalThemeSettings;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenRevisionModal: () => void;
}

/**
 * HeaderBanner สไตล์ม้วนคัมภีร์มินิมอล (Ultra-Compact Low-Profile)
 * แสดงเฉพาะ:
 * - มุมบนซ้าย: Revision + สถานะ Admin/สาขา
 * - มุมบนขวา: ปุ่มออกจากระบบ
 * - ตรงกลาง: ชื่อคัมภีร์ลับช่างซวดลวด ลงมาถึง ชื่อร้าน, เบอร์โทร และ LINE
 * ลดพื้นที่แนวตั้งลงสูงสุด เพื่อไม่ให้กินพื้นที่การทำงาน
 */
export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  profile,
  session,
  activeRevision,
  theme,
  onOpenLoginModal,
  onLogout,
  onOpenRevisionModal,
}) => {
  const expiryStatus = session.expiresAt ? checkBranchExpiry(session.expiresAt) : null;

  const brandTitle = theme?.brandTitle || 'คัมภีร์ลับช่างซวดลวด';
  const brandSubtitle = theme?.brandSubtitle || 'ศูนย์รวมเทคนิคชี้จุดเสีย • วิธีถอดประกอบ • คลังวงจรและคัมภีร์งานซ่อม';
  const taglineBadge = theme?.taglineBadge || 'Fix it Pro';

  const titleWeightClass =
    theme?.headerFontWeight === 'normal'
      ? 'font-normal'
      : theme?.headerFontWeight === 'bold'
      ? 'font-bold'
      : 'font-black';

  return (
    <header className="header-banner relative bg-[#04060a] text-white shadow-lg overflow-hidden print:hidden border-b border-amber-500/80 select-none">
      {/* Background Layer: ผืนคัมภีร์สีดำเข้มขอบทองลายวงจร */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* ภาพพื้นหลังร้าน (ถ้ามี) แบบมืดสนิทกลมกลืน */}
        {profile.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 filter brightness-40 contrast-125 mix-blend-luminosity"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          />
        )}

        {/* ผืนคัมภีร์สีดำเข้มขอบทอง */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1f1204 0%, #451a03 1.5%, rgba(6,9,15,0.96) 6%, rgba(3,5,9,0.94) 50%, rgba(6,9,15,0.96) 94%, #451a03 98.5%, #1f1204 100%), linear-gradient(180deg, rgba(217,119,6,0.12) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* แกนม้วนคัมภีร์ทอง 3D ฝั่งซ้ายและขวา */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 sm:w-3 z-20 border-r border-amber-400/40"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1c0f04 0%, #78350f 18%, #fef08a 45%, #b45309 75%, #451a03 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2 sm:w-3 z-20 border-l border-amber-400/40"
          style={{
            backgroundImage:
              'linear-gradient(270deg, #1c0f04 0%, #78350f 18%, #fef08a 45%, #b45309 75%, #451a03 100%)',
          }}
        />

        {/* ลายวงจรอิเล็กทรอนิกส์สีทองบนพื้นสีมืด */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="gold-circuit-pattern-compact"
              width="120"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 30 L 25 30 L 38 18 L 70 18 L 80 28 L 110 28 L 120 38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <circle cx="25" cy="30" r="1.8" fill="#fef08a" />
              <circle cx="70" cy="18" r="1.5" fill="#fbbf24" />
              <path
                d="M 6 10 L 12 10 L 15 6 L 19 14 L 23 6 L 27 14 L 30 10 L 36 10"
                fill="none"
                stroke="#facc15"
                strokeWidth="1"
              />
              <path
                d="M 80 8 L 86 8 M 86 3 L 86 13 M 89 3 L 89 13 M 89 8 L 95 8"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-circuit-pattern-compact)" />
        </svg>

        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
      </div>

      {/* Main Content Area: กะทัดรัด ประหยัดพื้นที่สูงสุด */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 space-y-1.5">
        {/* แถบด้านบนสุด: Revision + สถานะ ฝั่งซ้าย | ปุ่มออกจากระบบ ฝั่งขวา */}
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs pb-1 border-b border-amber-500/20">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Revision */}
            <button
              onClick={onOpenRevisionModal}
              title="คลิกดูประวัติการอัปเดตเวอร์ชัน"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition cursor-pointer"
            >
              <GitBranch className="w-2.5 h-2.5 text-amber-400" />
              <span className="font-mono font-bold">{activeRevision}</span>
            </button>

            {/* แสดงสถานะ Admin หรือ สาขา */}
            {session.role === 'admin' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/40 font-bold">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin ส่วนกลาง</span>
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>สาขา: {session.branchName || session.branchCode || 'ผู้ใช้งาน'}</span>
                </span>

                {expiryStatus && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border text-[10px] ${
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

          {/* ปุ่มออกจากระบบ / เข้าสู่ระบบ ที่มุมขวาบน (ทำไว้ดีแล้วตามที่ผู้ใช้สั่ง) */}
          <div>
            {session.isLoggedIn ? (
              <button
                onClick={onLogout}
                title={
                  session.role === 'branch_user'
                    ? 'ออกจากระบบสาขา (จะยังคงอยู่ในลิงก์สาขานี้ ไม่เด้งเข้า Admin)'
                    : 'ออกจากระบบ / สลับผู้ใช้งาน'
                }
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[10px] sm:text-xs font-bold transition cursor-pointer shadow-xs ${
                  session.role === 'branch_user'
                    ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border-rose-700/60 hover:border-rose-500'
                    : 'bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-800/50 hover:border-rose-500'
                }`}
              >
                <LogOut className="w-3 h-3" />
                <span>
                  {session.role === 'branch_user' ? 'ออกจากระบบสาขา' : 'ออกจากระบบ'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-[10px] sm:text-xs transition cursor-pointer shadow-xs"
              >
                <span>
                  {session.role === 'branch_user' ? 'เข้าสู่ระบบสาขา' : 'เข้าสู่ระบบ'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ส่วนเนื้อหาหลัก: เอาแค่ส่วนคัมภีร์ลับ ลงมาถึง ไลน์ (Ultra Compact) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          {/* ชื่อคัมภีร์และสโลแกน */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[1.5px] shadow-sm shadow-amber-500/20 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <h1
                  className={`text-lg sm:text-xl lg:text-2xl ${titleWeightClass} tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.3)]`}
                >
                  {brandTitle}
                </h1>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Sparkles className="w-2 h-2 text-amber-400" />
                  {taglineBadge}
                </span>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-amber-200/80 tracking-wide font-medium">
              {brandSubtitle}
            </p>
          </div>

          {/* ข้อมูลชื่อร้าน เบอร์โทร และ LINE (ลงมาถึงไลน์) */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 text-[11px]">
            {/* ชื่อร้าน */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-white font-bold shadow-xs">
              <Store className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-[240px]">
                {profile.shopName || 'คัมภีร์ยุทธช่างซวดลวด'}
              </span>
            </div>

            {/* ช่างผู้รับผิดชอบ (ถ้ามี) */}
            {profile.technicianName && (
              <div className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/70 border border-slate-700 text-amber-300 text-[10px]">
                <User className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span>ช่าง: {profile.technicianName}</span>
              </div>
            )}

            {/* เบอร์โทร */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold transition shadow-xs cursor-pointer"
                title="แตะเพื่อโทรออก"
              >
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>โทร: {profile.phone}</span>
              </a>
            )}

            {/* LINE */}
            {profile.lineId && (
              <a
                href={`https://line.me/R/ti/p/~${profile.lineId.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 font-semibold transition shadow-xs cursor-pointer"
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
