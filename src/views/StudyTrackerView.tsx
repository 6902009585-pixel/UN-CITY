import React, { useState, useEffect } from 'react';
import { Subject, StudyChapter, StudyLog } from '../types';
import {
  BookCheck,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  Save,
} from 'lucide-react';

interface StudyTrackerViewProps {
  subjects: Subject[];
  chapters: StudyChapter[];
  studyLogs: StudyLog[];
  onUpdateChapter: (chapter: StudyChapter) => void;
  onAddChapter: (chapter: StudyChapter) => void;
  onAddStudyLog: (log: StudyLog) => void;
}

export const StudyTrackerView: React.FC<StudyTrackerViewProps> = ({
  subjects,
  chapters,
  studyLogs,
  onUpdateChapter,
  onAddChapter,
  onAddStudyLog,
}) => {
  // Course selection
  const enrolledOrPassed = subjects.filter((s) => s.status === 'enrolled' || s.status === 'passed');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    enrolledOrPassed[0]?.code || 'MGT3101'
  );

  // Chapters for this course
  const courseChapters = chapters.filter((c) => c.subjectCode === selectedSubjectCode);
  const completedChaptersCount = courseChapters.filter((c) => c.status === 'completed').length;
  const progressPercent =
    courseChapters.length > 0
      ? Math.round((completedChaptersCount / courseChapters.length) * 100)
      : 0;

  // Study Timer (Pomodoro / Stopwatch)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [logNotes, setLogNotes] = useState('');
  const [logChapterInfo, setLogChapterInfo] = useState('บทที่ 1');

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(mins / 60);
    return `${hrs > 0 ? `${hrs}:` : ''}${String(mins % 60).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  const handleSaveStudySession = () => {
    if (timerSeconds < 30) {
      alert('เวลาอ่านหนังสือน้อยกว่า 30 วินาที ระบบจะยังไม่บันทึก');
      return;
    }
    const durationMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const newLog: StudyLog = {
      id: `log-${Date.now()}`,
      subjectCode: selectedSubjectCode,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      chapterInfo: logChapterInfo,
      notes: logNotes || 'อ่านเนื้อหาและทำข้อสอบเก่า',
    };
    onAddStudyLog(newLog);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setLogNotes('');
    alert(`บันทึกเวลาอ่านหนังสือ ${durationMinutes} นาที สำเร็จแล้ว! 📚`);
  };

  // Add chapter state
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    const nextChapterNum = courseChapters.length + 1;
    const newCh: StudyChapter = {
      id: `ch-${Date.now()}`,
      subjectCode: selectedSubjectCode,
      chapterNumber: nextChapterNum,
      title: newChapterTitle.trim(),
      status: 'not_started',
    };
    onAddChapter(newCh);
    setNewChapterTitle('');
  };

  const toggleChapterStatus = (ch: StudyChapter) => {
    const nextStatus =
      ch.status === 'not_started'
        ? 'in_progress'
        : ch.status === 'in_progress'
        ? 'completed'
        : 'not_started';
    onUpdateChapter({ ...ch, status: nextStatus });
  };

  const totalStudyMinutes = studyLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookCheck className="w-6 h-6 text-amber-500" />
            <span>📖 ระบบอ่านหนังสือ & เช็คลิสต์บทเรียน</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เช็คลิสต์บทเรียนรายวิชา ตัวจับเวลาอ่านหนังสือ และบันทึกประวัติการอ่าน
          </p>
        </div>

        {/* Course selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            วิชาที่อ่าน:
          </label>
          <select
            value={selectedSubjectCode}
            onChange={(e) => setSelectedSubjectCode(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.code}>
                {sub.code} - {sub.nameTh}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chapter Checklist (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card (Matches prompt example: RAM1142 บท 1 ✅, บท 2 ✅, บท 3 🟡, ความคืบหน้า 40%) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono font-bold text-amber-500 text-sm">
                  {selectedSubjectCode}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  เช็คลิสต์บทเรียนที่ต้องอ่าน
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  เสร็จแล้ว {completedChaptersCount} จาก {courseChapters.length} บท
                </span>
                <span className="text-xl font-black text-amber-500 font-mono">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Chapters List */}
            <div className="space-y-2">
              {courseChapters.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  ยังไม่มีบทเรียนในวิชานี้ เพิ่มบทเรียนแรกด้านล่างได้เลย
                </div>
              ) : (
                courseChapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => toggleChapterStatus(ch)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {ch.chapterNumber}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          คลิกเพื่อเปลี่ยนสถานะ (ยังไม่เริ่ม → กำลังอ่าน → อ่านจบแล้ว)
                        </div>
                      </div>
                    </div>

                    <div>
                      {ch.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          ✅ อ่านจบแล้ว
                        </span>
                      )}
                      {ch.status === 'in_progress' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                          🟡 กำลังอ่าน
                        </span>
                      )}
                      {ch.status === 'not_started' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          ⬜ ยังไม่อ่าน
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Chapter */}
            <form onSubmit={handleAddChapterSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="เพิ่มหัวข้อ/บทเรียนใหม่ เช่น บทที่ 4 การจัดการกลยุทธ์..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                + เพิ่มบท
              </button>
            </form>
          </div>

          {/* Reading Log History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>ประวัติการอ่านหนังสือที่บันทึกไว้</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {studyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-500">
                        {log.subjectCode}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {log.chapterInfo}
                      </span>
                    </div>
                    {log.notes && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{log.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sky-500">{log.durationMinutes} นาที</span>
                    <div className="text-[10px] text-slate-400">{log.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stopwatch / Study Timer (1 col) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>ตัวจับเวลาอ่านหนังสือ</span>
            </div>

            {/* Huge Timer Display */}
            <div className="py-4">
              <div className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {isTimerRunning ? 'กำลังอ่านหนังสืออย่างมีสมาธิ 📖' : 'กดเริ่มเพื่อจับเวลาการอ่าน'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition ${
                  isTimerRunning
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>หยุดชั่วคราว</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>เริ่มอ่านหนังสือ</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-white"
                title="รีเซ็ตเวลา"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Session Notes & Save */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                บทที่อ่านในรอบนี้:
              </label>
              <input
                type="text"
                value={logChapterInfo}
                onChange={(e) => setLogChapterInfo(e.target.value)}
                placeholder="เช่น บทที่ 2 หรือ ข้อสอบเก่า ปี 68"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />

              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                สรุปเนื้อหา / โน้ตย่อ:
              </label>
              <textarea
                rows={2}
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="จุดสำคัญที่ต้องจำ หรือสูตรคำนวณ..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 resize-none"
              />

              <button
                onClick={handleSaveStudySession}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกชั่วโมงอ่านหนังสือนัดนี้</span>
              </button>
            </div>
          </div>

          {/* Total Reading Stats Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-center">
            <span className="text-xs text-slate-500">เวลารวมที่อ่านหนังสือสะสม</span>
            <div className="text-3xl font-black text-amber-500 font-mono mt-1">
              {(totalStudyMinutes / 60).toFixed(1)} <span className="text-base font-normal">ชั่วโมง</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              (บันทึกทั้งหมด {studyLogs.length} ครั้ง)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
