import React from 'react';
import {
  FileEdit,
  Table,
  FileSpreadsheet,
  Users,
  Settings,
  Sparkles,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AuthSession } from '../types';

export type ActiveTab = 'home' | 'pinpoint' | 'disassembly' | 'record' | 'table' | 'sheet' | 'admin' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  repairCount: number;
  pinpointCount: number;
  guideCount: number;
  branchCount: number;
  session: AuthSession;
  onOpenBranchSettings?: () => void;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  repairCount,
  pinpointCount,
  guideCount,
  branchCount,
  session,
  onOpenBranchSettings,
  onLogout,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'หน้าหลัก (3 เมนูด่วน)',
      shortLabel: 'หน้าหลัก',
      icon: Sparkles,
      desc: 'ปุ่มชี้จุดเสียด่วน, วิธีถอดประกอบ, คลังคัมภีร์รวม',
    },
    {
      id: 'pinpoint' as ActiveTab,
      label: '1) ชี้จุดเสียด่วน',
      shortLabel: 'ชี้จุดเสีย',
      icon: FileEdit,
      count: pinpointCount,
      desc: 'รุ่น อาการ ถ่ายภาพ อธิบายข้างภาพ เปลี่ยนอะไร',
    },
    {
      id: 'disassembly' as ActiveTab,
      label: '2) วิธีถอด/ประกอบ',
      shortLabel: 'ถอด/ประกอบ',
      icon: Users,
      count: guideCount,
      desc: 'รุ่น อาการ รูปขั้นตอน 1-10 รูป',
    },
    {
      id: 'table' as ActiveTab,
      label: '3) คลังคัมภีร์รวมอาการเสีย',
      shortLabel: 'คลังคัมภีร์รวม',
      icon: Table,
      count: repairCount,
      desc: 'ตารางรวมแยกตามประเภทสินค้า / ค้นหา',
    },
    {
      id: 'record' as ActiveTab,
      label: '+ บันทึกงานซ่อมละเอียด',
      shortLabel: '+ บันทึกละเอียด',
      icon: FileEdit,
      badge: 'ฟอร์มเต็ม',
      desc: 'Visual Check, Function Check, Root Cause, วงจร',
    },
    {
      id: 'sheet' as ActiveTab,
      label: 'Sheet แยก',
      shortLabel: 'Sheet',
      icon: FileSpreadsheet,
      desc: 'ดูรายละเอียดทั้งหมด วงจร ภาพประกอบ พิมพ์',
    },
    {
      id: 'admin' as ActiveTab,
      label: 'จัดการสาขา',
      shortLabel: 'สาขา',
      icon: Users,
      count: branchCount,
      adminOnly: true,
      desc: 'สร้างลิงก์ กำหนดวันหมดอายุ ต่ออายุ รหัสผ่าน',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'ตั้งค่าร้าน',
      shortLabel: 'ตั้งค่า',
      icon: Settings,
      adminOnly: true,
      desc: 'เปลี่ยนรูปหน้าปก ชื่อ เบอร์โทร ไลน์',
    },
  ];

  // If in branch portal mode and not logged in, show locked state banner
  if (session.role === 'branch_user' && !session.isLoggedIn) {
    return (
      <nav className="bg-slate-900 border-b border-amber-500/40 shadow-sm sticky top-0 z-30 print:hidden text-amber-200 text-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold">ระบบเฉพาะสาขา: {session.branchName || session.branchCode}</span>
            <span className="text-slate-400 hidden sm:inline">| กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานคัมภีร์</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-300/90 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
            🔒 ลิงก์สาขาอิสระ
          </span>
        </div>
      </nav>
    );
  }

  // Filter out admin tabs for branch users
  const visibleTabs = tabs.filter((tab) => !(tab.adminOnly && session.role !== 'admin'));

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 scrollbar-thin">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'
                    }`}
                  />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>

                  {tab.count !== undefined && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}

                  {tab.badge && !isActive && (
                    <span className="hidden xl:inline-block text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions & Status on Navbar Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Notice if active as branch user */}
            {session.role === 'branch_user' && (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px]">{session.branchName || session.branchCode}</span>
                </div>
                {onOpenBranchSettings && (
                  <button
                    onClick={onOpenBranchSettings}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer"
                    title="ปรับแต่งภาพหน้าปกและข้อมูลสาขาตัวเอง"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-700" />
                    <span>ตั้งค่าสาขา</span>
                  </button>
                )}
              </div>
            )}

            {/* แสดงปุ่มออกจากระบบบนแถบนำทางเมื่อไม่ได้อยู่หน้าหลัก เพื่อความสะดวก */}
            {activeTab !== 'home' && session.isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
              >
                <LogOut className="w-3 h-3 text-rose-600" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
