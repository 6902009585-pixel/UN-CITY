import React, { useState } from 'react';
import { StudentProfile, Subject } from '../types';
import {
  Map,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
} from 'lucide-react';

interface StudyPlanViewProps {
  profile: StudentProfile;
  subjects: Subject[];
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ profile, subjects }) => {
  const [targetYears, setTargetYears] = useState<number>(profile.graduationTargetYears || 3);

  // Typical RU fast-track 3-Year / 4-Year credit allocation
  const getPaceRecommendation = (years: number, total: number) => {
    if (years === 3) {
      return [
        { year: 1, label: 'ปี 1', credits: 45, desc: 'ภาค 1 (21-22 นก.) + ภาค 2 (18-21 นก.) + Summer (6-9 นก.)' },
        { year: 2, label: 'ปี 2', credits: 45, desc: 'ภาค 1 (21-22 นก.) + ภาค 2 (18-21 นก.) + Summer (6-9 นก.)' },
        { year: 3, label: 'ปี 3', credits: Math.max(0, total - 90), desc: 'ภาค 1 (21 นก.) + ภาค 2 (กาขอจบสูงสุด 30 นก.)' },
      ];
    } else if (years === 2.5) {
      return [
        { year: 1, label: 'ปี 1', credits: 53, desc: 'ภาค 1 (22 นก.) + ภาค 2 (22 นก.) + Summer (9 นก.)' },
        { year: 2, label: 'ปี 2', credits: 53, desc: 'ภาค 1 (22 นก.) + ภาค 2 (22 นก.) + Summer (9 นก.)' },
        { year: 3, label: 'ปี 3 (ภาค 1)', credits: Math.max(0, total - 106), desc: 'กาขอจบ 26-30 หน่วยกิต สำเร็จการศึกษาใน 2 ปีครึ่ง' },
      ];
    } else {
      const perYear = Math.ceil(total / 4);
      return [
        { year: 1, label: 'ปี 1', credits: perYear, desc: 'ภาค 1 (18 นก.) + ภาค 2 (18 นก.)' },
        { year: 2, label: 'ปี 2', credits: perYear, desc: 'ภาค 1 (18 นก.) + ภาค 2 (18 นก.)' },
        { year: 3, label: 'ปี 3', credits: perYear, desc: 'ภาค 1 (18 นก.) + ภาค 2 (18 นก.)' },
        { year: 4, label: 'ปี 4', credits: Math.max(0, total - perYear * 3), desc: 'ภาค 1 (15 นก.) + ภาค 2 (15 นก.) ขอจบการศึกษา' },
      ];
    }
  };

  const planYears = getPaceRecommendation(targetYears, profile.totalCreditsRequired);
  const totalPlanned = planYears.reduce((sum, p) => sum + p.credits, 0);

  // Group real subjects by academic year
  const passedSubs = subjects.filter((s) => s.status === 'passed');
  const enrolledSubs = subjects.filter((s) => s.status === 'enrolled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-amber-500" />
            <span>🗺️ แผนการเรียนจนจบการศึกษา (Graduation RoadMap)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            วางแผนกระจายหน่วยกิตแต่ละชั้นปีเพื่อจบตามเป้าหมาย (2.5 ปี / 3 ปี / 4 ปี)
          </p>
        </div>

        {/* Target Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            แผนเป้าหมาย:
          </label>
          <select
            value={targetYears}
            onChange={(e) => setTargetYears(parseFloat(e.target.value))}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <option value={2.5}>🚀 จบภายใน 2.5 ปี (Fast-Track)</option>
            <option value={3}>🎯 จบภายใน 3 ปี (ยอดนิยม)</option>
            <option value={4}>🎓 จบภายใน 4 ปี (ตามมาตรฐาน)</option>
          </select>
        </div>
      </div>

      {/* Target Summary Banner (Directly matches prompt example) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>สรุปแผนการสะสมหน่วยกิต</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              เป้าหมาย: จบภายใน {targetYears} ปี ({profile.totalCreditsRequired} หน่วยกิต)
            </h2>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
            <span className="text-[11px] text-slate-400">หน่วยกิตตามหลักสูตร</span>
            <div className="text-xl font-black text-amber-400 font-mono">
              {profile.totalCreditsRequired} นก.
            </div>
          </div>
        </div>

        {/* ASCII/Visual Layout from Brief */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          {planYears.map((p) => (
            <div key={p.year} className="flex justify-between items-center">
              <span>{p.label} : {p.desc}</span>
              <span className="font-bold text-amber-400">{p.credits} หน่วยกิต</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-700/80 flex justify-between items-center font-bold text-white text-sm">
            <span>รวมทั้งหมดตามแผน</span>
            <span className="text-amber-400">{totalPlanned} หน่วยกิต</span>
          </div>
        </div>
      </div>

      {/* Year-by-Year Semester Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planYears.map((py) => (
          <div
            key={py.year}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  Y{py.year}
                </span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {py.label}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">
                เป้า {py.credits} นก.
              </span>
            </div>

            <div className="space-y-3">
              {/* Term 1 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>ภาค 1 (Regular)</span>
                  <span className="text-slate-500 font-mono">18 - 22 นก.</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ลงทะเบียนเต็มพิกัด 22 หน่วยกิต (วิชาศึกษาทั่วไปและวิชาแกน)
                </p>
              </div>

              {/* Term 2 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>ภาค 2 (Regular)</span>
                  <span className="text-slate-500 font-mono">18 - 22 นก.</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ลงทะเบียนวิชาแกนและวิชาเอกบังคับต่อเนื่อง
                </p>
              </div>

              {/* Summer */}
              <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
                <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>ภาคฤดูร้อน (Summer)</span>
                  <span className="font-mono">6 - 9 นก.</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  ลงเก็บวิชาเลือกเสรีหรือศึกษาทั่วไป เพื่อตัดชั่วโมงเรียนในภาคปกติ
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
