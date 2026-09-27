import React from 'react';
import { Subject, StudentProfile } from '../types';
import { RAMKHAMHAENG_FACULTIES } from '../data/faculties';
import {
  CheckCircle2,
  GraduationCap,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GraduationCheckViewProps {
  profile: StudentProfile;
  subjects: Subject[];
  earnedCredits: number;
}

export const GraduationCheckView: React.FC<GraduationCheckViewProps> = ({
  profile,
  subjects,
  earnedCredits,
}) => {
  // Find current faculty and major configuration
  const faculty = RAMKHAMHAENG_FACULTIES.find((f) => f.name === profile.faculty);
  const major = faculty?.majors.find((m) => m.name === profile.major);

  // Categories list
  const defaultCategories = major?.categories || [
    { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
    { name: 'หมวดวิชาแกน', credits: 36, color: 'bg-indigo-600' },
    { name: 'หมวดวิชาเอก', credits: 60, color: 'bg-amber-600' },
    { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
  ];

  // Calculate earned credits per category
  const categoryStats = defaultCategories.map((cat) => {
    const passedInCat = subjects.filter(
      (s) => s.category.includes(cat.name) || cat.name.includes(s.category)
    );
    const earnedInCat = passedInCat
      .filter((s) => s.status === 'passed')
      .reduce((sum, s) => sum + s.credits, 0);

    const enrolledInCat = passedInCat
      .filter((s) => s.status === 'enrolled')
      .reduce((sum, s) => sum + s.credits, 0);

    const percent = Math.min(100, Math.round((earnedInCat / cat.credits) * 100));
    const isCompleted = earnedInCat >= cat.credits;

    return {
      ...cat,
      earned: earnedInCat,
      enrolled: enrolledInCat,
      percent,
      isCompleted,
      remaining: Math.max(0, cat.credits - earnedInCat),
    };
  });

  const totalRequired = profile.totalCreditsRequired || 132;
  const overallPercent = Math.min(100, Math.round((earnedCredits / totalRequired) * 100));
  const remainingTotal = Math.max(0, totalRequired - earnedCredits);

  // Senior graduating threshold (Ramkhamhaeng rule: remaining <= 30 credits in regular term)
  const canRequestGraduation = remainingTotal <= 30;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            <span>🎯 ระบบตรวจสอบการจบการศึกษา (Curriculum Check)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {profile.faculty} • {profile.major} (หลักสูตร {profile.totalCreditsRequired} หน่วยกิต)
          </p>
        </div>
      </div>

      {/* Graduation Senior Banner (กาขอจบ) */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          canRequestGraduation
            ? 'bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border-amber-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${
              canRequestGraduation ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-400'
            }`}
          >
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                {canRequestGraduation
                  ? 'คุณมีสิทธิ์ทำเรื่อง "กาขอจบการศึกษา" แล้ว! 🎉'
                  : 'ยังอยู่ในระหว่างสะสมหน่วยกิต'}
              </span>
              {canRequestGraduation && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                  เหลือ ≤ 30 นก.
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {canRequestGraduation
                ? `ขณะนี้คุณเหลือหน่วยกิตที่ต้องเรียนอีกเพียง ${remainingTotal} หน่วยกิต ซึ่งไม่เกิน 30 หน่วยกิต สามารถลงทะเบียนได้สูงสุด 30 นก. ในภาคปกติ!`
                : `เหลือหน่วยกิตที่ต้องเรียนอีก ${remainingTotal} หน่วยกิต (ต้องเหลือไม่เกิน 30 หน่วยกิต จึงจะสามารถใช้สิทธิ์กาขอจบได้)`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-slate-500">ความสำเร็จภาพรวม</div>
          <div className="text-3xl font-black text-amber-500 font-mono mt-0.5">
            {overallPercent}%
          </div>
        </div>
      </div>

      {/* Visual Category Progress Bars (Requested in Brief) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>ความคืบหน้าแยกตามหมวดวิชาหลักสูตร</span>
          </h2>
          <span className="text-xs text-slate-400">
            {earnedCredits} / {totalRequired} หน่วยกิต
          </span>
        </div>

        <div className="space-y-5">
          {categoryStats.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {cat.name}
                  </span>
                  {cat.isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านครบแล้ว ✅
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      (ขาดอีก {cat.remaining} หน่วยกิต)
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-amber-500">{cat.earned}</span> / {cat.credits} นก.{' '}
                  <span className="text-slate-400">({cat.percent}%)</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    cat.isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>

              {/* Text visual bar (as in prompt ASCII style) */}
              <div className="font-mono text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                <span>
                  [{cat.isCompleted ? '████████████████' : '████████░░░░░░'}] {cat.earned}/{cat.credits}
                </span>
                {cat.enrolled > 0 && (
                  <span className="text-amber-500 font-sans">
                    + กำลังเรียน {cat.enrolled} นก.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graduation Requirements Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          รายการตรวจสอบเงื่อนไขการสำเร็จการศึกษา (RU Graduation Checklist)
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                earnedCredits >= totalRequired ? 'text-emerald-500' : 'text-slate-400'
              }`}
            />
            <div className="flex-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                สะสมหน่วยกิตครบตามหลักสูตร ({totalRequired} หน่วยกิต)
              </span>
              <p className="text-slate-500 text-[11px]">
                ปัจจุบันสอบผ่านแล้ว {earnedCredits} หน่วยกิต ({overallPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                เกรดเฉลี่ยสะสม (GPAX) ไม่ต่ำกว่า 2.00
              </span>
              <p className="text-slate-500 text-[11px]">
                เกณฑ์ขั้นต่ำของมหาวิทยาลัยรามคำแหงเพื่อขอรับปริญญาบัตร
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                ผ่านการทดสอบสมรรถนะภาษาอังกฤษ (RU-TEP หรือเทียบเท่า)
              </span>
              <p className="text-slate-500 text-[11px]">
                ตามเกณฑ์มาตรฐานการศึกษาของสำนักงานคณะกรรมการการอุดมศึกษา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                ยื่นคำร้องแจ้งจบการศึกษาและขึ้นทะเบียนบัณฑิต
              </span>
              <p className="text-slate-500 text-[11px]">
                ดำเนินการที่คณะและสำนักบริการทางวิชาการและทดสอบประเมินผล (สวป.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
