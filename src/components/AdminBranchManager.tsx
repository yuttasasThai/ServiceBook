import React, { useState } from 'react';
import { BranchUser, AuthSession } from '../types';
import { checkBranchExpiry } from '../utils/storage';
import {
  Users,
  UserPlus,
  Link,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Lock,
  Phone,
  KeyRound,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface AdminBranchManagerProps {
  branches: BranchUser[];
  session: AuthSession;
  onAddOrUpdateBranch: (branch: BranchUser) => void;
  onDeleteBranch: (id: string) => void;
  onExtendBranch: (id: string, days: number) => void;
  onSimulateLoginAsBranch: (branch: BranchUser) => void;
}

export const AdminBranchManager: React.FC<AdminBranchManagerProps> = ({
  branches,
  session,
  onAddOrUpdateBranch,
  onDeleteBranch,
  onExtendBranch,
  onSimulateLoginAsBranch,
}) => {
  // Form states for creating/editing branch
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Password visibility toggle in form
  const [showPassword, setShowPassword] = useState(false);

  // Extend Expiry Modal state
  const [extendingBranch, setExtendingBranch] = useState<BranchUser | null>(null);
  const [extendDays, setExtendDays] = useState(30);
  const [adminSecurityPin, setAdminSecurityPin] = useState(''); // รหัสลับยืนยัน ไม่แสดงในช่องพิมพ์

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-generate branch code & username
  const generateNewDefaults = () => {
    const randomCode = 'B-' + Math.floor(1000 + Math.random() * 9000);
    setBranchCode(randomCode);
    setUsername(`user_${randomCode.toLowerCase().replace('-', '_')}`);
    setPassword('pass' + Math.floor(1000 + Math.random() * 9000));
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setName('');
    setPhone('');
    setNotes('');
    setIsEditing(null);
  };

  const handleEditClick = (b: BranchUser) => {
    setIsEditing(b.id);
    setName(b.name);
    setPhone(b.phone);
    setBranchCode(b.branchCode);
    setUsername(b.username);
    setPassword(b.password);
    setExpiryDate(b.expiryDate);
    setNotes(b.notes || '');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('กรุณากรอกชื่อสาขาหรือชื่อผู้ใช้งาน');
      return;
    }
    if (!username.trim() || !password.trim()) {
      alert('กรุณากำหนด User และ Password สำหรับให้สาขาเข้าสู่ระบบ');
      return;
    }

    const currentOrigin = window.location.origin;
    const finalCode = branchCode.trim() || `B-${Date.now().toString().slice(-4)}`;
    const urlParams = new URLSearchParams();
    urlParams.set('branch', finalCode);
    urlParams.set('bname', name.trim());
    urlParams.set('exp', expiryDate);
    urlParams.set('u', username.trim());
    try {
      urlParams.set('p', btoa(encodeURIComponent(password.trim())));
    } catch {
      urlParams.set('p', password.trim());
    }
    const fullShareUrl = `${currentOrigin}?${urlParams.toString()}`;

    const branchData: BranchUser = {
      id: isEditing || `branch-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      branchCode: finalCode,
      shareUrl: fullShareUrl,
      username: username.trim(),
      password: password.trim(),
      expiryDate,
      isActive: true,
      createdAt: isEditing
        ? branches.find((b) => b.id === isEditing)?.createdAt || new Date().toISOString()
        : new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    };

    onAddOrUpdateBranch(branchData);
    alert(isEditing ? 'อัปเดตข้อมูลสาขาเรียบร้อยแล้ว' : 'สร้างลิงก์สาขาใหม่สำเร็จแล้ว!');
    generateNewDefaults();
  };

  const handleCopyLink = (branch: BranchUser) => {
    const currentOrigin = window.location.origin;
    const urlParams = new URLSearchParams();
    urlParams.set('branch', branch.branchCode);
    if (branch.name) urlParams.set('bname', branch.name);
    if (branch.expiryDate) urlParams.set('exp', branch.expiryDate);
    if (branch.username) urlParams.set('u', branch.username);
    if (branch.password) {
      try {
        urlParams.set('p', btoa(encodeURIComponent(branch.password)));
      } catch {
        urlParams.set('p', branch.password);
      }
    }
    const linkToCopy = `${currentOrigin}?${urlParams.toString()}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopiedId(branch.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleConfirmExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendingBranch) return;

    onExtendBranch(extendingBranch.id, Number(extendDays));
    alert(`ต่ออายุการใช้งานสาขา ${extendingBranch.name} เพิ่มอีก ${extendDays} วัน เรียบร้อยแล้ว!`);
    setExtendingBranch(null);
    setAdminSecurityPin('');
  };

  return (
    <div className="space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                ศูนย์จัดการสิทธิ์สาขา & บัญชีผู้ใช้งาน (Admin Branch Manager)
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              สร้างลิงก์สาขา กำหนดวันหมดอายุ ควบคุมรหัสผ่าน และต่ออายุสิทธิ์เข้าใช้งาน
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>โหมดควบคุมสิทธิ์สูงสุด</span>
            </span>
          </div>
        </div>

        {/* Feature Notice Box */}
        <div className="mt-4 p-3 bg-indigo-950/70 border border-indigo-800/80 rounded-xl text-xs text-indigo-200 space-y-1">
          <p className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>กฎความปลอดภัยและข้อกำหนดระบบสาขา:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1 text-[11px]">
            <li>ลิงก์สาขา user ไม่สามารถต่ออายุเองได้ (ระบบแสดงเฉพาะวันเวลานับถอยหลังหมดอายุ)</li>
            <li>ลิงก์สาขาเวลาเข้าใช้งานจะมีการตรวจสอบ User & Password ที่ Admin กำหนด</li>
            <li>ที่ช่องต่ออายุ ไม่แสดงรหัสในช่องพิมพ์ (Password masked/hidden ตามข้อกำหนด)</li>
          </ul>
        </div>
      </div>

      {/* Form: สร้างลิงก์สาขาใหม่ / แก้ไข */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? '✏️ แก้ไขข้อมูลลิงก์สาขา' : '➕ ฟอร์มสร้างลิงก์สาขา & บัญชี User ใหม่'}
            </h3>
          </div>

          {isEditing && (
            <button
              onClick={generateNewDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ยกเลิกการแก้ไข / สร้างสาขาใหม่
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ชื่อสาขา / User */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อสาขา / ชื่อช่างประจำสาขา <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น สาขาพระราม 2 (ช่างตั้ม)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>

            {/* เบอร์โทร */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เบอร์โทรศัพท์สาขา
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* รหัสสาขา / URL Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสสาขา (Branch Code)
              </label>
              <input
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value.toUpperCase())}
                placeholder="เช่น B-RAMA2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>

            {/* กำหนด User */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                กำหนด Username สำหรับล็อกอิน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น rama2_tech"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>

            {/* กำหนด Password (Admin เป็นผู้กำหนด) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                กำหนด Password สำหรับสาขา <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่านเข้าใช้งาน"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* กำหนด วันหมดอายุ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                กำหนดวันหมดอายุ (Expiry Date) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Quick Expiry Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            <span className="font-semibold">ตั้งวันหมดอายุเร็ว:</span>
            {[15, 30, 60, 90, 180, 365].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  const target = new Date(Date.now() + d * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0];
                  setExpiryDate(target);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 border border-slate-200 transition text-[11px] font-medium"
              >
                +{d} วัน
              </button>
            ))}
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุ / บันทึกภายในของสาขา
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น สาขาภาคอีสาน ชำระค่าสมาชิกเรียบร้อย"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isEditing ? 'บันทึกการแก้ไขสาขา' : 'สร้างลิงก์สาขา & User ทันที'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Branch List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>รายชื่อสาขาและสถานะวันหมดอายุทั้งหมด ({branches.length} สาขา)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin สามารถต่ออายุ, คัดลอกลิงก์ส่งให้สาขา หรือทดสอบสิทธิ์เข้าสู่ระบบ
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">ชื่อสาขา</th>
                <th className="py-3.5 px-4">เบอร์โทร</th>
                <th className="py-3.5 px-4">บัญชี User / Login</th>
                <th className="py-3.5 px-4">วันหมดอายุ & เวลาที่เหลือ</th>
                <th className="py-3.5 px-4">ลิงก์สาขา (Share URL)</th>
                <th className="py-3.5 px-4 text-center">ต่ออายุ</th>
                <th className="py-3.5 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {branches.map((b) => {
                const expiry = checkBranchExpiry(b.expiryDate);
                const currentOrigin = window.location.origin;
                const fullUrl = `${currentOrigin}?branch=${encodeURIComponent(b.branchCode)}`;

                return (
                  <tr key={b.id} className="hover:bg-indigo-50/20 transition">
                    {/* Branch Name & Code */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold">
                        {b.branchCode}
                      </span>
                      {b.notes && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{b.notes}</div>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      {b.phone ? (
                        <a href={`tel:${b.phone}`} className="hover:text-indigo-600">
                          {b.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Username & Masked Password */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800">
                        {b.username}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        รหัสผ่าน: ••••••••
                      </div>
                    </td>

                    {/* Expiry Countdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{b.expiryDate}</div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${expiry.badgeColor}`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{expiry.displayText}</span>
                        </span>
                      </div>
                    </td>

                    {/* Share Link */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyLink(b)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          {copiedId === b.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-600" />
                              <span>คัดลอกลิงก์</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onSimulateLoginAsBranch(b)}
                          title="ทดลองล็อกอินเป็นสาขานี้"
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Extend Expiry (Admin Only) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          setExtendingBranch(b);
                          setExtendDays(30);
                          setAdminSecurityPin('');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>ต่ออายุ</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(b)}
                          title="แก้ไขข้อมูลสาขา"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ต้องการลบสาขา ${b.name} (${b.branchCode}) หรือไม่?`)) {
                              onDeleteBranch(b.id);
                            }
                          }}
                          title="ลบสาขา"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: ต่ออายุสาขา (Admin Renewal Modal) */}
      {extendingBranch && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500" />
                <span>ต่ออายุการใช้งานสาขา</span>
              </h3>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                Admin เฉพาะ
              </span>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-500">สาขา:</span>{' '}
                  <strong className="text-slate-900">{extendingBranch.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">วันหมดอายุเดิม:</span>{' '}
                  <strong className="text-slate-800">{extendingBranch.expiryDate}</strong>
                </div>
              </div>

              {/* เลือกจำนวนวันที่ต้องการต่ออายุ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เลือกจำนวนวันที่ต้องการต่ออายุเพิ่ม:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${
                        extendDays === d
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      +{d} วัน
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement: และที่ช่องต่ออายุไม่ต้องเเสดงรหัสในช่องพิมพ์ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รหัสยืนยันการต่ออายุของ Admin (ไม่ต้องแสดงรหัสในช่องพิมพ์):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={adminSecurityPin}
                    onChange={(e) => setAdminSecurityPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * ช่องนี้ใช้ระบบ Mask ซ่อนตัวอักษรเพื่อความปลอดภัย ไม่แสดงตัวรหัสในช่องพิมพ์
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendingBranch(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExtend}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  ยืนยันต่ออายุ +{extendDays} วัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
