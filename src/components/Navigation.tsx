import React from 'react';
import {
  FileEdit,
  Table,
  FileSpreadsheet,
  Users,
  Settings,
  Sparkles,
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
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  repairCount,
  pinpointCount,
  guideCount,
  branchCount,
  session,
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

          {/* Quick Notice if active as branch user */}
          {session.role === 'branch_user' && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>โหมดสาขา: {session.branchName}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
