import React, { useState, useEffect } from 'react';
import {
  RepairEntry,
  ShopProfile,
  BranchUser,
  RevisionRecord,
  AuthSession,
  QuickPinpointRecord,
  DisassemblyGuide,
  BranchCustomProfile,
} from './types';
import { APP_VERSION } from './constants/version';
import {
  getShopProfile,
  saveShopProfile,
  getRepairs,
  saveOrUpdateRepair,
  deleteRepair,
  getBranchUsers,
  addOrUpdateBranch,
  deleteBranch,
  extendBranchExpiry,
  getRevisions,
  addRevisionRecord,
  getCategories,
  getAuthSession,
  saveAuthSession,
  checkBranchExpiry,
  getQuickPinpoints,
  saveOrUpdateQuickPinpoint,
  deleteQuickPinpoint,
  getDisassemblyGuides,
  saveOrUpdateDisassemblyGuide,
  deleteDisassemblyGuide,
  clearAllWorkData,
  resetToFactoryDefaults,
  getActiveShopProfile,
  saveBranchCustomProfile,
} from './utils/storage';
import { HeaderBanner } from './components/HeaderBanner';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeQuickMenu, MainViewMode } from './components/HomeQuickMenu';
import { QuickPinpointSection } from './components/QuickPinpointSection';
import { DisassemblyGuideSection } from './components/DisassemblyGuideSection';
import { RepairForm } from './components/RepairForm';
import { SummaryTable } from './components/SummaryTable';
import { DetailSheetView } from './components/DetailSheetView';
import { AdminBranchManager } from './components/AdminBranchManager';
import { SettingsModal } from './components/SettingsModal';
import { LoginModal } from './components/LoginModal';
import { RevisionModal } from './components/RevisionModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { BranchSettingsModal } from './components/BranchSettingsModal';
import { BranchLoginCard } from './components/BranchLoginCard';
import {
  Sparkles,
  GitBranch,
  Lock,
  ShieldAlert,
  Phone,
  MessageCircle,
  KeyRound,
  Clock,
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [homeQuickMode, setHomeQuickMode] = useState<MainViewMode>('pinpoint');

  // Core Data States
  const [session, setSession] = useState<AuthSession>(getAuthSession());
  const [profile, setProfile] = useState<ShopProfile>(getActiveShopProfile(getAuthSession()));
  const [repairs, setRepairs] = useState<RepairEntry[]>(getRepairs());
  const [pinpoints, setPinpoints] = useState<QuickPinpointRecord[]>(getQuickPinpoints());
  const [guides, setGuides] = useState<DisassemblyGuide[]>(getDisassemblyGuides());
  const [branches, setBranches] = useState<BranchUser[]>(getBranchUsers());
  const [revisions, setRevisions] = useState<RevisionRecord[]>(getRevisions());

  // Editing & Selection states
  const [editingRepair, setEditingRepair] = useState<RepairEntry | null>(null);
  const [selectedSheetRepairId, setSelectedSheetRepairId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isBranchSettingsModalOpen, setIsBranchSettingsModalOpen] = useState(false);
  const [isRecentlyLoggedOut, setIsRecentlyLoggedOut] = useState(false);

  // Derive categories list dynamically
  const categories = getCategories(repairs);

  // Parse URL parameters on load for branch links or specific tabs
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab | null;
      const sheetParam = params.get('sheet');

      // Refresh session, profile, and branches from storage
      const freshSession = getAuthSession();
      setSession(freshSession);
      setProfile(getActiveShopProfile(freshSession));
      setBranches(getBranchUsers());

      if (freshSession.role === 'branch_user' && freshSession.expiresAt) {
        const expiry = checkBranchExpiry(freshSession.expiresAt);
        if (expiry.isExpired) {
          alert(
            `สิทธิ์การใช้งานของสาขา "${freshSession.branchName || freshSession.branchCode}" ${expiry.displayText}\n* ข้อกำหนดความปลอดภัย: ลิงก์สาขาไม่สามารถต่ออายุเองได้ กรุณาติดต่อ Admin เพื่อขอต่ออายุ`
          );
        }
      }

      if (tabParam && ['home', 'pinpoint', 'disassembly', 'record', 'table', 'sheet', 'admin', 'settings'].includes(tabParam)) {
        if (freshSession.role !== 'admin' && (tabParam === 'admin' || tabParam === 'settings')) {
          setActiveTab('home');
        } else {
          setActiveTab(tabParam);
        }
      }

      if (sheetParam) {
        setSelectedSheetRepairId(sheetParam);
        setActiveTab('sheet');
      }
    } catch (e) {
      console.error('URL params parsing error', e);
    }
  }, []);

  // Handlers for Quick Pinpoints
  const handleSavePinpoint = (entry: QuickPinpointRecord) => {
    const updated = saveOrUpdateQuickPinpoint(entry);
    setPinpoints(updated);
  };

  const handleDeletePinpoint = (id: string) => {
    const updated = deleteQuickPinpoint(id);
    setPinpoints(updated);
  };

  // Handlers for Disassembly Guides
  const handleSaveGuide = (guide: DisassemblyGuide) => {
    const updated = saveOrUpdateDisassemblyGuide(guide);
    setGuides(updated);
  };

  const handleDeleteGuide = (id: string) => {
    const updated = deleteDisassemblyGuide(id);
    setGuides(updated);
  };

  // Handlers for Detailed Repairs
  const handleSaveRepair = (entry: RepairEntry) => {
    const updated = saveOrUpdateRepair(entry);
    setRepairs(updated);
    setEditingRepair(null);
    setActiveTab('table');
  };

  const handleDeleteRepair = (id: string) => {
    const updated = deleteRepair(id);
    setRepairs(updated);
    if (selectedSheetRepairId === id) {
      setSelectedSheetRepairId(updated[0]?.id || null);
    }
  };

  const handleEditRepair = (repair: RepairEntry) => {
    setEditingRepair(repair);
    setActiveTab('record');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleViewSheet = (repair: RepairEntry) => {
    setSelectedSheetRepairId(repair.id);
    setActiveTab('sheet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Categories
  const handleAddNewCategory = (newCat: string) => {
    setSelectedCategory(newCat);
  };

  // Handlers for Profile
  const handleSaveProfile = (newProfile: ShopProfile) => {
    setProfile(newProfile);
    saveShopProfile(newProfile);
  };

  // Handlers for Branches
  const handleAddOrUpdateBranch = (branch: BranchUser) => {
    const updated = addOrUpdateBranch(branch);
    setBranches(updated);
  };

  const handleDeleteBranch = (id: string) => {
    const updated = deleteBranch(id);
    setBranches(updated);
  };

  const handleExtendBranch = (id: string, days: number) => {
    const updated = extendBranchExpiry(id, days);
    setBranches(updated);
    if (session.branchId === id) {
      const refreshed = updated.find((b) => b.id === id);
      if (refreshed) {
        const newSession = { ...session, expiresAt: refreshed.expiryDate };
        setSession(newSession);
        saveAuthSession(newSession);
      }
    }
  };

  const handleSimulateLoginAsBranch = (branch: BranchUser) => {
    const expiry = checkBranchExpiry(branch.expiryDate);
    if (expiry.isExpired) {
      alert(
        `ไม่สามารถเข้าใช้งานได้ เนื่องจากสาขา "${branch.name}" ${expiry.displayText}\nลิงก์สาขา user ไม่สามารถต่ออายุเองได้ (กรุณากดปุ่มต่ออายุในฐานะ Admin ก่อน)`
      );
      return;
    }
    const newSession: AuthSession = {
      isLoggedIn: true,
      role: 'branch_user',
      branchId: branch.id,
      branchCode: branch.branchCode,
      branchName: branch.name,
      username: branch.username,
      expiresAt: branch.expiryDate,
    };
    setSession(newSession);
    saveAuthSession(newSession);
    setIsRecentlyLoggedOut(false);
    setActiveTab('home');
    alert(`เข้าสู่ระบบในโหมดสาขา: ${branch.name} เรียบร้อยแล้ว`);
  };

  // Handlers for Reset & Factory Defaults
  const handleClearWorkData = () => {
    const cleared = clearAllWorkData();
    setRepairs(cleared.repairs);
    setPinpoints(cleared.pinpoints);
    setGuides(cleared.guides);
    setSelectedSheetRepairId(null);
  };

  const handleResetFactoryDefaults = () => {
    const res = resetToFactoryDefaults();
    setProfile(res.profile);
    setRepairs(res.repairs);
    setPinpoints(res.pinpoints);
    setGuides(res.guides);
    setBranches(res.branches);
    setSelectedSheetRepairId(res.repairs[0]?.id || null);
  };

  // Handlers for Branch Profile Customization
  const handleSaveBranchProfile = (branchCustom: BranchCustomProfile) => {
    saveBranchCustomProfile(branchCustom);
    const updated = getActiveShopProfile(session);
    setProfile(updated);
  };

  // Handlers for Auth
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    saveAuthSession(newSession);
    setProfile(getActiveShopProfile(newSession));
    setIsRecentlyLoggedOut(false);
  };

  /**
   * ข้อ 4: ระบบออกจากระบบ (Logout) แยกขาดระหว่างลิงก์สาขาและ Admin อย่างถาวร:
   * - กรณีเป็นลิงก์สาขา: จะคงอยู่ในลิงก์สาขานั้นเสมอ (?branch=...) ไม่เด้งไปหน้า Admin และไม่เปลี่ยนสิทธิ์เป็น Admin
   *   โดยจะแสดงหน้าเข้าสู่ระบบสาขาเดิม เพื่อให้กรอก User/Password เข้าใช้งานใหม่
   * - กรณีเป็น Admin: ออกจากระบบ Admin และเปิดโมดอลล็อกอิน
   */
  const handleLogout = () => {
    const isBranchContext =
      session.role === 'branch_user' ||
      (typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('branch')));

    if (isBranchContext) {
      const urlBranchParam = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('branch')
        : null;

      const loggedOutBranchSession: AuthSession = {
        isLoggedIn: false,
        role: 'branch_user',
        branchId: session.branchId,
        branchCode: session.branchCode || urlBranchParam || undefined,
        branchName: session.branchName,
        username: session.username,
        expiresAt: session.expiresAt,
      };

      setSession(loggedOutBranchSession);
      saveAuthSession(loggedOutBranchSession);
      setIsRecentlyLoggedOut(true);
      setActiveTab('home');
      return;
    }

    // กรณี Admin ออกจากระบบ (บนลิงก์หลัก)
    const adminSession: AuthSession = {
      isLoggedIn: false,
      role: 'admin',
      username: 'admin',
    };
    setSession(adminSession);
    saveAuthSession(adminSession);
    setProfile(getShopProfile());
    setActiveTab('home');
    setIsLoginModalOpen(true);
  };

  // Handlers for Revisions
  const handleAddRevision = (rec: RevisionRecord) => {
    const updated = addRevisionRecord(rec);
    setRevisions(updated);
  };

  const activeRevision = revisions[0]?.revision || APP_VERSION;

  // Check if current branch user session is expired
  const isBranchExpired = session.role === 'branch_user' && session.expiresAt
    ? checkBranchExpiry(session.expiresAt).isExpired
    : false;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Header Banner (ฉากหลังม้วนคัมภีร์ลายวงจรอิเล็กทรอนิกส์, ข้อความ "คัมภีร์ลับซ่างซวดลวด", ชื่อร้าน/เบอร์ ด้านใต้) */}
      <HeaderBanner
        profile={profile}
        session={session}
        activeRevision={activeRevision}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenRevisionModal={() => setIsRevisionModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenBranchSettings={() => setIsBranchSettingsModalOpen(true)}
      />

      {/* 2. Top Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'pinpoint') setHomeQuickMode('pinpoint');
          if (tab === 'disassembly') setHomeQuickMode('disassembly');
          if (tab === 'table') setHomeQuickMode('knowledge');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        repairCount={repairs.length}
        pinpointCount={pinpoints.length}
        guideCount={guides.length}
        branchCount={branches.length}
        session={session}
        onOpenBranchSettings={() => setIsBranchSettingsModalOpen(true)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* กรณี 1: อยู่ในลิงก์สาขาแต่ยังไม่ได้เข้าสู่ระบบ (หรือเพิ่งกดออกจากระบบ): แสดงหน้าเข้าสู่ระบบสาขาเฉพาะตัว ไม่เด้งเข้า Admin */}
        {session.role === 'branch_user' && !session.isLoggedIn ? (
          <BranchLoginCard
            branchCode={
              session.branchCode ||
              (typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search).get('branch') || 'TEST01'
                : 'TEST01')
            }
            branchName={session.branchName || 'สาขา'}
            defaultUsername={session.username}
            branches={branches}
            onLoginSuccess={handleLoginSuccess}
            isRecentlyLoggedOut={isRecentlyLoggedOut}
          />
        ) : isBranchExpired ? (
          /* กรณี 2: ลิงก์สาขาหมดอายุ: แสดงหน้าจอล็อกอย่างเป็นทางการ ไม่อนุญาตให้เข้าถึงเนื้อหา */
          <div className="py-8 max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-200 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>สิทธิ์การใช้งานสิ้นสุดลงแล้ว</span>
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  ลิงก์สาขานี้หมดอายุการใช้งานแล้ว
                </h2>
                <p className="text-slate-600 text-sm">
                  สาขา: <strong className="text-slate-900">{session.branchName || session.branchCode}</strong>
                  {session.expiresAt && ` (หมดอายุเมื่อ: ${session.expiresAt})`}
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-left space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>ข้อกำหนดความปลอดภัยของระบบคัมภีร์ลับซ่างซวดลวด:</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  • ผู้ใช้งานลิงก์สาขาไม่สามารถกดต่ออายุเองได้<br/>
                  • กรุณาติดต่อผู้ดูแลระบบ (Admin) สำนักงานใหญ่ เพื่อดำเนินการต่ออายุสิทธิ์เข้าใช้งาน
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>โทรหา Admin: {profile.phone}</span>
                  </a>
                )}
                {profile.lineId && (
                  <a
                    href={`https://line.me/ti/p/~${profile.lineId.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>LINE: {profile.lineId}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* HOMEPAGE VIEW: แสดงเฉพาะ 3 ปุ่มรูปคัมภีร์สมุด 3D (แดง, เหลือง, เขียว) ไม่ต้องมีอะไรต่อท้ายเพื่อให้ประหยัดพื้นที่ */}
            {activeTab === 'home' && (
              <div className="py-2">
                <HomeQuickMenu
                  onSelectAction={(action) => {
                    if (action === 'pinpoint') setActiveTab('pinpoint');
                    if (action === 'disassembly') setActiveTab('disassembly');
                    if (action === 'knowledge') setActiveTab('table');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  pinpointCount={pinpoints.length}
                  guideCount={guides.length}
                  repairsCount={repairs.length}
                />
              </div>
            )}

            {/* DIRECT TAB: 1) ชี้จุดเสีย แบบซวดลวดรวดเร็ว (คัมภีร์เล่มแดง) */}
            {activeTab === 'pinpoint' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <QuickPinpointSection
                  pinpoints={pinpoints}
                  session={session}
                  onSavePinpoint={handleSavePinpoint}
                  onDeletePinpoint={handleDeletePinpoint}
                />
              </div>
            )}

            {/* DIRECT TAB: 2) วิธีถอดเครื่อง / วิธีประกอบเครื่อง (คัมภีร์เล่มเหลือง) */}
            {activeTab === 'disassembly' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <DisassemblyGuideSection
                  guides={guides}
                  session={session}
                  onSaveGuide={handleSaveGuide}
                  onDeleteGuide={handleDeleteGuide}
                />
              </div>
            )}

            {/* DIRECT TAB: 3) คลังคัมภีร์ซวดรวดรวมอาการเสีย (คัมภีร์เล่มเขียว) */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <span>← กลับหน้าหลัก 3 คัมภีร์</span>
                  </button>
                </div>
                <SummaryTable
                  repairs={repairs}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddNewCategory={handleAddNewCategory}
                  onViewSheet={handleViewSheet}
                  onEditRepair={handleEditRepair}
                  onDeleteRepair={handleDeleteRepair}
                />
              </div>
            )}

            {/* DIRECT TAB: บันทึกอาการเสียเจาะลึกเต็มรูปแบบ (ส่วนที่ 1 & 2) */}
            {activeTab === 'record' && (
              <RepairForm
                categories={categories}
                shopProfile={profile}
                session={session}
                editingRepair={editingRepair}
                onSave={handleSaveRepair}
                onCancelEdit={() => setEditingRepair(null)}
              />
            )}

            {/* DIRECT TAB: Sheet แยก (ส่วนที่ 4) */}
            {activeTab === 'sheet' && (
              <DetailSheetView
                repairs={repairs}
                selectedRepairId={selectedSheetRepairId}
                shopProfile={profile}
                onSelectRepair={(id) => setSelectedSheetRepairId(id)}
                onBackToTable={() => setActiveTab('table')}
              />
            )}

            {/* DIRECT TAB: จัดการสาขา (Admin Only) */}
            {activeTab === 'admin' && session.role === 'admin' && (
              <AdminBranchManager
                branches={branches}
                session={session}
                onAddOrUpdateBranch={handleAddOrUpdateBranch}
                onDeleteBranch={handleDeleteBranch}
                onExtendBranch={handleExtendBranch}
                onSimulateLoginAsBranch={handleSimulateLoginAsBranch}
              />
            )}

            {/* DIRECT TAB: ตั้งค่าร้าน & หน้าปก (Admin Only) */}
            {activeTab === 'settings' && session.role === 'admin' && (
              <SettingsModal
                profile={profile}
                onSaveProfile={handleSaveProfile}
                isStandaloneTab={true}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        profile={profile}
        onSaveProfile={handleSaveProfile}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <LoginModal
        branches={branches}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        branchCode={session.branchCode}
        isBranchLocked={session.role === 'branch_user'}
      />

      <RevisionModal
        revisions={revisions}
        activeRevision={activeRevision}
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onAddRevision={handleAddRevision}
        isAdmin={session.role === 'admin'}
      />

      {/* โมดอลเคลียร์งานเก่า / คืนค่าเริ่มต้นจากโรงงาน */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onClearWorkData={handleClearWorkData}
        onResetFactoryDefaults={handleResetFactoryDefaults}
        totalRepairs={repairs.length}
        totalPinpoints={pinpoints.length}
        totalGuides={guides.length}
      />

      {/* โมดอลตั้งค่าภาพหน้าปก & ข้อมูลร้านเฉพาะสาขา (ไม่เข้าถึงการสร้างลิงก์) */}
      <BranchSettingsModal
        isOpen={isBranchSettingsModalOpen}
        onClose={() => setIsBranchSettingsModalOpen(false)}
        branchCode={session.branchCode || session.branchId || 'MY-BRANCH'}
        branchName={session.branchName || 'สาขา'}
        currentProfile={profile}
        onSaveBranchProfile={handleSaveBranchProfile}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 mt-10 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold text-slate-200">คัมภีร์ลับซ่างซวดลวด</span>
            <span>• คลังปัญญางานซ่อมและวิธีถอดประกอบ</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRevisionModalOpen(true)}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono transition cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{activeRevision}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span>สถานะ: พร้อมใช้งาน</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
