import React, { useState } from 'react';
import { GlobalThemeSettings } from '../types';
import { DEFAULT_GLOBAL_THEME } from '../data/defaultData';
import {
  Palette,
  Type,
  Layout,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  Info,
  Layers,
  X,
} from 'lucide-react';

interface AdminGlobalCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: GlobalThemeSettings;
  onSaveTheme: (theme: GlobalThemeSettings) => void;
}

export const AdminGlobalCustomizer: React.FC<AdminGlobalCustomizerProps> = ({
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

        {/* Reassurance Banner (การันตีความปลอดภัยข้อมูลสาขา) */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>รับประกันการแยกข้อมูลสาขาเป็นอิสระ 100%:</strong> การปรับแต่งตัวหนังสือและพื้นหลังนี้ จะซิงก์ความสวยงามไปยังทุกลิงก์สาขาอัตโนมัติ โดยที่<strong>ภาพหน้าปกของสาขา, ชื่อร้านสาขา, เบอร์โทร, LINE และข้อมูลงานซ่อมของแต่ละสาขาจะไม่เปลี่ยนตาม</strong>เด็ดขาด
          </div>
        </div>

        {/* Sub Navigation Tabs */}
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
            <span>3) โทนพื้นหลัง & ลายน้ำไฟฟ้า</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scroll-container text-xs sm:text-sm">
          {/* TAB 1: ตัวหนังสือ & ข้อความ */}
          {activeSubTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  หัวข้อหลักหน้าปก (Brand Title)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={theme.brandTitle}
                    onChange={(e) => setTheme({ ...theme, brandTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-white font-bold text-sm outline-none transition"
                    placeholder="เช่น คัมภีร์ลับช่างซวดลวด"
                  />
                  <Zap className="w-4 h-4 text-amber-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
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
                    ความหนาตัวหนังสือหัวข้อ (Font Weight)
                  </label>
                  <select
                    value={theme.headerFontWeight}
                    onChange={(e) => setTheme({ ...theme, headerFontWeight: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-white text-xs outline-none transition"
                  >
                    <option value="normal">น้ำหนักปกติ (Normal 400)</option>
                    <option value="bold">หนาคมเข้ม (Bold 700)</option>
                    <option value="black">หนาพิเศษระดับโปร (Black 900)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  คำโปรย / สโลแกนใต้หัวข้อ (Subtitle Motto)
                </label>
                <input
                  type="text"
                  value={theme.brandSubtitle}
                  onChange={(e) => setTheme({ ...theme, brandSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-slate-200 text-xs outline-none transition"
                  placeholder="เช่น ศูนย์รวมเทคนิคชี้จุดเสีย • วิธีถอดประกอบ • คลังวงจรและคัมภีร์งานซ่อม"
                />
              </div>

              {/* ฟอนต์ตัวหนังสือหลัก */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2 text-xs">
                  เลือกแบบฟอนต์ตัวหนังสือทั้งระบบ (Font Family)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'prompt', name: 'Prompt (พร้อมต์)', desc: 'โมเดิร์น สไตล์แอปมาตรฐาน ทันสมัย อ่านง่ายสบายตา', sample: 'คัมภีร์งานซ่อมช่างมือโปร 0123' },
                    { id: 'kanit', name: 'Kanit (คณิต)', desc: 'ตัวหนา คมชัด มีพลัง สไตล์งานวิศวกรรมและช่าง', sample: 'คัมภีร์งานซ่อมช่างมือโปร 0123' },
                    { id: 'sarabun', name: 'Sarabun (สารบรรณ)', desc: 'เป็นทางการ เรียบร้อย สะอาด สไตล์คู่มือมาตรฐาน', sample: 'คัมภีร์งานซ่อมช่างมือโปร 0123' },
                    { id: 'chakra', name: 'Chakra Petch (ชักระเพชร)', desc: 'ดิจิทัล ลายเส้นเหลี่ยม ล้ำสมัยสไตล์ Cyber Circuit', sample: 'คัมภีร์งานซ่อมช่างมือโปร 0123' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTheme({ ...theme, fontFamily: f.id as any })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        theme.fontFamily === f.id
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-300">{f.name}</span>
                        {theme.fontFamily === f.id && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{f.desc}</p>
                      <span className={`text-xs px-2 py-1 rounded bg-black/40 text-slate-200 border border-slate-700/50 font-theme-${f.id}`}>
                        {f.sample}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* สเกลขนาดตัวหนังสือ */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  สเกลขนาดตัวหนังสือ (Font Scale)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sm', label: 'กะทัดรัด (Compact)', desc: 'ประหยัดพื้นที่ จอเล็ก' },
                    { id: 'md', label: 'มาตรฐาน (Normal)', desc: 'สมดุล อ่านง่ายกำลังดี' },
                    { id: 'lg', label: 'ตัวโต (Large)', desc: 'ตัวหนังสือชัดเจน ชัดเจนมาก' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTheme({ ...theme, fontScale: s.id as any })}
                      className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                        theme.fontScale === s.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: จัดเรียงหน้าปก */}
          {activeSubTab === 'layout' && (
            <div className="space-y-4">
              <label className="block text-slate-300 font-semibold text-xs">
                เลือกรูปแบบการจัดเรียงข้อความบนหน้าปก (Banner Layout)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'split',
                    title: 'สไตล์แบ่งส่วนสมดุล (Split Layout)',
                    desc: 'ชื่อระบบฝั่งซ้าย + ข้อมูลร้านและปุ่มติดต่อฝั่งขวา เป็นระเบียบเรียบร้อย สบายตา',
                    badge: 'แนะนำ',
                  },
                  {
                    id: 'centered',
                    title: 'สไตล์กึ่งกลางโปร (Centered Layout)',
                    desc: 'โลโก้และชื่อระบบอยู่ตรงกลาง ข้อมูลร้านอยู่ใต้ชื่อ ดูยิ่งใหญ่โอ่อ่า',
                    badge: 'ยอดนิยม',
                  },
                  {
                    id: 'compact',
                    title: 'สไตล์มินิมอล (Compact Slim)',
                    desc: 'ความสูงเตี้ยพิเศษ ประหยัดพื้นที่หน้าจอด้านบนสูงสุดเพื่อเห็นเมนูทันที',
                    badge: 'ประหยัดที่',
                  },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setTheme({ ...theme, bannerLayout: l.id as any })}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      theme.bannerLayout === l.id
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-amber-300 text-xs">{l.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                          {l.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{l.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      {theme.bannerLayout === l.id ? (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> เลือกอยู่
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">คลิกเลือก</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* กล่องตัวอย่างจำลองหน้าปก */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  จำลองการแสดงผลหน้าปก (Live Preview)
                </span>

                <div className="p-3 rounded-lg bg-black/80 border border-amber-500/40 text-center sm:text-left">
                  <div className={`flex flex-col ${theme.bannerLayout === 'centered' ? 'items-center text-center' : 'sm:flex-row items-center justify-between'} gap-2`}>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-base font-black text-amber-300">
                          {theme.brandTitle || 'คัมภีร์ลับช่างซวดลวด'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          {theme.taglineBadge || 'Fix it Pro'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        {theme.brandSubtitle || 'ศูนย์รวมเทคนิคชี้จุดเสีย • วิธีถอดประกอบ • คลังวงจรและคัมภีร์งานซ่อม'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-200">
                        สำนักงานใหญ่ / สาขา
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                        โทร: 089-xxx-xxxx
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                        LINE: @fixit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: โทนพื้นหลัง & ลายน้ำอิเล็กทรอนิกส์ */}
          {activeSubTab === 'background' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-2 text-xs">
                  เลือกโทนสี & สไตล์พื้นหลังหลัก (Background Tone)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'circuit-dark',
                      name: 'คัมภีร์วงจรมืดทอง (Circuit Dark Gold)',
                      desc: 'พื้นหลังสีดำสนิทแซมลายเส้นวงจรสีทอง ให้ความขลังพรีเมียมระดับคัมภีร์',
                      colorHex: '#030712',
                      borderHex: '#f59e0b',
                    },
                    {
                      id: 'slate-pro',
                      name: 'เทาเข้มระดับวิศวกร (Slate Pro)',
                      desc: 'สีเทาเข้มโทนสเลท สุขุม เรียบหรู อ่านง่าย ไม่ล้าสายตา',
                      colorHex: '#0f172a',
                      borderHex: '#38bdf8',
                    },
                    {
                      id: 'cyber-gold',
                      name: 'คัมภีร์ทองอร่าม (Royal Cyber Gold)',
                      desc: 'โทนทองอำพันและชิปแผงวงจร สว่างเรืองรอง สไตล์ช่างทองคำ',
                      colorHex: '#120b02',
                      borderHex: '#eab308',
                    },
                    {
                      id: 'electric-navy',
                      name: 'น้ำเงินวงจรไฟฟ้า (Electric Navy)',
                      desc: 'โทนสีกรมท่าน้ำเงินลึก สไตล์ห้องแล็บอุปกรณ์ไฟฟ้าและอิเล็กทรอนิกส์',
                      colorHex: '#051329',
                      borderHex: '#60a5fa',
                    },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setTheme({ ...theme, bgTone: b.id as any })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        theme.bgTone === b.id
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg border flex items-center justify-center shadow-inner shrink-0"
                          style={{ backgroundColor: b.colorHex, borderColor: b.borderHex }}
                        >
                          <Zap className="w-3.5 h-3.5" style={{ color: b.borderHex }} />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{b.name}</div>
                          <div className="text-[10px] text-slate-400">{b.desc}</div>
                        </div>
                      </div>
                      {theme.bgTone === b.id && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* ลายน้ำสัญลักษณ์ทางไฟฟ้าและอิเล็กทรอนิกส์ */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        ลายน้ำสัญลักษณ์ทางไฟฟ้า & อิเล็กทรอนิกส์ (Schematic Watermark)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        สัญลักษณ์ R, C, L, Diode, Ground, Transistor, AC/DC, Ohm Ω ปรากฏบางๆ ทุกหน้า
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.showCircuitWatermark}
                      onChange={(e) => setTheme({ ...theme, showCircuitWatermark: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {theme.showCircuitWatermark && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">
                          ระดับความเข้มของลายน้ำ: <strong>{Math.round(theme.watermarkOpacity * 100)}%</strong>
                        </span>
                        <span className="text-[10px] text-amber-300">
                          {theme.watermarkOpacity <= 0.04 ? 'บางเบาสบายตา (แนะนำ)' : theme.watermarkOpacity <= 0.08 ? 'ระดับปานกลาง' : 'คมชัดมาก'}
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
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>2% บางมาก</span>
                        <span>5% ค่าเริ่มต้น</span>
                        <span>12% คมชัด</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs mb-1">
                        ความหนาแน่นการกระจายตัวของสัญลักษณ์ (Density)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'subtle', label: 'กระจายกว้าง (Subtle)' },
                          { id: 'balanced', label: 'สมดุลพอดี (Balanced)' },
                          { id: 'dense', label: 'ถี่แน่น (Dense)' },
                        ].map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setTheme({ ...theme, watermarkDensity: d.id as any })}
                            className={`py-1.5 px-2 rounded-lg border text-center text-xs transition cursor-pointer ${
                              theme.watermarkDensity === d.id
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handleResetDefaults}
            title="คืนค่าฟอนต์, พื้นหลัง และการจัดเรียงกลับเป็นค่าเริ่มต้น"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>บันทึก & ซิงก์เรียบร้อย!</span>
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
