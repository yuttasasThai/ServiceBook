import React, { useState, useEffect } from 'react';
import {
  RepairEntry,
  ShopProfile,
  BranchUser,
  RevisionRecord,
  AuthSession,
  QuickPinpointRecord,
  DisassemblyGuide,
  BranchCustomProfile,
  GlobalThemeSettings,
} from './types';
import { APP_VERSION } from './constants/version';
import {
  getShopProfile,
  saveShopProfile,
  getRepairs,
  saveOrUpdateRepair,
  deleteRepair,
  getBranchUsers,
  addOrUpdateBranch,
  deleteBranch,
  extendBranchExpiry,
  getRevisions,
  addRevisionRecord,
  getCategories,
  getAuthSession,
  saveAuthSession,
  checkBranchExpiry,
  getQuickPinpoints,
  saveOrUpdateQuickPinpoint,
  deleteQuickPinpoint,
  getDisassemblyGuides,
  saveOrUpdateDisassemblyGuide,
  deleteDisassemblyGuide,
  clearAllWorkData,
  resetToFactoryDefaults,
  getActiveShopProfile,
  saveBranchCustomProfile,
  getGlobalThemeSettings,
  saveGlobalThemeSettings,
} from './utils/storage';
import { HeaderBanner } from './components/HeaderBanner';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeQuickMenu, MainViewMode } from './components/HomeQuickMenu';
import { QuickPinpointSection } from './components/QuickPinpointSection';
import { DisassemblyGuideSection } from './components/DisassemblyGuideSection';
import { RepairForm } from './components/RepairForm';
import { SummaryTable } from './components/SummaryTable';
import { DetailSheetView } from './components/DetailSheetView';
import { AdminBranchManager } from './components/AdminBranchManager';
import { SettingsModal } from './components/SettingsModal';
import { LoginModal } from './components/LoginModal';
import { RevisionModal } from './components/RevisionModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { BranchSettingsModal } from './components/BranchSettingsModal';
import { BranchLoginCard } from './components/BranchLoginCard';
import { DEFAULT_GLOBAL_THEME } from './data/defaultData';
import {
  Sparkles,
  GitBranch,
  Lock,
  ShieldAlert,
  Phone,
  MessageCircle,
  KeyRound,
  Clock,
  Palette,
  Type,
  Layout,
  Sliders,
  Check,
  RotateCcw,
  Zap,
  ShieldCheck,
  Layers,
  X,
} from 'lucide-react';

/* =========================================================================
   1. ลายน้ำสัญลักษณ์ทางไฟฟ้าและอิเล็กทรอนิกส์ (CircuitWatermark)
   รวมไว้ในไฟล์หลักเพื่อป้องกัน Error: [UNRESOLVED_IMPORT] บน Vercel
   ========================================================================= */
const CircuitWatermark: React.FC<{ theme: GlobalThemeSettings }> = ({ theme }) => {
  if (!theme.showCircuitWatermark) return null;

  const opacity = Math.min(Math.max(theme.watermarkOpacity ?? 0.05, 0.02), 0.15);
  const isLightTone = theme.bgTone === 'clean-light';
  const strokeColor = isLightTone ? '#0f172a' : '#38bdf8';
  const goldStroke = isLightTone ? '#b45309' : '#fbbf24';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="electronic-schematic-watermark"
            width={theme.watermarkDensity === 'dense' ? '300' : theme.watermarkDensity === 'subtle' ? '500' : '380'}
            height={theme.watermarkDensity === 'dense' ? '300' : theme.watermarkDensity === 'subtle' ? '500' : '380'}
            patternUnits="userSpaceOnUse"
          >
            {/* 1. ตัวต้านทาน (Resistor /\/\/\) */}
            <g transform="translate(20, 30)">
              <line x1="0" y1="15" x2="15" y2="15" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
              <polyline
                points="15,15 19,5 27,25 35,5 43,25 51,5 59,25 63,15"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line x1="63" y1="15" x2="78" y2="15" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
              <text x="32" y="38" fill={strokeColor} fontSize="8" fontFamily="monospace" textAnchor="middle">
                R 10kΩ
              </text>
            </g>

            {/* 2. คาปาซิเตอร์ / ตัวเก็บประจุ (Capacitor --||--) */}
            <g transform="translate(140, 25)">
              <line x1="0" y1="20" x2="18" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="18" y1="8" x2="18" y2="32" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="24" y1="8" x2="24" y2="32" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="24" y1="20" x2="42" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <text x="21" y="42" fill={strokeColor} fontSize="8" fontFamily="monospace" textAnchor="middle">
                C 100μF
              </text>
            </g>

            {/* 3. กราวด์ไฟฟ้า (Earth Ground ⏚) */}
            <g transform="translate(240, 30)">
              <line x1="20" y1="0" x2="20" y2="16" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="8" y1="16" x2="32" y2="16" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="21" x2="28" y2="21" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
              <line x1="16" y1="26" x2="24" y2="26" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" />
              <text x="20" y="36" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                GND
              </text>
            </g>

            {/* 4. ไดโอด (Diode -|>|-) และ LED */}
            <g transform="translate(310, 25)">
              <line x1="0" y1="18" x2="16" y2="18" stroke={goldStroke} strokeWidth="1.2" />
              <polygon points="16,8 30,18 16,28" fill="none" stroke={goldStroke} strokeWidth="1.2" strokeLinejoin="round" />
              <line x1="30" y1="8" x2="30" y2="28" stroke={goldStroke} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="30" y1="18" x2="46" y2="18" stroke={goldStroke} strokeWidth="1.2" />
              <text x="23" y="38" fill={goldStroke} fontSize="7" fontFamily="monospace" textAnchor="middle">
                LED
              </text>
            </g>

            {/* 5. ทรานซิสเตอร์ (NPN Transistor) */}
            <g transform="translate(40, 120)">
              <line x1="0" y1="20" x2="16" y2="20" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="16" y1="8" x2="16" y2="32" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="12" x2="32" y2="4" stroke={strokeColor} strokeWidth="1.2" />
              <line x1="16" y1="28" x2="32" y2="36" stroke={strokeColor} strokeWidth="1.2" />
              <circle cx="22" cy="20" r="18" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
              <text x="22" y="49" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                NPN Q1
              </text>
            </g>

            {/* 6. ขดลวดเหนี่ยวนำ (Inductor L) */}
            <g transform="translate(160, 120)">
              <line x1="0" y1="15" x2="10" y2="15" stroke={goldStroke} strokeWidth="1.2" />
              <path
                d="M 10 15 A 6 6 0 0 1 22 15 A 6 6 0 0 1 34 15 A 6 6 0 0 1 46 15 A 6 6 0 0 1 58 15"
                fill="none"
                stroke={goldStroke}
                strokeWidth="1.2"
              />
              <line x1="58" y1="15" x2="68" y2="15" stroke={goldStroke} strokeWidth="1.2" />
              <text x="34" y="27" fill={goldStroke} fontSize="7" fontFamily="monospace" textAnchor="middle">
                L 220μH
              </text>
            </g>

            {/* 7. สัญลักษณ์หน่วยช่าง: โอห์ม (Ω) และแหล่งจ่ายไฟ */}
            <g transform="translate(280, 115)">
              <circle cx="20" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              <path
                d="M 13 20 Q 16.5 13 20 20 T 27 20"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <text x="20" y="49" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle">
                220VAC ~
              </text>
            </g>

            {/* 8. ลายวงจร PCB Traces & Vias */}
            <g transform="translate(260, 215)">
              <path
                d="M 10 35 L 35 35 L 55 15 L 85 15"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <circle cx="10" cy="35" r="3" fill="none" stroke={strokeColor} strokeWidth="1" />
              <circle cx="85" cy="15" r="3" fill="none" stroke={strokeColor} strokeWidth="1" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#electronic-schematic-watermark)" />
      </svg>
    </div>
  );
};

/* =========================================================================
   2. แผงควบคุมปรับแต่งระบบส่วนกลาง (AdminGlobalCustomizer)
   รวมไว้ในไฟล์หลักเพื่อป้องกัน Error: [UNRESOLVED_IMPORT] บน Vercel
   ========================================================================= */
interface AdminGlobalCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: GlobalThemeSettings;
  onSaveTheme: (theme: GlobalThemeSettings) => void;
}

const AdminGlobalCustomizer: React.FC<AdminGlobalCustomizerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSaveTheme,
}) => {
  const [theme, setTheme] = useState<GlobalThemeSettings>({ ...currentTheme });
  const [activeSubTab, setActiveSubTab] = useState<'typography' | 'layout' | 'background'>('typography');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveTheme(theme);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการคืนค่าการปรับแต่งระบบ (ฟอนต์, พื้นหลัง, การจัดเรียง) กลับเป็นค่าเริ่มต้นหรือไม่?\n\n*หมายเหตุ: ข้อมูลสาขาและงานซ่อมจะไม่ถูกลบ*')) {
      setTheme({ ...DEFAULT_GLOBAL_THEME });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>ปรับแต่งระบบส่วนกลาง & ซิงก์สาขา Real-time</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  Admin Only
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ปรับฟอนต์, การจัดเรียงข้อความ, และพื้นหลัง ลิงก์สาขาจะเปลี่ยนตามทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance Banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>รับประกันการแยกข้อมูลสาขา 100%:</strong> การปรับแต่งนี้จะซิงก์ความสวยงามไปยังทุกลิงก์สาขา โดยที่<strong>ภาพหน้าปกสาขา, ชื่อร้านสาขา, เบอร์โทร, LINE และข้อมูลงานซ่อมจะไม่ถูกทับเด็ดขาด</strong>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('typography')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'typography'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>1) ตัวหนังสือ & ข้อความหัวข้อ</span>
          </button>
          <button
            onClick={() => setActiveSubTab('layout')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'layout'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>2) จัดเรียงหน้าปก</span>
          </button>
          <button
            onClick={() => setActiveSubTab('background')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'background'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3) โทนพื้นหลัง & ลายน้ำ</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 scroll-container text-xs sm:text-sm">
          {activeSubTab === 'typography' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  หัวข้อหลักหน้าปก (Brand Title)
                </label>
                <input
                  type="text"
                  value={theme.brandTitle}
                  onChange={(e) => setTheme({ ...theme, brandTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-white font-bold text-sm outline-none transition"
                  placeholder="เช่น คัมภีร์ลับช่างซวดลวด"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">
                    ป้ายกำกับด้านขวา (Badge Tagline)
                  </label>
                  <input
                    type="text"
                    value={theme.taglineBadge}
                    onChange={(e) => setTheme({ ...theme, taglineBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-white font-semibold text-xs outline-none transition"
                    placeholder="เช่น Fix it Pro"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">
                    ความหนาตัวหนังสือหัวข้อ
                  </label>
                  <select
                    value={theme.headerFontWeight}
                    onChange={(e) => setTheme({ ...theme, headerFontWeight: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-white text-xs outline-none transition"
                  >
                    <option value="normal">ปกติ (Normal)</option>
                    <option value="bold">หนา (Bold)</option>
                    <option value="black">หนาพิเศษ (Black)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  คำโปรยสโลแกน (Subtitle)
                </label>
                <input
                  type="text"
                  value={theme.brandSubtitle}
                  onChange={(e) => setTheme({ ...theme, brandSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-slate-200 text-xs outline-none transition"
                  placeholder="เช่น ศูนย์รวมเทคนิคชี้จุดเสีย • วิธีถอดประกอบ • คลังวงจรและคัมภีร์งานซ่อม"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2 text-xs">
                  เลือกแบบฟอนต์ตัวหนังสือทั้งระบบ (Font Family)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'prompt', name: 'Prompt (พร้อมต์)', desc: 'โมเดิร์น ทันสมัย อ่านง่าย' },
                    { id: 'kanit', name: 'Kanit (คณิต)', desc: 'ตัวหนา คมชัด สไตล์ช่าง' },
                    { id: 'sarabun', name: 'Sarabun (สารบรรณ)', desc: 'เรียบร้อย เป็นทางการ' },
                    { id: 'chakra', name: 'Chakra Petch', desc: 'ดิจิทัล ลายเส้นไฮเทค' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTheme({ ...theme, fontFamily: f.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        theme.fontFamily === f.id
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-300 text-xs">{f.name}</span>
                        {theme.fontFamily === f.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'layout' && (
            <div className="space-y-3">
              <label className="block text-slate-300 font-semibold text-xs">
                เลือกรูปแบบการจัดเรียงข้อความหน้าปก
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'split', title: 'แบ่งส่วนสมดุล (Split)', desc: 'ชื่อระบบซ้าย + ข้อมูลร้านขวา เป็นสัดส่วน' },
                  { id: 'centered', title: 'กึ่งกลางโปร (Centered)', desc: 'ชื่อระบบและข้อมูลร้านกึ่งกลาง' },
                  { id: 'compact', title: 'มินิมอล (Compact)', desc: 'กะทัดรัด เตี้ย ประหยัดพื้นที่สูงสุด' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setTheme({ ...theme, bannerLayout: l.id as any })}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      theme.bannerLayout === l.id
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-300 text-xs">{l.title}</span>
                      {theme.bannerLayout === l.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'background' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-2 text-xs">
                  เลือกโทนสีพื้นหลังหลัก (Background Tone)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'circuit-dark', name: 'คัมภีร์วงจรมืดทอง' },
                    { id: 'slate-pro', name: 'เทาเข้มระดับวิศวกร' },
                    { id: 'cyber-gold', name: 'คัมภีร์ทองอร่าม' },
                    { id: 'electric-navy', name: 'น้ำเงินวงจรไฟฟ้า' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setTheme({ ...theme, bgTone: b.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        theme.bgTone === b.id
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs text-white">{b.name}</span>
                      {theme.bgTone === b.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">
                      ลายน้ำสัญลักษณ์ทางไฟฟ้าและอิเล็กทรอนิกส์
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.showCircuitWatermark}
                      onChange={(e) => setTheme({ ...theme, showCircuitWatermark: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {theme.showCircuitWatermark && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">
                        ความเข้มลายน้ำ: <strong>{Math.round(theme.watermarkOpacity * 100)}%</strong>
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.12"
                      step="0.01"
                      value={theme.watermarkOpacity}
                      onChange={(e) => setTheme({ ...theme, watermarkOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold transition shadow-md cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>บันทึกแล้ว!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>บันทึก & ซิงก์ทุกลิงก์สาขา</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [homeQuickMode, setHomeQuickMode] = useState<MainViewMode>('pinpoint');

  // Core Data States
  const [session, setSession] = useState<AuthSession>(getAuthSession());
  const [profile, setProfile] = useState<ShopProfile>(getActiveShopProfile(getAuthSession()));
  const [repairs, setRepairs] = useState<RepairEntry[]>(getRepairs());
  const [pinpoints, setPinpoints] = useState<QuickPinpointRecord[]>(getQuickPinpoints());
  const [guides, setGuides] = useState<DisassemblyGuide[]>(getDisassemblyGuides());
  const [branches, setBranches] = useState<BranchUser[]>(getBranchUsers());
  const [revisions, setRevisions] = useState<RevisionRecord[]>(getRevisions());

  // Editing & Selection states
  const [editingRepair, setEditingRepair] = useState<RepairEntry | null>(null);
  const [selectedSheetRepairId, setSelectedSheetRepairId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isBranchSettingsModalOpen, setIsBranchSettingsModalOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isRecentlyLoggedOut, setIsRecentlyLoggedOut] = useState(false);

  // Global Theme & Typography (Syncs to all branch links in real-time)
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeSettings>(getGlobalThemeSettings());

  // Derive categories list dynamically
  const categories = getCategories(repairs);

  // Parse URL parameters on load for branch links or specific tabs
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab | null;
      const sheetParam = params.get('sheet');

      // Refresh session, profile, branches, and theme from storage
      const freshSession = getAuthSession();
      setSession(freshSession);
      setProfile(getActiveShopProfile(freshSession));
      setBranches(getBranchUsers());
      setGlobalTheme(getGlobalThemeSettings());

      if (freshSession.role === 'branch_user' && freshSession.expiresAt) {
        const expiry = checkBranchExpiry(freshSession.expiresAt);
        if (expiry.isExpired) {
          alert(
            `สิทธิ์การใช้งานของสาขา "${freshSession.branchName || freshSession.branchCode}" ${expiry.displayText}\n* ข้อกำหนดความปลอดภัย: ลิงก์สาขาไม่สามารถต่ออายุเองได้ กรุณาติดต่อ Admin เพื่อขอต่ออายุ`
          );
        }
      }

      if (tabParam && ['home', 'pinpoint', 'disassembly', 'record', 'table', 'sheet', 'admin', 'settings'].includes(tabParam)) {
        if (freshSession.role !== 'admin' && (tabParam === 'admin' || tabParam === 'settings')) {
          setActiveTab('home');
        } else {
          setActiveTab(tabParam);
        }
      }

      if (sheetParam) {
        setSelectedSheetRepairId(sheetParam);
        setActiveTab('sheet');
      }
    } catch (e) {
      console.error('URL params parsing error', e);
    }

    // Real-time listener: เมื่อแอดมินแก้ไขธีมในแท็บอื่น หรือในระบบ ลิงก์สาขาจะอัปเดตทันที
    const handleThemeSync = (e: any) => {
      if (e?.detail) {
        setGlobalTheme(e.detail);
      } else {
        setGlobalTheme(getGlobalThemeSettings());
      }
    };

    window.addEventListener('fixit_theme_updated', handleThemeSync);
    window.addEventListener('storage', handleThemeSync);

    return () => {
      window.removeEventListener('fixit_theme_updated', handleThemeSync);
      window.removeEventListener('storage', handleThemeSync);
    };
  }, []);

  // Handler for Admin Global Theme Customization
  const handleSaveGlobalTheme = (newTheme: GlobalThemeSettings) => {
    setGlobalTheme(newTheme);
    saveGlobalThemeSettings(newTheme);
  };


  // Handlers for Quick Pinpoints
  const handleSavePinpoint = (entry: QuickPinpointRecord) => {
    const updated = saveOrUpdateQuickPinpoint(entry);
    setPinpoints(updated);
  };

  const handleDeletePinpoint = (id: string) => {
    const updated = deleteQuickPinpoint(id);
    setPinpoints(updated);
  };

  // Handlers for Disassembly Guides
  const handleSaveGuide = (guide: DisassemblyGuide) => {
    const updated = saveOrUpdateDisassemblyGuide(guide);
    setGuides(updated);
  };

  const handleDeleteGuide = (id: string) => {
    const updated = deleteDisassemblyGuide(id);
    setGuides(updated);
  };

  // Handlers for Detailed Repairs
  const handleSaveRepair = (entry: RepairEntry) => {
    const updated = saveOrUpdateRepair(entry);
    setRepairs(updated);
    setEditingRepair(null);
    setActiveTab('table');
  };

  const handleDeleteRepair = (id: string) => {
    const updated = deleteRepair(id);
    setRepairs(updated);
    if (selectedSheetRepairId === id) {
      setSelectedSheetRepairId(updated[0]?.id || null);
    }
  };

  const handleEditRepair = (repair: RepairEntry) => {
    setEditingRepair(repair);
    setActiveTab('record');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleViewSheet = (repair: RepairEntry) => {
    setSelectedSheetRepairId(repair.id);
    setActiveTab('sheet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Categories
  const handleAddNewCategory = (newCat: string) => {
    setSelectedCategory(newCat);
  };

  // Handlers for Profile
  const handleSaveProfile = (newProfile: ShopProfile) => {
    setProfile(newProfile);
    saveShopProfile(newProfile);
  };

  // Handlers for Branches
  const handleAddOrUpdateBranch = (branch: BranchUser) => {
    const updated = addOrUpdateBranch(branch);
    setBranches(updated);
  };

  const handleDeleteBranch = (id: string) => {
    const updated = deleteBranch(id);
    setBranches(updated);
  };

  const handleExtendBranch = (id: string, days: number) => {
    const updated = extendBranchExpiry(id, days);
    setBranches(updated);
    if (session.branchId === id) {
      const refreshed = updated.find((b) => b.id === id);
      if (refreshed) {
        const newSession = { ...session, expiresAt: refreshed.expiryDate };
        setSession(newSession);
        saveAuthSession(newSession);
      }
    }
  };

  const handleSimulateLoginAsBranch = (branch: BranchUser) => {
    const expiry = checkBranchExpiry(branch.expiryDate);
    if (expiry.isExpired) {
      alert(
        `ไม่สามารถเข้าใช้งานได้ เนื่องจากสาขา "${branch.name}" ${expiry.displayText}\nลิงก์สาขา user ไม่สามารถต่ออายุเองได้ (กรุณากดปุ่มต่ออายุในฐานะ Admin ก่อน)`
      );
      return;
    }
    const newSession: AuthSession = {
      isLoggedIn: true,
      role: 'branch_user',
      branchId: branch.id,
      branchCode: branch.branchCode,
      branchName: branch.name,
      username: branch.username,
      expiresAt: branch.expiryDate,
    };
    setSession(newSession);
    saveAuthSession(newSession);
    setIsRecentlyLoggedOut(false);
    setActiveTab('home');
    alert(`เข้าสู่ระบบในโหมดสาขา: ${branch.name} เรียบร้อยแล้ว`);
  };

  // Handlers for Reset & Factory Defaults
  const handleClearWorkData = () => {
    const cleared = clearAllWorkData();
    setRepairs(cleared.repairs);
    setPinpoints(cleared.pinpoints);
    setGuides(cleared.guides);
    setSelectedSheetRepairId(null);
  };

  const handleResetFactoryDefaults = () => {
    const res = resetToFactoryDefaults();
    setProfile(res.profile);
    setRepairs(res.repairs);
    setPinpoints(res.pinpoints);
    setGuides(res.guides);
    setBranches(res.branches);
    setSelectedSheetRepairId(res.repairs[0]?.id || null);
  };

  // Handlers for Branch Profile Customization
  const handleSaveBranchProfile = (branchCustom: BranchCustomProfile) => {
    saveBranchCustomProfile(branchCustom);
    const updated = getActiveShopProfile(session);
    setProfile(updated);
  };

  // Handlers for Auth
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    saveAuthSession(newSession);
    setProfile(getActiveShopProfile(newSession));
    setIsRecentlyLoggedOut(false);
  };

  /**
   * ข้อ 4: ระบบออกจากระบบ (Logout) แยกขาดระหว่างลิงก์สาขาและ Admin อย่างถาวร:
   * - กรณีเป็นลิงก์สาขา: จะคงอยู่ในลิงก์สาขานั้นเสมอ (?branch=...) ไม่เด้งไปหน้า Admin และไม่เปลี่ยนสิทธิ์เป็น Admin
   *   โดยจะแสดงหน้าเข้าสู่ระบบสาขาเดิม เพื่อให้กรอก User/Password เข้าใช้งานใหม่
   * - กรณีเป็น Admin: ออกจากระบบ Admin และเปิดโมดอลล็อกอิน
   */
  const handleLogout = () => {
    const isBranchContext =
      session.role === 'branch_user' ||
      (typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('branch')));

    if (isBranchContext) {
      const urlBranchParam = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('branch')
        : null;

      const loggedOutBranchSession: AuthSession = {
        isLoggedIn: false,
        role: 'branch_user',
        branchId: session.branchId,
        branchCode: session.branchCode || urlBranchParam || undefined,
        branchName: session.branchName,
        username: session.username,
        expiresAt: session.expiresAt,
      };

      setSession(loggedOutBranchSession);
      saveAuthSession(loggedOutBranchSession);
      setIsRecentlyLoggedOut(true);
      setActiveTab('home');
      return;
    }

    // กรณี Admin ออกจากระบบ (บนลิงก์หลัก)
    const adminSession: AuthSession = {
      isLoggedIn: false,
      role: 'admin',
      username: 'admin',
    };
    setSession(adminSession);
    saveAuthSession(adminSession);
    setProfile(getShopProfile());
    setActiveTab('home');
    setIsLoginModalOpen(true);
  };

  // Handlers for Revisions
  const handleAddRevision = (rec: RevisionRecord) => {
    const updated = addRevisionRecord(rec);
    setRevisions(updated);
  };

  const activeRevision = revisions[0]?.revision || APP_VERSION;

  // Check if current branch user session is expired
  const isBranchExpired = session.role === 'branch_user' && session.expiresAt
    ? checkBranchExpiry(session.expiresAt).isExpired
    : false;

  return (
    <div
      className={`min-h-screen flex flex-col font-theme-${globalTheme.fontFamily} theme-${globalTheme.bgTone} ${
        globalTheme.fontScale === 'sm' ? 'text-xs' : globalTheme.fontScale === 'lg' ? 'text-base' : 'text-sm'
      } relative selection:bg-amber-400 selection:text-slate-950 transition-colors duration-200`}
    >
      {/* ลายน้ำสัญลักษณ์ทางไฟฟ้าและอิเล็กทรอนิกส์ บางเบาไม่บดบังข้อความ ปรากฏทุกหน้า */}
      <CircuitWatermark theme={globalTheme} />

      {/* 1. Header Banner แสดงเฉพาะส่วนของหน้าหลัก (Home) เท่านั้น หน้าอื่นๆ ไม่ต้องมีภาพหน้าปก เพื่อลดพื้นที่ลง */}
      {activeTab === 'home' && (
        <HeaderBanner
          profile={profile}
          session={session}
          activeRevision={activeRevision}
          theme={globalTheme}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenRevisionModal={() => setIsRevisionModalOpen(true)}
        />
      )}

      {/* 2. Top Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'pinpoint') setHomeQuickMode('pinpoint');
          if (tab === 'disassembly') setHomeQuickMode('disassembly');
          if (tab === 'table') setHomeQuickMode('knowledge');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        repairCount={repairs.length}
        pinpointCount={pinpoints.length}
        guideCount={guides.length}
        branchCount={branches.length}
        session={session}
        onOpenBranchSettings={() => setIsBranchSettingsModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* กรณี 1: อยู่ในลิงก์สาขาแต่ยังไม่ได้เข้าสู่ระบบ (หรือเพิ่งกดออกจากระบบ): แสดงหน้าเข้าสู่ระบบสาขาเฉพาะตัว ไม่เด้งเข้า Admin */}
        {session.role === 'branch_user' && !session.isLoggedIn ? (
          <BranchLoginCard
            branchCode={
              session.branchCode ||
              (typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search).get('branch') || 'TEST01'
                : 'TEST01')
            }
            branchName={session.branchName || 'สาขา'}
            defaultUsername={session.username}
            branches={branches}
            onLoginSuccess={handleLoginSuccess}
            isRecentlyLoggedOut={isRecentlyLoggedOut}
          />
        ) : isBranchExpired ? (
          /* กรณี 2: ลิงก์สาขาหมดอายุ: แสดงหน้าจอล็อกอย่างเป็นทางการ ไม่อนุญาตให้เข้าถึงเนื้อหา */
          <div className="py-8 max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-200 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>สิทธิ์การใช้งานสิ้นสุดลงแล้ว</span>
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  ลิงก์สาขานี้หมดอายุการใช้งานแล้ว
                </h2>
                <p className="text-slate-600 text-sm">
                  สาขา: <strong className="text-slate-900">{session.branchName || session.branchCode}</strong>
                  {session.expiresAt && ` (หมดอายุเมื่อ: ${session.expiresAt})`}
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-left space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>ข้อกำหนดความปลอดภัยของระบบคัมภีร์ลับซ่างซวดลวด:</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  • ผู้ใช้งานลิงก์สาขาไม่สามารถกดต่ออายุเองได้<br/>
                  • กรุณาติดต่อผู้ดูแลระบบ (Admin) สำนักงานใหญ่ เพื่อดำเนินการต่ออายุสิทธิ์เข้าใช้งาน
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>โทรหา Admin: {profile.phone}</span>
                  </a>
                )}
                {profile.lineId && (
                  <a
                    href={`https://line.me/ti/p/~${profile.lineId.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>LINE: {profile.lineId}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* HOMEPAGE VIEW: แสดงเฉพาะ 3 ปุ่มรูปคัมภีร์สมุด 3D (แดง, เหลือง, เขียว) ไม่ต้องมีอะไรต่อท้ายเพื่อให้ประหยัดพื้นที่ */}
            {activeTab === 'home' && (
              <div className="py-2">
                <HomeQuickMenu
                  onSelectAction={(action) => {
                    if (action === 'pinpoint') setActiveTab('pinpoint');
                    if (action === 'disassembly') setActiveTab('disassembly');
                    if (action === 'knowledge') setActiveTab('table');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  pinpointCount={pinpoints.length}
                  guideCount={guides.length}
                  repairsCount={repairs.length}
                />
              </div>
            )}

            {/* DIRECT TAB: 1) ชี้จุดเสีย แบบซวดลวดรวดเร็ว (คัมภีร์เล่มแดง) */}
            {activeTab === 'pinpoint' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <QuickPinpointSection
                  pinpoints={pinpoints}
                  session={session}
                  onSavePinpoint={handleSavePinpoint}
                  onDeletePinpoint={handleDeletePinpoint}
                />
              </div>
            )}

            {/* DIRECT TAB: 2) วิธีถอดเครื่อง / วิธีประกอบเครื่อง (คัมภีร์เล่มเหลือง) */}
            {activeTab === 'disassembly' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <DisassemblyGuideSection
                  guides={guides}
                  session={session}
                  onSaveGuide={handleSaveGuide}
                  onDeleteGuide={handleDeleteGuide}
                />
              </div>
            )}

            {/* DIRECT TAB: 3) คลังคัมภีร์ซวดรวดรวมอาการเสีย (คัมภีร์เล่มเขียว) */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <SummaryTable
                  repairs={repairs}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddNewCategory={handleAddNewCategory}
                  onViewSheet={handleViewSheet}
                  onEditRepair={handleEditRepair}
                  onDeleteRepair={handleDeleteRepair}
                />
              </div>
            )}

            {/* DIRECT TAB: บันทึกอาการเสียเจาะลึกเต็มรูปแบบ (ส่วนที่ 1 & 2) */}
            {activeTab === 'record' && (
              <RepairForm
                categories={categories}
                shopProfile={profile}
                session={session}
                editingRepair={editingRepair}
                onSave={handleSaveRepair}
                onCancelEdit={() => setEditingRepair(null)}
              />
            )}

            {/* DIRECT TAB: Sheet แยก (ส่วนที่ 4) */}
            {activeTab === 'sheet' && (
              <DetailSheetView
                repairs={repairs}
                selectedRepairId={selectedSheetRepairId}
                shopProfile={profile}
                onSelectRepair={(id) => setSelectedSheetRepairId(id)}
                onBackToTable={() => setActiveTab('table')}
              />
            )}

            {/* DIRECT TAB: จัดการสาขา (Admin Only) */}
            {activeTab === 'admin' && session.role === 'admin' && (
              <AdminBranchManager
                branches={branches}
                session={session}
                onAddOrUpdateBranch={handleAddOrUpdateBranch}
                onDeleteBranch={handleDeleteBranch}
                onExtendBranch={handleExtendBranch}
                onSimulateLoginAsBranch={handleSimulateLoginAsBranch}
              />
            )}

            {/* DIRECT TAB: ตั้งค่าร้าน & หน้าปก (Admin Only) */}
            {activeTab === 'settings' && session.role === 'admin' && (
              <SettingsModal
                profile={profile}
                onSaveProfile={handleSaveProfile}
                isStandaloneTab={true}
                isAdmin={session.role === 'admin'}
                onOpenResetModal={() => setIsResetModalOpen(true)}
                onOpenThemeCustomizer={() => setIsThemeCustomizerOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        profile={profile}
        onSaveProfile={handleSaveProfile}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isAdmin={session.role === 'admin'}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenThemeCustomizer={() => setIsThemeCustomizerOpen(true)}
      />

      <LoginModal
        branches={branches}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        branchCode={session.branchCode}
        isBranchLocked={session.role === 'branch_user'}
      />

      <RevisionModal
        revisions={revisions}
        activeRevision={activeRevision}
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onAddRevision={handleAddRevision}
        isAdmin={session.role === 'admin'}
      />

      {/* โมดอลเคลียร์งานเก่า / คืนค่าเริ่มต้นจากโรงงาน */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onClearWorkData={handleClearWorkData}
        onResetFactoryDefaults={handleResetFactoryDefaults}
        totalRepairs={repairs.length}
        totalPinpoints={pinpoints.length}
        totalGuides={guides.length}
      />

      {/* โมดอลตั้งค่าภาพหน้าปก & ข้อมูลร้านเฉพาะสาขา (ไม่เข้าถึงการสร้างลิงก์) */}
      <BranchSettingsModal
        isOpen={isBranchSettingsModalOpen}
        onClose={() => setIsBranchSettingsModalOpen(false)}
        branchCode={session.branchCode || session.branchId || 'MY-BRANCH'}
        branchName={session.branchName || 'สาขา'}
        currentProfile={profile}
        onSaveBranchProfile={handleSaveBranchProfile}
      />

      {/* โมดอลปรับแต่งระบบส่วนกลาง & ซิงก์สาขา Real-time โดย Admin */}
      <AdminGlobalCustomizer
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
        currentTheme={globalTheme}
        onSaveTheme={handleSaveGlobalTheme}
      />


      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 mt-10 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold text-slate-200">คัมภีร์ลับซ่างซวดลวด</span>
            <span>• คลังปัญญางานซ่อมและวิธีถอดประกอบ</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRevisionModalOpen(true)}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono transition cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{activeRevision}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span>สถานะ: พร้อมใช้งาน</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
