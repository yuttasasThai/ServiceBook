import React, { useState } from 'react';
import {
  RotateCcw,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearWorkData: () => void;
  onResetFactoryDefaults: () => void;
  totalRepairs: number;
  totalPinpoints: number;
  totalGuides: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onClearWorkData,
  onResetFactoryDefaults,
  totalRepairs,
  totalPinpoints,
  totalGuides,
}) => {
  const [selectedOption, setSelectedOption] = useState<'clear' | 'factory'>('clear');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedOption === 'clear') {
      onClearWorkData();
      setSuccessMsg('เคลียร์รายการงานเก่าทั้งหมดเรียบร้อยแล้ว! ตอนนี้คุณสามารถเริ่มบันทึกงานใหม่ได้ทันที');
    } else {
      onResetFactoryDefaults();
      setSuccessMsg('คืนค่าเริ่มต้นจากโรงงาน (Factory Defaults) เรียบร้อยแล้ว!');
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                รีเซ็ตค่าเริ่มต้น / เคลียร์งานเก่า
              </h3>
              <p className="text-xs text-amber-950/80 font-medium">
                จัดการเคลียร์งานเพื่อเริ่มต้นใหม่ หรือคืนค่าเริ่มต้นโรงงาน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-950/10 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-black text-slate-900">ดำเนินการสำเร็จ</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* สรุปข้อมูลปัจจุบัน */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="text-slate-500 block">งานชี้จุดเสีย</span>
                  <strong className="text-sm font-bold text-slate-800">{totalPinpoints} รายการ</strong>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-500 block">วิธีถอด/ประกอบ</span>
                  <strong className="text-sm font-bold text-slate-800">{totalGuides} รายการ</strong>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-500 block">คัมภีร์ตารางรวม</span>
                  <strong className="text-sm font-bold text-slate-800">{totalRepairs} รายการ</strong>
                </div>
              </div>

              {/* 2 ตัวเลือกหลัก */}
              <div className="space-y-3">
                {/* ตัวเลือกที่ 1: เคลียร์งานเก่าออกทั้งหมด */}
                <label
                  onClick={() => setSelectedOption('clear')}
                  className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
                    selectedOption === 'clear'
                      ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="reset-option"
                      checked={selectedOption === 'clear'}
                      onChange={() => setSelectedOption('clear')}
                      className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <Trash2 className="w-4 h-4 text-rose-500" />
                        <span>1) เคลียร์งานเก่าออกทั้งหมด (แนะนำสำหรับการเริ่มต้นบันทึกจริง)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ล้างรายการชี้จุดเสีย, วิธีถอดประกอบ, และใบงานซ่อมทั้งหมดให้เป็น <strong>0 รายการ</strong> เพื่อให้คุณบันทึกข้อมูลจริงของคุณเองใหม่ได้ทันที
                        <span className="block text-emerald-700 font-medium mt-0.5">
                          ✓ ข้อมูลชื่อร้าน, เบอร์โทร, LINE และลิงก์สาขาจะยังคงอยู่ ไม่ถูกลบ
                        </span>
                      </p>
                    </div>
                  </div>
                </label>

                {/* ตัวเลือกที่ 2: คืนค่าเริ่มต้นจากโรงงาน */}
                <label
                  onClick={() => setSelectedOption('factory')}
                  className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
                    selectedOption === 'factory'
                      ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="reset-option"
                      checked={selectedOption === 'factory'}
                      onChange={() => setSelectedOption('factory')}
                      className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>2) คืนค่าเริ่มต้นจากโรงงาน (Reset to Factory Defaults)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        กู้คืนข้อมูลตัวอย่างเริ่มต้นทั้งหมดกลับมา (งานซ่อมตัวอย่างบอร์ดเครื่องซักผ้า, ทีวี, มอเตอร์ ฯลฯ และข้อมูลร้านเริ่มต้น)
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* คำเตือน */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ข้อควรระวัง:</span> การดำเนินการนี้จะแก้ไขข้อมูลในเบราว์เซอร์ของคุณ กรุณาตรวจสอบให้แน่ใจก่อนกดดำเนินการ
                </div>
              </div>

              {/* ปุ่ม Action */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5 ${
                    selectedOption === 'clear'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  }`}
                >
                  {selectedOption === 'clear' ? (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>ยืนยันเคลียร์งานเก่าออกทั้งหมด</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>ยืนยันคืนค่าโรงงาน</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
