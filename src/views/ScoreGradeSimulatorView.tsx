import React, { useState } from 'react';
import { Subject, GradeType } from '../types';
import { calculateGradeFromScore, GRADE_CRITERIA_TEXT } from '../utils/gradeCalculations';
import {
  Sparkles,
  Calculator,
  Sliders,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface ScoreGradeSimulatorViewProps {
  subjects: Subject[];
  onUpdateSubject: (subject: Subject) => void;
}

export const ScoreGradeSimulatorView: React.FC<ScoreGradeSimulatorViewProps> = ({
  subjects,
  onUpdateSubject,
}) => {
  // Select which course to simulate
  const enrolledOrGraded = subjects.filter((s) => s.status === 'enrolled' || s.status === 'passed');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    enrolledOrGraded[0]?.id || subjects[0]?.id || ''
  );

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Score breakdown states
  const [accumulatedScore, setAccumulatedScore] = useState<number>(() => {
    return (currentSubject?.homeworkScore || 15) + (currentSubject?.midtermScore || 25);
  });
  const [finalScoreInput, setFinalScoreInput] = useState<number>(40); // slider 0-60 or 0-100

  // Whenever subject selection changes, update values
  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    const sub = subjects.find((s) => s.id === id);
    if (sub) {
      const acc = (sub.homeworkScore || 0) + (sub.midtermScore || 0);
      setAccumulatedScore(acc > 0 ? acc : 20);
      setFinalScoreInput(sub.finalScore || 45);
    }
  };

  const simulatedTotalScore = Math.min(100, Math.max(0, accumulatedScore + finalScoreInput));
  const simulatedGrade = calculateGradeFromScore(simulatedTotalScore);

  // Calculate needed final score for each target grade
  const targetGrades = [
    { grade: 'A', minScore: 80 },
    { grade: 'B+', minScore: 75 },
    { grade: 'B', minScore: 70 },
    { grade: 'C+', minScore: 65 },
    { grade: 'C', minScore: 60 },
    { grade: 'D+', minScore: 55 },
    { grade: 'D', minScore: 50 },
  ];

  const handleSaveToSubject = () => {
    if (!currentSubject) return;
    onUpdateSubject({
      ...currentSubject,
      score: simulatedTotalScore,
      grade: simulatedGrade,
      finalScore: finalScoreInput,
    });
    alert(`บันทึกคะแนนรวม ${simulatedTotalScore} (เกรด ${simulatedGrade}) ให้วิชา ${currentSubject.code} เรียบร้อยแล้ว!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>📊 ระบบคะแนน & Grade Simulator (จำลองเกรด)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            คำนวณคะแนนเก็บ คะแนนกลางภาค ปลายภาค และจำลองเกรดที่จะได้รับแบบเรียลไทม์
          </p>
        </div>

        {/* Subject Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            เลือกวิชา:
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => handleSelectSubject(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.nameTh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Simulator (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-amber-500">
                      {currentSubject.code}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentSubject.nameTh}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {currentSubject.category} • {currentSubject.credits} หน่วยกิต
                  </span>
                </div>

                <button
                  onClick={handleSaveToSubject}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  บันทึกเกรดนี้ลงระบบ
                </button>
              </div>

              {/* Score Input Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    คะแนนเก็บ + สอบกลางภาค (มีแล้ว)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={accumulatedScore}
                      onChange={(e) => setAccumulatedScore(parseInt(e.target.value) || 0)}
                      className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-base text-slate-900 dark:text-white"
                    />
                    <span className="text-xs text-slate-500">คะแนน</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    รวมคะแนนเก็บ การบ้าน รายงาน และข้อสอบกลางภาค
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      คะแนนปลายภาคที่คาดว่าจะได้:
                    </label>
                    <span className="text-lg font-black font-mono text-amber-500">
                      {finalScoreInput}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={finalScoreInput}
                    onChange={(e) => setFinalScoreInput(parseInt(e.target.value) || 0)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0 คะแนน</span>
                    <span>50 คะแนน</span>
                    <span>100 คะแนน</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Result Showcase (as requested in prompt) */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    ผลการจำลองเกรด (Simulation Result)
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-slate-300 text-sm">ถ้าสอบปลายภาคได้</span>
                    <span className="text-2xl font-black text-amber-400">{finalScoreInput}</span>
                    <span className="text-slate-300 text-sm">คะแนน</span>
                  </div>
                  <div className="mt-1 text-slate-400 text-xs">
                    คะแนนเก็บ ({accumulatedScore}) + ปลายภาค ({finalScoreInput}) ={' '}
                    <strong className="text-white">{simulatedTotalScore} คะแนน</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">เกรดที่ได้คือ</div>
                    <div className="text-xs font-semibold text-emerald-400">
                      {simulatedGrade === 'F' ? 'ไม่ผ่าน (Failed)' : 'ผ่านเกณฑ์ (Passed)'}
                    </div>
                  </div>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
                      simulatedGrade === 'A'
                        ? 'bg-emerald-500 text-white'
                        : simulatedGrade === 'B+' || simulatedGrade === 'B'
                        ? 'bg-sky-500 text-white'
                        : simulatedGrade === 'C+' || simulatedGrade === 'C'
                        ? 'bg-blue-600 text-white'
                        : simulatedGrade === 'D+' || simulatedGrade === 'D'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {simulatedGrade}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Score Matrix: How much needed for each grade */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>คะแนนสอบปลายภาคที่ต้องทำให้ได้เพื่อคว้าแต่ละเกรด:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {targetGrades.map((tg) => {
                  const neededFinal = Math.max(0, tg.minScore - accumulatedScore);
                  const isAchievable = neededFinal <= 100;
                  const isAlreadyReached = accumulatedScore >= tg.minScore;

                  return (
                    <div
                      key={tg.grade}
                      className={`p-3.5 rounded-xl border text-center transition ${
                        simulatedGrade === tg.grade
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">เกรด {tg.grade}</span>
                        <span className="text-[10px] text-slate-400 font-mono">≥ {tg.minScore}</span>
                      </div>

                      <div className="my-2">
                        {isAlreadyReached ? (
                          <span className="text-xs font-bold text-emerald-500">
                            คะแนนเก็บถึงแล้ว! ✅
                          </span>
                        ) : isAchievable ? (
                          <div>
                            <span className="text-xl font-black text-amber-500 font-mono">
                              {neededFinal}
                            </span>
                            <span className="text-[11px] text-slate-500 block">คะแนนปลายภาค</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-rose-500">เกิน 100 คะแนน</span>
                        )}
                      </div>

                      <button
                        onClick={() => setFinalScoreInput(neededFinal)}
                        disabled={!isAchievable || isAlreadyReached}
                        className="w-full py-1 text-[10px] rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium hover:bg-slate-100 disabled:opacity-40"
                      >
                        ลองจำลองเกรดนี้
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Ramkhamhaeng University Grading Criteria Table (1 col) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>เกณฑ์เกรด ม.รามคำแหง (8 ระดับ)</span>
              </h3>

              <div className="space-y-1.5">
                {GRADE_CRITERIA_TEXT.map((crit) => (
                  <div
                    key={crit.grade}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                      simulatedGrade === crit.grade
                        ? 'border-amber-400 bg-amber-400/10 font-bold'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 font-black font-mono text-center text-slate-900 dark:text-white">
                        {crit.grade}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">({crit.points.toFixed(1)})</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                        {crit.desc}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {crit.scoreRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
