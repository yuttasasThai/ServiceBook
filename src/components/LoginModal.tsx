import React, { useState } from 'react';
import { BranchUser, AuthSession } from '../types';
import { checkBranchExpiry } from '../utils/storage';
import {
  Lock,
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  X,
  KeyRound,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface LoginModalProps {
  branches: BranchUser[];
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  branchCode?: string;
  isBranchLocked?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  branches,
  isOpen,
  onClose,
  onLoginSuccess,
  branchCode,
  isBranchLocked = false,
}) => {
  const [loginMode, setLoginMode] = useState<'branch' | 'admin'>(isBranchLocked ? 'branch' : 'branch');
  const matchedBranch = branchCode
    ? branches.find((b) => b.branchCode.toUpperCase() === branchCode.toUpperCase())
    : null;

  const [username, setUsername] = useState(matchedBranch?.username || '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [expiredBranchWarning, setExpiredBranchWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setExpiredBranchWarning(null);

    if (loginMode === 'admin' && !isBranchLocked) {
      // Admin login (accepts admin / admin1234 or empty in local demo)
      if (
        (username.trim().toLowerCase() === 'admin' && password.trim() === 'admin1234') ||
        (username.trim().toLowerCase() === 'admin' && password.trim() === '')
      ) {
        onLoginSuccess({
          isLoggedIn: true,
          role: 'admin',
          username: 'admin',
        });
        onClose();
        return;
      } else {
        setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง (เริ่มต้น: user: admin / pass: admin1234)');
        return;
      }
    }

    // Branch User login
    const foundBranch = branches.find(
      (b) =>
        (b.username.toLowerCase() === username.trim().toLowerCase() ||
          b.branchCode.toLowerCase() === username.trim().toLowerCase()) &&
        b.password === password.trim()
    );

    if (!foundBranch) {
      setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านสาขาไม่ถูกต้อง กรุณาติดต่อ Admin ผู้สร้างลิงก์');
      return;
    }

    // Check expiry
    const expiry = checkBranchExpiry(foundBranch.expiryDate);
    if (expiry.isExpired) {
      setExpiredBranchWarning(
        `สิทธิ์การใช้งานของสาขา "${foundBranch.name}" ${expiry.displayText}\n* ข้อกำหนด: ลิงก์สาขาไม่สามารถต่ออายุเองได้ กรุณาติดต่อ Admin สำนักงานใหญ่เพื่อขอต่ออายุสิทธิ์เข้าใช้งาน`
      );
      return;
    }

    // Successful branch login
    onLoginSuccess({
      isLoggedIn: true,
      role: 'branch_user',
      branchId: foundBranch.id,
      branchCode: foundBranch.branchCode,
      branchName: foundBranch.name,
      username: foundBranch.username,
      expiresAt: foundBranch.expiryDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">
              {isBranchLocked ? `เข้าสู่ระบบสาขา (${branchCode || 'User'})` : 'เข้าสู่ระบบคัมภีร์ยุทธซ่างซวดลวดFix it'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch - Only show Admin tab if NOT locked to branch */}
        {!isBranchLocked ? (
          <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('branch');
                setErrorMessage('');
                setExpiredBranchWarning(null);
              }}
              className={`py-2 rounded-xl transition ${
                loginMode === 'branch'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เข้าใช้งานสำหรับสาขา (User)
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('admin');
                setErrorMessage('');
                setExpiredBranchWarning(null);
              }}
              className={`py-2 rounded-xl transition ${
                loginMode === 'admin'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ผู้ดูแลระบบ (Admin)
            </button>
          </div>
        ) : (
          <div className="px-6 py-2.5 bg-amber-500/15 border-b border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-700" />
            <span>เข้าสู่ระบบเฉพาะลิงก์สาขา: {matchedBranch?.name || branchCode}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          {loginMode === 'branch' ? (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
              <span className="font-bold block mb-0.5">📌 หมายเหตุสำหรับสาขา:</span>
              <span>
                กรอก Username และ Password ที่ Admin กำหนดให้ ลิงก์สาขาไม่สามารถต่ออายุเองได้ และจะแสดงเวลานับถอยหลังหมดอายุบนหน้าจอ
              </span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold block mb-0.5">👑 สิทธิ์ Admin สำนักงานใหญ่:</span>
              <span>
                สามารถสร้างลิงก์สาขา, กำหนดวันหมดอายุ และต่ออายุสิทธิ์เข้าใช้งานได้ (รหัสเริ่มต้น: admin / admin1234)
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{errorMessage}</span>
            </div>
          )}

          {expiredBranchWarning && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-xl text-xs font-semibold space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                <Clock className="w-4 h-4" />
                <span>แจ้งเตือน: สิทธิ์เข้าใช้งานหมดอายุ</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-slate-700">
                {expiredBranchWarning}
              </p>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={loginMode === 'branch' ? 'เช่น rama2_tech' : 'admin'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Quick Helper for Branch testing */}
          {loginMode === 'branch' && branches.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1">
                คลิกเลือกทดสอบสาขาที่มีในระบบ:
              </span>
              <div className="flex flex-wrap gap-1">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setUsername(b.username);
                      setPassword(b.password);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-100 text-slate-700 border border-slate-200"
                  >
                    {b.name} ({b.username})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow transition cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
