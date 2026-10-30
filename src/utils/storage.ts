import {
  RepairEntry,
  ShopProfile,
  BranchUser,
  RevisionRecord,
  AuthSession,
  QuickPinpointRecord,
  DisassemblyGuide,
} from '../types';
import {
  DEFAULT_SHOP_PROFILE,
  INITIAL_REPAIRS,
  INITIAL_BRANCH_USERS,
  INITIAL_REVISIONS,
  INITIAL_QUICK_PINPOINTS,
  INITIAL_DISASSEMBLY_GUIDES,
} from '../data/defaultData';

const STORAGE_KEYS = {
  PROFILE: 'fixit_shop_profile_v1',
  REPAIRS: 'fixit_repairs_v1',
  BRANCHES: 'fixit_branches_v1',
  REVISIONS: 'fixit_revisions_v1',
  SESSION: 'fixit_auth_session_v1',
  CATEGORIES: 'fixit_custom_categories_v1',
  PINPOINTS: 'fixit_quick_pinpoints_v1',
  GUIDES: 'fixit_disassembly_guides_v1',
};

// Profile
export function getShopProfile(): ShopProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read shop profile from storage', err);
  }
  return DEFAULT_SHOP_PROFILE;
}

export function saveShopProfile(profile: ShopProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save shop profile', err);
  }
}

// Repairs
export function getRepairs(): RepairEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPAIRS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read repairs from storage', err);
  }
  // Initialize with seed data
  saveRepairs(INITIAL_REPAIRS);
  return INITIAL_REPAIRS;
}

export function saveRepairs(repairs: RepairEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs));
  } catch (err) {
    console.error('Failed to save repairs list', err);
  }
}

export function saveOrUpdateRepair(entry: RepairEntry): RepairEntry[] {
  const existing = getRepairs();
  const index = existing.findIndex((r) => r.id === entry.id);
  let updated: RepairEntry[];
  if (index >= 0) {
    updated = existing.map((r) => (r.id === entry.id ? { ...entry, updatedAt: new Date().toISOString() } : r));
  } else {
    updated = [{ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...existing];
  }
  saveRepairs(updated);
  return updated;
}

export function deleteRepair(id: string): RepairEntry[] {
  const existing = getRepairs();
  const updated = existing.filter((r) => r.id !== id);
  saveRepairs(updated);
  return updated;
}

// Branches
export function getBranchUsers(): BranchUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read branches from storage', err);
  }
  saveBranchUsers(INITIAL_BRANCH_USERS);
  return INITIAL_BRANCH_USERS;
}

export function saveBranchUsers(branches: BranchUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  } catch (err) {
    console.error('Failed to save branches', err);
  }
}

export function addOrUpdateBranch(branch: BranchUser): BranchUser[] {
  const existing = getBranchUsers();
  const idx = existing.findIndex((b) => b.id === branch.id);
  let updated: BranchUser[];
  if (idx >= 0) {
    updated = existing.map((b) => (b.id === branch.id ? branch : b));
  } else {
    updated = [...existing, branch];
  }
  saveBranchUsers(updated);
  return updated;
}

export function deleteBranch(id: string): BranchUser[] {
  const existing = getBranchUsers();
  const updated = existing.filter((b) => b.id !== id);
  saveBranchUsers(updated);
  return updated;
}

export function extendBranchExpiry(id: string, additionalDays: number): BranchUser[] {
  const existing = getBranchUsers();
  const updated = existing.map((b) => {
    if (b.id === id) {
      // Calculate from current expiry or today (whichever is later)
      const currentExpiry = new Date(b.expiryDate).getTime();
      const now = Date.now();
      const baseTime = currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseTime + additionalDays * 24 * 60 * 60 * 1000);
      return {
        ...b,
        expiryDate: newExpiry.toISOString().split('T')[0],
      };
    }
    return b;
  });
  saveBranchUsers(updated);
  return updated;
}

// Revisions
export function getRevisions(): RevisionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVISIONS);
    if (raw) {
      const parsed: RevisionRecord[] = JSON.parse(raw);
      // Merge with initial revisions if new revision added
      const existingRevSet = new Set(parsed.map((r) => r.revision));
      const missingFromInitial = INITIAL_REVISIONS.filter((r) => !existingRevSet.has(r.revision));
      if (missingFromInitial.length > 0) {
        const merged = [...missingFromInitial, ...parsed];
        saveRevisions(merged);
        return merged;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read revisions from storage', err);
  }
  saveRevisions(INITIAL_REVISIONS);
  return INITIAL_REVISIONS;
}

export function saveRevisions(revisions: RevisionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVISIONS, JSON.stringify(revisions));
  } catch (err) {
    console.error('Failed to save revisions', err);
  }
}

export function addRevisionRecord(rec: RevisionRecord): RevisionRecord[] {
  const list = getRevisions();
  const updated = [rec, ...list];
  saveRevisions(updated);
  return updated;
}

// Categories
export function getCategories(repairs: RepairEntry[]): string[] {
  const base = [
    'ทั้งหมด',
    'บอร์ดเครื่องซักผ้า',
    'สมาร์ททีวี / แอลอีดีทีวี',
    'ตู้เย็นอินเวอร์เตอร์',
    'มอเตอร์ & ปั๊มน้ำ',
    'เตาอบไมโครเวฟ',
    'เครื่องปรับอากาศ / บอร์ดคอยล์ร้อน',
    'ตู้เชื่อมอินเวอร์เตอร์',
    'เครื่องเสียง & แอมป์ขยาย',
    'เครื่องมือช่างไฟฟ้า (สว่าน/หินเจียร์)',
    'พาวเวอร์ซัพพลายสวิทชิ่ง',
  ];
  const fromRepairs = repairs.map((r) => r.category).filter(Boolean);
  return Array.from(new Set([...base, ...fromRepairs]));
}

// Auth Session
export function getAuthSession(): AuthSession {
  // 1. Check if URL explicitly contains branch query param (e.g. ?branch=TEST01)
  if (typeof window !== 'undefined' && window.location.search) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const branchParam = urlParams.get('branch');
      if (branchParam && branchParam.trim()) {
        const bCode = branchParam.trim();
        const bNameParam = urlParams.get('bname') || urlParams.get('name');
        const expParam = urlParams.get('exp');

        const allBranches = getBranchUsers();
        const found = allBranches.find(
          (b) => b.branchCode.toUpperCase() === bCode.toUpperCase()
        );

        const finalName = found?.name || (bNameParam ? decodeURIComponent(bNameParam) : `สาขา ${bCode}`);
        const finalExpiry =
          found?.expiryDate ||
          expParam ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // If this branch is not yet in the local device's branch list, save it
        if (!found) {
          const autoBranch: BranchUser = {
            id: `branch-${bCode.toLowerCase()}`,
            name: finalName,
            phone: '',
            branchCode: bCode,
            shareUrl: `?branch=${encodeURIComponent(bCode)}`,
            username: `user_${bCode.toLowerCase()}`,
            password: '',
            expiryDate: finalExpiry,
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            notes: 'บันทึกอัตโนมัติจากลิงก์สาขา',
          };
          saveBranchUsers([...allBranches, autoBranch]);
        }

        const branchSession: AuthSession = {
          isLoggedIn: true,
          role: 'branch_user',
          branchId: found?.id || `branch-${bCode.toLowerCase()}`,
          branchCode: bCode,
          branchName: finalName,
          username: found?.username || bCode.toLowerCase(),
          expiresAt: finalExpiry,
        };

        saveAuthSession(branchSession);
        return branchSession;
      }
    } catch (e) {
      console.error('Failed to parse branch query param in getAuthSession', e);
    }
  }

  // 2. Read existing session from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read auth session', err);
  }

  // 3. Default to Admin in demo mode
  return {
    isLoggedIn: true,
    role: 'admin',
    username: 'admin',
  };
}

export function saveAuthSession(session: AuthSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save auth session', err);
  }
}

// Expiry Calculator
export interface ExpiryStatus {
  isExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  displayText: string;
  badgeColor: string;
}

export function checkBranchExpiry(expiryDateStr: string): ExpiryStatus {
  if (!expiryDateStr) {
    return {
      isExpired: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      displayText: 'ไม่มีข้อมูลวันหมดอายุ',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
    };
  }

  // End of day calculation
  const expiryDate = new Date(`${expiryDateStr}T23:59:59`);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    const expiredDaysAgo = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    return {
      isExpired: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      displayText: expiredDaysAgo === 0 ? 'หมดอายุวันนี้แล้ว' : `หมดอายุแล้ว (${expiredDaysAgo} วันก่อน)`,
      badgeColor: 'bg-red-50 text-red-700 border-red-300',
    };
  }

  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  if (daysRemaining <= 3) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse';
  } else if (daysRemaining <= 7) {
    badgeColor = 'bg-yellow-50 text-yellow-800 border-yellow-300';
  }

  return {
    isExpired: false,
    daysRemaining,
    hoursRemaining,
    displayText: daysRemaining > 0 ? `เหลืออีก ${daysRemaining} วัน ${hoursRemaining} ชม.` : `เหลืออีก ${hoursRemaining} ชั่วโมง`,
    badgeColor,
  };
}

// 1) Quick Pinpoint Faults
export function getQuickPinpoints(): QuickPinpointRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PINPOINTS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read pinpoints from storage', err);
  }
  saveQuickPinpoints(INITIAL_QUICK_PINPOINTS);
  return INITIAL_QUICK_PINPOINTS;
}

export function saveQuickPinpoints(list: QuickPinpointRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PINPOINTS, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save pinpoints list', err);
  }
}

export function saveOrUpdateQuickPinpoint(entry: QuickPinpointRecord): QuickPinpointRecord[] {
  const existing = getQuickPinpoints();
  const idx = existing.findIndex((p) => p.id === entry.id);
  let updated: QuickPinpointRecord[];
  if (idx >= 0) {
    updated = existing.map((p) => (p.id === entry.id ? entry : p));
  } else {
    updated = [entry, ...existing];
  }
  saveQuickPinpoints(updated);
  return updated;
}

export function deleteQuickPinpoint(id: string): QuickPinpointRecord[] {
  const existing = getQuickPinpoints();
  const updated = existing.filter((p) => p.id !== id);
  saveQuickPinpoints(updated);
  return updated;
}

// 2) Disassembly / Assembly Guides
export function getDisassemblyGuides(): DisassemblyGuide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUIDES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read disassembly guides from storage', err);
  }
  saveDisassemblyGuides(INITIAL_DISASSEMBLY_GUIDES);
  return INITIAL_DISASSEMBLY_GUIDES;
}

export function saveDisassemblyGuides(list: DisassemblyGuide[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save disassembly guides', err);
  }
}

export function saveOrUpdateDisassemblyGuide(entry: DisassemblyGuide): DisassemblyGuide[] {
  const existing = getDisassemblyGuides();
  const idx = existing.findIndex((g) => g.id === entry.id);
  let updated: DisassemblyGuide[];
  if (idx >= 0) {
    updated = existing.map((g) => (g.id === entry.id ? entry : g));
  } else {
    updated = [entry, ...existing];
  }
  saveDisassemblyGuides(updated);
  return updated;
}

export function deleteDisassemblyGuide(id: string): DisassemblyGuide[] {
  const existing = getDisassemblyGuides();
  const updated = existing.filter((g) => g.id !== id);
  saveDisassemblyGuides(updated);
  return updated;
}

