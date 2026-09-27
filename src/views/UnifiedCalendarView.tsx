import React, { useState } from 'react';
import { ScheduleItem, ExamItem, AssignmentItem, StudyLog, ExpenseItem } from '../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  DollarSign,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface UnifiedCalendarViewProps {
  schedule: ScheduleItem[];
  exams: ExamItem[];
  assignments: AssignmentItem[];
  studyLogs: StudyLog[];
  expenses: ExpenseItem[];
}

export const UnifiedCalendarView: React.FC<UnifiedCalendarViewProps> = ({
  schedule,
  exams,
  assignments,
  studyLogs,
  expenses,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month days calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const monthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  // Helper to get events for a date string YYYY-MM-DD
  const getEventsForDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const dayOfWeekNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayName = dayOfWeekNames[dateObj.getDay()];

    const dayExams = exams.filter((e) => e.examDate === dateStr);
    const dayAssignments = assignments.filter((a) => a.dueDate === dateStr);
    const dayStudyLogs = studyLogs.filter((s) => s.date === dateStr);
    const dayExpenses = expenses.filter((ex) => ex.date === dateStr);

    return { dayExams, dayAssignments, dayStudyLogs, dayExpenses, dayName };
  };

  const selectedEvents = getEventsForDate(selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-amber-500" />
            <span>📆 ปฏิทินรวมการเรียน (Unified Calendar)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            รวบรวมวันสอบไล่ กำหนดส่งงาน บันทึกเวลาอ่านหนังสือ และวันชำระค่าธรรมเนียมในที่เดียว
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> สอบไล่
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> กำหนดส่งงาน
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> อ่านหนังสือ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> ค่าใช้จ่าย
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {year + 543}
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
              >
                วันนี้
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-rose-500">อา.</span>
            <span>จ.</span>
            <span>อ.</span>
            <span>พ.</span>
            <span>พฤ.</span>
            <span>ศ.</span>
            <span className="text-indigo-400">ส.</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {/* Blank offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const isToday =
                new Date().toISOString().split('T')[0] === dateStr;

              const events = getEventsForDate(dateStr);
              const hasExams = events.dayExams.length > 0;
              const hasAssignments = events.dayAssignments.length > 0;
              const hasStudy = events.dayStudyLogs.length > 0;
              const hasExpenses = events.dayExpenses.length > 0;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border text-left flex flex-col justify-between transition group relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/10 shadow-sm'
                      : isToday
                      ? 'border-sky-500 bg-sky-500/5'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[11px]'
                          : isSelected
                          ? 'text-amber-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  {/* Colored dots indicators */}
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {hasExams && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" title="มีสอบ" />
                    )}
                    {hasAssignments && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" title="ส่งงาน" />
                    )}
                    {hasStudy && (
                      <span className="w-2 h-2 rounded-full bg-sky-500 ring-1 ring-white" title="อ่านหนังสือ" />
                    )}
                    {hasExpenses && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" title="ชำระเงิน" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Activity Sidebar (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              กิจกรรมประจำวัน
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {new Date(selectedDateStr).toLocaleDateString('th-TH', {
                dateStyle: 'full',
              })}
            </h3>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {/* Exams on this day */}
            {selectedEvents.dayExams.map((exam) => (
              <div
                key={exam.id}
                className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                    สอบไล่ ม.ร.
                  </span>
                  <span className="font-mono text-slate-500">{exam.examTime}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {exam.subjectCode} - {exam.subjectName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  ห้อง {exam.room} ({exam.building})
                </div>
              </div>
            ))}

            {/* Assignments due */}
            {selectedEvents.dayAssignments.map((asg) => (
              <div
                key={asg.id}
                className="p-3 rounded-xl border border-amber-400/30 bg-amber-400/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                    กำหนดส่งงาน
                  </span>
                  <span className="font-mono text-amber-500 font-bold">
                    {asg.subjectCode}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {asg.title}
                </div>
              </div>
            ))}

            {/* Study sessions */}
            {selectedEvents.dayStudyLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-sky-500/20 bg-sky-500/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white">
                    อ่านหนังสือ
                  </span>
                  <span className="font-bold text-sky-500">{log.durationMinutes} นาที</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {log.subjectCode} • {log.chapterInfo}
                </div>
                {log.notes && (
                  <div className="text-slate-500 text-[11px]">{log.notes}</div>
                )}
              </div>
            ))}

            {/* Expenses */}
            {selectedEvents.dayExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                    ค่าใช้จ่าย
                  </span>
                  <span className="font-mono font-bold text-emerald-500">
                    {exp.amount.toLocaleString()} บาท
                  </span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {exp.title}
                </div>
              </div>
            ))}

            {selectedEvents.dayExams.length === 0 &&
              selectedEvents.dayAssignments.length === 0 &&
              selectedEvents.dayStudyLogs.length === 0 &&
              selectedEvents.dayExpenses.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  ไม่มีกิจกรรมหรือกำหนดการในวันนี้
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
