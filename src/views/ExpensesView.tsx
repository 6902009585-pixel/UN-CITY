import React, { useState } from 'react';
import { ExpenseItem, ExpenseCategory } from '../types';
import {
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  BookOpen,
  Car,
  FileText,
  Package,
  Layers,
} from 'lucide-react';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add form
  const [newTitle, setNewTitle] = useState('');
  const [newSemester, setNewSemester] = useState('1/2569');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('registration');
  const [newAmount, setNewAmount] = useState<number>(1150);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  const semesters = Array.from(new Set(expenses.map((e) => e.semester)));

  const filteredExpenses = expenses.filter((e) => {
    if (selectedSemesterFilter !== 'all' && e.semester !== selectedSemesterFilter) return false;
    return true;
  });

  const totalExpenseAll = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by semester for summary cards (as requested in brief: ภาค 1/69, ภาค 2/69, Summer...)
  const semesterSummaries = semesters.map((sem) => {
    const total = expenses
      .filter((e) => e.semester === sem)
      .reduce((sum, e) => sum + e.amount, 0);
    return { semester: sem, total };
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount <= 0) {
      alert('กรุณากรอกรายการและจำนวนเงินที่ถูกต้อง');
      return;
    }
    const item: ExpenseItem = {
      id: `exp-${Date.now()}`,
      semester: newSemester,
      category: newCategory,
      title: newTitle.trim(),
      amount: newAmount,
      date: newDate,
      notes: newNotes,
    };
    onAddExpense(item);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewAmount(100);
  };

  const getCategoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'registration':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'books':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'travel':
        return <Car className="w-4 h-4 text-emerald-500" />;
      case 'documents':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'supplies':
        return <Package className="w-4 h-4 text-rose-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryName = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'registration':
        return 'ค่าลงทะเบียน';
      case 'books':
        return 'ค่าหนังสือ';
      case 'travel':
        return 'ค่าเดินทาง';
      case 'documents':
        return 'ค่าเอกสาร';
      case 'supplies':
        return 'ค่าอุปกรณ์';
      default:
        return 'อื่น ๆ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-500" />
            <span>💰 ระบบค่าใช้จ่ายการเรียน (Study Expenses)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            บันทึกค่าลงทะเบียน ค่าตำราเรียน ค่าเดินทาง และสรุปยอดค่าใช้จ่ายรายภาค
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกค่าใช้จ่ายใหม่</span>
        </button>
      </div>

      {/* Summary by Semester (Requested specifically in prompt) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            สรุปยอดค่าใช้จ่ายการเรียน มหาวิทยาลัยรามคำแหง
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">รวมทั้งหมด: </span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {totalExpenseAll.toLocaleString()} บาท
            </span>
          </div>
        </div>

        {/* Breakdown as specified in user brief */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          {semesterSummaries.map((s) => (
            <div
              key={s.semester}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-left"
            >
              <div className="text-xs text-slate-400 font-mono">ภาค {s.semester}</div>
              <div className="text-lg font-black text-white font-mono mt-0.5">
                {s.total.toLocaleString()} บาท
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            รายการบันทึกค่าใช้จ่าย
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">กรองภาคเรียน:</span>
            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              <option value="all">ทุกภาคเรียน</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  ภาค {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(exp.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {exp.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {getCategoryName(exp.category)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ภาค {exp.semester} • {exp.date} {exp.notes && `• ${exp.notes}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                  {exp.amount.toLocaleString()} ฿
                </span>
                <button
                  onClick={() => onDeleteExpense(exp.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              บันทึกค่าใช้จ่ายใหม่
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รายการค่าใช้จ่าย *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น ค่าลงทะเบียนเรียน 1/2569 หรือ ตำราเรียน ม.ร."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  >
                    <option value="registration">ค่าลงทะเบียน</option>
                    <option value="books">ค่าหนังสือ</option>
                    <option value="travel">ค่าเดินทาง</option>
                    <option value="documents">ค่าเอกสาร</option>
                    <option value="supplies">ค่าอุปกรณ์</option>
                    <option value="other">อื่น ๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ภาคเรียน *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    placeholder="1/2569"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    จำนวนเงิน (บาท) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    วันที่ชำระ
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  หมายเหตุเพิ่มเติม
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="เช่น ชำระผ่าน RU App หรือ ศูนย์หนังสือ ม.ร."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
