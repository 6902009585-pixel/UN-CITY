import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  ExamItem,
  AssignmentItem,
  AppNotification,
  HonorsStatus,
} from '../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles,
  ChevronRight,
  Flame,
  Info,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface DashboardViewProps {
  profile: StudentProfile;
  subjects: Subject[];
  exams: ExamItem[];
  assignments: AssignmentItem[];
  notifications: AppNotification[];
  honorsStatus: HonorsStatus;
  cumulativeGpa: number;
  earnedCredits: number;
  onNavigate: (tab: ActiveTab) => void;
  onOpenProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  subjects,
  exams,
  assignments,
  notifications,
  honorsStatus,
  cumulativeGpa,
  earnedCredits,
  onNavigate,
  onOpenProfile,
}) => {
  // Live countdown state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const enrolledSubjects = subjects.filter((s) => s.status === 'enrolled');
  const enrolledCredits = enrolledSubjects.reduce((acc, curr) => acc + curr.credits, 0);
  const remainingCredits = Math.max(0, profile.totalCreditsRequired - earnedCredits);
  const graduationProgress = Math.min(
    100,
    Math.round((earnedCredits / profile.totalCreditsRequired) * 100)
  );

  // Find next upcoming exam
  const upcomingExams = exams
    .filter((e) => new Date(e.examDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const nextExam = upcomingExams[0];

  const getCountdownString = (examDateStr: string, examTimeStr: string) => {
    // examDate e.g. "2026-10-07", time e.g. "09:30 - 12:00"
    const startTimePart = examTimeStr.split('-')[0].trim();
    const [hours, minutes] = startTimePart.split(':');
    const examDate = new Date(examDateStr);
    examDate.setHours(parseInt(hours) || 9, parseInt(minutes) || 30, 0, 0);

    const diff = examDate.getTime() - currentTime.getTime();
    if (diff <= 0) return 'ถึงเวลาสอบแล้ว / กำลังดำเนินการสอบ';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days} วัน ${hrs} ชม. ${mins} นาที ${secs} วิ`;
  };

  const pendingAssignments = assignments.filter((a) => a.status === 'todo' || a.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* 1. Student Hero Banner with RU Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/30 shrink-0">
              {profile.studentId.slice(-2) || 'RU'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  สวัสดี, {profile.name}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-400 text-slate-950">
                  รหัส {profile.studentId}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ภาค {profile.currentSemester}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                {profile.faculty} • {profile.major}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>ปีที่เข้าศึกษา: {profile.admissionYear}</span>
                <span>•</span>
                <span>หลักสูตร: พ.ศ. {profile.curriculumYear}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">
                  🎯 เป้าหมายจบ: {profile.graduationTargetYears} ปี ({profile.targetGradSemester})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              แก้ไขข้อมูล & คณะ
            </button>
            <button
              onClick={() => onNavigate('graduation')}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold shadow-md shadow-amber-400/20 transition flex items-center gap-1.5"
            >
              <span>ตรวจสอบการจบ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Honors Notice Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Award className={`w-4 h-4 ${honorsStatus.isEligible ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-slate-400">สถานะเกียรตินิยม ม.รามคำแหง:</span>
            <span
              className={`font-semibold ${
                honorsStatus.isEligible ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              {honorsStatus.honorsTitle}
            </span>
          </div>
          {honorsStatus.disqualifyReasons.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Info className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>{honorsStatus.disqualifyReasons[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* GPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>GPA สะสม</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 4.00</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {cumulativeGpa >= 3.5 ? 'เกรดดีเยี่ยม 🌟' : cumulativeGpa >= 3.0 ? 'เกรดดีมาก 📈' : 'กำลังสะสมเกรด'}
          </p>
        </div>

        {/* Earned Credits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>หน่วยกิตสะสมที่ผ่าน</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {earnedCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {profile.totalCreditsRequired}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">ผ่านแล้ว {subjects.filter(s => s.status === 'passed').length} วิชา</p>
        </div>

        {/* Enrolled Credits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>กำลังเรียนเทอมนี้</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {enrolledCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">หน่วยกิต</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{enrolledSubjects.length} วิชาในภาค {profile.currentSemester}</p>
        </div>

        {/* Remaining Credits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>หน่วยกิตคงเหลือ</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {remainingCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">หน่วยกิต</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {remainingCredits <= 30 ? '🔥 กาขอจบได้แล้ว!' : `ประมาณ ${Math.ceil(remainingCredits / 22)} ภาคเรียน`}
          </p>
        </div>

        {/* Progress % */}
        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>ความคืบหน้าสู่บัณฑิต</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-black text-amber-500">{graduationProgress}%</span>
              <span className="text-[11px] text-slate-400">เป้า {profile.graduationTargetYears} ปี</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${graduationProgress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onNavigate('graduation')}
            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            ดูหมวดวิชาคงเหลือ <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Next Exam Live Countdown Alert (if any) */}
      {nextExam && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500 text-white">
                  สอบไล่วิชาถัดไป
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {nextExam.subjectCode} - {nextExam.subjectName}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                วันสอบ: {new Date(nextExam.examDate).toLocaleDateString('th-TH', { dateStyle: 'long' })} ({nextExam.examTime})
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                สถานที่: {nextExam.building} ห้อง {nextExam.room} {nextExam.seat && `(${nextExam.seat})`}
              </p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/90 border border-amber-500/30 rounded-xl px-4 py-3 text-center sm:text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
              นับถอยหลังเวลาสอบ
            </div>
            <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">
              {getCountdownString(nextExam.examDate, nextExam.examTime)}
            </div>
          </div>
        </div>
      )}

      {/* 4. Split Section: Current Subjects & To-Dos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current Enrolled Subjects (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                วิชาที่กำลังเรียน (ภาค {profile.currentSemester})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
            >
              จัดการวิชาทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {enrolledSubjects.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              ยังไม่มีวิชาที่ลงทะเบียนในภาคนี้
              <div className="mt-2">
                <button
                  onClick={() => onNavigate('registration')}
                  className="px-3 py-1.5 bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow"
                >
                  ไปลงทะเบียนเรียน
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {enrolledSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {sub.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {sub.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {sub.credits} นก.
                        </span>
                        <span className="text-[10px] text-slate-500">{sub.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {sub.nameTh}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('scores')}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition font-medium"
                    >
                      จำลองเกรด
                    </button>
                    <button
                      onClick={() => onNavigate('reading')}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-medium transition"
                    >
                      อ่านหนังสือ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Registration Alert footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>ลงทั้งหมด {enrolledSubjects.length} วิชา ({enrolledCredits} หน่วยกิต)</span>
            <button
              onClick={() => onNavigate('registration')}
              className="text-amber-500 font-medium hover:underline flex items-center gap-1"
            >
              ระบบลงทะเบียนเรียน <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Urgent To-Dos & Notifications (1 col) */}
        <div className="space-y-6">
          {/* Pending Assignments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  งานที่ต้องทำ ({pendingAssignments.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs text-blue-500 hover:underline"
              >
                ดูทั้งหมด
              </button>
            </div>

            {pendingAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">ไม่มีงานค้างส่ง เยี่ยมมาก! 🎉</p>
            ) : (
              <div className="space-y-2.5">
                {pendingAssignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 font-semibold text-slate-900 dark:text-white">
                      <span className="truncate">{asg.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30 shrink-0">
                        {asg.subjectCode}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>กำหนดส่ง: {new Date(asg.dueDate).toLocaleDateString('th-TH')}</span>
                      <span className="text-rose-500 font-medium">
                        {asg.status === 'in_progress' ? 'กำลังทำ' : 'ยังไม่เริ่ม'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              เมนูลัดใช้งานบ่อย
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('schedule')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
              >
                <Calendar className="w-4 h-4 text-blue-500 mb-1" />
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">ตารางเรียน</div>
                <div className="text-[10px] text-slate-400">เช็คห้อง & เวลา</div>
              </button>
              <button
                onClick={() => onNavigate('exams')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
              >
                <Clock className="w-4 h-4 text-rose-500 mb-1" />
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">ตารางสอบ</div>
                <div className="text-[10px] text-slate-400">นับถอยหลัง</div>
              </button>
              <button
                onClick={() => onNavigate('scores')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
              >
                <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">จำลองเกรด</div>
                <div className="text-[10px] text-slate-400">คำนวณคะแนน</div>
              </button>
              <button
                onClick={() => onNavigate('evidence')}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-500 mb-1" />
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">คลังหลักฐาน</div>
                <div className="text-[10px] text-slate-400">รูปใบเสร็จ & บัตร</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
