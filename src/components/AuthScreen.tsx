import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  CreditCard,
  Building2,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { AppStorage } from '../services/storage';
import { UserAccount } from '../types';
import confetti from 'canvas-confetti';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const RU_FACULTIES = [
  {
    name: 'คณะนิติศาสตร์',
    majors: ['สาขาวิชานิติศาสตร์'],
  },
  {
    name: 'คณะบริหารธุรกิจ',
    majors: [
      'สาขาวิชาการจัดการ',
      'สาขาวิชาการเงินและการธนาคาร',
      'สาขาวิชาการตลาด',
      'สาขาวิชาการบัญชี',
      'สาขาวิชาการสื่อสารดิจิทัลทางธุรกิจ',
    ],
  },
  {
    name: 'คณะรัฐศาสตร์',
    majors: [
      'กลุ่มวิชาการปกครอง',
      'กลุ่มวิชาความสัมพันธ์ระหว่างประเทศ',
      'กลุ่มวิชาการบริหารรัฐกิจ',
    ],
  },
  {
    name: 'คณะมนุษยศาสตร์',
    majors: [
      'สาขาวิชาภาษาอังกฤษ',
      'สาขาวิชาภาษาไทย',
      'สาขาวิชาประวัติศาสตร์',
      'สาขาวิชาภาษาญี่ปุ่น',
      'สาขาวิชาสารสนเทศศาสตร์และบรรณารักษศาสตร์',
    ],
  },
  {
    name: 'คณะศึกษาศาสตร์',
    majors: [
      'สาขาวิชาการศึกษาปฐมวัย',
      'สาขาวิชาคณิตศาสตร์',
      'สาขาวิชาภาษาไทย',
      'สาขาวิชาพลศึกษา',
    ],
  },
  {
    name: 'คณะวิทยาศาสตร์',
    majors: [
      'สาขาวิชาวิทยาการคอมพิวเตอร์',
      'สาขาวิชาเทคโนโลยีสารสนเทศ',
      'สาขาวิชาเคมี',
      'สาขาวิชาคณิตศาสตร์',
      'สาขาวิชาสถิติ',
    ],
  },
  {
    name: 'คณะเศรษฐศาสตร์',
    majors: ['สาขาวิชาเศรษฐศาสตร์ทั่วไป', 'สาขาวิชาเศรษฐศาสตร์ธุรกิจ'],
  },
  {
    name: 'คณะสื่อสารมวลชน',
    majors: ['สาขาวิชาวารสารศาสตร์และสื่อสิ่งพิมพ์', 'สาขาวิชาวิทยุกระจายเสียงและโทรทัศน์'],
  },
  {
    name: 'คณะพัฒนาทรัพยากรมนุษย์',
    majors: ['สาขาวิชาการพัฒนาทรัพยากรมนุษย์'],
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginStudentId, setLoginStudentId] = useState(() => AppStorage.getLastStudentId() || '');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot / Reset PIN state
  const [forgotStudentId, setForgotStudentId] = useState(() => AppStorage.getLastStudentId() || '');
  const [forgotNewPin, setForgotNewPin] = useState('');
  const [forgotConfirmPin, setForgotConfirmPin] = useState('');
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regFaculty, setRegFaculty] = useState(RU_FACULTIES[0].name);
  const [regMajor, setRegMajor] = useState(RU_FACULTIES[0].majors[0]);
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Available registered accounts for quick switch
  const registeredUsers = AppStorage.getUsers();

  const handleFacultyChange = (facultyName: string) => {
    setRegFaculty(facultyName);
    const facultyObj = RU_FACULTIES.find((f) => f.name === facultyName);
    if (facultyObj && facultyObj.majors.length > 0) {
      setRegMajor(facultyObj.majors[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanId = loginStudentId.trim();
    const cleanPin = loginPin.trim();

    if (!cleanId) {
      setLoginError('กรุณากรอกรหัสนักศึกษา (10 หลัก)');
      return;
    }

    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      setLoginError('กรุณากรอกรหัสผ่านเป็นตัวเลข 6 ตัว (PIN 6 หลัก)');
      return;
    }

    const result = AppStorage.loginUser(cleanId, cleanPin);
    if (result.success && result.user) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      onLoginSuccess(result.user);
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const cleanId = regStudentId.trim();
    const cleanPin = regPin.trim();
    const cleanConfirm = regConfirmPin.trim();

    if (!regFirstName.trim() || !regLastName.trim()) {
      setRegError('กรุณากรอกชื่อและนามสกุล');
      return;
    }

    if (!cleanId || cleanId.length < 10) {
      setRegError('กรุณากรอกรหัสนักศึกษา 10 หลัก (เช่น 6902009585)');
      return;
    }

    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      setRegError('รหัสผ่านต้องเป็นตัวเลข 6 หลัก (เช่น 123456)');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setRegError('รหัสผ่าน 6 ตัวกับยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const result = AppStorage.registerUser(
      cleanId,
      regFirstName,
      regLastName,
      cleanPin,
      regFaculty,
      regMajor
    );

    if (result.success && result.user) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setRegSuccessMessage('ลงทะเบียนสำเร็จ! กำลังเข้าสู่ระบบด้วยชุดข้อมูลว่างเปล่า...');
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 700);
    } else {
      setRegError(result.message);
    }
  };

  const handleQuickLogin = (user: UserAccount) => {
    setLoginStudentId(user.studentId);
    setLoginPin(user.passwordPin);
    const result = AppStorage.loginUser(user.studentId, user.passwordPin);
    if (result.success && result.user) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      onLoginSuccess(result.user);
    }
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const cleanId = forgotStudentId.trim();
    const cleanPin = forgotNewPin.trim();
    const cleanConfirm = forgotConfirmPin.trim();

    if (!cleanId) {
      setForgotError('กรุณากรอกรหัสนักศึกษา (10 หลัก)');
      return;
    }

    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      setForgotError('รหัสผ่านใหม่ต้องเป็นตัวเลข 6 หลัก (0-9)');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setForgotError('รหัสผ่าน 6 ตัวใหม่กับยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const result = AppStorage.resetPasswordPin(cleanId, cleanPin);
    if (result.success && result.user) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setForgotSuccess(result.message);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 700);
    } else {
      setForgotError(result.message);
    }
  };

  const selectedFacultyObj = RU_FACULTIES.find((f) => f.name === regFaculty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-['Prompt',sans-serif]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-xl shadow-amber-500/25 mb-3 ring-4 ring-amber-400/20">
            <GraduationCap className="w-10 h-10 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>RU STUDY HUB</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              ม.รามคำแหง
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            ระบบจัดการการเรียนรู้ แผนการเรียน ตารางสอบ เกรด และติดตามการจบการศึกษา
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Tab Switcher */}
          <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`py-2 text-[11px] font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3 shrink-0" />
              <span>เข้าสู่ระบบ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError(null);
              }}
              className={`py-2 text-[11px] font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3 shrink-0" />
              <span>ลงทะเบียน</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('forgot');
                setForgotError(null);
                setForgotSuccess(null);
                if (loginStudentId) setForgotStudentId(loginStudentId);
              }}
              className={`py-2 text-[11px] font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'forgot'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>ลืมรหัสผ่าน</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>รหัสนักศึกษา (10 หลัก)</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="เช่น 6902009585"
                  value={loginStudentId}
                  onChange={(e) => setLoginStudentId(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm tracking-wider font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>รหัสผ่าน 6 ตัว (PIN 6 หลัก)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">ตัวเลข 6 ตัว</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="••••••"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm tracking-widest font-mono text-center"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showLoginPin ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setForgotError(null);
                      setForgotSuccess(null);
                      if (loginStudentId) setForgotStudentId(loginStudentId);
                    }}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 transition hover:underline cursor-pointer"
                  >
                    ลืมรหัสผ่าน 6 ตัว? เปลี่ยนรหัสผ่านที่นี่
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError(null);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4"
                >
                  ยังไม่มีข้อมูล? กดลงทะเบียนนักศึกษาใหม่ที่นี่
                </button>
              </div>

              {/* Quick Login with existing accounts on this device */}
              {registeredUsers.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-2 font-medium">
                    👤 บัญชีที่บันทึกไว้ในอุปกรณ์นี้:
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {registeredUsers.map((u) => (
                      <button
                        key={u.studentId}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left transition group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                            {u.studentId.slice(-2)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              รหัส: {u.studentId}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          เข้าใช้งาน
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น สมชาย"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ใจดี"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>รหัสนักศึกษา (10 หลัก)</span>
                  <span className="text-[11px] text-amber-400 font-mono">10 หลัก</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="เช่น 6902009585"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-mono tracking-wider"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    คณะ
                  </label>
                  <select
                    value={regFaculty}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                  >
                    {RU_FACULTIES.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    สาขาวิชา
                  </label>
                  <select
                    value={regMajor}
                    onChange={(e) => setRegMajor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs truncate"
                  >
                    {selectedFacultyObj?.majors.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>รหัสผ่าน 6 ตัว</span>
                    <span className="text-[10px] text-slate-500">6 หลัก</span>
                  </label>
                  <input
                    type={showRegPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="••••••"
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-mono text-center tracking-widest"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>ยืนยันรหัสผ่าน</span>
                    <button
                      type="button"
                      onClick={() => setShowRegPin(!showRegPin)}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      {showRegPin ? 'ซ่อน' : 'แสดง'}
                    </button>
                  </label>
                  <input
                    type={showRegPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="••••••"
                    value={regConfirmPin}
                    onChange={(e) => setRegConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-mono text-center tracking-widest"
                    required
                  />
                </div>
              </div>

              {/* Clean slate notice */}
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  บัญชีจะเริ่มต้นด้วย <strong>ชุดข้อมูลว่างเปล่า (Clean Slate)</strong> พร้อมให้คุณกรอกวิชาและเกรดจริงทันที
                </span>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ลงทะเบียนและเริ่มใช้งานทันที</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setRegError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  มีบัญชีอยู่แล้ว? <span className="text-amber-400 underline underline-offset-4">เข้าสู่ระบบที่นี่</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT / RESET PIN FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleResetPin} className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-slate-300 text-xs flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-amber-300">ลืมรหัสผ่าน 6 ตัว?</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ใส่รหัสนักศึกษา 10 หลักของคุณ และตั้งรหัสผ่าน 6 ตัวใหม่ได้ทันที ระบบจะอัปเดตและเข้าสู่ระบบให้อัตโนมัติ
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>รหัสนักศึกษา (10 หลัก)</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">10 หลัก</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="เช่น 6902009585"
                  value={forgotStudentId}
                  onChange={(e) => setForgotStudentId(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm tracking-wider font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>รหัสผ่านใหม่</span>
                    <span className="text-[10px] text-slate-500">6 หลัก</span>
                  </label>
                  <input
                    type={showForgotPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="••••••"
                    value={forgotNewPin}
                    onChange={(e) => setForgotNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-mono text-center tracking-widest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>ยืนยันรหัสผ่าน</span>
                    <button
                      type="button"
                      onClick={() => setShowForgotPin(!showForgotPin)}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      {showForgotPin ? 'ซ่อน' : 'แสดง'}
                    </button>
                  </label>
                  <input
                    type={showForgotPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="••••••"
                    value={forgotConfirmPin}
                    onChange={(e) => setForgotConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-mono text-center tracking-widest"
                    required
                  />
                </div>
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกรหัสผ่านใหม่ & เข้าสู่ระบบ</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setForgotError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  จำรหัสผ่านได้แล้ว? <span className="text-amber-400 underline underline-offset-4">กลับไปเข้าสู่ระบบ</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>ระบบรักษาความปลอดภัยข้อมูลแยกรายบุคคลในเครื่อง • ม.ร.</span>
        </div>
      </div>
    </div>
  );
};
