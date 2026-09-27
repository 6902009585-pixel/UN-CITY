import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { RAMKHAMHAENG_FACULTIES, FacultyItem, MajorItem } from '../data/faculties';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppStorage } from '../services/storage';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  onLogout?: () => void;
  onResetToCleanState?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onLogout,
  onResetToCleanState,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyItem | undefined>(() => {
    return RAMKHAMHAENG_FACULTIES.find((f) => f.name === profile.faculty) || RAMKHAMHAENG_FACULTIES[1];
  });
  const [selectedMajor, setSelectedMajor] = useState<MajorItem | undefined>(() => {
    return selectedFaculty?.majors.find((m) => m.name === profile.major) || selectedFaculty?.majors[0];
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmCleanReset, setConfirmCleanReset] = useState(false);

  // In-app PIN change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    const cleanNew = newPin.trim();
    const cleanConfirm = confirmPin.trim();

    if (cleanNew.length !== 6 || !/^\d{6}$/.test(cleanNew)) {
      setPinMessage({ text: 'รหัสผ่านใหม่ต้องเป็นตัวเลข 6 หลัก (0-9)', isError: true });
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setPinMessage({ text: 'รหัสผ่าน 6 ตัวใหม่กับยืนยันรหัสผ่านไม่ตรงกัน', isError: true });
      return;
    }

    const res = AppStorage.resetPasswordPin(profile.studentId, cleanNew);
    if (res.success) {
      setPinMessage({ text: 'เปลี่ยนรหัสผ่าน 6 ตัวสำเร็จเรียบร้อยแล้ว!', isError: false });
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinMessage(null), 4000);
    } else {
      setPinMessage({ text: res.message, isError: true });
    }
  };

  // When faculty changes, update available majors
  const handleFacultyChange = (facultyName: string) => {
    const fac = RAMKHAMHAENG_FACULTIES.find((f) => f.name === facultyName);
    setSelectedFaculty(fac);
    if (fac && fac.majors.length > 0) {
      const firstMajor = fac.majors[0];
      setSelectedMajor(firstMajor);
      setFormData((prev) => ({
        ...prev,
        faculty: fac.name,
        major: firstMajor.name,
        totalCreditsRequired: firstMajor.defaultCredits,
      }));
    } else {
      setFormData((prev) => ({ ...prev, faculty: facultyName }));
    }
  };

  const handleMajorChange = (majorName: string) => {
    const maj = selectedFaculty?.majors.find((m) => m.name === majorName);
    setSelectedMajor(maj);
    setFormData((prev) => ({
      ...prev,
      major: majorName,
      totalCreditsRequired: maj ? maj.defaultCredits : prev.totalCreditsRequired,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              ข้อมูลนักศึกษา & เลือกคณะ/สาขาวิชา
            </h1>
            <p className="text-xs text-slate-500">
              กำหนดคณะ สาขา หลักสูตร และเป้าหมายการจบการศึกษา มหาวิทยาลัยรามคำแหง
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Faculty and Major Selection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              1. เลือกคณะและสาขาวิชา (ม.รามคำแหง)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Faculty Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                คณะที่ศึกษา *
              </label>
              <select
                value={formData.faculty}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                {RAMKHAMHAENG_FACULTIES.map((fac) => (
                  <option key={fac.id} value={fac.name}>
                    {fac.icon} {fac.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400">
                เมื่อเลือกคณะ สาขาวิชาทั้งหมดของคณะจะปรากฏให้เลือกโดยอัตโนมัติ
              </p>
            </div>

            {/* Major Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                สาขาวิชา / แผนการศึกษา *
              </label>
              <select
                value={formData.major}
                onChange={(e) => handleMajorChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                {selectedFaculty?.majors.map((maj) => (
                  <option key={maj.id} value={maj.name}>
                    {maj.name}
                  </option>
                ))}
              </select>
              {selectedMajor?.description && (
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400/90 leading-tight">
                  ℹ️ {selectedMajor.description}
                </p>
              )}
            </div>
          </div>

          {/* Credits required & Categories overview */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              จำนวนหน่วยกิตทั้งหมดที่ต้องเรียนตามหลักสูตร (ปรับแก้ได้) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="60"
                max="250"
                value={formData.totalCreditsRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCreditsRequired: parseInt(e.target.value) || 132,
                  })
                }
                className="w-36 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-medium">หน่วยกิต</span>
              <span className="text-[11px] text-slate-400">
                (มาตรฐาน ป.ตรี ม.รามคำแหงทั่วไป 130 - 140 หน่วยกิต, คณะศึกษาศาสตร์ 138 หน่วยกิต)
              </span>
            </div>
          </div>

          {/* Category Breakdown Pill Preview */}
          {selectedMajor?.categories && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                โครงสร้างหมวดวิชาตามหลักสูตร:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedMajor.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
                  >
                    <div className="text-[11px] text-slate-500 truncate">{cat.name}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {cat.credits} นก.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Student Personal Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              2. ข้อมูลส่วนตัวและรหัสนักศึกษา
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                รหัสนักศึกษา (10 หลัก) *
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="เช่น 6902009585"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ชื่อ-นามสกุล *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อ-นามสกุล นักศึกษา"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                อีเมลนักศึกษา (@rumail.ru.ac.th)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="6902009585@rumail.ru.ac.th"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ปีที่เข้าศึกษา (พ.ศ.) *
              </label>
              <input
                type="text"
                value={formData.admissionYear}
                onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                placeholder="2569"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                หลักสูตรปี (พ.ศ.)
              </label>
              <input
                type="text"
                value={formData.curriculumYear}
                onChange={(e) => setFormData({ ...formData, curriculumYear: e.target.value })}
                placeholder="2565"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ภาคการศึกษาปัจจุบัน *
              </label>
              <input
                type="text"
                value={formData.currentSemester}
                onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                placeholder="1/2569"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Graduation Goal Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Award className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              3. แผนเป้าหมายระยะเวลาจบการศึกษา
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                เป้าหมายจบภายในกี่ปี *
              </label>
              <select
                value={formData.graduationTargetYears}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    graduationTargetYears: parseInt(e.target.value) || 3,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value={2.5}>2.5 ปี (Fast-Track สะสมหน่วยกิตเต็มพิกัด)</option>
                <option value={3}>3 ปี (มาตรฐานนักศึกษาเรียนรามขยัน)</option>
                <option value={3.5}>3.5 ปี</option>
                <option value={4}>4 ปี (ตามแผนการเรียนปกติ)</option>
                <option value={5}>5 ปี</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                เป้าหมายภาคเรียนที่คาดว่าจะจบ
              </label>
              <input
                type="text"
                value={formData.targetGradSemester}
                onChange={(e) => setFormData({ ...formData, targetGradSemester: e.target.value })}
                placeholder="เช่น 2/2571 หรือ Summer/2571"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>บันทึกข้อมูลเรียบร้อยแล้ว!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              * ข้อมูลจะถูกจัดเก็บลงเครื่องและเตรียมพร้อมสำหรับซิงค์ Google Sheets
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-400/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลนักศึกษา</span>
          </button>
        </div>
      </form>

      {/* Change Password PIN In-App Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>เปลี่ยนรหัสผ่าน 6 ตัว (PIN) ในระบบ</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">รหัส 6 หลัก</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          คุณสามารถเปลี่ยนรหัสผ่าน 6 ตัวสำหรับรหัสนักศึกษา <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{profile.studentId}</span> ได้โดยตรงที่นี่
        </p>

        <form onSubmit={handleUpdatePin} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>รหัสผ่านใหม่ (PIN 6 ตัว)</span>
                <span className="text-[10px] text-slate-400">ตัวเลข 6 ตัว</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  placeholder="••••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>ยืนยันรหัสผ่านใหม่</span>
                <span className="text-[10px] text-slate-400">ตัวเลข 6 ตัว</span>
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                placeholder="••••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          {pinMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                pinMessage.isError
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
              }`}
            >
              {pinMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{pinMessage.text}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 dark:hover:bg-amber-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>บันทึกรหัสผ่านใหม่</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Management & Clean Slate Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span>🛡️ การจัดการบัญชี & รีเซ็ตข้อมูล</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          บัญชีรหัสนักศึกษา: <span className="font-mono font-bold text-slate-900 dark:text-white">{profile.studentId}</span>
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {onResetToCleanState && (
            confirmCleanReset ? (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-xs text-rose-500 font-semibold">⚠️ ล้างข้อมูลทั้งหมดจริงหรือไม่?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetToCleanState();
                    setConfirmCleanReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  ยืนยันล้างข้อมูล
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCleanReset(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmCleanReset(true)}
                className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition cursor-pointer"
              >
                🧹 ล้างข้อมูลทั้งหมดเป็นค่าว่าง (รีเซ็ตเพื่อใส่ข้อมูลใหม่)
              </button>
            )
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              🚪 ออกจากระบบ (Logout)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
