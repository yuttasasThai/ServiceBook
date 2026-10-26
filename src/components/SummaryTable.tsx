import React, { useState, useMemo } from 'react';
import { RepairEntry } from '../types';
import {
  Search,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SummaryTableProps {
  repairs: RepairEntry[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddNewCategory: (newCategory: string) => void;
  onViewSheet: (repair: RepairEntry) => void;
  onEditRepair: (repair: RepairEntry) => void;
  onDeleteRepair: (id: string) => void;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({
  repairs,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddNewCategory,
  onViewSheet,
  onEditRepair,
  onDeleteRepair,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { ทั้งหมด: repairs.length };
    repairs.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [repairs]);

  // Filtered list
  const filteredRepairs = useMemo(() => {
    return repairs.filter((item) => {
      // Category filter
      if (selectedCategory !== 'ทั้งหมด' && item.category !== selectedCategory) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesBasic =
          item.code.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.technicianName.toLowerCase().includes(query);

        const matchesSymptoms = item.symptoms.some(
          (s) =>
            s.symptomTitle.toLowerCase().includes(query) ||
            s.rootCause.toLowerCase().includes(query) ||
            s.visualCheck.toLowerCase().includes(query) ||
            s.functionCheck.toLowerCase().includes(query)
        );

        return matchesBasic || matchesSymptoms;
      }

      return true;
    });
  }, [repairs, selectedCategory, searchTerm]);

  // CSV Export
  const handleExportCSV = () => {
    if (repairs.length === 0) return;
    const headers = [
      'รหัสงานซ่อม',
      'สินค้า/ประเภท',
      'ยี่ห้อ',
      'รุ่น',
      'อาการเสีย',
      'สาเหตุ (Root Cause)',
      'ผลทดสอบหลังซ่อม',
      'ช่างผู้ซ่อม',
      'สาขา',
      'วันที่ซ่อม',
    ];

    const rows = filteredRepairs.map((r) => {
      const allSymptoms = r.symptoms.map((s) => s.symptomTitle).join(' | ');
      const allRootCauses = r.symptoms.map((s) => s.rootCause).join(' | ');
      const allTests = r.symptoms.map((s) => s.postRepairTest).join(' | ');
      return [
        `"${r.code}"`,
        `"${r.category}"`,
        `"${r.brand}"`,
        `"${r.model}"`,
        `"${allSymptoms.replace(/"/g, '""')}"`,
        `"${allRootCauses.replace(/"/g, '""')}"`,
        `"${allTests.replace(/"/g, '""')}"`,
        `"${r.technicianName}"`,
        `"${r.branchName}"`,
        `"${r.repairDate}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fixit_repairs_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      onAddNewCategory(newCatInput.trim());
      setNewCatInput('');
      setShowAddCatModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ตารางรวมสรุปอาการเสีย (แยกตามประเภทสินค้า)
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              ส่วนที่ 3: สรุปข้อมูลภาพรวม สินค้า, ยี่ห้อ, รุ่น, อาการเสีย, สาเหตุ (Root cause) สามารถกดเปิดดู Sheet เพื่อดูรายละเอียดเต็มได้
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>ส่งออก Excel/CSV</span>
            </button>

            <button
              onClick={() => setShowAddCatModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มประเภทสินค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal scrollable) */}
        <div className="pt-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>แยกชนิดประเภทสินค้า (คลิกเพื่อกรอง):</span>
            </div>
            <span className="text-xs text-slate-500">
              พบ {filteredRepairs.length} รายการ
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-container">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด่วนตาม รุ่น, ยี่ห้อ, รหัสอาการ, สาเหตุ Root cause, ช่าง..."
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

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredRepairs.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">ไม่พบรายการซ่อมตามเงื่อนไขที่เลือก</p>
            <p className="text-xs text-slate-400 mt-1">
              ลองเลือกประเภทสินค้าอื่น หรือกดบันทึกงานซ่อมใหม่ที่แท็บแรก
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scroll-container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3.5 px-4"># รหัส</th>
                  <th className="py-3.5 px-4">สินค้า</th>
                  <th className="py-3.5 px-4">ยี่ห้อ</th>
                  <th className="py-3.5 px-4">รุ่น (Model)</th>
                  <th className="py-3.5 px-4 min-w-[220px]">อาการเสีย</th>
                  <th className="py-3.5 px-4 min-w-[220px]">สาเหตุ (Root Cause)</th>
                  <th className="py-3.5 px-4">วันที่ / ช่าง</th>
                  <th className="py-3.5 px-4 text-center">เปิดดู Sheet</th>
                  <th className="py-3.5 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredRepairs.map((item, idx) => {
                  const firstSymptom = item.symptoms[0];
                  const totalSymptoms = item.symptoms.length;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition group"
                    >
                      {/* Code */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        <span className="bg-slate-100 group-hover:bg-amber-100 text-slate-800 px-2 py-0.5 rounded text-xs">
                          {item.code}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                        {item.brand}
                      </td>

                      {/* Model */}
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <div className="font-semibold text-slate-900">{item.model}</div>
                        {item.serialNumber && (
                          <div className="text-[11px] text-slate-400">S/N: {item.serialNumber}</div>
                        )}
                      </td>

                      {/* Symptom Summary */}
                      <td className="py-3 px-4 text-slate-800">
                        <div className="line-clamp-2 font-medium">
                          {firstSymptom?.symptomTitle || '-'}
                        </div>
                        {totalSymptoms > 1 && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            + มีอีก {totalSymptoms - 1} อาการเสีย
                          </span>
                        )}
                      </td>

                      {/* Root Cause */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="line-clamp-2 text-xs">
                          {firstSymptom?.rootCause ? (
                            <span>{firstSymptom.rootCause}</span>
                          ) : (
                            <span className="text-slate-400 italic">ยังไม่ได้ระบุ</span>
                          )}
                        </div>
                      </td>

                      {/* Date & Technician */}
                      <td className="py-3 px-4 text-xs whitespace-nowrap text-slate-600">
                        <div className="font-semibold">{item.repairDate}</div>
                        <div className="text-[11px] text-slate-400">{item.technicianName} ({item.branchName})</div>
                      </td>

                      {/* Open Full Sheet (Part 4 Link) */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewSheet(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>เปิด Sheet</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditRepair(item)}
                            title="แก้ไขข้อมูล"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`ยืนยันการลบคัมภีร์งานซ่อม ${item.code} (${item.model}) หรือไม่?`)) {
                                onDeleteRepair(item.id);
                              }
                            }}
                            title="ลบข้อมูล"
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
        )}
      </div>

      {/* Modal to Add New Category */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              + เพิ่มชนิดประเภทสินค้าใหม่
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              กำหนดชนิดสินค้าตามความต้องการของคุณ เพื่อแยกตารางและจัดหมวดหมู่งานซ่อมให้เป็นระเบียบ
            </p>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="เช่น แอร์เคลื่อนที่, เครื่องปั่นไฟ, อินเวอร์เตอร์ไฮบริด..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow transition"
                >
                  บันทึกประเภทสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
