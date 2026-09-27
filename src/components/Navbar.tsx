import React from 'react';
import {
  GraduationCap,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Bell,
  Menu,
  Award,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { StudentProfile, HonorsStatus } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  honorsStatus: HonorsStatus;
  cumulativeGpa: number;
  earnedCredits: number;
  isSyncing: boolean;
  onSyncGoogleSheet: () => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  honorsStatus,
  cumulativeGpa,
  earnedCredits,
  isSyncing,
  onSyncGoogleSheet,
  unreadNotifsCount,
  onOpenNotifications,
  onToggleSidebar,
  onOpenProfile,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenProfile}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">RU STUDY HUB</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  ม.รามคำแหง
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
                {profile.name} • {profile.studentId}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Stats Pille */}
        <div className="hidden lg:flex items-center gap-2">
          {/* GPA Badge */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">GPA สะสม:</span>
            <span className="font-bold text-amber-400 text-sm">
              {cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : '-'}
            </span>
          </div>

          {/* Credits Badge */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">หน่วยกิต:</span>
            <span className="font-bold text-sky-400 text-sm">
              {earnedCredits} / {profile.totalCreditsRequired}
            </span>
          </div>

          {/* Honors Status */}
          <div
            className={`border rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-medium ${
              honorsStatus.isEligible
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={honorsStatus.disqualifyReasons.join(', ') || honorsStatus.honorsTitle}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{honorsStatus.isEligible ? honorsStatus.honorsTitle.split(' ')[0] : 'สิทธิ์เกียรตินิยม'}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Google Sheet Sync Button */}
          <button
            onClick={onSyncGoogleSheet}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSyncing
                ? 'bg-slate-800 text-amber-400 border-amber-500/40 cursor-wait'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60 hover:border-emerald-400/50'
            }`}
            title="ซิงค์ข้อมูลกับ Google Sheet"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline">
              {isSyncing ? 'กำลังซิงค์ Sheet...' : 'ซิงค์ Google Sheet'}
            </span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="การแจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Profile Avatar trigger */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 text-left hover:opacity-80 transition cursor-pointer"
            title="ดูข้อมูลนักศึกษา"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow ring-2 ring-blue-500/20">
              {profile.studentId.slice(-2) || 'RU'}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-white leading-tight truncate max-w-[120px]">
                {profile.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{profile.studentId}</div>
            </div>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
