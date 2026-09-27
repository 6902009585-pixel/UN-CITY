import React, { useState } from 'react';
import { AssignmentItem, Subject } from '../types';
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface AssignmentsViewProps {
  assignments: AssignmentItem[];
  subjects: Subject[];
  onAddAssignment: (item: AssignmentItem) => void;
  onUpdateAssignment: (item: AssignmentItem) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  subjects,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'todo' | 'in_progress' | 'submitted' | 'graded'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New assignment form
  const [newTitle, setNewTitle] = useState('');
  const [newSubCode, setNewSubCode] = useState(subjects[0]?.code || 'MGT3101');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxScore, setNewMaxScore] = useState(20);
  const [newStatus, setNewStatus] = useState<'todo' | 'in_progress' | 'submitted' | 'graded'>('todo');
  const [newNotes, setNewNotes] = useState('');

  const filteredAssignments = assignments.filter((a) => {
    if (selectedFilter !== 'all' && a.status !== selectedFilter) return false;
    if (selectedSubject !== 'all' && a.subjectCode !== selectedSubject) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      alert('กรุณากรอกชื่องานและวันกำหนดส่ง');
      return;
    }
    const item: AssignmentItem = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      subjectCode: newSubCode,
      description: newDescription,
      startDate: newStartDate,
      dueDate: newDueDate,
      maxScore: newMaxScore,
      status: newStatus,
      notes: newNotes,
    };
    onAddAssignment(item);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const getStatusBadge = (status: AssignmentItem['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">ส่งแล้ว</span>;
      case 'graded':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">ตรวจแล้ว</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30">กำลังทำ</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">ยังไม่เริ่ม</span>;
    }
  };

  // Group by subjects for clean view
  const subjectCodes = Array.from(new Set(assignments.map((a) => a.subjectCode)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-500" />
            <span>📌 ระบบงานและการบ้าน (Assignments Tracker)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            บันทึกการบ้าน รายงาน โครงงาน แยกตามรายวิชา พร้อมกำหนดส่งและบันทึกคะแนน
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มงานใหม่</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ทั้งหมด ({assignments.length})
          </button>
          <button
            onClick={() => setSelectedFilter('todo')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'todo'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ยังไม่เริ่ม ({assignments.filter((a) => a.status === 'todo').length})
          </button>
          <button
            onClick={() => setSelectedFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'in_progress'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            กำลังทำ ({assignments.filter((a) => a.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setSelectedFilter('submitted')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedFilter === 'submitted'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ส่งแล้ว ({assignments.filter((a) => a.status === 'submitted').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">กรองวิชา:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            <option value="all">ทุกวิชา</option>
            {subjectCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped by Subjects View */}
      <div className="space-y-6">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            ไม่พบรายการงานตามเงื่อนไขที่เลือก
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30">
                      {asg.subjectCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {asg.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(asg.status)}
                    <button
                      onClick={() => onDeleteAssignment(asg.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {asg.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {asg.description}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>
                      ส่งภายใน: {new Date(asg.dueDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {asg.score !== undefined ? `${asg.score} / ` : ''}{asg.maxScore} คะแนน
                    </span>

                    <button
                      onClick={() => {
                        const next =
                          asg.status === 'todo'
                            ? 'in_progress'
                            : asg.status === 'in_progress'
                            ? 'submitted'
                            : 'graded';
                        onUpdateAssignment({ ...asg, status: next });
                      }}
                      className="text-[11px] text-amber-500 hover:underline font-medium"
                    >
                      เปลี่ยนสถานะ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              เพิ่มงาน / การบ้านใหม่
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  วิชา *
                </label>
                <select
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.code} - {s.nameTh}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่องาน / หัวข้อ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น กรณีศึกษาระบบคลังสินค้า หรือ รายงาน SWOT"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รายละเอียด / คำสั่ง
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="รายละเอียดงาน ความยาว หรือรูปแบบการส่ง"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    วันกำหนดส่ง *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    คะแนนเต็ม
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
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
                  เพิ่มงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
