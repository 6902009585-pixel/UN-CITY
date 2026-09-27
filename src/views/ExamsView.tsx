import React, { useState, useEffect } from 'react';
import { ExamItem, GradeType } from '../types';
import { calculateGradeFromScore } from '../utils/gradeCalculations';
import {
  Clock,
  Calendar,
  MapPin,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit2,
} from 'lucide-react';

interface ExamsViewProps {
  exams: ExamItem[];
  onAddExam: (exam: ExamItem) => void;
  onUpdateExam: (exam: ExamItem) => void;
  onDeleteExam: (id: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamItem | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateCountdown = (examDateStr: string, examTimeStr: string) => {
    const startTimePart = examTimeStr.split('-')[0].trim();
    const [h, m] = startTimePart.split(':');
    const target = new Date(examDateStr);
    target.setHours(parseInt(h) || 9, parseInt(m) || 30, 0, 0);

    const diff = target.getTime() - currentTime.getTime();
    if (diff <= 0) {
      return { isPast: true, text: 'ดำเนินการสอบเสร็จสิ้นแล้ว / ผลสอบออก' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      isPast: false,
      days,
      hours,
      minutes,
      seconds,
      text: `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              📝 ระบบตารางสอบไล่ & นับถอยหลัง (ม.ร.)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {exams.length} วิชา
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ตารางสอบไล่ส่วนกลาง ม.รามคำแหง นับถอยหลังแบบเรียลไทม์ และบันทึกผลสอบ
          </p>
        </div>

        <button
          onClick={() => {
            setEditingExam(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มตารางสอบ</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => {
          const countdown = calculateCountdown(exam.examDate, exam.examTime);
          const totalScore =
            (exam.midtermScore || 0) + (exam.finalScore || 0) + (exam.homeworkScore || 0);

          return (
            <div
              key={exam.id}
              className={`rounded-2xl border p-5 shadow-xs transition ${
                countdown.isPast
                  ? 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 border-amber-500/40 shadow-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    {exam.subjectCode.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                        {exam.subjectCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          exam.session === 'morning'
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
                            : 'bg-indigo-500/20 text-indigo-400'
                        }`}
                      >
                        {exam.session === 'morning' ? 'คาบเช้า (09:30)' : 'คาบบ่าย (14:00)'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 mt-0.5">
                      {exam.subjectName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingExam(exam);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="แก้ไขคะแนน/ข้อมูล"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="ลบ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Countdown Banner */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300 font-medium">เหลืออีก:</span>
                </div>
                <div
                  className={`font-mono text-xs sm:text-sm font-black ${
                    countdown.isPast ? 'text-slate-400' : 'text-amber-400'
                  }`}
                >
                  {countdown.text}
                </div>
              </div>

              {/* Date & Location */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {new Date(exam.examDate).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>เวลา {exam.examTime}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {exam.building} ห้อง {exam.room} {exam.seat && `• ${exam.seat}`}
                  </span>
                </div>
              </div>

              {/* Score Breakdown (Example in prompt: กลางภาค 25, ปลายภาค -, งาน 10) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                  <span>คะแนนสะสม & ผลสอบ:</span>
                  {exam.resultGrade && (
                    <span className="font-bold text-emerald-500">
                      เกรดที่ได้: {exam.resultGrade}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">เก็บ/งาน</div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {exam.homeworkScore !== undefined ? exam.homeworkScore : '-'}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">กลางภาค</div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {exam.midtermScore !== undefined ? exam.midtermScore : '-'}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">ปลายภาค</div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {exam.finalScore !== undefined && exam.finalScore > 0 ? exam.finalScore : '-'}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
                    <div className="text-[10px] text-amber-500">คะแนนรวม</div>
                    <div className="font-black text-xs text-amber-500">
                      {totalScore > 0 ? totalScore : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Exam Modal */}
      {isAddModalOpen && (
        <ExamFormModal
          exam={editingExam}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingExam(null);
          }}
          onSave={(data) => {
            if (editingExam) {
              onUpdateExam({ ...editingExam, ...data });
            } else {
              onAddExam({
                id: `exam-${Date.now()}`,
                ...data,
              });
            }
            setIsAddModalOpen(false);
            setEditingExam(null);
          }}
        />
      )}
    </div>
  );
};

interface ExamFormModalProps {
  exam: ExamItem | null;
  onClose: () => void;
  onSave: (data: Omit<ExamItem, 'id'>) => void;
}

const ExamFormModal: React.FC<ExamFormModalProps> = ({ exam, onClose, onSave }) => {
  const [subjectCode, setSubjectCode] = useState(exam?.subjectCode || '');
  const [subjectName, setSubjectName] = useState(exam?.subjectName || '');
  const [semester, setSemester] = useState(exam?.semester || '1/2569');
  const [examDate, setExamDate] = useState(exam?.examDate || '2026-10-07');
  const [examTime, setExamTime] = useState(exam?.examTime || '09:30 - 12:00');
  const [session, setSession] = useState<'morning' | 'afternoon'>(exam?.session || 'morning');
  const [room, setRoom] = useState(exam?.room || 'VKB 401');
  const [seat, setSeat] = useState(exam?.seat || 'แถว 12 ที่นั่ง 04');
  const [building, setBuilding] = useState(exam?.building || 'อาคารเวียงคำ (VKB)');
  const [homeworkScore, setHomeworkScore] = useState<number | undefined>(exam?.homeworkScore);
  const [midtermScore, setMidtermScore] = useState<number | undefined>(exam?.midtermScore);
  const [finalScore, setFinalScore] = useState<number | undefined>(exam?.finalScore);
  const [resultGrade, setResultGrade] = useState<GradeType>(exam?.resultGrade || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode.trim() || !subjectName.trim()) {
      alert('กรุณากรอกรหัสและชื่อวิชา');
      return;
    }
    const total = (homeworkScore || 0) + (midtermScore || 0) + (finalScore || 0);
    const calculatedGrade = total > 0 ? calculateGradeFromScore(total) : resultGrade;

    onSave({
      subjectCode: subjectCode.trim().toUpperCase(),
      subjectName: subjectName.trim(),
      semester,
      examDate,
      examTime,
      session,
      room,
      seat,
      building,
      status: 'upcoming',
      homeworkScore,
      midtermScore,
      finalScore,
      totalScore: total > 0 ? total : undefined,
      resultGrade: resultGrade || (total > 0 ? calculatedGrade : undefined),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          {exam ? 'แก้ไขข้อมูลการสอบ & บันทึกคะแนน' : 'เพิ่มตารางสอบไล่ใหม่'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                รหัสวิชา *
              </label>
              <input
                type="text"
                required
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="ACC1103"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                คาบสอบ *
              </label>
              <select
                value={session}
                onChange={(e) => {
                  const s = e.target.value as 'morning' | 'afternoon';
                  setSession(s);
                  setExamTime(s === 'morning' ? '09:30 - 12:00' : '14:00 - 16:30');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              >
                <option value="morning">คาบเช้า (09:30 - 12:00)</option>
                <option value="afternoon">คาบบ่าย (14:00 - 16:30)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อวิชา *
            </label>
            <input
              type="text"
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="การจัดการการปฏิบัติการ"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                วันสอบ (YYYY-MM-DD) *
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                เวลาสอบ
              </label>
              <input
                type="text"
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ห้องสอบ
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="VKB 401"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                อาคาร
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="เวียงคำ (VKB)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                แถว/ที่นั่ง
              </label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                placeholder="แถว 12 นั่ง 04"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Scores section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              บันทึกคะแนนสอบ (ถ้ามี)
            </span>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">งาน/เก็บ</label>
                <input
                  type="number"
                  value={homeworkScore ?? ''}
                  onChange={(e) =>
                    setHomeworkScore(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">กลางภาค</label>
                <input
                  type="number"
                  value={midtermScore ?? ''}
                  onChange={(e) =>
                    setMidtermScore(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">ปลายภาค</label>
                <input
                  type="number"
                  value={finalScore ?? ''}
                  onChange={(e) =>
                    setFinalScore(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">เกรดที่ได้</label>
                <select
                  value={resultGrade}
                  onChange={(e) => setResultGrade(e.target.value as GradeType)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800"
                >
                  <option value="">-</option>
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow"
            >
              บันทึกตารางสอบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
