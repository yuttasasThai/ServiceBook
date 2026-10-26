import React, { useState, useEffect, useRef } from 'react';
import {
  RepairEntry,
  SymptomRecord,
  ShopProfile,
  AuthSession,
} from '../types';
import {
  COMMON_CATEGORIES,
  COMMON_SYMPTOMS,
} from '../data/defaultData';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Plus,
  Trash2,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Cpu,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Save,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface RepairFormProps {
  categories: string[];
  shopProfile: ShopProfile;
  session: AuthSession;
  editingRepair: RepairEntry | null;
  onSave: (entry: RepairEntry) => void;
  onCancelEdit: () => void;
}

export const RepairForm: React.FC<RepairFormProps> = ({
  categories,
  shopProfile,
  session,
  editingRepair,
  onSave,
  onCancelEdit,
}) => {
  // Main form fields
  const [code, setCode] = useState('');
  const [category, setCategory] = useState(categories[1] || 'บอร์ดเครื่องซักผ้า');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [technicianName, setTechnicianName] = useState(
    session.role === 'branch_user'
      ? session.branchName || shopProfile.technicianName
      : shopProfile.technicianName
  );
  const [branchName, setBranchName] = useState(
    session.role === 'branch_user'
      ? session.branchName || 'สาขาย่อย'
      : 'สำนักงานใหญ่'
  );
  const [repairDate, setRepairDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'completed' | 'in_progress' | 'waiting_parts'>('completed');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Symptoms list
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>([]);

  // Feedback states
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSymptomIndex, setActiveSymptomIndex] = useState(0);

  // File input refs
  const photoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const circuitInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Reset or populate when editingRepair changes
  useEffect(() => {
    if (editingRepair) {
      setCode(editingRepair.code);
      setCategory(editingRepair.category);
      setBrand(editingRepair.brand);
      setModel(editingRepair.model);
      setSerialNumber(editingRepair.serialNumber || '');
      setTechnicianName(editingRepair.technicianName);
      setBranchName(editingRepair.branchName);
      setRepairDate(editingRepair.repairDate);
      setStatus(editingRepair.status);
      setEstimatedCost(editingRepair.estimatedCost || '');
      setNotes(editingRepair.notes || '');
      setSymptoms(editingRepair.symptoms);
      setActiveSymptomIndex(0);
    } else {
      resetForm();
    }
  }, [editingRepair]);

  const resetForm = () => {
    const timestamp = Date.now().toString().slice(-4);
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    setCode(`FIX-${dateCode}-${timestamp}`);
    setCategory(categories[1] || 'บอร์ดเครื่องซักผ้า');
    setBrand('');
    setModel('');
    setSerialNumber('');
    setTechnicianName(
      session.role === 'branch_user'
        ? session.branchName || shopProfile.technicianName
        : shopProfile.technicianName
    );
    setBranchName(
      session.role === 'branch_user'
        ? session.branchName || 'สาขาย่อย'
        : 'สำนักงานใหญ่'
    );
    setRepairDate(new Date().toISOString().split('T')[0]);
    setStatus('completed');
    setEstimatedCost('');
    setNotes('');

    // Default with Symptom 1
    setSymptoms([
      {
        id: `sym-${Date.now()}-1`,
        symptomTitle: '',
        visualCheck: '',
        functionCheck: '',
        checkTechnique: '',
        rootCause: '',
        replacedParts: '',
        postRepairTest: '',
        photos: [],
        circuitDiagram: '',
      },
    ]);
    setActiveSymptomIndex(0);
  };

  // Add new symptom (อาการเสียที่ 2, 3...)
  const handleAddSymptom = () => {
    const newSymptom: SymptomRecord = {
      id: `sym-${Date.now()}-${symptoms.length + 1}`,
      symptomTitle: '',
      visualCheck: '',
      functionCheck: '',
      checkTechnique: '',
      rootCause: '',
      replacedParts: '',
      postRepairTest: '',
      photos: [],
      circuitDiagram: '',
    };
    setSymptoms([...symptoms, newSymptom]);
    setActiveSymptomIndex(symptoms.length);
  };

  // Remove symptom
  const handleRemoveSymptom = (index: number) => {
    if (symptoms.length <= 1) {
      alert('จำเป็นต้องมีอาการเสียอย่างน้อย 1 อาการ');
      return;
    }
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
    setActiveSymptomIndex(Math.max(0, index - 1));
  };

  // Update specific field in a symptom
  const updateSymptomField = <K extends keyof SymptomRecord>(
    index: number,
    field: K,
    value: SymptomRecord[K]
  ) => {
    const updated = [...symptoms];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSymptoms(updated);
  };

  // Handle uploading photos for a symptom (up to 3 photos)
  const handlePhotoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const currentPhotos = symptoms[index].photos || [];
      const newPhotos: string[] = [...currentPhotos];

      for (let i = 0; i < files.length; i++) {
        if (newPhotos.length >= 3) {
          alert('สามารถบันทึกภาพถ่ายประกอบงานซ่อมได้สูงสุด 3 รูปต่อ 1 อาการ');
          break;
        }
        const compressedBase64 = await compressImageFile(files[i], 800, 800, 0.75);
        newPhotos.push(compressedBase64);
      }

      updateSymptomField(index, 'photos', newPhotos);
    } catch (err) {
      console.error('Error compressing image', err);
      alert('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    }
    // reset input value so user can upload again if needed
    e.target.value = '';
  };

  const handleRemovePhoto = (symptomIndex: number, photoIndex: number) => {
    const currentPhotos = symptoms[symptomIndex].photos || [];
    const updated = currentPhotos.filter((_, i) => i !== photoIndex);
    updateSymptomField(symptomIndex, 'photos', updated);
  };

  // Handle uploading circuit diagram
  const handleCircuitUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressedBase64 = await compressImageFile(files[0], 1000, 1000, 0.8);
      updateSymptomField(index, 'circuitDiagram', compressedBase64);
    } catch (err) {
      console.error('Error uploading circuit diagram', err);
      alert('ไม่สามารถอัปโหลดภาพวงจรได้');
    }
    e.target.value = '';
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      alert('กรุณาระบุชนิดสินค้า');
      return;
    }
    if (!brand.trim()) {
      alert('กรุณาระบุยี่ห้อสินค้า');
      return;
    }
    if (!model.trim()) {
      alert('กรุณาระบุรุ่นสินค้า');
      return;
    }

    // Check symptoms
    for (let i = 0; i < symptoms.length; i++) {
      if (!symptoms[i].symptomTitle.trim()) {
        alert(`กรุณาระบุรายละเอียด "อาการเสียที่ ${i + 1}"`);
        setActiveSymptomIndex(i);
        return;
      }
    }

    const newEntry: RepairEntry = {
      id: editingRepair ? editingRepair.id : `rep-${Date.now()}`,
      code: code || `FIX-${Date.now().toString().slice(-6)}`,
      category: category.trim(),
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim() || undefined,
      technicianName: technicianName.trim() || shopProfile.technicianName,
      branchName: branchName.trim() || 'สำนักงานใหญ่',
      repairDate,
      status,
      estimatedCost: typeof estimatedCost === 'number' ? estimatedCost : undefined,
      notes: notes.trim() || undefined,
      symptoms,
      createdAt: editingRepair ? editingRepair.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newEntry);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    if (!editingRepair) {
      resetForm();
    }
  };

  const currentSymptom = symptoms[activeSymptomIndex] || symptoms[0];

  const brandSuggestions = [
    'LG',
    'Samsung',
    'Sony',
    'Panasonic',
    'Mitsubishi',
    'Daikin',
    'Sharp',
    'Toshiba',
    'Makita',
    'Hitachi',
    'Electrolux',
    'Carrier',
    'Haier',
    'TCL',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {editingRepair ? '✏️ แก้ไขข้อมูลคัมภีร์งานซ่อม' : '📝 บันทึกข้อมูลคัมภีร์งานซ่อม & แนวทางแก้ไข'}
            </h2>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            ส่วนที่ 1 & ส่วนที่ 2: บันทึกข้อมูลสินค้าและอาการเสียเจาะลึก Visual Check, Function Check, Root Cause และภาพถ่าย
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editingRepair && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 transition"
            >
              ยกเลิกการแก้ไข
            </button>
          )}

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างฟอร์ม</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-emerald-800 text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>บันทึกข้อมูลคัมภีร์งานซ่อมลงสู่ระบบเรียบร้อยแล้ว! สามารถเปิดดูในตารางสรุป หรือ Sheet แยกได้ทันที</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* SECTION 1: ข้อมูลเครื่องและสินค้า */}
        <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base mb-4 pb-2 border-b border-slate-200">
            <Cpu className="w-5 h-5 text-amber-500" />
            <span>ข้อมูลสินค้าและอุปกรณ์ที่นำมาซ่อม</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* รหัสใบงาน */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสบันทึกงานซ่อม
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="FIX-2026-001"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* สินค้า / ประเภทสินค้า */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  ชนิดสินค้า / หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  className="text-[11px] text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                >
                  {isAddingNewCategory ? '← เลือกจากรายการที่มี' : '+ เพิ่มชนิดสินค้าใหม่'}
                </button>
              </div>

              {isAddingNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder="พิมพ์ชื่อชนิดสินค้าใหม่ เช่น แอร์เคลื่อนที่, อินเวอร์เตอร์โซลาร์..."
                    className="flex-1 px-3 py-2 bg-white border border-amber-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customCategoryInput.trim()) {
                        setCategory(customCategoryInput.trim());
                        setIsAddingNewCategory(false);
                      }
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-xs"
                  >
                    ใช้ชนิดนี้
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  required
                >
                  {categories.filter((c) => c !== 'ทั้งหมด').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  {/* Default fallbacks if not in list */}
                  {!categories.includes(category) && (
                    <option value={category}>{category}</option>
                  )}
                </select>
              )}
            </div>

            {/* สถานะงาน */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะผลการซ่อม
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="completed">✅ ซ่อมสำเร็จสมบูรณ์ (Fixed)</option>
                <option value="in_progress">⚙️ กำลังดำเนินการวิเคราะห์</option>
                <option value="waiting_parts">⏳ รออะไหล่จากศูนย์</option>
              </select>
            </div>

            {/* ยี่ห้อ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ยี่ห้อ (Brand) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="เช่น LG, Samsung, Mitsubishi"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {brandSuggestions.slice(0, 6).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-200/80 hover:bg-slate-300 rounded text-slate-700 transition"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* รุ่น (Model) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รุ่น (Model) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="เช่น WF-T1465TD, UA55NU7100"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* หมายเลขเครื่อง S/N */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมายเลขเครื่อง / S/N (ถ้ามี)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="เช่น SN-892184912"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* วันที่ซ่อม */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ซ่อม / วันที่บันทึก
              </label>
              <input
                type="date"
                value={repairDate}
                onChange={(e) => setRepairDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* ช่างผู้ซ่อม */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ช่างผู้บันทึก / ผู้ตรวจซ่อม
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* สาขา */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สาขาประจำ
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* ค่าบริการโดยประมาณ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าบริการ / ค่าอะไหล่ (บาท)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value ? Number(e.target.value) : '')}
                placeholder="เช่น 1500"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* หมายเหตุเพิ่มเติม */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมายเหตุงานซ่อม
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ข้อมูลเพิ่มเติมจากลูกค้าหรือการรับประกัน"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: รายการอาการเสีย (Dynamic Symptom list 1, 2...) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  เจาะลึกอาการเสีย & ขั้นตอนวิเคราะห์แก้ไข
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                สามารถเพิ่มได้หลายอาการเสียต่อ 1 เครื่อง (อาการเสียที่ 1, อาการเสียที่ 2...) พร้อม Visual Check, Function Check, Root Cause
              </p>
            </div>

            {/* Add symptom button */}
            <button
              type="button"
              onClick={handleAddSymptom}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มอาการเสียที่ {symptoms.length + 1}</span>
            </button>
          </div>

          {/* Symptom Tabs / Filter selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
            {symptoms.map((sym, idx) => (
              <div key={sym.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveSymptomIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeSymptomIndex === idx
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold">
                    {idx + 1}
                  </span>
                  <span>
                    อาการเสียที่ {idx + 1}
                    {sym.symptomTitle ? `: ${sym.symptomTitle.slice(0, 15)}...` : ''}
                  </span>
                </button>

                {symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(idx)}
                    title={`ลบอาการเสียที่ ${idx + 1}`}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition ml-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Symptom Card Content */}
          {currentSymptom && (
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 space-y-6">
              {/* Header of Active Symptom & Preset Selector */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>ระบุชื่ออาการเสียที่ {activeSymptomIndex + 1}</span>
                    <span className="text-red-500">*</span>
                  </label>

                  <span className="text-xs text-slate-500">
                    เลือกจากอาการพบบ่อย หรือพิมพ์ระบุเอง
                  </span>
                </div>

                <input
                  type="text"
                  value={currentSymptom.symptomTitle}
                  onChange={(e) =>
                    updateSymptomField(activeSymptomIndex, 'symptomTitle', e.target.value)
                  }
                  placeholder="เช่น เปิดไม่ติด ไฟสแตนด์บายไม่ติด, มอเตอร์หมุนกระตุก Error E-02, จอดำมีเสียง..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />

                {/* Common Symptom Quick Filter Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">อาการพบบ่อย:</span>
                  {COMMON_SYMPTOMS.map((commonSym) => (
                    <button
                      key={commonSym}
                      type="button"
                      onClick={() =>
                        updateSymptomField(activeSymptomIndex, 'symptomTitle', commonSym)
                      }
                      className="text-[11px] px-2 py-0.5 rounded-full bg-white hover:bg-amber-100 text-slate-700 border border-slate-300 hover:border-amber-400 transition cursor-pointer"
                    >
                      {commonSym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Check & Function Check (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Visual Check */}
                <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-sky-100">
                    <span className="font-bold text-sky-900 text-sm flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-sky-600" />
                      Visual Check (พบจุดเสียด้วยสายตาตรวจสอบ)
                    </span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-medium">
                      ไม่ต้องจ่ายไฟ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น ตรวจพบ C ฟิลเตอร์ 450V บวมแตก, R สตาร์ทไหม้ดำ, รอยสนิมเขียว, ลายปรินท์ขาด, ขั้วต่อหลวม, คราบน้ำ
                  </p>
                  <textarea
                    rows={4}
                    value={currentSymptom.visualCheck}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'visualCheck', e.target.value)
                    }
                    placeholder="บันทึกสิ่งที่มองเห็นด้วยตาเปล่าหรือแว่นขยาย..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                {/* Function Check */}
                <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-indigo-100">
                    <span className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      Function Check (ต้องจ่ายไฟถึงจะทราบ)
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                      จ่ายไฟทดสอบ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น จ่ายไฟแล้วไฟสแตนด์บายติดไหม, รีเลย์ดึงหรือไม่, วัดไฟขาออก 12V ตกเหลือ 0V, โค้ด Error หน้าจอ
                  </p>
                  <textarea
                    rows={4}
                    value={currentSymptom.functionCheck}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'functionCheck', e.target.value)
                    }
                    placeholder="บันทึกพฤติกรรมของเครื่องเมื่อจ่ายไฟเข้า..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* เทคนิคแนวทางตรวจสอบ & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* เทคนิคแนวทางตรวจสอบ */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-100">
                    <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-amber-600" />
                      เทคนิคแนวทางตรวจสอบ (การตั้งค่า, การวัด)
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      การใช้เครื่องมือ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น ตั้งมิเตอร์ย่านโอห์ม/ไดโอดเช็คช็อต, การวัดไฟ 15V Gate Drive, สโคปจับสัญญาณ PWM หรือการต่อหลอดอนุกรม
                  </p>
                  <textarea
                    rows={4}
                    value={currentSymptom.checkTechnique}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'checkTechnique', e.target.value)
                    }
                    placeholder="ขั้นตอนและเคล็ดลับการใช้เครื่องมือวัดจุดสำคัญ..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                {/* สาเหตุ (Root cause) อุปกรณ์เสีย */}
                <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-rose-100">
                    <span className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      สาเหตุ (Root Cause) อุปกรณ์เสีย
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                      ต้นตอปัญหา
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น เกิดจากเสิร์จไฟกระชากทำให้ไดโอดบริดจ์ช็อต, ความร้อนสะสมทำให้ MOSFET รั่ว, น้ำซึมเข้าเซนเซอร์
                  </p>
                  <textarea
                    rows={4}
                    value={currentSymptom.rootCause}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'rootCause', e.target.value)
                    }
                    placeholder="วิเคราะห์ต้นเหตุที่แท้จริงว่าทำไมอุปกรณ์ชิ้นนี้ถึงเสีย..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* อะไหล่ที่เปลี่ยน & ผลทดสอบหลังการซ่อม */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* อะไหล่ที่เปลี่ยน */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-800 text-sm mb-1">
                    รายการอะไหล่ที่เปลี่ยน / เบอร์ชิ้นส่วน
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น IC Switching TOP246YN, Capacitor 150uF/450V, Fuse 3.15A
                  </p>
                  <input
                    type="text"
                    value={currentSymptom.replacedParts || ''}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'replacedParts', e.target.value)
                    }
                    placeholder="ระบุเบอร์อะไหล่หรือรายการอุปกรณ์ที่นำมาเปลี่ยน..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* ผลทดสอบหลังการซ่อม */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ผลทดสอบหลังการซ่อม (Post-Repair Test)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    เช่น จ่ายไฟผ่านโหลดหลอด 100W แรงดัน 12V นิ่ง รันทดสอบโหลด 45 นาที ไม่ร้อน ไม่ตัด
                  </p>
                  <input
                    type="text"
                    value={currentSymptom.postRepairTest}
                    onChange={(e) =>
                      updateSymptomField(activeSymptomIndex, 'postRepairTest', e.target.value)
                    }
                    placeholder="บันทึกผลการจ่ายไฟทดสอบและการทำงานจริงหลังซ่อมเสร็จ..."
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* ภาพถ่ายประกอบงานซ่อม & แนบวงจร */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* ภาพถ่ายประกอบงานซ่อม 2-3 รูป */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-500" />
                      บันทึกภาพถ่ายประกอบงานซ่อม (2-3 รูป)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {(currentSymptom.photos || []).length} / 3 รูป
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    ภาพถ่ายจุดเสีย, รอยไหม้, อุปกรณ์ก่อนและหลังเปลี่ยน (รองรับถ่ายภาพสดจากมือถือหรืออัปโหลด)
                  </p>

                  {/* Photos Grid & Add Button */}
                  <div className="grid grid-cols-3 gap-2">
                    {(currentSymptom.photos || []).map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-slate-300 bg-slate-100"
                      >
                        <img
                          src={photoUrl}
                          alt={`รูปประกอบ ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(activeSymptomIndex, pIdx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition shadow"
                          title="ลบรูปนี้"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {(currentSymptom.photos || []).length < 3 && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            photoInputRefs.current[currentSymptom.id] = el;
                          }}
                          onChange={(e) => handlePhotoUpload(activeSymptomIndex, e)}
                          className="hidden"
                          multiple
                        />
                        <button
                          type="button"
                          onClick={() => photoInputRefs.current[currentSymptom.id]?.click()}
                          className="w-full aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-amber-600 transition cursor-pointer"
                        >
                          <Camera className="w-5 h-5" />
                          <span className="text-[10px] font-semibold">+ ถ่าย/แนบรูป</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* แนบรูปวงจร (Circuit Diagram) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-600" />
                      แนบรูปวงจร (Circuit Diagram หากมี)
                    </span>
                    {currentSymptom.circuitDiagram && (
                      <button
                        type="button"
                        onClick={() => updateSymptomField(activeSymptomIndex, 'circuitDiagram', '')}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        ลบรูปวงจร
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    แผนภาพลายวงจร (Schematic), จุดเทสต์พอยต์ (Test Point TP) สำหรับใช้อ้างอิงการซ่อมครั้งถัดไป
                  </p>

                  {currentSymptom.circuitDiagram ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-900 group">
                      <img
                        src={currentSymptom.circuitDiagram}
                        alt="รูปวงจร"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                        <button
                          type="button"
                          onClick={() => window.open(currentSymptom.circuitDiagram, '_blank')}
                          className="px-2.5 py-1 rounded bg-white text-slate-900 text-xs font-semibold"
                        >
                          ขยายดูภาพวงจร
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          circuitInputRefs.current[currentSymptom.id] = el;
                        }}
                        onChange={(e) => handleCircuitUpload(activeSymptomIndex, e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => circuitInputRefs.current[currentSymptom.id]?.click()}
                        className="w-full aspect-video rounded-lg border-2 border-dashed border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50/40 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-cyan-700 transition cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-cyan-500" />
                        <span className="text-xs font-semibold">อัปโหลดภาพวงจร (Schematic)</span>
                        <span className="text-[10px] text-slate-400">รองรับไฟล์ภาพ JPG, PNG</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ข้อมูลจะถูกบันทึกลงในคัมภีร์ยุทธ พร้อมค้นหาและส่งออกเป็น Sheet ทันที</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingRepair ? 'บันทึกการแก้ไขคัมภีร์' : 'บันทึกเข้าสู่คัมภีร์งานซ่อม'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
