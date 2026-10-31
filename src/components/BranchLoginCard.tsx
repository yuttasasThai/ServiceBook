import React, { useState } from 'react';
import { BranchUser, AuthSession } from '../types';
import { checkBranchExpiry } from '../utils/storage';
import {
  Lock,
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface BranchLoginCardProps {
  branchCode: string;
  branchName: string;
  defaultUsername?: string;
  branches: BranchUser[];
  onLoginSuccess: (session: AuthSession) => void;
  isRecentlyLoggedOut?: boolean;
}

export const BranchLoginCard: React.FC<BranchLoginCardProps> = ({
  branchCode,
  branchName,
  defaultUsername,
  branches,
  onLoginSuccess,
  isRecentlyLoggedOut = false,
}) => {
  // Find matching branch record
  const currentBranch = branches.find(
    (b) => b.branchCode.toUpperCase() === branchCode.toUpperCase()
  );

  const initialUser =
    defaultUsername ||
    currentBranch?.username ||
    (branchCode ? `user_${branchCode.toLowerCase()}` : '');

  const [username, setUsername] = useState(initialUser);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expiredWarning, setExpiredWarning] = useState<string | null>(null);

  const expiryStatus = currentBranch?.expiryDate
    ? checkBranchExpiry(currentBranch.expiryDate)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setExpiredWarning(null);

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password.trim();

    if (!enteredPass) {
      setErrorMessage('กรุณากรอกรหัสผ่านสำหรับสาขานี้');
      return;
    }

    // Check against matching branch
    const matched =
      currentBranch &&
      (currentBranch.username.toLowerCase() === enteredUser ||
        currentBranch.branchCode.toLowerCase() === enteredUser)
        ? currentBranch
        : branches.find(
            (b) =>
              (b.username.toLowerCase() === enteredUser ||
                b.branchCode.toLowerCase() === enteredUser) &&
              b.password === enteredPass
          );

    if (!matched || matched.password !== enteredPass) {
      setErrorMessage(
        `รหัสผ่านสำหรับสาขา "${branchName || branchCode}" ไม่ถูกต้อง\nกรุณาติดต่อ Admin ผู้สร้างลิงก์เพื่อขอรับรหัสผ่านที่ถูกต้อง`
      );
      return;
    }

    // Check expiry
    const expiry = checkBranchExpiry(matched.expiryDate);
    if (expiry.isExpired) {
      setExpiredWarning(
        `สิทธิ์การใช้งานของสาขา "${matched.name}" ${expiry.displayText}\n* ข้อกำหนด: ลิงก์สาขาไม่สามารถต่ออายุเองได้ กรุณาติดต่อ Admin สำนักงานใหญ่เพื่อขอต่ออายุสิทธิ์เข้าใช้งาน`
      );
      return;
    }

    // Authenticated
    const successSession: AuthSession = {
      isLoggedIn: true,
      role: 'branch_user',
      branchId: matched.id,
      branchCode: matched.branchCode,
      branchName: matched.name,
      username: matched.username,
      expiresAt: matched.expiryDate,
    };

    onLoginSuccess(successSession);
  };

  return (
    <div className="py-6 sm:py-10 max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-500/50 overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 px-6 py-6 text-white border-b border-amber-500/40 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ลิงก์เฉพาะสาขา (Branch Portal)</span>
              </div>
              <h2 className="text-xl font-black text-white">
                เข้าสู่ระบบคัมภีร์ยุทธซ่างซวดลวด
              </h2>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-slate-300">
              สาขา: <strong className="text-amber-300">{branchName || branchCode}</strong>
              <span className="text-slate-400 ml-1.5 font-mono">({branchCode})</span>
            </div>
            {expiryStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  expiryStatus.isExpired
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{expiryStatus.displayText}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Logout notification if user just logged out */}
          {isRecentlyLoggedOut && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">ออกจากระบบสาขาเรียบร้อยแล้ว</p>
                <p className="text-emerald-700 mt-0.5">
                  คุณยังคงอยู่ในลิงก์สาขานี้ ไม่มีการสลับไปหน้า Admin — กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานสาขาของคุณอีกครั้ง
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="whitespace-pre-line font-medium leading-relaxed">
                {errorMessage}
              </div>
            </div>
          )}

          {expiredWarning && (
            <div className="p-4 bg-rose-50 border-2 border-rose-400 text-rose-950 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <Clock className="w-4 h-4" />
                <span>แจ้งเตือน: สิทธิ์เข้าใช้งานหมดอายุ</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-slate-700">
                {expiredWarning}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ชื่อผู้ใช้งานสาขา (Username / รหัสสาขา)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`เช่น ${initialUser || 'user_test01'}`}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รหัสผ่านสาขา (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านที่ Admin กำหนดให้"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Test Helper if branch credentials are available */}
            {currentBranch && currentBranch.password && (
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-[11px]">
                <span className="text-amber-800 font-medium">
                  ทดสอบสาขา: {currentBranch.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(currentBranch.username);
                    setPassword(currentBranch.password);
                  }}
                  className="px-2 py-0.5 rounded bg-amber-200/70 hover:bg-amber-300 text-amber-900 font-bold transition cursor-pointer"
                >
                  ใส่รหัสทดสอบอัตโนมัติ
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.99] cursor-pointer"
            >
              เข้าสู่ระบบสาขา {branchName || branchCode}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 text-center">
            <p className="flex items-center justify-center gap-1 text-slate-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>ระบบความปลอดภัยแยกขาด: ลิงก์สาขานี้ไม่สามารถสลับเป็น Admin ได้</span>
            </p>
            <p className="text-slate-400">
              หากลืมรหัสผ่านหรือต้องการต่ออายุสิทธิ์ กรุณาติดต่อ Admin สำนักงานใหญ่
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
