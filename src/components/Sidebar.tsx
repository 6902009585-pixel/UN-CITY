import React from 'react';
import {
  Home,
  User,
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Map,
  BookCheck,
  ClipboardList,
  CalendarDays,
  DollarSign,
  FolderArchive,
  BarChart3,
  Target,
  Trophy,
  Settings,
  Sparkles,
  Camera,
  X,
  FileCheck2,
  LogOut,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'profile'
  | 'subjects'
  | 'registration'
  | 'schedule'
  | 'exams'
  | 'scores'
  | 'grades'
  | 'graduation'
  | 'study_plan'
  | 'reading'
  | 'assignments'
  | 'calendar'
  | 'expenses'
  | 'evidence'
  | 'analytics'
  | 'goals'
  | 'achievements'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  upcomingExamsCount: number;
  pendingAssignmentsCount: number;
  unreadNotifsCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  upcomingExamsCount,
  pendingAssignmentsCount,
  onLogout,
}) => {
  const navSections = [
    {
      title: 'ภาพรวม & ข้อมูล',
      items: [
        { id: 'dashboard', label: '🏠 หน้าหลัก (Dashboard)', icon: Home },
        { id: 'profile', label: '👤 ข้อมูลนักศึกษา & คณะ', icon: User },
      ],
    },
    {
      title: 'วิชา & ตารางเรียน',
      items: [
        { id: 'subjects', label: '📚 รายวิชา & รีเกรด', icon: BookOpen },
        { id: 'registration', label: '📝 ระบบลงทะเบียน', icon: FileCheck2 },
        { id: 'schedule', label: '📅 ตารางเรียน', icon: Calendar },
        {
          id: 'exams',
          label: '📝 ตารางสอบ & นับถอยหลัง',
          icon: Clock,
          badge: upcomingExamsCount > 0 ? `${upcomingExamsCount}` : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        { id: 'scores', label: '📊 คะแนน & จำลองเกรด', icon: Sparkles },
      ],
    },
    {
      title: 'เกรด & วางแผนการจบ',
      items: [
        { id: 'grades', label: '🎓 ระบบเกรด & GPA', icon: Award },
        { id: 'graduation', label: '🎯 ตรวจสอบการจบ', icon: CheckCircle2 },
        { id: 'study_plan', label: '🗺️ แผนเรียนจนจบ', icon: Map },
      ],
    },
    {
      title: 'การอ่าน & กิจกรรม',
      items: [
        { id: 'reading', label: '📖 อ่านหนังสือ & เช็คลิสต์', icon: BookCheck },
        {
          id: 'assignments',
          label: '📌 ระบบงานและการบ้าน',
          icon: ClipboardList,
          badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount}` : undefined,
          badgeColor: 'bg-amber-500 text-slate-900',
        },
        { id: 'calendar', label: '📆 ปฏิทินรวม', icon: CalendarDays },
      ],
    },
    {
      title: 'การเงิน & หลักฐาน',
      items: [
        { id: 'evidence', label: '📸 คลังหลักฐาน & เอกสาร', icon: Camera },
        { id: 'expenses', label: '💰 ระบบค่าใช้จ่าย', icon: DollarSign },
      ],
    },
    {
      title: 'สถิติ & ความสำเร็จ',
      items: [
        { id: 'analytics', label: '📈 สถิติการเรียน', icon: BarChart3 },
        { id: 'goals', label: '🧠 ระบบเป้าหมาย', icon: Target },
        { id: 'achievements', label: '🏆 Achievement รางวัล', icon: Trophy },
        { id: 'settings', label: '⚙️ ตั้งค่า & Google Sheet', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile header inside sidebar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">เมนูระบบ ม.ราม</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h3>
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id as ActiveTab);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition group ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition ${
                            isActive
                              ? 'text-slate-950'
                              : 'text-slate-400 group-hover:text-amber-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ (Logout)</span>
          </button>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>RU Study Hub v2.5</span>
            <span className="text-amber-400/80 font-mono">ม.ร. ศิลาบาตร</span>
          </div>
        </div>
      </aside>
    </>
  );
};
