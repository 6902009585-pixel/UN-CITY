import React, { useState } from 'react';
import { Subject, GradeType, SubjectStatus } from '../types';
import { checkRegradeEligibility, GRADE_CRITERIA_TEXT } from '../utils/gradeCalculations';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Award,
  Edit2,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';

interface SubjectsViewProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onRegradeSubject: (subject: Subject, targetSemester: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onRegradeSubject,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | SubjectStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [regradeSubjectTarget, setRegradeSubjectTarget] = useState<Subject | null>(null);
  const [regradeTargetSemester, setRegradeTargetSemester] = useState('1/2569');

  // Filter logic
  const filteredSubjects = subjects.filter((s) => {
    // Status filter
    if (activeFilter !== 'all' && s.status !== activeFilter) return false;
    // Category filter
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = s.code.toLowerCase().includes(q);
      const matchName = s.nameTh.toLowerCase().includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q));
      if (!matchCode && !matchName) return false;
    }
    return true;
  });

  // Unique categories for filter
  const categories = Array.from(new Set(subjects.map((s) => s.category)));

  // Status stats
  const passedCount = subjects.filter((s) => s.status === 'passed').length;
  const enrolledCount = subjects.filter((s) => s.status === 'enrolled').length;
  const notTakenCount = subjects.filter((s) => s.status === 'not_taken').length;
  const failedCount = subjects.filter((s) => s.status === 'failed' || s.grade === 'F').length;
  const regradeCount = subjects.filter((s) => s.isRegrade || s.status === 'regrade').length;

  // Handle re-grade trigger
  const handleOpenRegradeModal = (subject: Subject) => {
    setRegradeSubjectTarget(subject);
  };

  const confirmRegrade = () => {
    if (!regradeSubjectTarget) return;
    const check = checkRegradeEligibility(regradeSubjectTarget);
    if (!check.eligible) {
      alert(check.reason);
      return;
    }
    onRegradeSubject(regradeSubjectTarget, regradeTargetSemester);
    setRegradeSubjectTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              📚 ระบบรายวิชา & รีเกรด ม.รามคำแหง
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-500 border border-amber-400/30">
              รวม {subjects.length} วิชา
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            จัดการรายวิชาทั้งหมด แยกสถานะ พร้อมระบบตรวจสอบการรีเกรด (D/D+) ตามระเบียบ ม.ร.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSubject(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มรายวิชาใหม่</span>
        </button>
      </div>

      {/* RU Regrade Rule Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-700 dark:text-amber-300 text-sm">
            ⚖️ ระเบียบการรีเกรดของมหาวิทยาลัยรามคำแหง:
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            • นักศึกษาสามารถลงทะเบียนเรียนใหม่ (รีเกรด) ได้เฉพาะวิชาที่เคยสอบได้เกรด <strong>D</strong> หรือ <strong>D+</strong> เท่านั้น เพื่อปรับคะแนนเฉลี่ยสะสม<br />
            • วิชาที่สอบได้ตั้งแต่เกรด <strong>C</strong> ขึ้นไป (C, C+, B, B+, A) <strong>ไม่สามารถรีเกรดได้โดยเด็ดขาด</strong><br />
            • ⚠️ <strong>สำคัญมาก:</strong> หากมีการลงทะเบียนรีเกรดในวิชาใดก็ตาม จะมีผลทำให้ <strong>หมดสิทธิ์ได้รับเกียรตินิยมทุกกรณี</strong> ตามข้อบังคับมหาวิทยาลัย
          </p>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80">ทั้งหมด</div>
          <div className="text-xl font-bold mt-1">{subjects.length} วิชา</div>
        </button>

        <button
          onClick={() => setActiveFilter('passed')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'passed'
              ? 'bg-emerald-600 text-white border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-500">🟢 ผ่านแล้ว</div>
          <div className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{passedCount} วิชา</div>
        </button>

        <button
          onClick={() => setActiveFilter('enrolled')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'enrolled'
              ? 'bg-amber-500 text-slate-950 border-transparent shadow-md font-semibold'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-500">🟡 กำลังเรียน</div>
          <div className="text-xl font-bold mt-1 text-amber-500">{enrolledCount} วิชา</div>
        </button>

        <button
          onClick={() => setActiveFilter('not_taken')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'not_taken'
              ? 'bg-sky-600 text-white border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-sky-500">⬜ ยังไม่เรียน</div>
          <div className="text-xl font-bold mt-1 text-sky-600 dark:text-sky-400">{notTakenCount} วิชา</div>
        </button>

        <button
          onClick={() => setActiveFilter('failed')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'failed'
              ? 'bg-rose-600 text-white border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-rose-500">🔴 ไม่ผ่าน (F)</div>
          <div className="text-xl font-bold mt-1 text-rose-600 dark:text-rose-400">{failedCount} วิชา</div>
        </button>

        <button
          onClick={() => setActiveFilter('regrade')}
          className={`p-3 rounded-xl border text-left transition ${
            activeFilter === 'regrade'
              ? 'bg-purple-600 text-white border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-purple-500">🔄 รีเกรด/ลงซ้ำ</div>
          <div className="text-xl font-bold mt-1 text-purple-600 dark:text-purple-400">{regradeCount} วิชา</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-56 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <option value="all">ทุกหมวดวิชา</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">รหัสวิชา</th>
                <th className="py-3 px-4">ชื่อวิชา</th>
                <th className="py-3 px-4 text-center">นก.</th>
                <th className="py-3 px-4">หมวดวิชา</th>
                <th className="py-3 px-4">ภาคเรียน</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-center">เกรด</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 text-amber-500 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {subjects.length === 0
                          ? 'ยังไม่มีรายวิชาในระบบ (พร้อมให้คุณกรอกข้อมูลเอง)'
                          : 'ไม่พบข้อมูลรายวิชาตามเงื่อนไขที่เลือก'}
                      </div>
                      <p className="text-xs text-slate-400">
                        {subjects.length === 0
                          ? 'กดปุ่มด้านล่างเพื่อเริ่มบันทึกวิชาที่คุณเรียน เกรด และหน่วยกิตของคุณเอง'
                          : 'ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองหมวดวิชา'}
                      </p>
                      {subjects.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow hover:bg-amber-300 transition cursor-pointer"
                        >
                          + เพิ่มวิชาแรกของคุณ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sub) => {
                  const regradeCheck = checkRegradeEligibility(sub);
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{sub.code}</span>
                          {sub.isRegrade && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              รีเกรด
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">{sub.nameTh}</div>
                        {sub.nameEn && (
                          <div className="text-[10px] text-slate-400">{sub.nameEn}</div>
                        )}
                        {sub.note && (
                          <div className="text-[10px] text-amber-500 mt-0.5 line-clamp-1">
                            {sub.note}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {sub.credits}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{sub.category}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        {sub.semester}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sub.status === 'passed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            🟢 ผ่าน
                          </span>
                        )}
                        {sub.status === 'enrolled' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            🟡 กำลังเรียน
                          </span>
                        )}
                        {sub.status === 'not_taken' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            ⬜ ยังไม่เรียน
                          </span>
                        )}
                        {sub.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            🔴 ไม่ผ่าน
                          </span>
                        )}
                        {sub.status === 'regrade' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            🔄 ลงซ้ำ/รีเกรด
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sub.grade ? (
                          <span
                            className={`inline-block w-7 py-0.5 rounded font-black text-center ${
                              sub.grade === 'A'
                                ? 'bg-emerald-500 text-white'
                                : sub.grade === 'B+' || sub.grade === 'B'
                                ? 'bg-sky-500 text-white'
                                : sub.grade === 'C+' || sub.grade === 'C'
                                ? 'bg-blue-500 text-white'
                                : sub.grade === 'D+' || sub.grade === 'D'
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {sub.grade}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Re-grade Button */}
                          {(sub.grade === 'D' || sub.grade === 'D+') && !sub.isRegrade && (
                            <button
                              onClick={() => handleOpenRegradeModal(sub)}
                              className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-500 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1"
                              title="รีเกรดวิชานี้ (เฉพาะ D/D+)"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>รีเกรด</span>
                            </button>
                          )}

                          {/* Disabled Regrade tooltip for C or higher */}
                          {(sub.grade === 'A' ||
                            sub.grade === 'B+' ||
                            sub.grade === 'B' ||
                            sub.grade === 'C+' ||
                            sub.grade === 'C') && (
                            <button
                              onClick={() =>
                                alert(
                                  `❌ ไม่สามารถรีเกรดวิชา ${sub.code} ได้!\nเกรดปัจจุบันคือ ${sub.grade}\nตามระเบียบมหาวิทยาลัยรามคำแหง วิชาที่ได้เกรด C ขึ้นไป ไม่อนุญาตให้รีเกรดได้`
                                )
                              }
                              className="px-1.5 py-1 rounded text-slate-300 hover:text-slate-500 text-[10px]"
                              title="วิชาที่ได้ C ขึ้นไป ไม่สามารถรีเกรดได้"
                            >
                              🔒 C+ ไม่ให้รี
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingSubject(sub);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="แก้ไขวิชา"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSubject(sub.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="ลบวิชา"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regrade Confirmation Modal with strict RU policy explanation */}
      {regradeSubjectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ยืนยันการลงทะเบียนรีเกรด (ม.รามคำแหง)
                </h3>
                <p className="text-xs text-slate-400">
                  วิชา {regradeSubjectTarget.code} - {regradeSubjectTarget.nameTh}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>คำเตือนสำคัญเกี่ยวกับสิทธิ์เกียรตินิยม:</span>
              </div>
              <p className="leading-relaxed">
                เกรดปัจจุบันของวิชานี้คือ <strong>{regradeSubjectTarget.grade}</strong> (อยู่ในเกณฑ์ D/D+ ซึ่งอนุญาตให้รีเกรดได้)
                <br /><br />
                ⚠️ หากท่านยืนยันที่จะลงทะเบียนรีเกรดวิชานี้ ระบบจะทำเครื่องหมายว่ามีการรีเกรด ซึ่งตามระเบียบมหาวิทยาลัยรามคำแหง <strong>ท่านจะหมดสิทธิ์ได้รับเกียรตินิยมทุกกรณีทันที</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                เลือกภาคเรียนที่จะลงทะเบียนรีเกรด:
              </label>
              <input
                type="text"
                value={regradeTargetSemester}
                onChange={(e) => setRegradeTargetSemester(e.target.value)}
                placeholder="เช่น 1/2569 หรือ 2/2569"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRegradeSubjectTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmRegrade}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow transition"
              >
                ยืนยันลงทะเบียนรีเกรด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      {isAddModalOpen && (
        <SubjectFormModal
          subject={editingSubject}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingSubject(null);
          }}
          onSave={(subData) => {
            if (editingSubject) {
              onUpdateSubject({ ...editingSubject, ...subData });
            } else {
              onAddSubject({
                id: `sub-${Date.now()}`,
                ...subData,
              });
            }
            setIsAddModalOpen(false);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
};

interface SubjectFormModalProps {
  subject: Subject | null;
  onClose: () => void;
  onSave: (data: Omit<Subject, 'id'>) => void;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({ subject, onClose, onSave }) => {
  const [code, setCode] = useState(subject?.code || '');
  const [nameTh, setNameTh] = useState(subject?.nameTh || '');
  const [nameEn, setNameEn] = useState(subject?.nameEn || '');
  const [credits, setCredits] = useState<number>(subject?.credits || 3);
  const [category, setCategory] = useState(subject?.category || 'หมวดวิชาศึกษาทั่วไป');
  const [semester, setSemester] = useState(subject?.semester || '1/2569');
  const [status, setStatus] = useState<SubjectStatus>(subject?.status || 'enrolled');
  const [grade, setGrade] = useState<GradeType>(subject?.grade || '');
  const [score, setScore] = useState<number | undefined>(subject?.score);
  const [isRegrade, setIsRegrade] = useState<boolean>(subject?.isRegrade || false);
  const [note, setNote] = useState(subject?.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !nameTh.trim()) {
      alert('กรุณากรอกรหัสวิชาและชื่อวิชา');
      return;
    }
    onSave({
      code: code.trim().toUpperCase(),
      nameTh: nameTh.trim(),
      nameEn: nameEn.trim(),
      credits,
      category,
      semester: semester.trim(),
      status,
      grade,
      score,
      isRegrade,
      note,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {subject ? 'แก้ไขข้อมูลรายวิชา' : 'เพิ่มรายวิชาใหม่ (ม.รามคำแหง)'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            ✕ ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                รหัสวิชา (เช่น RAM1111, ACC1101) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="RAM1111"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                จำนวนหน่วยกิต *
              </label>
              <input
                type="number"
                min="1"
                max="9"
                required
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อวิชา (ภาษาไทย) *
            </label>
            <input
              type="text"
              required
              value={nameTh}
              onChange={(e) => setNameTh(e.target.value)}
              placeholder="ความรู้คู่คุณธรรมเพื่อการดำเนินชีวิต"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อวิชา (ภาษาอังกฤษ)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Morality and Knowledge for Living"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                หมวดวิชา *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                <option value="หมวดวิชาศึกษาทั่วไป">หมวดวิชาศึกษาทั่วไป</option>
                <option value="หมวดวิชาแกน">หมวดวิชาแกน</option>
                <option value="หมวดวิชาเอก">หมวดวิชาเอก</option>
                <option value="หมวดวิชาเอกเลือก">หมวดวิชาเอกเลือก</option>
                <option value="หมวดวิชาโท">หมวดวิชาโท</option>
                <option value="หมวดวิชาเลือกเสรี">หมวดวิชาเลือกเสรี</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ภาคเรียน *
              </label>
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="1/2569"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                สถานะวิชา *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubjectStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                <option value="enrolled">🟡 กำลังเรียน</option>
                <option value="passed">🟢 ผ่านแล้ว</option>
                <option value="not_taken">⬜ ยังไม่เรียน</option>
                <option value="failed">🔴 ไม่ผ่าน</option>
                <option value="regrade">🔄 ลงซ้ำ/รีเกรด</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                เกรดที่ได้
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              >
                <option value="">- ยังไม่ออก -</option>
                <option value="A">A (4.0)</option>
                <option value="B+">B+ (3.5)</option>
                <option value="B">B (3.0)</option>
                <option value="C+">C+ (2.5)</option>
                <option value="C">C (2.0)</option>
                <option value="D+">D+ (1.5)</option>
                <option value="D">D (1.0)</option>
                <option value="F">F (0.0)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                คะแนนรวม (เต็ม 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score !== undefined ? score : ''}
                onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="เช่น 85"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isRegradeCheck"
              checked={isRegrade}
              onChange={(e) => setIsRegrade(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isRegradeCheck" className="text-xs text-slate-700 dark:text-slate-300">
              วิชานี้เป็นการลงทะเบียนรีเกรด (ทำเครื่องหมายนี้จะทำให้หมดสิทธิ์เกียรตินิยม)
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              หมายเหตุ
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม เช่น ห้องสอบ หรือแนวข้อสอบ"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
