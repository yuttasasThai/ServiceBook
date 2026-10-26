import React, { useState, useRef } from 'react';
import { ShopProfile } from '../types';
import { PRESET_COVERS, DEFAULT_SHOP_PROFILE } from '../data/defaultData';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Settings,
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
  Image as ImageIcon,
} from 'lucide-react';

interface SettingsModalProps {
  profile: ShopProfile;
  onSaveProfile: (profile: ShopProfile) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isStandaloneTab?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onSaveProfile,
  isOpen = true,
  onClose,
  isStandaloneTab = false,
}) => {
  const [shopName, setShopName] = useState(profile.shopName);
  const [technicianName, setTechnicianName] = useState(profile.technicianName);
  const [phone, setPhone] = useState(profile.phone);
  const [lineId, setLineId] = useState(profile.lineId);
  const [address, setAddress] = useState(profile.address);
  const [slogan, setSlogan] = useState(profile.slogan);
  const [coverImage, setCoverImage] = useState(profile.coverImage);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen && !isStandaloneTab) return null;

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
    const updated: ShopProfile = {
      shopName: shopName.trim() || 'คัมภีร์ยุทธซ่างซวดลวดFix it',
      technicianName: technicianName.trim() || 'ช่างยุทธ',
      phone: phone.trim(),
      lineId: lineId.trim(),
      address: address.trim(),
      slogan: slogan.trim(),
      coverImage: coverImage || DEFAULT_SHOP_PROFILE.coverImage,
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onClose) onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (confirm('ต้องการรีเซ็ตข้อมูลร้านและรูปหน้าปกกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setShopName(DEFAULT_SHOP_PROFILE.shopName);
      setTechnicianName(DEFAULT_SHOP_PROFILE.technicianName);
      setPhone(DEFAULT_SHOP_PROFILE.phone);
      setLineId(DEFAULT_SHOP_PROFILE.lineId);
      setAddress(DEFAULT_SHOP_PROFILE.address);
      setSlogan(DEFAULT_SHOP_PROFILE.slogan);
      setCoverImage(DEFAULT_SHOP_PROFILE.coverImage);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">
              ตั้งค่าโปรไฟล์ร้าน & เปลี่ยนรูปภาพหน้าปก
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ส่วนที่ 1: แก้ไขชื่อโปรฟาย, เบอร์โทรศัพท์, ไลน์ และเปลี่ยนรูปภาพหน้าร้าน/หน้าปก
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>บันทึกการตั้งค่าร้านและรูปหน้าปกเรียบร้อยแล้ว!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Preview & Customizer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>ภาพหน้าปก (Cover Banner)</span>
            </label>
            <span className="text-[11px] text-slate-400">
              แสดงเด่นชัดอยู่ส่วนที่ 1 หน้าแรกของโปรแกรม
            </span>
          </div>

          {/* Current Cover Preview */}
          <div className="relative aspect-[21/9] sm:aspect-[24/8] rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-900 group">
            <img
              src={coverImage}
              alt="รูปหน้าปกที่เลือก"
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white space-y-0.5">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                  ตัวอย่างภาพหน้าปก
                </span>
                <div className="text-sm sm:text-lg font-bold">{shopName}</div>
                <div className="text-xs text-amber-300">
                  {phone ? `โทร: ${phone}` : ''} {lineId ? `• LINE: ${lineId}` : ''}
                </div>
              </div>
            </div>

            {/* Change cover button overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur border border-slate-700 shadow transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>ปุ่มเปลี่ยนรูปหน้าปก (อัปโหลดรูป)</span>
              </button>
            </div>
          </div>

          {/* Preset Covers Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-600 block">
              หรือเลือกรูปหน้าปกช่างธีมสวยงามที่ออกแบบไว้ให้:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    coverImage === preset.url
                      ? 'border-amber-500 ring-2 ring-amber-400/50'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 p-1.5 flex items-end">
                    <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                      {preset.name}
                    </span>
                  </div>
                  {coverImage === preset.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Info Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          {/* ชื่อโปรไฟล์ / ร้าน */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อโปรไฟล์ / ชื่อร้าน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="เช่น คัมภีร์ยุทธซ่างซวดลวดFix it"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              required
            />
          </div>

          {/* ชื่อช่างผู้เชี่ยวชาญ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อช่างผู้ตรวจซ่อม / เจ้าของร้าน
            </label>
            <div className="relative">
              <Wrench className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="เช่น ช่างยุทธ ยุทธการงานซ่อม"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เบอร์โทรศัพท์ (สามารถเปลี่ยนได้ที่นี่)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 089-765-4321"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* LINE ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              LINE ID (สามารถเปลี่ยนได้ที่นี่)
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="เช่น @yutt-fixit"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* คำขวัญ / สโลแกน */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              คำขวัญ / สโลแกนร้าน
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="เช่น ซ่อมไว แม่นยำ Visual & Function Check..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* ที่อยู่ร้าน */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ที่อยู่ร้าน / ศูนย์บริการ
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="เช่น 168/9 ถ.ช่างทอง กรุงเทพฯ 10250"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                ปิด
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่าร้าน</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  if (isStandaloneTab) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {content}
      </div>
    </div>
  );
};
