import React, { useState } from 'react';
import { Subject, StudentProfile } from '../types';
import { calculateRURegistrationFee } from '../utils/gradeCalculations';
import {
  FileCheck2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Printer,
  Sparkles,
  BookOpen,
  Info,
} from 'lucide-react';

interface RegistrationViewProps {
  profile: StudentProfile;
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  profile,
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [selectedSemester, setSelectedSemester] = useState(profile.currentSemester || '1/2569');
  const [isGraduatingSenior, setIsGraduatingSenior] = useState(false); // กาขอจบ

  // Quick add form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newCategory, setNewCategory] = useState('หมวดวิชาเอก');

  // Filter subjects registered in this semester
  const semesterSubjects = subjects.filter((s) => s.semester === selectedSemester);
  const totalSubjectsCount = semesterSubjects.length;
  const totalCredits = semesterSubjects.reduce((acc, curr) => acc + curr.credits, 0);

  const isSummer = selectedSemester.toLowerCase().includes('s') || selectedSemester.includes('summer');
  const maxCreditsAllowed = isGraduatingSenior ? (isSummer ? 18 : 30) : isSummer ? 9 : 22;
  const isOverCreditLimit = totalCredits > maxCreditsAllowed;

  // Fee calculation (Ramkhamhaeng University structure)
  const feeDetails = calculateRURegistrationFee(totalCredits, isSummer);

  // Available subjects from not_taken or curriculum to pick easily
  const unEnrolledSubjects = subjects.filter(
    (s) => s.status === 'not_taken' && s.semester !== selectedSemester
  );

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      alert('กรุณากรอกรหัสวิชาและชื่อวิชา');
      return;
    }
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      nameTh: newName.trim(),
      credits: newCredits,
      category: newCategory,
      semester: selectedSemester,
      status: 'enrolled',
    };
    onAddSubject(newSub);
    setNewCode('');
    setNewName('');
  };

  const handleQuickAdd = (targetSub: Subject) => {
    onUpdateSubject({
      ...targetSub,
      semester: selectedSemester,
      status: 'enrolled',
    });
  };

  const semestersList = [
    '1/2567',
    '2/2567',
    'S/2567',
    '1/2568',
    '2/2568',
    'S/2568',
    '1/2569',
    '2/2569',
    'S/2569',
    '1/2570',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              📝 ระบบลงทะเบียนเรียน ม.รามคำแหง
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              ภาค {selectedSemester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            เลือกวิชา คำนวณจำนวนหน่วยกิต ตรวจสอบขีดจำกัดหน่วยกิต และคำนวณค่าธรรมเนียมลงทะเบียนอัตโนมัติ
          </p>
        </div>

        {/* Semester Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            เลือกภาคเรียน:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            {semestersList.map((sem) => (
              <option key={sem} value={sem}>
                ภาค {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Instant Summary Calculation Card (Requested in brief) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Instant Counter Banner */}
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-800 text-white p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                สรุปผลการลงทะเบียนทันที
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gradSeniorCheck"
                  checked={isGraduatingSenior}
                  onChange={(e) => setIsGraduatingSenior(e.target.checked)}
                  className="rounded text-amber-400 focus:ring-amber-300"
                />
                <label
                  htmlFor="gradSeniorCheck"
                  className="text-xs text-slate-300 cursor-pointer font-medium"
                >
                  🎓 ขอใช้สิทธิ์กาขอจบ (เพิ่มเพดาน นก.)
                </label>
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-4">
              <div>
                <span className="text-xs text-slate-400">ลงทั้งหมด</span>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {totalSubjectsCount} <span className="text-lg font-normal text-slate-300">วิชา</span>
                </div>
              </div>
              <div className="text-3xl text-slate-600 font-light">/</div>
              <div>
                <span className="text-xs text-slate-400">รวมหน่วยกิต</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {totalCredits}{' '}
                  <span className="text-lg font-normal text-slate-300">หน่วยกิต</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                เกณฑ์สูงสุดภาคนี้: ไม่เกิน <strong>{maxCreditsAllowed} หน่วยกิต</strong>{' '}
                {isGraduatingSenior ? '(สิทธิ์ขอจบ)' : '(ปกติ)'}
              </span>
            </div>
            {isOverCreditLimit ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-400" /> เกินกำหนด {totalCredits - maxCreditsAllowed} นก.!
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> อยู่ในเกณฑ์ที่กำหนด
              </span>
            )}
          </div>
        </div>

        {/* Tuition Fee Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-500" />
                ประมาณการค่าลงทะเบียน
              </span>
              <span className="text-[11px] text-slate-400 font-normal">ม.ร. (หน่วยกิตละ 25 บ.)</span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>ค่าหน่วยกิต ({totalCredits} × 25 บ.)</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {feeDetails.creditFee.toLocaleString()} บ.
                </span>
              </div>
              <div className="flex justify-between">
                <span>ค่าบำรุงมหาวิทยาลัย</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {feeDetails.maintenanceFee.toLocaleString()} บ.
                </span>
              </div>
              <div className="flex justify-between">
                <span>ค่าข่าวรามคำแหง</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {feeDetails.newsFee.toLocaleString()} บ.
                </span>
              </div>
              <div className="flex justify-between">
                <span>ค่าบริการข้อมูล/ประกัน</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {feeDetails.otherFee.toLocaleString()} บ.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ยอดรวมทั้งสิ้น</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {feeDetails.totalFee.toLocaleString()} บาท
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled in Cart & Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Registered Subjects Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>รายชื่อวิชาที่ลงทะเบียนในภาค {selectedSemester}</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {semesterSubjects.length} วิชา ({totalCredits} หน่วยกิต)
            </span>
          </div>

          {semesterSubjects.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              ยังไม่มีวิชาที่ลงทะเบียนในภาคเรียนนี้
              <p className="text-xs mt-1 text-slate-500">
                เพิ่มวิชาจากแบบฟอร์มด้านขวา หรือเลือกจากหลักสูตร
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {semesterSubjects.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {sub.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {sub.code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-400">
                          {sub.credits} หน่วยกิต
                        </span>
                        <span className="text-[10px] text-slate-400">{sub.category}</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                        {sub.nameTh}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      25 × {sub.credits} = {sub.credits * 25} บ.
                    </span>
                    <button
                      onClick={() => onDeleteSubject(sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="ลบวิชาออกจากภาคนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Add Course Form (1 col) */}
        <div className="space-y-6">
          {/* Add New Custom Course */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>เพิ่มวิชาลงทะเบียนใหม่</span>
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รหัสวิชา (เช่น ACC1103, RAM1142) *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="ACC1103"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อวิชาภาษาไทย *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="เช่น การบัญชีการเงิน"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    หน่วยกิต
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    หมวดวิชา
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="หมวดวิชาศึกษาทั่วไป">ศึกษาทั่วไป</option>
                    <option value="หมวดวิชาแกน">วิชาแกน</option>
                    <option value="หมวดวิชาเอก">วิชาเอก</option>
                    <option value="หมวดวิชาเอกเลือก">วิชาเอกเลือก</option>
                    <option value="หมวดวิชาเลือกเสรี">วิชาเลือกเสรี</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มวิชาในภาค {selectedSemester}</span>
              </button>
            </form>
          </div>

          {/* Quick pick from curriculum */}
          {unEnrolledSubjects.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-2">
                ดึงวิชาที่ยังไม่ได้เรียนมาลงทะเบียน ({unEnrolledSubjects.length})
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {unEnrolledSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {sub.code}
                      </span>{' '}
                      <span className="text-slate-500">({sub.credits} นก.)</span>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{sub.nameTh}</div>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(sub)}
                      className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400/40 text-amber-500 font-bold text-[10px] shrink-0"
                    >
                      + ลงทะเบียน
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
