import React, { useState, useEffect } from 'react';
import {
  RepairEntry,
  ShopProfile,
  BranchUser,
  RevisionRecord,
  AuthSession,
  QuickPinpointRecord,
  DisassemblyGuide,
} from './types';
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
import {
  Sparkles,
  GitBranch,
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [homeQuickMode, setHomeQuickMode] = useState<MainViewMode>('pinpoint');

  // Core Data States
  const [profile, setProfile] = useState<ShopProfile>(getShopProfile());
  const [repairs, setRepairs] = useState<RepairEntry[]>(getRepairs());
  const [pinpoints, setPinpoints] = useState<QuickPinpointRecord[]>(getQuickPinpoints());
  const [guides, setGuides] = useState<DisassemblyGuide[]>(getDisassemblyGuides());
  const [branches, setBranches] = useState<BranchUser[]>(getBranchUsers());
  const [revisions, setRevisions] = useState<RevisionRecord[]>(getRevisions());
  const [session, setSession] = useState<AuthSession>(getAuthSession());

  // Editing & Selection states
  const [editingRepair, setEditingRepair] = useState<RepairEntry | null>(null);
  const [selectedSheetRepairId, setSelectedSheetRepairId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  // Derive categories list dynamically
  const categories = getCategories(repairs);

  // Parse URL parameters on load for branch links or specific tabs
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const branchParam = params.get('branch');
      const tabParam = params.get('tab') as ActiveTab | null;
      const sheetParam = params.get('sheet');

      if (branchParam) {
        const found = branches.find(
          (b) => b.branchCode.toUpperCase() === branchParam.toUpperCase()
        );
        if (found) {
          const expiry = checkBranchExpiry(found.expiryDate);
          if (expiry.isExpired) {
            alert(
              `ลิงก์สาขา "${found.name}" หมดอายุแล้ว (${expiry.displayText})\nลิงก์สาขาไม่สามารถต่ออายุเองได้ กรุณาติดต่อ Admin เพื่อต่ออายุ`
            );
          } else {
            setIsLoginModalOpen(true);
          }
        }
      }

      if (tabParam && ['home', 'pinpoint', 'disassembly', 'record', 'table', 'sheet', 'admin', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
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
      branchName: branch.name,
      username: branch.username,
      expiresAt: branch.expiryDate,
    };
    setSession(newSession);
    saveAuthSession(newSession);
    setActiveTab('home');
    alert(`เข้าสู่ระบบในโหมดสาขา: ${branch.name} เรียบร้อยแล้ว`);
  };

  // Handlers for Auth
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    saveAuthSession(newSession);
  };

  const handleLogout = () => {
    const defaultAdminSession: AuthSession = {
      isLoggedIn: true,
      role: 'admin',
      username: 'admin',
    };
    setSession(defaultAdminSession);
    saveAuthSession(defaultAdminSession);
    alert('สลับกลับสู่โหมดผู้ดูแลระบบ (Admin สำนักงานใหญ่)');
  };

  // Handlers for Revisions
  const handleAddRevision = (rec: RevisionRecord) => {
    const updated = addRevisionRecord(rec);
    setRevisions(updated);
  };

  const activeRevision = revisions[0]?.revision || 'Rev 1.4.0';

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
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
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

        {/* DIRECT TAB: จัดการสาขา (Admin) */}
        {activeTab === 'admin' && (
          <AdminBranchManager
            branches={branches}
            session={session}
            onAddOrUpdateBranch={handleAddOrUpdateBranch}
            onDeleteBranch={handleDeleteBranch}
            onExtendBranch={handleExtendBranch}
            onSimulateLoginAsBranch={handleSimulateLoginAsBranch}
          />
        )}

        {/* DIRECT TAB: ตั้งค่าร้าน & หน้าปก */}
        {activeTab === 'settings' && (
          <SettingsModal
            profile={profile}
            onSaveProfile={handleSaveProfile}
            isStandaloneTab={true}
          />
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
      />

      <RevisionModal
        revisions={revisions}
        activeRevision={activeRevision}
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onAddRevision={handleAddRevision}
        isAdmin={session.role === 'admin'}
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
