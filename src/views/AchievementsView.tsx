import React from 'react';
import { Achievement } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
} from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  onTriggerCelebration?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>🏆 เหรียญรางวัลความสำเร็จ (RU Achievements)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ปลดล็อกความสำเร็จในการเรียน มหาวิทยาลัยรามคำแหง
          </p>
        </div>

        <button
          onClick={triggerConfetti}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>จุดพลุฉลองความสำเร็จ 🎉</span>
        </button>
      </div>

      {/* Progress banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
            ความคืบหน้าการปลดล็อก
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            ปลดล็อกแล้ว {unlockedCount} จาก {achievements.length} รางวัล
          </div>
          <p className="text-xs text-slate-400 mt-1">
            เรียนรู้ พัฒนาตนเอง และสะสมหน่วยกิตเพื่อคว้าชัยชนะ
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold text-3xl shrink-0">
          🏆
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            onClick={() => {
              if (ach.unlocked) triggerConfetti();
            }}
            className={`p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
              ach.unlocked
                ? 'bg-white dark:bg-slate-900 border-amber-400/40 shadow-md shadow-amber-400/5 hover:border-amber-400 cursor-pointer'
                : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="text-4xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {ach.icon}
                </div>
                {ach.unlocked ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> ปลดล็อกแล้ว
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> ล็อกอยู่
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-3">
                {ach.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ach.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              {ach.unlocked ? (
                <span className="text-amber-500 font-medium">สำเร็จเมื่อ {ach.unlockedAt || 'ภาคนี้'}</span>
              ) : (
                <span>ความคืบหน้า: {ach.progress} / {ach.maxProgress}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
