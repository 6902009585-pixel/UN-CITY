import React, { useState } from 'react';
import { Subject, GradeType, HonorsStatus } from '../types';
import { calculateGPA, GRADE_POINTS } from '../utils/gradeCalculations';
import {
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Info,
} from 'lucide-react';

interface GradesGpaViewProps {
  subjects: Subject[];
  honorsStatus: HonorsStatus;
  cumulativeGpa: number;
  earnedCredits: number;
}

export const GradesGpaView: React.FC<GradesGpaViewProps> = ({
  subjects,
  honorsStatus,
  cumulativeGpa,
  earnedCredits,
}) => {
  // Group subjects by semester
  const semesters = Array.from(new Set(subjects.map((s) => s.semester))).filter(Boolean);

  const [expandedSemester, setExpandedSemester] = useState<string>(semesters[0] || '');

  // Grade distributions
  const gradeCounts: Record<string, number> = {
    A: 0,
    'B+': 0,
    B: 0,
    'C+': 0,
    C: 0,
    'D+': 0,
    D: 0,
    F: 0,
  };

  subjects.forEach((s) => {
    if (s.grade && gradeCounts[s.grade] !== undefined) {
      gradeCounts[s.grade]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>🎓 ระบบเกรด & GPA มหาวิทยาลัยรามคำแหง</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            รายงานผลการเรียนรายภาค GPA สะสม หน่วยกิตสะสม และตรวจสอบคุณสมบัติเกียรตินิยม
          </p>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500">เกรดเฉลี่ยสะสม (GPAX)</div>
          <div className="mt-2 text-3xl font-black text-amber-500 font-mono">
            {cumulativeGpa.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-slate-400">จากคะแนนเต็ม 4.00</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500">หน่วยกิตสะสมที่ผ่านแล้ว</div>
          <div className="mt-2 text-3xl font-black text-sky-500 font-mono">
            {earnedCredits}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {subjects.filter((s) => s.status === 'passed').length} รายวิชา
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-500">สถานะเกียรตินิยม</div>
          <div
            className={`mt-2 text-base font-bold truncate ${
              honorsStatus.isEligible ? 'text-emerald-500' : 'text-slate-400'
            }`}
          >
            {honorsStatus.honorsTitle}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {honorsStatus.isEligible ? 'เข้าเกณฑ์ระเบียบ ม.ร.' : honorsStatus.disqualifyReasons[0]}
          </div>
        </div>
      </div>

      {/* Honors Rules Detail Banner */}
      <div
        className={`p-5 rounded-2xl border text-xs space-y-2 ${
          honorsStatus.isEligible
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 font-bold text-sm">
          <Award className="w-5 h-5 text-amber-500" />
          <span>เกณฑ์การได้รับเกียรตินิยม มหาวิทยาลัยรามคำแหง:</span>
        </div>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          1. <strong>เกียรตินิยมอันดับหนึ่ง:</strong> GPAX สะสมไม่ต่ำกว่า <strong>3.50</strong><br />
          2. <strong>เกียรตินิยมอันดับสอง:</strong> GPAX สะสมไม่ต่ำกว่า <strong>3.25</strong><br />
          3. <strong>ข้อห้ามสำคัญ:</strong> ต้องไม่เคยได้รับเกรด <strong>F</strong> ในรายวิชาใด และต้องไม่เคยลงทะเบียน <strong>รีเกรด (Re-grade)</strong> วิชาที่เคยได้ D หรือ D+ เพื่อปรับเกรด รวมทั้งต้องสำเร็จการศึกษาภายในระยะเวลาที่กำหนด (ไม่เกิน 4 ปีการศึกษา)
        </p>
      </div>

      {/* Grade Distribution Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          การกระจายตัวของเกรดที่ได้รับ (Grade Breakdown)
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center">
          {Object.entries(gradeCounts).map(([gr, count]) => (
            <div
              key={gr}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <div className="text-base font-black font-mono text-slate-900 dark:text-white">
                {gr}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{GRADE_POINTS[gr as Exclude<GradeType, ''>].toFixed(1)} แต้ม</div>
              <div className="mt-2 text-sm font-bold text-amber-500">{count} วิชา</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Breakdown by Semester */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          <span>ประวัติผลการเรียนรายภาค (Term GPA History)</span>
        </h3>

        <div className="space-y-3">
          {semesters.map((sem) => {
            const semSubs = subjects.filter((s) => s.semester === sem);
            const semGPA = calculateGPA(semSubs);
            const isExpanded = expandedSemester === sem;

            return (
              <div
                key={sem}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSemester(isExpanded ? '' : sem)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                      ภาคเรียนที่ {sem}
                    </span>
                    <span className="text-xs text-slate-400">({semSubs.length} วิชา)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">GPA ภาคนี้:</div>
                      <div className="font-bold text-sm text-amber-500 font-mono">
                        {semGPA.gpa > 0 ? semGPA.gpa.toFixed(2) : '-'}
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-slate-500">หน่วยกิต:</div>
                      <div className="font-bold text-sm text-sky-500 font-mono">
                        {semGPA.earnedCredits} นก.
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="py-2 px-3">รหัสวิชา</th>
                          <th className="py-2 px-3">ชื่อวิชา</th>
                          <th className="py-2 px-3 text-center">หน่วยกิต</th>
                          <th className="py-2 px-3 text-center">เกรด</th>
                          <th className="py-2 px-3 text-center">แต้มคะแนน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {semSubs.map((sub) => (
                          <tr key={sub.id}>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                              {sub.code}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {sub.nameTh}
                            </td>
                            <td className="py-2.5 px-3 text-center">{sub.credits}</td>
                            <td className="py-2.5 px-3 text-center">
                              {sub.grade ? (
                                <span className="font-bold text-amber-500">{sub.grade}</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono">
                              {sub.grade && GRADE_POINTS[sub.grade] !== undefined
                                ? (GRADE_POINTS[sub.grade] * sub.credits).toFixed(1)
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
