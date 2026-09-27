import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Tv,
  List,
  CalendarDays,
  Columns,
} from 'lucide-react';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  onAddSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  onAddSchedule,
  onDeleteSchedule,
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'list'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('จันทร์');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const daysOfWeek = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'] as const;

  // New item state
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newDay, setNewDay] = useState<'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์' | 'เสาร์' | 'อาทิตย์'>('จันทร์');
  const [newStartTime, setNewStartTime] = useState('09:30');
  const [newEndTime, setNewEndTime] = useState('11:20');
  const [newRoom, setNewRoom] = useState('KTB 401');
  const [newBuilding, setNewBuilding] = useState('อาคารกงไกรลาศ (KTB)');
  const [newInstructor, setNewInstructor] = useState('');
  const [newCyberUrl, setNewCyberUrl] = useState('https://cyberclassroom.ru.ac.th');
  const [newNote, setNewNote] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode.trim() || !newSubName.trim()) {
      alert('กรุณากรอกรหัสและชื่อวิชา');
      return;
    }
    const item: ScheduleItem = {
      id: `sch-${Date.now()}`,
      subjectCode: newSubCode.trim().toUpperCase(),
      subjectName: newSubName.trim(),
      semester: '1/2569',
      dayOfWeek: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
      building: newBuilding,
      instructor: newInstructor,
      cyberClassUrl: newCyberUrl,
      note: newNote,
    };
    onAddSchedule(item);
    setIsAddModalOpen(false);
    setNewSubCode('');
    setNewSubName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>📅 ตารางเรียน มหาวิทยาลัยรามคำแหง</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ดูตารางบรรยายในชั้นเรียนและ RU Cyber Classroom (รายสัปดาห์ / รายวัน / รายการ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'weekly'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              รายสัปดาห์
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'daily'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              รายวัน
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              รายการทั้งหมด
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มตารางเรียน</span>
          </button>
        </div>
      </div>

      {/* RU Cyber Classroom Link Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">RU Cyber Classroom & Course on Demand</div>
            <div className="text-xs text-slate-300">
              รับชมการบรรยายสดและย้อนหลังฟรี ไม่สะดวกเข้าเรียนที่มหาวิทยาลัยก็เรียนได้ทุกที่
            </div>
          </div>
        </div>
        <a
          href="https://cyberclassroom.ru.ac.th"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition"
        >
          <span>เข้าห้องเรียนออนไลน์</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* VIEW: Weekly Grid */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {daysOfWeek.slice(0, 5).map((day) => {
            const dayItems = schedule.filter((s) => s.dayOfWeek === day);
            return (
              <div
                key={day}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    วัน{day}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-500">
                    {dayItems.length} คาบ
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {dayItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">ไม่มีคาบเรียน</div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-amber-500">
                            {item.subjectCode}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {item.subjectName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.room} ({item.building})</span>
                        </div>
                        {item.instructor && (
                          <div className="text-[10px] text-slate-400 truncate">
                            อาจารย์: {item.instructor}
                          </div>
                        )}
                        <button
                          onClick={() => onDeleteSchedule(item.id)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
                          title="ลบคาบเรียน"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: Daily View */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedDay === day
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                วัน{day} ({schedule.filter((s) => s.dayOfWeek === day).length})
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              ตารางเรียนวัน{selectedDay}
            </h2>

            {schedule.filter((s) => s.dayOfWeek === selectedDay).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                ไม่มีคาบเรียนในวัน{selectedDay} (วันอ่านหนังสือ/พักผ่อน 📖)
              </div>
            ) : (
              <div className="space-y-3">
                {schedule
                  .filter((s) => s.dayOfWeek === selectedDay)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-500 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {item.startTime}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                              {item.subjectCode}
                            </span>
                            <span className="text-xs text-slate-400">({item.startTime} - {item.endTime})</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                            {item.subjectName}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              ห้อง {item.room} - {item.building}
                            </span>
                            {item.instructor && <span>• อ.{item.instructor}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {item.cyberClassUrl && (
                          <a
                            href={item.cyberClassUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1"
                          >
                            <Tv className="w-3.5 h-3.5" />
                            <span>ดูถ่ายทอดสด</span>
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteSchedule(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: List */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">วัน</th>
                <th className="py-3 px-4">เวลา</th>
                <th className="py-3 px-4">รหัสวิชา</th>
                <th className="py-3 px-4">ชื่อวิชา</th>
                <th className="py-3 px-4">ห้องเรียน & อาคาร</th>
                <th className="py-3 px-4">อาจารย์</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    วัน{item.dayOfWeek}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {item.startTime} - {item.endTime}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-500">
                    {item.subjectCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.subjectName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {item.room} ({item.building})
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.instructor || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteSchedule(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              เพิ่มตารางเรียนใหม่
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    รหัสวิชา *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="MGT3101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    วันเรียน *
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        วัน{d}
                      </option>
                    ))}
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
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="การจัดการการปฏิบัติการ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    เวลาเริ่ม
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    เวลาสิ้นสุด
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ห้องเรียน
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="KTB 401"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    อาคาร
                  </label>
                  <input
                    type="text"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    placeholder="อาคารกงไกรลาศ (KTB)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  อาจารย์ผู้สอน
                </label>
                <input
                  type="text"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="เช่น ผศ.ดร.กิตติพงษ์"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  เพิ่มตารางเรียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
