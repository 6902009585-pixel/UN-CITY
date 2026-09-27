import { GradeType, Subject, HonorsStatus } from '../types';

export const GRADE_POINTS: Record<Exclude<GradeType, ''>, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
};

export const GRADE_CRITERIA_TEXT = [
  { grade: 'A', points: 4.0, scoreRange: '80 - 100', desc: 'ดีเยี่ยม (Excellent)' },
  { grade: 'B+', points: 3.5, scoreRange: '75 - 79', desc: 'ดีมาก (Very Good)' },
  { grade: 'B', points: 3.0, scoreRange: '70 - 74', desc: 'ดี (Good)' },
  { grade: 'C+', points: 2.5, scoreRange: '65 - 69', desc: 'ค่อนข้างดี (Fairly Good)' },
  { grade: 'C', points: 2.0, scoreRange: '60 - 64', desc: 'พอใช้ (Fair)' },
  { grade: 'D+', points: 1.5, scoreRange: '55 - 59', desc: 'อ่อน (Poor - รีเกรดได้)' },
  { grade: 'D', points: 1.0, scoreRange: '50 - 54', desc: 'อ่อนมาก (Very Poor - รีเกรดได้)' },
  { grade: 'F', points: 0.0, scoreRange: '0 - 49', desc: 'ไม่ผ่าน (Failed - ต้องลงเรียนใหม่)' },
];

export function calculateGradeFromScore(score: number): GradeType {
  if (score >= 80) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'D+';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * Checks if a subject can be re-graded under Ramkhamhaeng University Regulations
 * Rule: Only D and D+ are eligible. Grades C and above CANNOT be re-graded.
 */
export function checkRegradeEligibility(subject: Subject): { eligible: boolean; reason: string } {
  if (!subject.grade) {
    return { eligible: false, reason: 'วิชานี้ยังไม่มีผลการเรียน' };
  }
  if (subject.grade === 'F') {
    return { eligible: false, reason: 'เกรด F คือไม่ผ่าน ต้องลงทะเบียนเรียนใหม่ (ไม่ใช่การรีเกรด)' };
  }
  if (subject.grade === 'D' || subject.grade === 'D+') {
    return {
      eligible: true,
      reason: `สามารถรีเกรดได้ (เกรดเดิมคือ ${subject.grade}) แต่จะมีผลทำให้หมดสิทธิ์ได้รับเกียรตินิยมตามระเบียบ ม.ร.`,
    };
  }
  return {
    eligible: false,
    reason: `ไม่สามารถรีเกรดได้! ตามระเบียบ ม.รามคำแหง วิชาที่ได้เกรด C ขึ้นไป (${subject.grade}) ไม่อนุญาตให้ลงทะเบียนรีเกรด`,
  };
}

/**
 * Calculate GPA for a specific list of subjects
 */
export function calculateGPA(subjects: Subject[]): {
  gpa: number;
  totalCredits: number;
  gradedCredits: number;
  earnedCredits: number;
} {
  let totalPoints = 0;
  let gradedCredits = 0;
  let earnedCredits = 0;
  let totalCredits = 0;

  for (const s of subjects) {
    totalCredits += s.credits;
    if (s.grade) {
      const pts = GRADE_POINTS[s.grade];
      totalPoints += pts * s.credits;
      gradedCredits += s.credits;
      if (s.grade !== 'F') {
        earnedCredits += s.credits;
      }
    }
  }

  const gpa = gradedCredits > 0 ? Number((totalPoints / gradedCredits).toFixed(2)) : 0.0;
  return { gpa, totalCredits, gradedCredits, earnedCredits };
}

/**
 * Ramkhamhaeng University Honors Rules:
 * 1. Must never have received an 'F' grade in any course.
 * 2. Must never have re-graded (repeated) any passed course (D/D+ repeated).
 * 3. Complete curriculum within standard study period (typically 4 years).
 * 4. First Class Honors: GPA >= 3.50
 * 5. Second Class Honors: GPA >= 3.25
 */
export function checkHonorsEligibility(subjects: Subject[], cumulativeGpa: number): HonorsStatus {
  const disqualifyReasons: string[] = [];

  const hasFailedGrade = subjects.some((s) => s.grade === 'F' || s.status === 'failed');
  if (hasFailedGrade) {
    disqualifyReasons.push('เคยได้รับผลการเรียนเกรด F ในบางรายวิชา');
  }

  const hasRegraded = subjects.some((s) => s.isRegrade || s.status === 'regrade');
  if (hasRegraded) {
    disqualifyReasons.push('มีการลงทะเบียนรีเกรดวิชาที่เคยสอบได้ D/D+ เพื่อปรับเกรด');
  }

  if (disqualifyReasons.length > 0) {
    return {
      isEligible: false,
      honorsTier: 'none',
      honorsTitle: 'หมดสิทธิ์ได้รับเกียรตินิยม',
      disqualifyReasons,
    };
  }

  if (cumulativeGpa >= 3.50) {
    return {
      isEligible: true,
      honorsTier: 'first_class',
      honorsTitle: 'มีสิทธิ์ได้รับเกียรตินิยมอันดับหนึ่ง 🥇 (GPA ≥ 3.50)',
      disqualifyReasons: [],
    };
  } else if (cumulativeGpa >= 3.25) {
    return {
      isEligible: true,
      honorsTier: 'second_class',
      honorsTitle: 'มีสิทธิ์ได้รับเกียรตินิยมอันดับสอง 🥈 (GPA ≥ 3.25)',
      disqualifyReasons: [],
    };
  }

  return {
    isEligible: false,
    honorsTier: 'none',
    honorsTitle: 'ยังไม่ถึงเกณฑ์เกียรตินิยม (ต้องการ GPA ≥ 3.25)',
    disqualifyReasons: ['GPA สะสมปัจจุบันยังไม่ถึงเกณฑ์ขั้นต่ำ 3.25'],
  };
}

/**
 * Ramkhamhaeng University Registration Tuition Fee Calculator:
 * - Credit fee: 25 THB per credit
 * - University maintenance fee (ค่าบำรุงมหาวิทยาลัย): 500 THB regular term / 300 THB summer
 * - Ramkhamhaeng News fee (ค่าข่าวรามคำแหง): 100 THB regular term / 50 THB summer
 * - Health insurance & library fee: 100 THB
 * - Special faculty fee / lab fee: varies (optional)
 */
export function calculateRURegistrationFee(credits: number, isSummer: boolean = false): {
  creditFee: number;
  maintenanceFee: number;
  newsFee: number;
  otherFee: number;
  totalFee: number;
} {
  const creditFee = credits * 25;
  const maintenanceFee = isSummer ? 300 : 500;
  const newsFee = isSummer ? 50 : 100;
  const otherFee = isSummer ? 50 : 100;
  const totalFee = creditFee + maintenanceFee + newsFee + otherFee;

  return { creditFee, maintenanceFee, newsFee, otherFee, totalFee };
}
