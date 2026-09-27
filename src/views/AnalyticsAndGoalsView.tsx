import React, { useState } from 'react';
import { Subject, StudyLog, StudentProfile, AssignmentItem } from '../types';
import { calculateGPA } from '../utils/gradeCalculations';
import {
  BarChart3,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AnalyticsAndGoalsViewProps {
  profile: StudentProfile;
  subjects: Subject[];
  studyLogs: StudyLog[];
  assignments: AssignmentItem[];
}

export const AnalyticsAndGoalsView: React.FC<AnalyticsAndGoalsViewProps> = ({
  profile,
  subjects,
  studyLogs,
  assignments,
}) => {
  // Goal states
  const [targetGpa, setTargetGpa] = useState<number>(3.5);
  const [targetStudyHours, setTargetStudyHours] = useState<number>(100);

  // Semesters stats
  const semesters = Array.from(new Set(subjects.map((s) => s.semester))).filter(Boolean);

  const termStats = semesters.map((sem) => {
    const semSubs = subjects.filter((s) => s.semester === sem);
    const gpaInfo = calculateGPA(semSubs);
    return {
      semester: sem,
      gpa: gpaInfo.gpa,
      credits: gpaInfo.totalCredits,
      earnedCredits: gpaInfo.earnedCredits,
    };
  });

  const passedCount = subjects.filter((s) => s.status === 'passed').length;
  const failedCount = subjects.filter((s) => s.status === 'failed' || s.grade === 'F').length;
  const enrolledCount = subjects.filter((s) => s.status === 'enrolled').length;

  const totalReadingMinutes = studyLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalReadingHours = Math.round((totalReadingMinutes / 60) * 10) / 10;

  const submittedAssignments = assignments.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  ).length;
  const assignmentRate =
    assignments.length > 0 ? Math.round((submittedAssignments / assignments.length) * 100) : 100;

  const currentGpaInfo = calculateGPA(subjects);
  const curriculumPercent = Math.min(
    100,
    Math.round((currentGpaInfo.earnedCredits / profile.totalCreditsRequired) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            <span>📈 สถิติการเรียน & 🧠 ระบบเป้าหมาย (Analytics & Goals)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            วิเคราะห์แนวโน้มผลการเรียน ชั่วโมงอ่านหนังสือ และติดตามเป้าหมายการจบการศึกษา
          </p>
        </div>
      </div>

      {/* Target Goals Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Target className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            เป้าหมายการเรียนของฉัน (Personal Study Goals)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Goal 1: Degree */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="text-xs text-slate-500 font-medium">🎓 จบปริญญาตรี</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.graduationTargetYears} ปี ({profile.targetGradSemester})
            </div>
            <div className="text-xs text-slate-400">
              ความคืบหน้าสะสม: <strong className="text-amber-500">{curriculumPercent}%</strong>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${curriculumPercent}%` }} />
            </div>
          </div>

          {/* Goal 2: Target GPA */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>📈 GPA เป้าหมาย</span>
              <span className="font-mono text-amber-500 font-bold">{targetGpa.toFixed(2)}</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ปัจจุบัน {currentGpaInfo.gpa.toFixed(2)}
            </div>
            <input
              type="range"
              min="2.0"
              max="4.0"
              step="0.05"
              value={targetGpa}
              onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="text-[10px] text-slate-400">
              {currentGpaInfo.gpa >= targetGpa ? '🎉 ถึงเป้าหมายที่ตั้งไว้แล้ว!' : `ต้องการอีก ${(targetGpa - currentGpaInfo.gpa).toFixed(2)}`}
            </div>
          </div>

          {/* Goal 3: Credits */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="text-xs text-slate-500 font-medium">📚 หน่วยกิตเป้าหมาย</div>
            <div className="text-xl font-bold text-sky-500 font-mono">
              {currentGpaInfo.earnedCredits} / {profile.totalCreditsRequired}
            </div>
            <div className="text-xs text-slate-400">
              เหลืออีก <strong className="text-slate-700 dark:text-slate-300">{Math.max(0, profile.totalCreditsRequired - currentGpaInfo.earnedCredits)}</strong> หน่วยกิต
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${curriculumPercent}%` }} />
            </div>
          </div>

          {/* Goal 4: Reading Hours */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>⏱️ ชั่วโมงอ่านหนังสือ</span>
              <span className="font-mono text-emerald-500 font-bold">{targetStudyHours} ชม.</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {totalReadingHours} ชม.
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalReadingHours / targetStudyHours) * 100))}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">
              {Math.min(100, Math.round((totalReadingHours / targetStudyHours) * 100))}% ของเป้าหมาย
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Term GPA Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>แนวโน้ม GPA แต่ละภาคเรียน</span>
          </h3>

          <div className="space-y-3 pt-2">
            {termStats.map((t) => (
              <div key={t.semester} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="font-mono text-slate-700 dark:text-slate-300">ภาค {t.semester}</span>
                  <span className="font-mono text-amber-500 font-bold">{t.gpa.toFixed(2)} ({t.earnedCredits} นก.)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (t.gpa / 4.0) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Pass vs Fail Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <span>สถิติผลการสอบและสถานะวิชา</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">วิชาที่สอบผ่าน</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{passedCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">กำลังเรียน</span>
              <div className="text-2xl font-black text-amber-500 mt-1">{enrolledCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">ไม่ผ่าน (F)</span>
              <div className="text-2xl font-black text-rose-500 mt-1">{failedCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">ส่งงานตรงเวลา</span>
              <div className="text-2xl font-black text-blue-500 mt-1">{assignmentRate}%</div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">เวลาอ่านสะสม</span>
              <div className="text-2xl font-black text-indigo-500 mt-1">{totalReadingHours} ชม.</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">ความคืบหน้าจบ</span>
              <div className="text-2xl font-black text-purple-500 mt-1">{curriculumPercent}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
