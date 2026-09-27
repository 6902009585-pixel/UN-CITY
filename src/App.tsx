import React, { useState, useEffect } from 'react';
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
} from './types';
import { AppStorage } from './services/storage';
import { calculateGPA, checkHonorsEligibility } from './utils/gradeCalculations';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { SubjectsView } from './views/SubjectsView';
import { RegistrationView } from './views/RegistrationView';
import { ScheduleView } from './views/ScheduleView';
import { ExamsView } from './views/ExamsView';
import { ScoreGradeSimulatorView } from './views/ScoreGradeSimulatorView';
import { GradesGpaView } from './views/GradesGpaView';
import { GraduationCheckView } from './views/GraduationCheckView';
import { StudyPlanView } from './views/StudyPlanView';
import { StudyTrackerView } from './views/StudyTrackerView';
import { AssignmentsView } from './views/AssignmentsView';
import { UnifiedCalendarView } from './views/UnifiedCalendarView';
import { ExpensesView } from './views/ExpensesView';
import { EvidenceVaultView } from './views/EvidenceVaultView';
import { AnalyticsAndGoalsView } from './views/AnalyticsAndGoalsView';
import { AchievementsView } from './views/AchievementsView';
import { SettingsAndSheetsView } from './views/SettingsAndSheetsView';
import confetti from 'canvas-confetti';

export default function App() {
  // Current logged in user state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    AppStorage.getActiveUser()
  );

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Core Data States for the active user
  const [profile, setProfile] = useState<StudentProfile>(() => AppStorage.getProfile());
  const [subjects, setSubjects] = useState<Subject[]>(() => AppStorage.getSubjects());
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => AppStorage.getSchedule());
  const [exams, setExams] = useState<ExamItem[]>(() => AppStorage.getExams());
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() =>
    AppStorage.getAssignments()
  );
  const [chapters, setChapters] = useState<StudyChapter[]>(() => AppStorage.getStudyChapters());
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => AppStorage.getStudyLogs());
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => AppStorage.getExpenses());
  const [evidence, setEvidence] = useState<EvidenceDocument[]>(() => AppStorage.getEvidence());
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    AppStorage.getAchievements()
  );
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() =>
    AppStorage.getSheetConfig()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    AppStorage.getNotifications()
  );

  // Auto-save active user's data to Storage whenever states change
  useEffect(() => {
    if (currentUser) {
      AppStorage.saveProfile(profile);
    }
  }, [profile, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveSubjects(subjects);
    }
  }, [subjects, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveSchedule(schedule);
    }
  }, [schedule, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveExams(exams);
    }
  }, [exams, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveAssignments(assignments);
    }
  }, [assignments, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveStudyChapters(chapters);
    }
  }, [chapters, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveStudyLogs(studyLogs);
    }
  }, [studyLogs, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveExpenses(expenses);
    }
  }, [expenses, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveEvidence(evidence);
    }
  }, [evidence, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveAchievements(achievements);
    }
  }, [achievements, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveSheetConfig(sheetConfig);
    }
  }, [sheetConfig, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AppStorage.saveNotifications(notifications);
    }
  }, [notifications, currentUser]);

  // Derived Calculations
  const gpaData = calculateGPA(subjects);
  const cumulativeGpa = gpaData.gpa;
  const earnedCredits = gpaData.earnedCredits;
  const honorsStatus = checkHonorsEligibility(subjects, cumulativeGpa);

  const upcomingExamsCount = exams.filter(
    (e) => new Date(e.examDate) >= new Date(new Date().setHours(0, 0, 0, 0))
  ).length;

  const pendingAssignmentsCount = assignments.filter(
    (a) => a.status === 'todo' || a.status === 'in_progress'
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Reload all active user data from storage
  const handleReloadAll = () => {
    setProfile(AppStorage.getProfile());
    setSubjects(AppStorage.getSubjects());
    setSchedule(AppStorage.getSchedule());
    setExams(AppStorage.getExams());
    setAssignments(AppStorage.getAssignments());
    setChapters(AppStorage.getStudyChapters());
    setStudyLogs(AppStorage.getStudyLogs());
    setExpenses(AppStorage.getExpenses());
    setEvidence(AppStorage.getEvidence());
    setAchievements(AppStorage.getAchievements());
    setSheetConfig(AppStorage.getSheetConfig());
    setNotifications(AppStorage.getNotifications());
  };

  // Login handler
  const handleLoginSuccess = (user: UserAccount) => {
    AppStorage.setActiveStudentId(user.studentId);
    setCurrentUser(user);
    handleReloadAll();
    setActiveTab('dashboard');
  };

  // Logout handler - immediately switches to login screen
  const handleLogout = () => {
    setIsSidebarOpen(false);
    setIsNotifsOpen(false);
    AppStorage.logout();
    setCurrentUser(null);
  };

  // Reset active user's data to Clean State (all empty)
  const handleResetToCleanState = () => {
    const clean = AppStorage.resetToCleanState();
    setProfile(clean.profile);
    setSubjects([]);
    setSchedule([]);
    setExams([]);
    setAssignments([]);
    setChapters([]);
    setStudyLogs([]);
    setExpenses([]);
    setEvidence([]);
    setAchievements(clean.achievements);
    setNotifications(clean.notifications);
    setSyncToast('ล้างข้อมูลเป็นค่าว่างเรียบร้อยแล้ว พร้อมให้คุณกรอกข้อมูลใหม่ทันที');
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Load sample demo data
  const handleLoadSampleData = () => {
    const sample = AppStorage.loadSampleDataForActiveUser();
    setProfile(sample.profile);
    setSubjects(sample.subjects);
    setSchedule(sample.schedule);
    setExams(sample.exams);
    setAssignments(sample.assignments);
    setChapters(sample.chapters);
    setStudyLogs(sample.studyLogs);
    setExpenses(sample.expenses);
    setEvidence(sample.evidence);
    setAchievements(sample.achievements);
    setNotifications(sample.notifications);
    setSyncToast('โหลดชุดข้อมูลตัวอย่าง ม.รามคำแหง เรียบร้อยแล้ว');
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Reset to initial demo data
  const handleResetAllData = () => {
    handleResetToCleanState();
  };

  // Google Sheet Push Sync Action
  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    try {
      const res = await AppStorage.pushToGoogleSheet(sheetConfig, {
        profile,
        subjects,
        exams,
        schedule,
        assignments,
        expenses,
        evidence,
      });
      setSyncToast(res.message);
      setSheetConfig((prev) => ({
        ...prev,
        lastSyncTime: new Date().toLocaleTimeString('th-TH'),
      }));
      setTimeout(() => setSyncToast(null), 4000);
    } catch (err: any) {
      setSyncToast('เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets');
      setTimeout(() => setSyncToast(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Re-grade Course Action
  const handleRegradeSubject = (targetSub: Subject, targetSemester: string) => {
    const updatedOriginal: Subject = {
      ...targetSub,
      isRegrade: true,
      status: 'regrade',
      note: `ลงทะเบียนรีเกรดในภาค ${targetSemester} (เกรดเดิม ${targetSub.grade} หมดสิทธิ์เกียรตินิยม)`,
    };

    const newEnrolledSub: Subject = {
      id: `sub-regrade-${Date.now()}`,
      code: targetSub.code,
      nameTh: targetSub.nameTh,
      nameEn: targetSub.nameEn,
      credits: targetSub.credits,
      category: targetSub.category,
      semester: targetSemester,
      status: 'enrolled',
      isRegrade: true,
      originalSubjectId: targetSub.id,
      note: `วิชารีเกรดจากภาค ${targetSub.semester} (เกรดเดิม ${targetSub.grade})`,
    };

    setSubjects((prev) => [
      ...prev.filter((s) => s.id !== targetSub.id),
      updatedOriginal,
      newEnrolledSub,
    ]);

    const regradeNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `ลงทะเบียนรีเกรด ${targetSub.code}`,
      message: `คุณได้ลงทะเบียนรีเกรดวิชา ${targetSub.code} ในภาค ${targetSemester} แล้ว ตามระเบียบ ม.รามคำแหง ท่านจะหมดสิทธิ์ได้รับเกียรตินิยม`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false,
      urgent: true,
    };
    setNotifications((prev) => [regradeNotif, ...prev]);

    alert(
      `ลงทะเบียนรีเกรดวิชา ${targetSub.code} ในภาค ${targetSemester} สำเร็จแล้ว!\nระบบได้บันทึกสถานะการรีเกรดเรียบร้อยแล้ว`
    );
  };

  // If user is not authenticated, show AuthScreen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        honorsStatus={honorsStatus}
        cumulativeGpa={cumulativeGpa}
        earnedCredits={earnedCredits}
        isSyncing={isSyncing}
        onSyncGoogleSheet={handleSyncGoogleSheet}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenProfile={() => setActiveTab('profile')}
        onLogout={handleLogout}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          upcomingExamsCount={upcomingExamsCount}
          pendingAssignmentsCount={pendingAssignmentsCount}
          unreadNotifsCount={unreadNotifsCount}
          onLogout={handleLogout}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              subjects={subjects}
              exams={exams}
              assignments={assignments}
              notifications={notifications}
              honorsStatus={honorsStatus}
              cumulativeGpa={cumulativeGpa}
              earnedCredits={earnedCredits}
              onNavigate={setActiveTab}
              onOpenProfile={() => setActiveTab('profile')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={setProfile}
              onLogout={handleLogout}
              onResetToCleanState={handleResetToCleanState}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView
              subjects={subjects}
              onAddSubject={(s) => setSubjects((prev) => [s, ...prev])}
              onUpdateSubject={(s) =>
                setSubjects((prev) => prev.map((item) => (item.id === s.id ? s : item)))
              }
              onDeleteSubject={(id) => setSubjects((prev) => prev.filter((s) => s.id !== id))}
              onRegradeSubject={handleRegradeSubject}
            />
          )}

          {activeTab === 'registration' && (
            <RegistrationView
              profile={profile}
              subjects={subjects}
              onAddSubject={(s) => setSubjects((prev) => [s, ...prev])}
              onUpdateSubject={(s) =>
                setSubjects((prev) => prev.map((item) => (item.id === s.id ? s : item)))
              }
              onDeleteSubject={(id) => setSubjects((prev) => prev.filter((s) => s.id !== id))}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleView
              schedule={schedule}
              onAddSchedule={(item) => setSchedule((prev) => [...prev, item])}
              onDeleteSchedule={(id) => setSchedule((prev) => prev.filter((s) => s.id !== id))}
            />
          )}

          {activeTab === 'exams' && (
            <ExamsView
              exams={exams}
              onAddExam={(item) => setExams((prev) => [...prev, item])}
              onUpdateExam={(item) =>
                setExams((prev) => prev.map((e) => (e.id === item.id ? item : e)))
              }
              onDeleteExam={(id) => setExams((prev) => prev.filter((e) => e.id !== id))}
            />
          )}

          {activeTab === 'scores' && (
            <ScoreGradeSimulatorView
              subjects={subjects}
              onUpdateSubject={(s) =>
                setSubjects((prev) => prev.map((item) => (item.id === s.id ? s : item)))
              }
            />
          )}

          {activeTab === 'grades' && (
            <GradesGpaView
              subjects={subjects}
              honorsStatus={honorsStatus}
              cumulativeGpa={cumulativeGpa}
              earnedCredits={earnedCredits}
            />
          )}

          {activeTab === 'graduation' && (
            <GraduationCheckView
              profile={profile}
              subjects={subjects}
              earnedCredits={earnedCredits}
            />
          )}

          {activeTab === 'study_plan' && (
            <StudyPlanView profile={profile} subjects={subjects} />
          )}

          {activeTab === 'reading' && (
            <StudyTrackerView
              subjects={subjects}
              chapters={chapters}
              studyLogs={studyLogs}
              onUpdateChapter={(c) =>
                setChapters((prev) => prev.map((item) => (item.id === c.id ? c : item)))
              }
              onAddChapter={(c) => setChapters((prev) => [...prev, c])}
              onAddStudyLog={(log) => setStudyLogs((prev) => [log, ...prev])}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              subjects={subjects}
              onAddAssignment={(item) => setAssignments((prev) => [item, ...prev])}
              onUpdateAssignment={(item) =>
                setAssignments((prev) => prev.map((a) => (a.id === item.id ? item : a)))
              }
              onDeleteAssignment={(id) =>
                setAssignments((prev) => prev.filter((a) => a.id !== id))
              }
            />
          )}

          {activeTab === 'calendar' && (
            <UnifiedCalendarView
              schedule={schedule}
              exams={exams}
              assignments={assignments}
              studyLogs={studyLogs}
              expenses={expenses}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              onAddExpense={(item) => setExpenses((prev) => [item, ...prev])}
              onDeleteExpense={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceVaultView
              evidence={evidence}
              onAddEvidence={(item) => setEvidence((prev) => [item, ...prev])}
              onDeleteEvidence={(id) => setEvidence((prev) => prev.filter((e) => e.id !== id))}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsAndGoalsView
              profile={profile}
              subjects={subjects}
              studyLogs={studyLogs}
              assignments={assignments}
            />
          )}

          {activeTab === 'goals' && (
            <AnalyticsAndGoalsView
              profile={profile}
              subjects={subjects}
              studyLogs={studyLogs}
              assignments={assignments}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              onTriggerCelebration={() => {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsAndSheetsView
              sheetConfig={sheetConfig}
              onSaveSheetConfig={setSheetConfig}
              onSyncGoogleSheet={handleSyncGoogleSheet}
              isSyncing={isSyncing}
              onResetAllData={handleResetAllData}
              onReloadAllData={handleReloadAll}
              onResetToCleanState={handleResetToCleanState}
              onLoadSampleData={handleLoadSampleData}
            />
          )}
        </main>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        notifications={notifications}
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        onMarkAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />
    </div>
  );
}
