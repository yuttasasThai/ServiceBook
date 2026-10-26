import React, { useState, useRef } from 'react';
import { QuickPinpointRecord, AuthSession } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Crosshair,
  Plus,
  Camera,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Search,
  RotateCcw,
  Sparkles,
  Maximize2,
  X,
  Wrench,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface QuickPinpointSectionProps {
  pinpoints: QuickPinpointRecord[];
  session: AuthSession;
  onSavePinpoint: (entry: QuickPinpointRecord) => void;
  onDeletePinpoint: (id: string) => void;
}

export const QuickPinpointSection: React.FC<QuickPinpointSectionProps> = ({
  pinpoints,
  session,
  onSavePinpoint,
  onDeletePinpoint,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [symptom, setSymptom] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [replacedWhat, setReplacedWhat] = useState('');

  // Search & Lightbox
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setModel('');
    setBrand('');
    setSymptom('');
    setPhoto('');
    setPhotoDescription('');
    setReplacedWhat('');
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEditClick = (item: QuickPinpointRecord) => {
    setEditingId(item.id);
    setModel(item.model);
    setBrand(item.brand || '');
    setSymptom(item.symptom);
    setPhoto(item.photo);
    setPhotoDescription(item.photoDescription);
    setReplacedWhat(item.replacedWhat);
    setIsCreating(true);
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressed = await compressImageFile(files[0], 900, 900, 0.75);
      setPhoto(compressed);
    } catch (err) {
      console.error('Error compressing image', err);
      alert('ไม่สามารถอัปโหลดภาพได้ กรุณาลองใหม่อีกครั้ง');
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
      alert('กรุณากรอกอาการเสีย');
      return;
    }
    if (!photo) {
      alert('กรุณาถ่ายภาพหรืออัปโหลดภาพประกอบจุดเสีย');
      return;
    }

    const newRecord: QuickPinpointRecord = {
      id: editingId || `pin-${Date.now()}`,
      model: model.trim(),
      brand: brand.trim() || undefined,
      symptom: symptom.trim(),
      photo,
      photoDescription: photoDescription.trim(),
      replacedWhat: replacedWhat.trim() || 'ตรวจซ่อมแก้ไขจุดบัดกรี/ทำความสะอาด',
      createdAt: editingId
        ? pinpoints.find((p) => p.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      author: session.branchName || 'ช่างผู้ชำนาญ',
    };

    onSavePinpoint(newRecord);
    alert(editingId ? 'บันทึกการแก้ไขจุดเสียสำเร็จ' : 'บันทึกจุดเสียซวดลวดสำเร็จแล้ว!');
    resetForm();
  };

  const filteredList = pinpoints.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.model.toLowerCase().includes(q) ||
      item.symptom.toLowerCase().includes(q) ||
      item.photoDescription.toLowerCase().includes(q) ||
      item.replacedWhat.toLowerCase().includes(q) ||
      (item.brand && item.brand.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Crosshair className="w-6 h-6 text-amber-500" />
                <span>ชี้จุดเสีย แบบซวดลวดรวดเร็ว</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              ฟังก์ชันด่วนสำหรับช่าง: ระบุรุ่น / อาการ / ถ่ายภาพจุดเสีย / พิมพ์อธิบายข้างภาพ / เปลี่ยนอะไร จบงานได้ทันที
            </p>
          </div>

          {!isCreating && (
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ บันทึกชี้จุดเสียด่วน</span>
            </button>
          )}
        </div>

        {/* Quick Search Bar */}
        <div className="pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด่วนตามรุ่น, อาการ, จุดเสีย, หรืออะไหล่ที่เปลี่ยน..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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

      {/* Form: สร้าง / แก้ไขชี้จุดเสีย */}
      {isCreating && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-amber-400/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? '✏️ แก้ไขข้อมูลจุดเสีย' : '➕ ฟอร์มชี้จุดเสีย แบบซวดลวดรวดเร็ว'}
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
            {/* Top Row: รุ่น & อาการ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* รุ่น */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  รุ่น (Model) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="เช่น WA16J6750SP, 55T6, MS-GL13VF"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              {/* ยี่ห้อ */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ยี่ห้อ (Brand)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="เช่น Samsung, LG, Daikin, Sharp"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* อาการ */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  อาการเสีย <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="เช่น เปิดไม่ติด, จอมืดมีเสียง, ปั่นหมาดไม่ได้..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Middle Row: ถ่ายภาพ + พิมพ์อธิบายข้างภาพ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* ซ้าย: ถ่ายภาพ / แสดงรูป */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>ถ่ายภาพจุดเสีย / อุปกรณ์เสีย <span className="text-red-500">*</span></span>
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      เปลี่ยนรูป
                    </button>
                  )}
                </div>

                {photo ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-900 group">
                    <img
                      src={photo}
                      alt="จุดเสีย"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <button
                        type="button"
                        onClick={() => setZoomImage(photo)}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-950 text-xs font-bold shadow"
                      >
                        ดูภาพเต็ม
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/40 hover:bg-amber-100/50 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-amber-800 transition cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-amber-500" />
                      <span className="text-xs font-bold">กดเพื่อถ่ายภาพ หรือ อัปโหลดรูปภาพ</span>
                      <span className="text-[10px] text-slate-400">รูปจุดไหม้ / อุปกรณ์ช็อต / รอยเสีย</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ขวา: พิมพ์ อธิบาย ข้างภาพ */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  พิมพ์ อธิบาย ข้างภาพ (รายละเอียดจุดเสียที่พบ)
                </label>
                <textarea
                  rows={5}
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="พิมพ์อธิบายชี้จุดเสียข้างภาพ เช่น: ตรวจพบไดโอด D101 ช็อตทะลุ และ R สตาร์ทไหม้ดำ ทำให้ไฟ 300Vdc ไม่เข้าไอซีสวิทชิ่ง ขูดกาวทำความสะอาดแล้ววัดเทียบจุด TP2..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Bottom Row: เปลี่ยนอะไร */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>เปลี่ยนอะไร (อะไหล่หรือวิธีแก้ไขที่จบงาน)</span>
              </label>
              <input
                type="text"
                value={replacedWhat}
                onChange={(e) => setReplacedWhat(e.target.value)}
                placeholder="เช่น เปลี่ยน Diode Bridge 4A/600V และ R-Fuse 10Ω 5W บอร์ดจ่ายไฟปกติ รันเทสต์ผ่านฉลุย"
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'บันทึกการแก้ไข' : 'บันทึกจุดเสียซวดลวด'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pinpoint Cards List */}
      <div className="space-y-4 scroll-container">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Crosshair className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">ยังไม่มีรายการชี้จุดเสียด่วน</p>
            <p className="text-xs text-slate-400 mt-1">
              กดปุ่ม "+ บันทึกชี้จุดเสียด่วน" ด้านบน เพื่อสร้างคลังชี้จุดเสียรวดเร็ว
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-5 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Left: รูปถ่ายจุดเสีย (4 cols on desktop) */}
                <div className="md:col-span-5">
                  <div
                    onClick={() => setZoomImage(item.photo)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer group shadow-inner"
                  >
                    <img
                      src={item.photo}
                      alt={item.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 font-mono text-[11px] font-bold">
                      {item.brand ? `${item.brand} ` : ''}{item.model}
                    </div>
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Right: พิมพ์ อธิบาย ข้างภาพ + เปลี่ยนอะไร (7 cols on desktop) */}
                <div className="md:col-span-7 space-y-3">
                  {/* Model & Symptom Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase">
                        รุ่น: <strong className="text-slate-800 text-sm">{item.model}</strong>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>อาการ: {item.symptom}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(item)}
                        title="แก้ไข"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบจุดเสียของรุ่น ${item.model} หรือไม่?`)) {
                            onDeletePinpoint(item.id);
                          }
                        }}
                        title="ลบ"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* คำอธิบายข้างภาพ */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      📝 คำอธิบายจุดเสียข้างภาพ:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {item.photoDescription || <span className="text-slate-400 italic">ไม่มีคำอธิบาย</span>}
                    </p>
                  </div>

                  {/* เปลี่ยนอะไร */}
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold text-emerald-950">เปลี่ยนอะไร: </span>
                      <span className="font-semibold text-emerald-900">{item.replacedWhat}</span>
                    </div>
                  </div>

                  {/* Author & Date Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>บันทึกโดย: {item.author || 'ช่างผู้ชำนาญ'}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
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
