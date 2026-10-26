import React from 'react';
import {
  Wrench,
  Sparkles,
} from 'lucide-react';

export type MainViewMode = 'pinpoint' | 'disassembly' | 'knowledge';

interface HomeQuickMenuProps {
  onSelectAction: (action: 'pinpoint' | 'disassembly' | 'knowledge') => void;
  pinpointCount: number;
  guideCount: number;
  repairsCount: number;
}

// 1) ไอคอน หลอดไฟกลมลายวงจรอิเล็กทรอนิกส์ชี้จุดเสีย (Round Light Bulb with Electronic Circuit Inside)
const CircuitBulbIcon = () => (
  <svg
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-[0_2px_10px_rgba(251,191,36,0.7)]"
  >
    <defs>
      {/* ไล่เฉดสีทองหลอดไฟสว่างไสว */}
      <linearGradient id="bulbGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      {/* ขั้วเกลียวโลหะ */}
      <linearGradient id="bulbBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>

    {/* เส้นประกายแสงความรู้รอบหลอดไฟกลม (Insight Radiance Rays) */}
    <line x1="26" y1="2" x2="26" y2="4.5" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="12" y1="7.5" x2="14" y2="9.5" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="7.5" x2="38" y2="9.5" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="18.5" x2="9" y2="18.5" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
    <line x1="46" y1="18.5" x2="43" y2="18.5" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />

    {/* โครงสร้างแก้วหลอดไฟกลม (Round Bulb Glass Outline) */}
    <path
      d="M 17 29 C 13.5 25.5 12 21.5 12 18 C 12 10.3 18.3 4 26 4 C 33.7 4 40 10.3 40 18 C 40 21.5 38.5 25.5 35 29 C 33.2 30.8 32 33 32 35.5 L 20 35.5 C 20 33 18.8 30.8 17 29 Z"
      fill="rgba(245, 158, 11, 0.14)"
      stroke="url(#bulbGlassGrad)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* ขั้วเกลียวโลหะของหลอดไฟ (Threaded Screw Base) */}
    <path
      d="M 21 36 L 31 36 M 21.5 39.5 L 30.5 39.5 M 22.5 43 L 29.5 43"
      stroke="url(#bulbBaseGrad)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* จุดขั้วสัมผัสไฟฟ้าด้านล่างสุด */}
    <path
      d="M 23.5 44 C 23.5 46.5 28.5 46.5 28.5 44 Z"
      fill="#cbd5e1"
      stroke="#94a3b8"
      strokeWidth="1"
    />

    {/* ลายวงจรอิเล็กทรอนิกส์ด้านในหลอดไฟ (Electronic Circuit Pattern Inside Bulb) */}
    {/* ก้านจ่ายไฟหลักคู่จากฐานขั้วหลอด */}
    <line x1="23" y1="35.5" x2="23" y2="29" stroke="#fbbf24" strokeWidth="1.8" />
    <line x1="29" y1="35.5" x2="29" y2="29" stroke="#fbbf24" strokeWidth="1.8" />

    {/* วงจรสายบัสลายทองแดง (PCB Tracks Inside) */}
    <path
      d="M 23 29 L 20 26 L 16 26"
      stroke="#facc15"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 29 29 L 32 26 L 36 26"
      stroke="#facc15"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 23 25 L 23 18 L 19 14 L 17 14"
      stroke="#fde047"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 29 25 L 29 18 L 33 14 L 35 14"
      stroke="#fde047"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* จุดชี้เป้าจุดเสียตรงกลาง (Pinpoint Center Target Node) */}
    <circle cx="26" cy="18" r="4.2" stroke="#fef08a" strokeWidth="1.4" strokeDasharray="2 1.5" />
    <circle cx="26" cy="18" r="2" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
    <path d="M 26 11.5 L 26 14 M 26 22 L 26 24.5" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />

    {/* จุดเชื่อมต่อบัดกรี/เวียสีทองและฟ้า (Gold & Cyan Vias inside Circuit Bulb) */}
    <circle cx="16" cy="26" r="1.6" fill="#fef08a" stroke="#78350f" strokeWidth="0.6" />
    <circle cx="36" cy="26" r="1.6" fill="#fef08a" stroke="#78350f" strokeWidth="0.6" />
    <circle cx="17" cy="14" r="1.6" fill="#38bdf8" />
    <circle cx="35" cy="14" r="1.6" fill="#38bdf8" />
  </svg>
);

// 3) ไอคอน สมองดิจิตอล/สมองกลอิเล็กทรอนิกส์ (Clear Digital Brain with Binary Numbers 0 1)
const ElectronicBrainIcon = () => (
  <svg
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-[0_2px_10px_rgba(16,185,129,0.6)]"
  >
    <defs>
      <linearGradient id="brainLobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="50%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* สมองซีกซ้าย: กลีบสมองโค้งมนหยักชัดเจน (Left Cerebral Hemisphere) */}
    <path
      d="M 23 8 C 17 7 12 9 9 13.5 C 5.5 18.5 6 24 8 28 C 5.5 32.5 6.5 38 11.5 41.5 C 15.5 44 20.5 44 23 44"
      stroke="url(#brainLobeGrad)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* รอยหยักในสมองซีกซ้าย (Left Sulci & Gyri Folds) */}
    <path
      d="M 12 15 C 16 16 19 14.5 23 15"
      stroke="#a7f3d0"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 8 26 C 13 25 17 28 23 27"
      stroke="#34d399"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 11 36 C 15 35 18 38 23 38"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* สมองซีกขวา: กลีบสมองโค้งมนหยักชัดเจน (Right Cerebral Hemisphere) */}
    <path
      d="M 29 8 C 35 7 40 9 43 13.5 C 46.5 18.5 46 24 44 28 C 46.5 32.5 45.5 38 40.5 41.5 C 36.5 44 31.5 44 29 44"
      stroke="url(#brainLobeGrad)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* รอยหยักในสมองซีกขวา (Right Sulci & Gyri Folds) */}
    <path
      d="M 40 15 C 36 16 33 14.5 29 15"
      stroke="#a7f3d0"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 44 26 C 39 25 35 28 29 27"
      stroke="#34d399"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 41 36 C 37 35 34 38 29 38"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* ร่องแบ่งซีกสมองตรงกลาง (Central Fissure) */}
    <line
      x1="26"
      y1="8"
      x2="26"
      y2="44"
      stroke="#6ee7b7"
      strokeWidth="1.5"
      strokeDasharray="2.5 2"
      opacity="0.8"
    />

    {/* จุดเชื่อมต่อวงจรเวียทองคำ (Gold Via Nodes) */}
    <circle cx="23" cy="15" r="1.8" fill="#fde047" stroke="#78350f" strokeWidth="0.6" />
    <circle cx="29" cy="15" r="1.8" fill="#fde047" stroke="#78350f" strokeWidth="0.6" />
    <circle cx="23" cy="27" r="1.8" fill="#34d399" />
    <circle cx="29" cy="27" r="1.8" fill="#34d399" />
    <circle cx="23" cy="38" r="1.8" fill="#38bdf8" />
    <circle cx="29" cy="38" r="1.8" fill="#38bdf8" />

    {/* ตัวเลขดิจิตอล (Binary Bits: 0 1 0 1) ในสมอง มองเห็นชัดเจน */}
    <text
      x="12"
      y="22"
      fill="#fef08a"
      fontSize="7"
      fontFamily="ui-monospace, monospace"
      fontWeight="900"
      letterSpacing="1"
      className="select-none"
    >
      01
    </text>
    <text
      x="13"
      y="33"
      fill="#a7f3d0"
      fontSize="7"
      fontFamily="ui-monospace, monospace"
      fontWeight="900"
      letterSpacing="1"
      className="select-none"
    >
      10
    </text>
    <text
      x="31"
      y="22"
      fill="#a7f3d0"
      fontSize="7"
      fontFamily="ui-monospace, monospace"
      fontWeight="900"
      letterSpacing="1"
      className="select-none"
    >
      10
    </text>
    <text
      x="31"
      y="33"
      fill="#fef08a"
      fontSize="7"
      fontFamily="ui-monospace, monospace"
      fontWeight="900"
      letterSpacing="1"
      className="select-none"
    >
      01
    </text>

    {/* ขั้วสัญญาณสมองกลด้านล่าง (Stem Bus Connections) */}
    <line x1="22" y1="44" x2="22" y2="48" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="44" x2="26" y2="49" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="44" x2="30" y2="48" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HomeQuickMenu: React.FC<HomeQuickMenuProps> = ({
  onSelectAction,
  pinpointCount,
  guideCount,
  repairsCount,
}) => {
  const books = [
    {
      id: 'pinpoint' as const,
      number: '1',
      title: '1) ชี้จุดเสีย แบบซวดลวดรวดเร็ว',
      count: pinpointCount,
      iconType: 'bulb' as const,
      // สีแดง (Red Tome)
      coverBg: 'from-red-950 via-red-800 to-rose-950',
      spineBg: 'from-red-950 via-red-900 to-red-950',
      ribbonBg: 'bg-red-500',
      goldGlow: 'hover:shadow-red-600/50 shadow-rose-950/60',
      emblemBg: 'bg-red-950/90 border-amber-400 text-amber-300',
      badgeBg: 'bg-red-900 text-amber-200 border-red-500/50',
      textColor: 'text-red-900',
    },
    {
      id: 'disassembly' as const,
      number: '2',
      title: '2) วิธีถอดเครื่อง/วิธีประกอบเครื่อง',
      count: guideCount,
      iconType: 'wrench' as const,
      // สีเหลือง (Yellow / Golden Tome)
      coverBg: 'from-amber-800 via-yellow-600 to-amber-900',
      spineBg: 'from-amber-950 via-amber-800 to-amber-950',
      ribbonBg: 'bg-yellow-400',
      goldGlow: 'hover:shadow-yellow-600/50 shadow-amber-950/60',
      emblemBg: 'bg-amber-950/90 border-amber-300 text-yellow-300',
      badgeBg: 'bg-amber-900 text-amber-200 border-amber-400/50',
      textColor: 'text-amber-900',
    },
    {
      id: 'knowledge' as const,
      number: '3',
      title: '3) คลังคัมภีร์ซวดรวดรวมอาการเสีย',
      count: repairsCount,
      iconType: 'brain' as const,
      // สีเขียว (Green Tome)
      coverBg: 'from-emerald-950 via-emerald-800 to-teal-950',
      spineBg: 'from-emerald-950 via-emerald-900 to-emerald-950',
      ribbonBg: 'bg-emerald-400',
      goldGlow: 'hover:shadow-emerald-600/50 shadow-emerald-950/60',
      emblemBg: 'bg-emerald-950/90 border-emerald-300 text-emerald-300',
      badgeBg: 'bg-emerald-900 text-emerald-200 border-emerald-500/50',
      textColor: 'text-emerald-900',
    },
  ];

  return (
    <div className="py-2 print:hidden select-none max-w-4xl mx-auto">
      {/* 
        Responsive Layout:
        - เรียงแนวนอนบนหน้าจอปกติ (sm:grid-cols-3)
        - หากเรียงแนวนอนไม่พอ บนหน้าจอแคบมากจะเรียงแนวตั้งอัตโนมัติ (grid-cols-1 sm:grid-cols-3)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 justify-center">
        {books.map((book) => {
          return (
            <div key={book.id} className="flex flex-col items-center">
              {/* ปุ่มรูปเล่มคัมภีร์สมุดนูน 3D: ข้างในมี 'แค่ไอค่อน' เพื่อความกระชับ */}
              <button
                type="button"
                onClick={() => onSelectAction(book.id)}
                className={`group relative w-48 sm:w-full aspect-[4/3] max-w-[240px] rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:translate-y-0.5 cursor-pointer ${book.goldGlow} shadow-xl`}
                style={{
                  perspective: '1000px',
                }}
              >
                {/* 3D Book Construction */}
                <div className="relative w-full h-full flex rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-slate-900 shadow-md">
                  {/* สันปกคัมภีร์ด้านซ้าย (Book Spine) */}
                  <div
                    className={`w-5 sm:w-6 flex-shrink-0 bg-gradient-to-r ${book.spineBg} border-r-2 border-amber-400/70 relative flex flex-col items-center justify-between py-2 shadow-inner`}
                  >
                    <div className="w-full h-0.5 bg-amber-400/70" />
                    <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/80 flex items-center justify-center text-amber-300 font-mono text-[9px] font-black">
                      {book.number}
                    </div>
                    <div className="w-full h-0.5 bg-amber-400/70" />
                  </div>

                  {/* หน้าปกคัมภีร์: ใส่ 'แค่ไอค่อน' กึ่งกลาง เพื่อความกระชับ สวยงาม */}
                  <div
                    className={`flex-1 p-2 bg-gradient-to-br ${book.coverBg} relative overflow-hidden flex items-center justify-center`}
                  >
                    {/* กรอบทองปั๊มนูน */}
                    <div className="absolute inset-1.5 rounded-xl border border-amber-400/40 pointer-events-none" />

                    {/* มุมทอง 4 ด้าน */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
                    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-amber-300 pointer-events-none" />

                    {/* ริบบิ้นคั่นหน้าคัมภีร์ */}
                    <div
                      className={`absolute top-0 right-4 w-2.5 h-6 ${book.ribbonBg} shadow-md rounded-b-xs border-b border-black/30 pointer-events-none z-10`}
                    />

                    {/* ตัวนับจำนวนมุมบนขวา */}
                    <div className="absolute bottom-2 right-2.5 text-[10px] font-mono font-black text-amber-200/90 bg-black/40 px-1.5 py-0.2 rounded border border-amber-400/30">
                      {book.count}
                    </div>

                    {/* ตราสัญลักษณ์นูน 3D กึ่งกลาง: มี 'แค่ไอค่อน' ตรงตามโจทย์ */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${book.emblemBg} border-2 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      {book.iconType === 'bulb' && <CircuitBulbIcon />}
                      {book.iconType === 'wrench' && (
                        <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 stroke-[2.2] drop-shadow" />
                      )}
                      {book.iconType === 'brain' && <ElectronicBrainIcon />}
                    </div>
                  </div>

                  {/* สันขอบกระดาษสมุดด้านขวา (Book Page Edges) */}
                  <div
                    className="w-2.5 sm:w-3 flex-shrink-0 border-l border-amber-900/60"
                    style={{
                      background:
                        'repeating-linear-gradient(180deg, #fef3c7 0px, #fef3c7 1px, #d97706 1px, #d97706 2px)',
                      boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
                    }}
                  />
                </div>

                {/* เงา 3D ตกกระทบพื้น */}
                <div className="h-2 w-10/12 mx-auto bg-black/40 blur-xs rounded-full -mt-1 group-hover:scale-95 transition-transform" />
              </button>

              {/* 
                คำบรรยายใส่ใต้ปุ่ม เอาเเค่ชื่อหัวข้อ (ไม่ต้องเพิ่มคำบรรยายเพราะยาวไป)
              */}
              <div className="mt-2.5 text-center px-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                  {book.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
