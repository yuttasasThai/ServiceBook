import React, { useState, useRef } from 'react';
import { DisassemblyGuide, GuideStep, AuthSession } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Wrench,
  Plus,
  Camera,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Search,
  Maximize2,
  X,
  Layers,
  ArrowRight,
  BookOpen,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DisassemblyGuideSectionProps {
  guides: DisassemblyGuide[];
  session: AuthSession;
  onSaveGuide: (guide: DisassemblyGuide) => void;
  onDeleteGuide: (id: string) => void;
}

export const DisassemblyGuideSection: React.FC<DisassemblyGuideSectionProps> = ({
  guides,
  session,
  onSaveGuide,
  onDeleteGuide,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [model, setModel] = useState('');
  const [symptom, setSymptom] = useState('');
  const [guideType, setGuideType] = useState<'disassembly' | 'assembly' | 'both'>('disassembly');
  const [steps, setSteps] = useState<GuideStep[]>([
    {
      id: `step-${Date.now()}-1`,
      stepNumber: 1,
      photo: '',
      description: '',
    },
  ]);

  // Search & Expanded guides & Lightbox
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const resetForm = () => {
    setModel('');
    setSymptom('');
    setGuideType('disassembly');
    setSteps([
      {
        id: `step-${Date.now()}-1`,
        stepNumber: 1,
        photo: '',
        description: '',
      },
    ]);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEditClick = (g: DisassemblyGuide) => {
    setEditingId(g.id);
    setModel(g.model);
    setSymptom(g.symptom);
    setGuideType(g.type);
    setSteps(g.steps);
    setIsCreating(true);
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  // Add a new step (up to 10 photos)
  const handleAddStep = () => {
    if (steps.length >= 10) {
      alert('สามารถเพิ่มรูปขั้นตอนได้สูงสุด 10 รูป');
      return;
    }
    const newStep: GuideStep = {
      id: `step-${Date.now()}-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      photo: '',
      description: '',
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      alert('จำเป็นต้องมีอย่างน้อย 1 ขั้นตอน');
      return;
    }
    const updated = steps
      .filter((_, i) => i !== index)
      .map((st, i) => ({ ...st, stepNumber: i + 1 }));
    setSteps(updated);
  };

  const updateStepField = (index: number, field: 'photo' | 'description', value: string) => {
    const updated = [...steps];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSteps(updated);
  };

  const handleStepPhotoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressed = await compressImageFile(files[0], 900, 900, 0.75);
      updateStepField(index, 'photo', compressed);
    } catch (err) {
      console.error('Error compressing step photo', err);
      alert('ไม่สามารถอัปโหลดภาพขั้นตอนได้');
    }
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!model.trim()) {
      alert('กรุณากรอกรุ่นสินค้า');
      return;
    }
    if (!symptom.trim()) {
      alert('กรุณากรอกอาการหรือวัตถุประสงค์การถอด/ประกอบ');
      return;
    }

    // Check if at least one photo is provided
    const validSteps = steps.filter((s) => s.photo || s.description.trim());
    if (validSteps.length === 0) {
      alert('กรุณาเพิ่มรูปถ่ายหรือคำอธิบายอย่างน้อย 1 ขั้นตอน');
      return;
    }

    const newGuide: DisassemblyGuide = {
      id: editingId || `guide-${Date.now()}`,
      model: model.trim(),
      symptom: symptom.trim(),
      type: guideType,
      steps: steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 })),
      createdAt: editingId
        ? guides.find((g) => g.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      author: session.branchName || 'ช่างผู้ชำนาญ',
    };

    onSaveGuide(newGuide);
    alert(editingId ? 'บันทึกการแก้ไขคู่มือถอด/ประกอบสำเร็จ' : 'สร้างคู่มือถอด/ประกอบสำเร็จแล้ว!');
    resetForm();
  };

  const filteredGuides = guides.filter((g) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchesBase = g.model.toLowerCase().includes(q) || g.symptom.toLowerCase().includes(q);
    const matchesSteps = g.steps.some((s) => s.description.toLowerCase().includes(q));
    return matchesBase || matchesSteps;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-cyan-600" />
                <span>วิธีถอดเครื่อง / วิธีประกอบเครื่อง</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              คู่มือขั้นตอนการแกะและประกอบ: ใส่รุ่น / อาการ / เพิ่มรูปขั้นตอน + คำอธิบายทีละขั้นตอน (เพิ่มได้ 1-10 รูป)
            </p>
          </div>

          {!isCreating && (
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ สร้างวิธีถอด/ประกอบใหม่</span>
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div className="pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาคู่มือถอด/ประกอบ ตามรุ่น, อาการ, หรือขั้นตอน..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้างคำค้น
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form: สร้าง / แก้ไขคู่มือถอด/ประกอบ */}
      {isCreating && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-cyan-400/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? '✏️ แก้ไขวิธีถอด/ประกอบ' : '➕ ฟอร์มสร้างคู่มือวิธีถอด/วิธีประกอบเครื่อง'}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ยกเลิก
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Row: รุ่น / อาการ / ประเภท */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* รุ่น */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  รุ่น (Model) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="เช่น Daikin FTKQ-UV2S, Sharp R-2200F"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  required
                />
              </div>

              {/* อาการ / วัตถุประสงค์ */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  อาการ / หัวข้อการถอดประกอบ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="เช่น ถอดล้างพัดลมกรงกระรอก, เปลี่ยนแมกนีตรอน..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  required
                />
              </div>

              {/* ประเภทคู่มือ */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ประเภทคู่มือ
                </label>
                <select
                  value={guideType}
                  onChange={(e) => setGuideType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                >
                  <option value="disassembly">🔧 วิธีถอดเครื่อง (Disassembly)</option>
                  <option value="assembly">🔩 วิธีประกอบเครื่อง (Assembly)</option>
                  <option value="both">🔄 วิธีถอดและประกอบเครื่อง (ครบชุด)</option>
                </select>
              </div>
            </div>

            {/* Steps List (1 to 10 photos) */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span>เพิ่มรูปขั้นตอน + พิมพ์คำอธิบาย (เพิ่มได้ 1-10 รูป)</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    ปัจจุบันเพิ่มแล้ว {steps.length} / 10 ขั้นตอน
                  </p>
                </div>

                {steps.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs border border-cyan-200 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ เพิ่มรูปขั้นตอนที่ {steps.length + 1}</span>
                  </button>
                )}
              </div>

              {/* Steps Cards */}
              <div className="space-y-4">
                {steps.map((st, idx) => (
                  <div
                    key={st.id}
                    className="bg-slate-50/80 p-4 rounded-xl border border-slate-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs font-black">
                        รูปขั้นตอนที่ {idx + 1}
                      </span>

                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบขั้นตอนนี้</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* รูปภาพขั้นตอน */}
                      <div className="md:col-span-5">
                        {st.photo ? (
                          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-900 group">
                            <img
                              src={st.photo}
                              alt={`ขั้นตอนที่ ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => updateStepField(idx, 'photo', '')}
                              className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                              title="ลบรูปนี้"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => {
                                fileInputRefs.current[st.id] = el;
                              }}
                              onChange={(e) => handleStepPhotoUpload(idx, e)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[st.id]?.click()}
                              className="w-full aspect-video rounded-lg border-2 border-dashed border-cyan-400 bg-cyan-50/30 hover:bg-cyan-100/50 flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:text-cyan-800 transition cursor-pointer"
                            >
                              <Camera className="w-6 h-6 text-cyan-500" />
                              <span className="text-xs font-bold">+ ถ่ายรูป/แนบรูปขั้นตอนที่ {idx + 1}</span>
                              <span className="text-[10px] text-slate-400">รูปจุดล็อก/ตำแหน่งน็อต</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* พิมพ์อธิบายข้างภาพ */}
                      <div className="md:col-span-7">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          พิมพ์อธิบายขั้นตอนที่ {idx + 1}
                        </label>
                        <textarea
                          rows={4}
                          value={st.description}
                          onChange={(e) => updateStepField(idx, 'description', e.target.value)}
                          placeholder={`อธิบายวิธีปฏิบัติในขั้นตอนที่ ${idx + 1} เช่น ขันสกรู 3 ตัวด้านล่าง ปลดกิ๊ฟล็อก...`}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm rounded-xl shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'บันทึกการแก้ไขคู่มือ' : 'บันทึกคู่มือถอด/ประกอบ'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guides List */}
      <div className="space-y-4 scroll-container">
        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">ยังไม่มีคู่มือวิธีถอด/ประกอบเครื่อง</p>
            <p className="text-xs text-slate-400 mt-1">
              กดปุ่ม "+ สร้างวิธีถอด/ประกอบใหม่" ด้านบนเพื่อบันทึกขั้นตอนและรูปภาพ 1-10 รูป
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedGuideId === guide.id;

            return (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 p-5 shadow-sm transition overflow-hidden"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">
                        {guide.type === 'disassembly'
                          ? '🔧 วิธีถอดเครื่อง'
                          : guide.type === 'assembly'
                          ? '🔩 วิธีประกอบเครื่อง'
                          : '🔄 ถอดและประกอบ'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {guide.steps.length} ขั้นตอน/รูป
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      รุ่น: <span className="text-cyan-800">{guide.model}</span> — {guide.symptom}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(guide)}
                      title="แก้ไข"
                      className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`ต้องการลบคู่มือของรุ่น ${guide.model} หรือไม่?`)) {
                          onDeleteGuide(guide.id);
                        }
                      }}
                      title="ลบ"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedGuideId(isExpanded ? null : guide.id)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <span>{isExpanded ? 'ย่อคู่มือ' : 'เปิดดูทุกขั้นตอน'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Compact preview or Full Steps */}
                {isExpanded ? (
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {guide.steps.map((step) => (
                        <div
                          key={step.id}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black bg-slate-900 text-amber-300 px-2 py-0.5 rounded">
                              ขั้นตอนที่ {step.stepNumber}
                            </span>
                          </div>

                          {step.photo && (
                            <div
                              onClick={() => setZoomImage(step.photo)}
                              className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer group"
                            >
                              <img
                                src={step.photo}
                                alt={`ขั้นตอนที่ ${step.stepNumber}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                            {step.description || <span className="text-slate-400 italic">ไม่มีคำอธิบาย</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Compact Preview row */
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      {guide.steps.slice(0, 4).map((s, i) => (
                        <div
                          key={s.id}
                          className="inline-block h-12 w-16 rounded-md overflow-hidden ring-2 ring-white border border-slate-200 bg-slate-100"
                        >
                          {s.photo ? (
                            <img src={s.photo} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                              #{i + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-slate-600 flex-1 line-clamp-1">
                      {guide.steps[0]?.description || 'คลิกเปิดดูทุกขั้นตอน เพื่ออ่านขั้นตอนการถอดประกอบ'}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(guide.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Zoom */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="ภาพขยาย"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
