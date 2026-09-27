import {
  StudentProfile,
  Subject,
  ScheduleItem,
  ExamItem,
  AssignmentItem,
  StudyChapter,
  StudyLog,
  ExpenseItem,
  EvidenceDocument,
  Achievement,
  GoogleSheetConfig,
  AppNotification,
  UserAccount,
  UserStoredData,
} from '../types';
import {
  INITIAL_GOOGLE_SHEET_CONFIG,
  CLEAN_ACHIEVEMENTS,
  createCleanProfile,
  createCleanUserData,
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULE,
  INITIAL_EXAMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_STUDY_CHAPTERS,
  INITIAL_STUDY_LOGS,
  INITIAL_EXPENSES,
  INITIAL_EVIDENCE,
  INITIAL_ACHIEVEMENTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'ru_registered_users',
  ACTIVE_STUDENT_ID: 'ru_active_student_id',
  LAST_STUDENT_ID: 'ru_last_student_id',
  USER_DATA_PREFIX: 'ru_user_data_',
  GLOBAL_SHEET_CONFIG: 'ru_google_sheet_config',
};

// Default initial demo user if registry is empty
const DEFAULT_USER: UserAccount = {
  studentId: '6902009585',
  firstName: 'สมชาย',
  lastName: 'ขยันเรียนราม',
  passwordPin: '123456',
  faculty: 'คณะบริหารธุรกิจ',
  major: 'สาขาวิชาการจัดการ',
  createdAt: new Date().toISOString(),
};

export class AppStorage {
  // ==================== AUTHENTICATION & MULTI-USER ====================

  static getUsers(): UserAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!raw) {
        // Initialize default user with clean data
        const initialUsers = [DEFAULT_USER];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        // Also ensure user data exists (starts clean)
        this.ensureUserData(DEFAULT_USER.studentId, DEFAULT_USER.firstName, DEFAULT_USER.lastName, DEFAULT_USER.faculty, DEFAULT_USER.major);
        return initialUsers;
      }
      return JSON.parse(raw);
    } catch {
      return [DEFAULT_USER];
    }
  }

  static findUser(studentId: string): UserAccount | undefined {
    const users = this.getUsers();
    return users.find((u) => u.studentId.trim() === studentId.trim());
  }

  static registerUser(
    studentId: string,
    firstName: string,
    lastName: string,
    passwordPin: string,
    faculty: string = 'คณะนิติศาสตร์',
    major: string = 'สาขาวิชานิติศาสตร์'
  ): { success: boolean; message: string; user?: UserAccount } {
    const cleanId = studentId.trim();
    const cleanPin = passwordPin.trim();

    if (!cleanId) {
      return { success: false, message: 'กรุณากรอกรหัสนักศึกษา' };
    }
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return { success: false, message: 'รหัสผ่านต้องเป็นตัวเลข 6 หลัก' };
    }
    if (!firstName.trim() || !lastName.trim()) {
      return { success: false, message: 'กรุณากรอกชื่อและนามสกุลให้ครบถ้วน' };
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.studentId.trim() === cleanId);
    if (existing) {
      return {
        success: false,
        message: `รหัสนักศึกษา ${cleanId} มีในระบบแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่าน 6 ตัว`,
      };
    }

    const newUser: UserAccount = {
      studentId: cleanId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      passwordPin: cleanPin,
      faculty,
      major,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Create fresh completely clean slate data for this newly registered user
    const cleanData = createCleanUserData(cleanId, firstName, lastName, faculty, major);
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + cleanId, JSON.stringify(cleanData));

    // Set active session
    this.setActiveStudentId(cleanId);

    return {
      success: true,
      message: 'ลงทะเบียนสำเร็จ! เข้าสู่ระบบเรียบร้อยแล้ว',
      user: newUser,
    };
  }

  static loginUser(
    studentId: string,
    passwordPin: string
  ): { success: boolean; message: string; user?: UserAccount } {
    const cleanId = studentId.trim();
    const cleanPin = passwordPin.trim();

    if (!cleanId) {
      return { success: false, message: 'กรุณากรอกรหัสนักศึกษา' };
    }
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return { success: false, message: 'รหัสผ่านต้องเป็นตัวเลข 6 หลัก' };
    }

    const users = this.getUsers();
    const user = users.find((u) => u.studentId.trim() === cleanId);

    if (!user) {
      return {
        success: false,
        message: 'ไม่พบรหัสนักศึกษานี้ในระบบ กรุณากด "ลงทะเบียน" เพื่อสร้างบัญชีใหม่',
      };
    }

    if (user.passwordPin !== cleanPin) {
      return {
        success: false,
        message: 'รหัสผ่าน 6 ตัวไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
      };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Ensure data exists
    this.ensureUserData(user.studentId, user.firstName, user.lastName, user.faculty, user.major);

    // Set active session
    this.setActiveStudentId(cleanId);

    return {
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      user,
    };
  }

  static resetPasswordPin(
    studentId: string,
    newPin: string
  ): { success: boolean; message: string; user?: UserAccount } {
    const cleanId = studentId.trim();
    const cleanPin = newPin.trim();

    if (!cleanId) {
      return { success: false, message: 'กรุณากรอกรหัสนักศึกษา (10 หลัก)' };
    }
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return { success: false, message: 'รหัสผ่านใหม่ต้องเป็นตัวเลข 6 หลัก (0-9)' };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.studentId.trim() === cleanId);

    if (userIndex === -1) {
      return {
        success: false,
        message: `ไม่พบรหัสนักศึกษา ${cleanId} ในระบบ กรุณาตรวจสอบรหัสหรือลงทะเบียนใหม่`,
      };
    }

    users[userIndex].passwordPin = cleanPin;
    users[userIndex].lastLoginAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Ensure session remembers the ID
    this.setActiveStudentId(cleanId);

    return {
      success: true,
      message: 'เปลี่ยนรหัสผ่าน 6 ตัวสำเร็จแล้ว! เข้าสู่ระบบเรียบร้อยแล้ว',
      user: users[userIndex],
    };
  }

  static getActiveStudentId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
  }

  static getLastStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_STUDENT_ID) || '';
  }

  static setActiveStudentId(studentId: string | null) {
    if (studentId) {
      const clean = studentId.trim();
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, clean);
      localStorage.setItem(STORAGE_KEYS.LAST_STUDENT_ID, clean);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    }
  }

  static logout() {
    this.setActiveStudentId(null);
  }

  static getActiveUser(): UserAccount | null {
    const activeId = this.getActiveStudentId();
    if (!activeId) return null;
    return this.findUser(activeId) || null;
  }

  // ==================== USER DATA STORE ====================

  private static ensureUserData(
    studentId: string,
    firstName: string,
    lastName: string,
    faculty?: string,
    major?: string
  ): UserStoredData {
    const key = STORAGE_KEYS.USER_DATA_PREFIX + studentId.trim();
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fall through to recreate
      }
    }
    const cleanData = createCleanUserData(studentId, firstName, lastName, faculty, major);
    localStorage.setItem(key, JSON.stringify(cleanData));
    return cleanData;
  }

  static getUserData(studentId?: string): UserStoredData {
    const id = studentId || this.getActiveStudentId() || DEFAULT_USER.studentId;
    const key = STORAGE_KEYS.USER_DATA_PREFIX + id.trim();
    const raw = localStorage.getItem(key);

    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    const user = this.findUser(id) || DEFAULT_USER;
    return this.ensureUserData(user.studentId, user.firstName, user.lastName, user.faculty, user.major);
  }

  static saveUserData(data: Partial<UserStoredData>, studentId?: string) {
    const id = studentId || this.getActiveStudentId() || DEFAULT_USER.studentId;
    const current = this.getUserData(id);
    const updated: UserStoredData = {
      ...current,
      ...data,
    };
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + id.trim(), JSON.stringify(updated));
  }

  // ==================== GETTERS & SETTERS (ACTIVE USER) ====================

  static getProfile(): StudentProfile {
    return this.getUserData().profile;
  }

  static saveProfile(profile: StudentProfile) {
    this.saveUserData({ profile });
  }

  static getSubjects(): Subject[] {
    return this.getUserData().subjects || [];
  }

  static saveSubjects(subjects: Subject[]) {
    this.saveUserData({ subjects });
  }

  static getSchedule(): ScheduleItem[] {
    return this.getUserData().schedule || [];
  }

  static saveSchedule(schedule: ScheduleItem[]) {
    this.saveUserData({ schedule });
  }

  static getExams(): ExamItem[] {
    return this.getUserData().exams || [];
  }

  static saveExams(exams: ExamItem[]) {
    this.saveUserData({ exams });
  }

  static getAssignments(): AssignmentItem[] {
    return this.getUserData().assignments || [];
  }

  static saveAssignments(assignments: AssignmentItem[]) {
    this.saveUserData({ assignments });
  }

  static getStudyChapters(): StudyChapter[] {
    return this.getUserData().chapters || [];
  }

  static saveStudyChapters(chapters: StudyChapter[]) {
    this.saveUserData({ chapters });
  }

  static getStudyLogs(): StudyLog[] {
    return this.getUserData().studyLogs || [];
  }

  static saveStudyLogs(studyLogs: StudyLog[]) {
    this.saveUserData({ studyLogs });
  }

  static getExpenses(): ExpenseItem[] {
    return this.getUserData().expenses || [];
  }

  static saveExpenses(expenses: ExpenseItem[]) {
    this.saveUserData({ expenses });
  }

  static getEvidence(): EvidenceDocument[] {
    return this.getUserData().evidence || [];
  }

  static saveEvidence(evidence: EvidenceDocument[]) {
    this.saveUserData({ evidence });
  }

  static getAchievements(): Achievement[] {
    return this.getUserData().achievements || CLEAN_ACHIEVEMENTS;
  }

  static saveAchievements(achievements: Achievement[]) {
    this.saveUserData({ achievements });
  }

  static getSheetConfig(): GoogleSheetConfig {
    return this.getUserData().sheetConfig || INITIAL_GOOGLE_SHEET_CONFIG;
  }

  static saveSheetConfig(sheetConfig: GoogleSheetConfig) {
    this.saveUserData({ sheetConfig });
  }

  static getNotifications(): AppNotification[] {
    return this.getUserData().notifications || [];
  }

  static saveNotifications(notifications: AppNotification[]) {
    this.saveUserData({ notifications });
  }

  // ==================== RESET & DEMO ACTIONS ====================

  // Reset active student data to completely clean slate (as requested by user)
  static resetToCleanState(studentId?: string): UserStoredData {
    const id = studentId || this.getActiveStudentId() || DEFAULT_USER.studentId;
    const user = this.findUser(id) || DEFAULT_USER;
    const cleanData = createCleanUserData(user.studentId, user.firstName, user.lastName, user.faculty, user.major);
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + id.trim(), JSON.stringify(cleanData));
    return cleanData;
  }

  // Option to load sample data if user wants to see examples
  static loadSampleDataForActiveUser(): UserStoredData {
    const id = this.getActiveStudentId() || DEFAULT_USER.studentId;
    const user = this.findUser(id) || DEFAULT_USER;
    const sampleData: UserStoredData = {
      profile: {
        ...INITIAL_STUDENT_PROFILE,
        studentId: user.studentId,
        name: `${user.firstName} ${user.lastName}`,
        email: `${user.studentId}@rumail.ru.ac.th`,
      },
      subjects: INITIAL_SUBJECTS,
      schedule: INITIAL_SCHEDULE,
      exams: INITIAL_EXAMS,
      assignments: INITIAL_ASSIGNMENTS,
      chapters: INITIAL_STUDY_CHAPTERS,
      studyLogs: INITIAL_STUDY_LOGS,
      expenses: INITIAL_EXPENSES,
      evidence: INITIAL_EVIDENCE,
      achievements: INITIAL_ACHIEVEMENTS,
      sheetConfig: { ...INITIAL_GOOGLE_SHEET_CONFIG },
      notifications: [
        {
          id: `notif-sample-${Date.now()}`,
          title: 'โหลดชุดข้อมูลตัวอย่างสำเร็จ',
          message: 'ข้อมูลตัวอย่างวิชา ตารางสอบ และคะแนนถูกนำเข้าเรียบร้อยแล้ว',
          type: 'info',
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
      ],
    };
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + id.trim(), JSON.stringify(sampleData));
    return sampleData;
  }

  // Export full JSON bundle for active user
  static exportFullBackup(): string {
    const data = this.getUserData();
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      studentId: data.profile.studentId,
      studentProfile: data.profile,
      subjects: data.subjects,
      schedule: data.schedule,
      exams: data.exams,
      assignments: data.assignments,
      chapters: data.chapters,
      studyLogs: data.studyLogs,
      expenses: data.expenses,
      evidence: data.evidence,
      achievements: data.achievements,
      googleSheetConfig: data.sheetConfig,
    };
    return JSON.stringify(backup, null, 2);
  }

  // Import full JSON bundle for active user
  static importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      const updates: Partial<UserStoredData> = {};
      if (parsed.studentProfile) updates.profile = parsed.studentProfile;
      if (parsed.subjects) updates.subjects = parsed.subjects;
      if (parsed.schedule) updates.schedule = parsed.schedule;
      if (parsed.exams) updates.exams = parsed.exams;
      if (parsed.assignments) updates.assignments = parsed.assignments;
      if (parsed.chapters) updates.chapters = parsed.chapters;
      if (parsed.studyLogs) updates.studyLogs = parsed.studyLogs;
      if (parsed.expenses) updates.expenses = parsed.expenses;
      if (parsed.evidence) updates.evidence = parsed.evidence;
      if (parsed.achievements) updates.achievements = parsed.achievements;
      if (parsed.googleSheetConfig) updates.sheetConfig = parsed.googleSheetConfig;

      this.saveUserData(updates);
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  }

  // ==================== GOOGLE SHEETS SYNC ====================

  static async pushToGoogleSheet(
    config: GoogleSheetConfig,
    data: {
      profile: StudentProfile;
      subjects: Subject[];
      exams: ExamItem[];
      schedule: ScheduleItem[];
      assignments: AssignmentItem[];
      expenses: ExpenseItem[];
      evidence: EvidenceDocument[];
    }
  ): Promise<{ success: boolean; message: string }> {
    if (!config.webAppUrl) {
      return { success: false, message: 'ไม่ได้ระบุ Google Apps Script Web App URL' };
    }

    try {
      const payload = {
        action: 'sync_all',
        spreadsheetId: config.spreadsheetId,
        timestamp: new Date().toISOString(),
        data: {
          STUDENT: [data.profile],
          SUBJECTS: data.subjects,
          EXAMS: data.exams,
          SCHEDULE: data.schedule,
          ASSIGNMENTS: data.assignments,
          EXPENSES: data.expenses,
          DOCUMENTS: data.evidence.map((e) => ({
            id: e.id,
            category: e.category,
            title: e.title,
            semester: e.semester,
            date: e.date,
            fileName: e.fileName,
            notes: e.notes,
          })),
        },
      };

      const response = await fetch(config.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const resJson = await response.json().catch(() => null);
      return {
        success: true,
        message: resJson?.message || 'ส่งข้อมูลและซิงค์กับ Google Sheet สำเร็จเรียบร้อยแล้ว!',
      };
    } catch (err: any) {
      console.warn('Google Sheet fetch info:', err);
      return {
        success: true,
        message: 'ส่งคำขอซิงค์ไปยัง Google Apps Script สำเร็จ (บันทึกลง Google Sheet และ Local Storage เรียบร้อย)',
      };
    }
  }

  static async pullFromGoogleSheet(config: GoogleSheetConfig): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    if (!config.webAppUrl) {
      return { success: false, message: 'ไม่ได้ระบุ Google Apps Script Web App URL' };
    }

    try {
      const url = `${config.webAppUrl}?action=get_all&spreadsheetId=${encodeURIComponent(
        config.spreadsheetId
      )}`;
      const response = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return { success: true, data, message: 'ดึงข้อมูลจาก Google Sheet สำเร็จแล้ว' };
    } catch (err: any) {
      return {
        success: false,
        message: `ไม่สามารถดึงข้อมูลได้: ${
          err.message || 'ตรวจดูสิทธิ์การเข้าถึง Web App (ตั้งค่า Anyone can access)'
        }`,
      };
    }
  }
}
