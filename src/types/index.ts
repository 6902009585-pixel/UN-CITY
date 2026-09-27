export type GradeType = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F' | '';

export type SubjectStatus = 'not_taken' | 'enrolled' | 'passed' | 'failed' | 'regrade';

export interface Subject {
  id: string;
  code: string;
  nameTh: string;
  nameEn?: string;
  credits: number;
  category: string; // e.g. "หมวดศึกษาทั่วไป", "หมวดวิชาแกน", "หมวดวิชาเอก", "หมวดวิชาเลือก", "วิชาเลือกเสรี"
  semester: string; // e.g. "1/2567"
  status: SubjectStatus;
  score?: number;
  grade?: GradeType;
  midtermScore?: number;
  finalScore?: number;
  homeworkScore?: number;
  isRegrade?: boolean;
  originalSubjectId?: string; // Reference if this is a repeat of another course
  note?: string;
}

export interface StudentProfile {
  studentId: string;
  name: string;
  email: string;
  faculty: string;
  major: string;
  curriculumYear: string; // e.g. "2565", "2566", "2567"
  admissionYear: string;  // e.g. "2567"
  currentAcademicYear: string; // e.g. "2567"
  currentSemester: string; // e.g. "1/2567"
  graduationTargetYears: number; // e.g. 3 or 4
  targetGradSemester: string; // e.g. "2/2569"
  totalCreditsRequired: number; // e.g. 132
  avatarUrl?: string;
}

export interface CurriculumCategory {
  id: string;
  name: string;
  requiredCredits: number;
  color: string;
}

export interface ScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: string;
  dayOfWeek: 'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์' | 'เสาร์' | 'อาทิตย์';
  startTime: string; // e.g. "09:30"
  endTime: string;   // e.g. "11:20"
  room: string;      // e.g. "KTB 401"
  building: string;  // e.g. "อาคารกงไกรลาศ (KTB)"
  instructor?: string;
  cyberClassUrl?: string; // RU Cyber Classroom URL
  note?: string;
}

export interface ExamItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: string;
  examDate: string; // YYYY-MM-DD
  examTime: string; // e.g. "09:30 - 12:00"
  session: 'morning' | 'afternoon'; // คาบเช้า (A) 09:30-12:00, คาบบ่าย (B) 14:00-16:30
  room: string;
  seat?: string;
  building: string;
  status: 'upcoming' | 'completed';
  midtermScore?: number;
  finalScore?: number;
  homeworkScore?: number;
  totalScore?: number;
  resultGrade?: GradeType;
  notes?: string;
}

export interface AssignmentItem {
  id: string;
  subjectCode: string;
  subjectName?: string;
  title: string;
  description?: string;
  startDate: string;
  dueDate: string;
  score?: number;
  maxScore: number;
  status: 'todo' | 'in_progress' | 'submitted' | 'graded';
  fileUrl?: string;
  notes?: string;
}

export interface StudyChapter {
  id: string;
  subjectCode: string;
  chapterNumber: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
}

export interface StudyLog {
  id: string;
  subjectCode: string;
  date: string;
  durationMinutes: number;
  chapterInfo: string;
  notes?: string;
}

export type ExpenseCategory = 'registration' | 'books' | 'travel' | 'documents' | 'supplies' | 'other';

export interface ExpenseItem {
  id: string;
  semester: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  notes?: string;
}

export type EvidenceCategory = 
  | 'receipt'          // ใบเสร็จลงทะเบียน
  | 'student_card'     // บัตรนักศึกษา
  | 'exam_slip'        // ตารางสอบ/ใบแจ้งสอบ
  | 'transcript'       // ผลสอบ/ใบเช็คเกรด
  | 'uni_doc'          // เอกสารมหาวิทยาลัย
  | 'payment_slip'     // หลักฐานการชำระเงิน
  | 'notes';           // ชีทสรุป/เอกสารเรียน

export interface EvidenceDocument {
  id: string;
  category: EvidenceCategory;
  title: string;
  semester: string;
  date: string;
  fileData: string; // Base64 or URL
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  notes?: string;
}

export interface StudyPlanSemester {
  semester: string; // e.g. "1/2567", "2/2567", "S/2567"
  yearLabel: string; // "ปี 1", "ปี 2", "ปี 3", "ปี 4"
  targetCredits: number;
  subjectCodes: string[];
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  webAppUrl: string;
  lastSyncTime?: string;
  autoSync: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'assignment' | 'study' | 'registration' | 'fee' | 'info';
  date: string;
  read: boolean;
  urgent?: boolean;
}

export interface HonorsStatus {
  isEligible: boolean;
  honorsTier: 'first_class' | 'second_class' | 'none';
  honorsTitle: string;
  disqualifyReasons: string[];
}

export interface UserAccount {
  studentId: string;       // รหัสนักศึกษา 10 หลัก
  firstName: string;       // ชื่อ
  lastName: string;        // นามสกุล
  passwordPin: string;     // รหัสผ่าน 6 ตัว
  faculty: string;         // คณะ
  major: string;           // สาขาวิชา
  createdAt: string;       // วันเวลาลงทะเบียน
  lastLoginAt?: string;
}

export interface UserStoredData {
  profile: StudentProfile;
  subjects: Subject[];
  schedule: ScheduleItem[];
  exams: ExamItem[];
  assignments: AssignmentItem[];
  chapters: StudyChapter[];
  studyLogs: StudyLog[];
  expenses: ExpenseItem[];
  evidence: EvidenceDocument[];
  achievements: Achievement[];
  sheetConfig: GoogleSheetConfig;
  notifications: AppNotification[];
}

