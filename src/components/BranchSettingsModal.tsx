import React, { useState, useRef } from 'react';
import { BranchCustomProfile, ShopProfile } from '../types';
import { PRESET_COVERS } from '../data/defaultData';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Camera,
  Upload,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Wrench,
  X,
  Store,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

interface BranchSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchCode: string;
  branchName: string;
  currentProfile: ShopProfile;
  onSaveBranchProfile: (profile: BranchCustomProfile) => void;
}

export const BranchSettingsModal: React.FC<BranchSettingsModalProps> = ({
  isOpen,
  onClose,
  branchCode,
  branchName,
  currentProfile,
  onSaveBranchProfile,
}) => {
  const [shopName, setShopName] = useState(currentProfile.shopName || branchName || 'คัมภีร์ลับซ่างซวดลวด');
  const [technicianName, setTechnicianName] = useState(currentProfile.technicianName || '');
  const [phone, setPhone] = useState(currentProfile.phone || '');
  const [lineId, setLineId] = useState(currentProfile.lineId || '');
  const [address, setAddress] = useState(currentProfile.address || '');
  const [slogan, setSlogan] = useState(currentProfile.slogan || '');
  const [coverImage, setCoverImage] = useState(currentProfile.coverImage || '');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressed = await compressImageFile(files[0], 1600, 900, 0.8);
      setCoverImage(compressed);
    } catch (err) {
      console.error('Error uploading cover image', err);
      alert('ไม่สามารถอัปโหลดรูปหน้าปกได้');
    }
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BranchCustomProfile = {
      branchCode,
      shopName: shopName.trim() || branchName || 'คัมภีร์ลับซ่างซวดลวด',
      technicianName: technicianName.trim(),
      phone: phone.trim(),
      lineId: lineId.trim(),
      address: address.trim(),
      slogan: slogan.trim(),
      coverImage: coverImage || currentProfile.coverImage,
      updatedAt: new Date().toISOString(),
    };
    onSaveBranchProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleApplyCustomUrl = () => {
    if (!customCoverUrl.trim()) return;
    setCoverImage(customCoverUrl.trim());
    setCustomCoverUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-amber-500/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  ตั้งค่าข้อมูลสาขา & รูปหน้าปก
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  สาขา: {branchCode || branchName}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/80">
                ปรับเปลี่ยนรูปหน้าปก ชื่อ เบอร์โทร ไลน์ สำหรับสาขาของคุณได้อิสระ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-bold animate-in fade-in duration-200">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>บันทึกการตั้งค่าหน้าปกและข้อมูลสาขาเรียบร้อยแล้ว!</span>
            </div>
          )}

          {/* คำชี้แจงความปลอดภัย */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>สิทธิ์เฉพาะสาขา:</strong> คุณสามารถปรับเปลี่ยนรูปหน้าปก ข้อมูลร้าน เบอร์ และ LINE ของสาขาตัวเองได้อย่างอิสระ โดยไม่กระทบกับข้อมูลของสำนักงานใหญ่ และไม่ต้องเข้าถึงหน้าสร้างลิงก์
            </div>
          </div>

          {/* ส่วนที่ 1: ภาพหน้าปก (Cover Image) */}
          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-bold text-slate-900">
              ภาพหน้าปกคัมภีร์ของสาขา (Cover Banner)
            </label>

            {/* พรีวิวภาพหน้าปกปัจจุบัน */}
            <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-900 shadow-inner group">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="ภาพหน้าปกสาขา"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                  <ImageIcon className="w-8 h-8 text-slate-500" />
                  <span>ยังไม่มีภาพหน้าปก</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-[11px] text-amber-300 font-bold bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  พรีวิวภาพหน้าปกของสาขา
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพ</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* เลือกจากพรีเซ็ตหน้าปกสวยๆ */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-2">
                หรือเลือกภาพหน้าปกสำเร็จรูปที่ออกแบบมาสำหรับงานช่าง:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left transition cursor-pointer group ${
                      coverImage === preset.url
                        ? 'border-amber-500 ring-2 ring-amber-400/50'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-14 object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="p-1 bg-white">
                      <p className="text-[10px] font-bold text-slate-800 truncate">
                        {preset.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ใส่ URL ภาพเอง */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                placeholder="หรือวางลิงก์ URL รูปภาพ (https://...)"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customCoverUrl.trim()}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
              >
                ใช้รูปนี้
              </button>
            </div>
          </div>

          {/* ส่วนที่ 2: ข้อมูลร้านสาขา */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              ข้อมูลร้านและช่องทางการติดต่อ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ชื่อร้านสาขา */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อร้าน / สาขา
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="เช่น คัมภีร์ยุทธ Fix it - สาขา 1"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* ชื่อช่าง */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อช่างประจำสาขา
                </label>
                <div className="relative">
                  <Wrench className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    placeholder="เช่น ช่างเอก มอเตอร์"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เช่น 089-123-4567"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* LINE ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  LINE ID (สำหรับแตะเปิดแชท)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    placeholder="เช่น @mybranch-line หรือ myid"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* ที่อยู่สาขา */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ที่อยู่สาขา
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="เช่น เลขที่ 99 หมู่ 3 ต.ในเมือง อ.เมือง..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            {/* สโลแกน / คำอธิบาย */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                คำโปรย / สโลแกนสาขา
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="เช่น บริการซ่อมด่วน ตรวจเช็คละเอียด ราคายุติธรรม"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่าสาขา</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
