import React, { useState } from 'react';
import { RepairEntry, ShopProfile } from '../types';
import {
  Printer,
  Copy,
  Check,
  Eye,
  Activity,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  ArrowLeft,
  Share2,
  Calendar,
  User,
  Wrench,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';

interface DetailSheetViewProps {
  repairs: RepairEntry[];
  selectedRepairId: string | null;
  shopProfile: ShopProfile;
  onSelectRepair: (id: string) => void;
  onBackToTable: () => void;
}

export const DetailSheetView: React.FC<DetailSheetViewProps> = ({
  repairs,
  selectedRepairId,
  shopProfile,
  onSelectRepair,
  onBackToTable,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Active repair to display
  const currentRepair =
    repairs.find((r) => r.id === selectedRepairId) || repairs[0] || null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTextReport = () => {
    if (!currentRepair) return;
    const lines = [
      `📋 คัมภีร์งานซ่อม: ${currentRepair.code}`,
      `📌 สินค้า: ${currentRepair.category} | ${currentRepair.brand} ${currentRepair.model}`,
      `🔧 ช่างผู้ซ่อม: ${currentRepair.technicianName} (${currentRepair.branchName})`,
      `📅 วันที่: ${currentRepair.repairDate}`,
      '----------------------------------------',
      ...currentRepair.symptoms.map(
        (s, idx) =>
          `[อาการที่ ${idx + 1}] ${s.symptomTitle}\n` +
          `• Visual Check: ${s.visualCheck || '-'}\n` +
          `• Function Check: ${s.functionCheck || '-'}\n` +
          `• แนวทางตรวจวัด: ${s.checkTechnique || '-'}\n` +
          `• สาเหตุ Root Cause: ${s.rootCause || '-'}\n` +
          `• อะไหล่เปลี่ยน: ${s.replacedParts || '-'}\n` +
          `• ผลทดสอบ: ${s.postRepairTest || '-'}\n`
      ),
      '----------------------------------------',
      `ร้าน: ${shopProfile.shopName} โทร: ${shopProfile.phone} LINE: ${shopProfile.lineId}`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!currentRepair) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลงานซ่อมในระบบ กรุณาบันทึกข้อมูลก่อน</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTable}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าตารางสรุป</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Dropdown to Switch Case */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">เลือกดูเคส:</span>
            <select
              value={currentRepair.id}
              onChange={(e) => onSelectRepair(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {repairs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} - {r.brand} {r.model} ({r.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTextReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">คัดลอกข้อความแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>คัดลอกสรุปส่ง LINE</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบงาน Sheet / บันทึกเป็น PDF</span>
          </button>
        </div>
      </div>

      {/* Main Technical Sheet Container (A4 Printable Layout) */}
      <div className="sheet-container bg-white rounded-2xl shadow-md border border-slate-300 p-6 sm:p-10 max-w-5xl mx-auto text-slate-900 print:p-4 print:shadow-none print:border-none print:max-w-full">
        {/* Sheet Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
              คัมภีร์ยุทธซ่างซวดลวดFix it
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ใบบันทึกผลการวิเคราะห์งานซ่อม (Technical Service Sheet)
            </h1>
            <p className="text-xs text-slate-600">
              {shopProfile.shopName} • ช่างผู้เชี่ยวชาญ: {shopProfile.technicianName} • โทร: {shopProfile.phone} • LINE: {shopProfile.lineId}
            </p>
          </div>

          <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">เลขที่บันทึกคัมภีร์</div>
            <div className="text-lg font-mono font-black text-amber-600">
              {currentRepair.code}
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>วันที่บันทึก: {currentRepair.repairDate}</span>
            </div>
          </div>
        </div>

        {/* Basic Device Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">ชนิดสินค้า</span>
            <span className="font-bold text-slate-900 text-base">{currentRepair.category}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">ยี่ห้อ (Brand)</span>
            <span className="font-bold text-slate-900 text-base">{currentRepair.brand}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">รุ่น (Model)</span>
            <span className="font-bold text-slate-900 text-base">{currentRepair.model}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">สถานะผลการซ่อม</span>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mt-1">
              {currentRepair.status === 'completed'
                ? '✅ ซ่อมสำเร็จสมบูรณ์'
                : currentRepair.status === 'in_progress'
                ? '⚙️ กำลังตรวจสอบ'
                : '⏳ รออะไหล่'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">หมายเลขเครื่อง S/N</span>
            <span className="font-mono text-slate-700">{currentRepair.serialNumber || '-'}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">ช่างผู้บันทึก</span>
            <span className="font-medium text-slate-800">{currentRepair.technicianName}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">สาขาที่ปฏิบัติการ</span>
            <span className="font-medium text-slate-800">{currentRepair.branchName}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">ค่าบริการ / อะไหล่</span>
            <span className="font-bold text-amber-700">
              {currentRepair.estimatedCost ? `${currentRepair.estimatedCost.toLocaleString()} บาท` : '-'}
            </span>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              รายละเอียดผลการวิเคราะห์อาการเสีย ({currentRepair.symptoms.length} อาการ)
            </h2>
          </div>

          {currentRepair.symptoms.map((symptom, sIdx) => (
            <div
              key={symptom.id}
              className="bg-white rounded-xl border border-slate-300 p-5 space-y-5 shadow-xs"
            >
              {/* Symptom Title Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-black text-sm flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">อาการเสียที่ {sIdx + 1}</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {symptom.symptomTitle}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Grid: Visual Check & Function Check */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Check */}
                <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wide mb-1.5">
                    <Eye className="w-4 h-4 text-sky-600" />
                    <span>Visual Check (พบจุดเสียด้วยสายตาตรวจสอบ)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {symptom.visualCheck || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                  </p>
                </div>

                {/* Function Check */}
                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide mb-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Function Check (ต้องจ่ายไฟถึงจะทราบ)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {symptom.functionCheck || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                  </p>
                </div>
              </div>

              {/* Grid: Technique & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Technique */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide mb-1.5">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    <span>เทคนิคแนวทางตรวจสอบ (การตั้งค่า, การวัด)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {symptom.checkTechnique || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                  </p>
                </div>

                {/* Root Cause */}
                <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>สาเหตุ (Root Cause) อุปกรณ์เสีย</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                    {symptom.rootCause || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                  </p>
                </div>
              </div>

              {/* Replaced Parts & Post-Repair Test */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50/60">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    รายการอะไหล่ที่เปลี่ยน:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {symptom.replacedParts || <span className="text-slate-400 italic">ไม่ได้เปลี่ยนอะไหล่/ไม่ระบุ</span>}
                  </p>
                </div>

                <div className="border border-emerald-200 p-3.5 rounded-xl bg-emerald-50/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ผลทดสอบหลังการซ่อม (Post-Repair Test):</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                    {symptom.postRepairTest || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                  </p>
                </div>
              </div>

              {/* Photos Gallery */}
              {symptom.photos && symptom.photos.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>ภาพถ่ายประกอบงานซ่อม ({symptom.photos.length} รูป):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {symptom.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setZoomImageUrl(photo)}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-100 cursor-pointer shadow-xs hover:border-amber-500 transition"
                      >
                        <img
                          src={photo}
                          alt={`รูปประกอบ ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Circuit Diagram */}
              {symptom.circuitDiagram && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 mb-2">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span>รูปวงจร (Circuit Diagram / Schematic):</span>
                  </div>
                  <div
                    onClick={() => setZoomImageUrl(symptom.circuitDiagram || null)}
                    className="max-w-md rounded-lg overflow-hidden border border-slate-300 bg-slate-900 cursor-pointer hover:border-cyan-500 transition p-1"
                  >
                    <img
                      src={symptom.circuitDiagram}
                      alt="รูปวงจร"
                      className="w-full h-auto max-h-60 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer of Sheet */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <span>บันทึกและจัดเก็บโดยระบบ: </span>
            <strong className="text-slate-800">คัมภีร์ยุทธซ่างซวดลวดFix it</strong>
          </div>
          <div>
            <span>ลงชื่อช่างผู้ตรวจซ่อม: __________________________ ({currentRepair.technicianName})</span>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="ภาพขยาย"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
