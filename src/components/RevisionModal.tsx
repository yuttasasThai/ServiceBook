import React, { useState } from 'react';
import { RevisionRecord } from '../types';
import { downloadSourceZip } from '../utils/exportSourceZip';
import {
  GitBranch,
  Calendar,
  CheckCircle,
  Plus,
  X,
  Code2,
  Tag,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  Terminal,
  CloudUpload,
  Check,
} from 'lucide-react';

interface RevisionModalProps {
  revisions: RevisionRecord[];
  activeRevision: string;
  isOpen: boolean;
  onClose: () => void;
  onAddRevision: (rec: RevisionRecord) => void;
  isAdmin: boolean;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  revisions,
  activeRevision,
  isOpen,
  onClose,
  onAddRevision,
  isAdmin,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [versionInput, setVersionInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [showDeployGuide, setShowDeployGuide] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    const res = downloadSourceZip('khamphi-suadluad-source.zip');
    if (res.success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionInput.trim() || !descInput.trim()) return;

    const newRev: RevisionRecord = {
      revision: versionInput.startsWith('Rev') ? versionInput.trim() : `Rev ${versionInput.trim()}`,
      date: new Date().toISOString().split('T')[0],
      description: descInput.trim(),
      details: detailsInput
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
    };

    onAddRevision(newRev);
    setShowAddForm(false);
    setVersionInput('');
    setDescInput('');
    setDetailsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ประวัติการปรับปรุง Source Code (Revision Tracking)
              </h3>
              <span className="text-xs text-slate-400">
                เวอร์ชันปัจจุบันที่กำลังทำงาน: <strong className="text-amber-400">{activeRevision}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* กล่องดาวน์โหลด Source Code & คู่มือ GitHub / Vercel */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <CloudUpload className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-amber-200">
                    ดาวน์โหลด Source Code สำหรับขึ้น GitHub & Vercel
                  </h4>
                  <p className="text-xs text-slate-300">
                    รวมไฟล์ทั้งโปรเจกต์ พร้อมไฟล์ตั้งค่า <code className="text-amber-300 font-mono">vercel.json</code>, <code className="text-amber-300 font-mono">README.md</code> เรียบร้อย
                  </p>
                </div>
              </div>

              {/* ปุ่มดาวน์โหลดไฟล์ ZIP ทันที (Direct in-memory Blob, Guaranteed ZIP file) */}
              <button
                type="button"
                onClick={handleDownload}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 font-black text-xs rounded-xl shadow-lg transition cursor-pointer shrink-0 ${
                  downloadSuccess
                    ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/25 active:scale-95'
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>ดาวน์โหลด .ZIP สำเร็จแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>ดาวน์โหลด ZIP (81 KB)</span>
                  </>
                )}
              </button>
            </div>

            {/* ส่วนคู่มือคำสั่ง Git และ Vercel */}
            {showDeployGuide && (
              <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-sans text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      คำสั่งนำขึ้น GitHub (พิมพ์ใน Terminal หลังแตกไฟล์ ZIP):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const commands = `git init\ngit branch -M main\ngit add .\ngit commit -m "Initial commit"\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit push -u origin main`;
                        navigator.clipboard.writeText(commands);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] transition cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกคำสั่ง'}</span>
                    </button>
                  </div>
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
{`git init
git branch -M main
git add .
git commit -m "Initial commit: คัมภีร์ลับซ่างซวดลวด"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <strong className="text-white block mb-0.5">1. สร้าง Repo บน GitHub</strong>
                    ไปที่ github.com สร้าง New Repository แล้วนำ URL มาแทนที่ในคำสั่งด้านบน
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <strong className="text-white block mb-0.5">2. เชื่อมต่อไปยัง Vercel</strong>
                    ไปที่ vercel.com เลือก "Import Git Repository" แล้วกด Deploy ได้ทันที (ระบบมี vercel.json ให้แล้ว)
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">การันตีไฟล์ .ZIP แท้ 100%: </span>
                    ระบบส่งข้อมูลไบนารี ZIP ตรงเข้าเครื่อง (In-memory Binary Blob) มั่นใจได้ว่าได้ไฟล์ <code className="text-white font-mono bg-amber-950/80 px-1 py-0.5 rounded">.zip</code> แท้ ไม่ใช่ไฟล์ .html แน่นอน แตกไฟล์แล้วเปิดด้วย VS Code หรืออัปขึ้น GitHub ได้ทันที
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-600">
              บันทึกการแก้ไขปรับปรุงตามข้อกำหนดซอร์สโค้ด
            </span>
            {isAdmin && !showAddForm && (
              <button
                onClick={() => {
                  const nextNum = (revisions.length + 1).toString();
                  setVersionInput(`Rev 1.0.${nextNum}`);
                  setShowAddForm(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ เพิ่มบันทึก Revision ใหม่</span>
              </button>
            )}
          </div>

          {/* Form to add new revision */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-slate-50 p-4 rounded-xl border border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  เพิ่มบันทึก Revision ของโปรแกรม
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ยกเลิก
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    รหัส Revision
                  </label>
                  <input
                    type="text"
                    value={versionInput}
                    onChange={(e) => setVersionInput(e.target.value)}
                    placeholder="เช่น Rev 1.0.1"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    หัวข้อการปรับปรุง
                  </label>
                  <input
                    type="text"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="เช่น เพิ่มฟังก์ชันพิมพ์แบบ A4"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  รายละเอียด (แยกทีละบรรทัด)
                </label>
                <textarea
                  rows={3}
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="• ปรับปรุงปุ่มกดเปลี่ยนหน้าปก&#10;• อัปเดตตารางสรุปตามสินค้า"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg"
                >
                  บันทึก Revision
                </button>
              </div>
            </form>
          )}

          {/* Timeline of Revisions */}
          <div className="space-y-4">
            {revisions.map((rev, idx) => (
              <div
                key={rev.revision}
                className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-transparent"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-xs" />

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-400">
                        {rev.revision}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.description}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {rev.date}
                    </span>
                  </div>

                  {rev.details && rev.details.length > 0 && (
                    <ul className="space-y-1 pt-1 text-xs text-slate-600">
                      {rev.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>ระบบ Revision จะเพิ่มขึ้นเรื่อยๆ ทุกครั้งที่มีการอัปเดตโค้ดและปรับปรุงฟังก์ชัน</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
