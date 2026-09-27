export interface MajorItem {
  id: string;
  name: string;
  defaultCredits: number;
  description?: string;
  categories: { name: string; credits: number; color: string }[];
}

export interface FacultyItem {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  majors: MajorItem[];
}

export const RAMKHAMHAENG_FACULTIES: FacultyItem[] = [
  {
    id: 'law',
    name: 'คณะนิติศาสตร์',
    code: 'LAW',
    icon: '⚖️',
    color: 'from-amber-600 to-amber-800',
    majors: [
      {
        id: 'law_general',
        name: 'สาขาวิชานิติศาสตร์ (หลักสูตรนิติศาสตรบัณฑิต)',
        defaultCredits: 132,
        description: 'เรียนคลุมทุกด้านกฎหมาย ไม่มีแยกสาขาย่อยในระดับ ป.ตรี มุ่งเน้นกฎหมายแพ่ง พาณิชย์ อาญา วิถีพิจารณาความ และกฎหมายมหาชน',
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนและวิชาบังคับ', credits: 78, color: 'bg-amber-600' },
          { name: 'หมวดวิชาเอกเลือก', credits: 18, color: 'bg-emerald-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
    ],
  },
  {
    id: 'bba',
    name: 'คณะบริหารธุรกิจ',
    code: 'BBA',
    icon: '💼',
    color: 'from-blue-600 to-indigo-800',
    majors: [
      {
        id: 'accounting',
        name: 'สาขาวิชาการบัญชี',
        defaultCredits: 135,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกการบัญชี', credits: 63, color: 'bg-amber-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'finance',
        name: 'สาขาวิชาการเงินและการธนาคาร',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกการเงิน', credits: 60, color: 'bg-emerald-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'marketing',
        name: 'สาขาวิชาการตลาด',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกการตลาด', credits: 60, color: 'bg-rose-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'management',
        name: 'สาขาวิชาการจัดการ',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกการจัดการ', credits: 60, color: 'bg-cyan-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'digital_biz_comm',
        name: 'สาขาวิชาการสื่อสารธุรกิจดิจิทัล',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกสื่อสารธุรกิจดิจิทัล', credits: 60, color: 'bg-violet-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'logistics',
        name: 'สาขาวิชาการจัดการโลจิสติกส์และโซ่อุปทาน',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกโลจิสติกส์', credits: 60, color: 'bg-teal-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
      {
        id: 'tourism',
        name: 'สาขาวิชาการท่องเที่ยวและการบริการ',
        defaultCredits: 132,
        categories: [
          { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30, color: 'bg-blue-500' },
          { name: 'หมวดวิชาแกนธุรกิจ', credits: 36, color: 'bg-indigo-600' },
          { name: 'หมวดวิชาเอกการท่องเที่ยวฯ', credits: 60, color: 'bg-sky-600' },
          { name: 'หมวดวิชาเลือกเสรี', credits: 6, color: 'bg-purple-600' },
        ],
      },
    ],
  },
  {
    id: 'humanities',
    name: 'คณะมนุษยศาสตร์',
    code: 'HUM',
    icon: '🗣️',
    color: 'from-orange-500 to-amber-700',
    majors: [
      { id: 'eng', name: 'สาขาวิชาภาษาอังกฤษ', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'thai', name: 'สาขาวิชาภาษาไทย', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'chinese', name: 'สาขาวิชาภาษาจีน', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'japanese', name: 'สาขาวิชาภาษาญี่ปุ่น', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'french', name: 'สาขาวิชาภาษาฝรั่งเศส', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'german', name: 'สาขาวิชาภาษาเยอรมัน', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'spanish', name: 'สาขาวิชาภาษาสเปน', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'russian', name: 'สาขาวิชาภาษารัสเซีย', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'history', name: 'สาขาวิชาประวัติศาสตร์', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'philosophy', name: 'สาขาวิชาปรัชญา', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'sociology', name: 'สาขาวิชาสังคมวิทยาและมานุษยวิทยา', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'library', name: 'สาขาวิชาสารสนเทศศาสตร์และบรรณารักษ์ศาสตร์', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
    ],
  },
  {
    id: 'education',
    name: 'คณะศึกษาศาสตร์',
    code: 'EDU',
    icon: '🍎',
    color: 'from-red-600 to-rose-800',
    majors: [
      { id: 'edu_thai', name: 'ศึกษาศาสตร์ (วิชาเอกภาษาไทย - หลักสูตรครู 4 ปี)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_eng', name: 'ศึกษาศาสตร์ (วิชาเอกภาษาอังกฤษ - หลักสูตรครู 4 ปี)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_social', name: 'ศึกษาศาสตร์ (วิชาเอกสังคมศึกษา - หลักสูตรครู 4 ปี)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_math', name: 'ศึกษาศาสตร์ (วิชาเอกคณิตศาสตร์ - หลักสูตรครู 4 ปี)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_pe', name: 'ศึกษาศาสตร์ (วิชาเอกสุขศึกษาและพลศึกษา)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_primary', name: 'ศึกษาศาสตร์ (วิชาเอกประถมศึกษา)', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_earlychild', name: 'สาขาวิชาการศึกษาปฐมวัย', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_special', name: 'สาขาวิชาการศึกษาพิเศษ', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'edu_digital', name: 'สาขาวิชาเทคโนโลยีดิจิทัลและนวัตกรรมการเรียนรู้', defaultCredits: 138, categories: standardCategories(30, 48, 54, 6) },
      { id: 'psychology', name: 'สาขาวิชาจิตวิทยา (กลุ่มหลักสูตรอื่นๆ)', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'geography', name: 'สาขาวิชาภูมิศาสตร์', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
      { id: 'sport_sci', name: 'สาขาวิชาวิทยาศาสตร์การกีฬา', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
    ],
  },
  {
    id: 'science',
    name: 'คณะวิทยาศาสตร์',
    code: 'SCI',
    icon: '🔬',
    color: 'from-emerald-600 to-teal-800',
    majors: [
      { id: 'cs', name: 'สาขาวิชาวิทยาการคอมพิวเตอร์', defaultCredits: 130, categories: standardCategories(30, 42, 52, 6) },
      { id: 'it', name: 'สาขาวิชาเทคโนโลยีสารสนเทศ', defaultCredits: 130, categories: standardCategories(30, 42, 52, 6) },
      { id: 'math', name: 'สาขาวิชาคณิตศาสตร์', defaultCredits: 130, categories: standardCategories(30, 42, 52, 6) },
      { id: 'stats', name: 'สาขาวิชาสถิติศาสตร์และวิทยาการจัดการข้อมูล', defaultCredits: 130, categories: standardCategories(30, 42, 52, 6) },
      { id: 'chem', name: 'สาขาวิชาเคมี', defaultCredits: 132, categories: standardCategories(30, 42, 54, 6) },
      { id: 'phys', name: 'สาขาวิชาฟิสิกส์', defaultCredits: 132, categories: standardCategories(30, 42, 54, 6) },
      { id: 'bio', name: 'สาขาวิชาชีววิทยา', defaultCredits: 132, categories: standardCategories(30, 42, 54, 6) },
      { id: 'food_tech', name: 'สาขาวิชาเทคโนโลยีอาหาร', defaultCredits: 135, categories: standardCategories(30, 45, 54, 6) },
      { id: 'env_sci', name: 'สาขาวิชาวิทยาศาสตร์สิ่งแวดล้อม', defaultCredits: 132, categories: standardCategories(30, 42, 54, 6) },
    ],
  },
  {
    id: 'political_science',
    name: 'คณะรัฐศาสตร์',
    code: 'POL',
    icon: '🏛️',
    color: 'from-indigo-600 to-blue-900',
    majors: [
      {
        id: 'pol_gov',
        name: 'สาขาวิชารัฐศาสตร์ (วิชาเอกการเมืองการปกครอง - Plan A)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'pol_pub_admin',
        name: 'สาขาวิชารัฐศาสตร์ (วิชาเอกบริหารรัฐกิจ/การบริหารสาธารณะ - Plan B)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'pol_ir',
        name: 'สาขาวิชารัฐศาสตร์ (วิชาเอกความสัมพันธ์ระหว่างประเทศ - Plan C)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
    ],
  },
  {
    id: 'economics',
    name: 'คณะเศรษฐศาสตร์',
    code: 'ECO',
    icon: '📈',
    color: 'from-cyan-600 to-blue-800',
    majors: [
      {
        id: 'eco_finance',
        name: 'สาขาวิชาเศรษฐศาสตร์ (กลุ่มวิชาการเงินและการคลัง)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'eco_inter',
        name: 'สาขาวิชาเศรษฐศาสตร์ (กลุ่มวิชาเศรษฐศาสตร์ระหว่างประเทศ)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'eco_dev',
        name: 'สาขาวิชาเศรษฐศาสตร์ (กลุ่มวิชาเศรษฐศาสตร์การพัฒนา)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'eco_quant',
        name: 'สาขาวิชาเศรษฐศาสตร์ (กลุ่มวิชาเศรษฐศาสตร์เชิงปริมาณ)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
    ],
  },
  {
    id: 'mass_comm',
    name: 'คณะสื่อสารมวลชน',
    code: 'MCS',
    icon: '🎬',
    color: 'from-pink-600 to-rose-700',
    majors: [
      {
        id: 'comm_arts',
        name: 'สาขาวิชานิเทศศาสตร์และสื่อดิจิทัล',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
      {
        id: 'film_digital',
        name: 'สาขาวิชาภาพยนตร์ดิจิทัลและสื่อสร้างสรรค์',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
    ],
  },
  {
    id: 'hrd',
    name: 'คณะพัฒนาทรัพยากรมนุษย์',
    code: 'HRD',
    icon: '👥',
    color: 'from-amber-600 to-orange-700',
    majors: [
      {
        id: 'hrd_main',
        name: 'สาขาวิชาการพัฒนาทรัพยากรมนุษย์ (บริหารงานบุคคลและการพัฒนาองค์กร)',
        defaultCredits: 132,
        categories: standardCategories(30, 36, 60, 6),
      },
    ],
  },
  {
    id: 'special_faculties',
    name: '⚠️ กลุ่มคณะ/หลักสูตรพิเศษ',
    code: 'SPC',
    icon: '⭐',
    color: 'from-purple-700 to-slate-900',
    majors: [
      { id: 'eng_civil', name: 'คณะวิศวกรรมศาสตร์: สาขาวิชาวิศวกรรมโยธา', defaultCredits: 144, categories: standardCategories(30, 54, 54, 6) },
      { id: 'eng_comp', name: 'คณะวิศวกรรมศาสตร์: สาขาวิชาวิศวกรรมคอมพิวเตอร์', defaultCredits: 142, categories: standardCategories(30, 52, 54, 6) },
      { id: 'eng_ind', name: 'คณะวิศวกรรมศาสตร์: สาขาวิชาวิศวกรรมอุตสาหการ', defaultCredits: 142, categories: standardCategories(30, 52, 54, 6) },
      { id: 'fine_arts', name: 'คณะศิลปกรรมศาสตร์: ดนตรีไทย-สากล / นาฏศิลป์ / ศิลปะจินตทัศน์', defaultCredits: 136, categories: standardCategories(30, 40, 60, 6) },
      { id: 'public_health', name: 'คณะสาธารณสุขศาสตร์ & พยาบาลศาสตร์: สาธารณสุขชุมชน / พยาบาลศาสตร์', defaultCredits: 140, categories: standardCategories(30, 50, 54, 6) },
      { id: 'optometry', name: 'คณะทัศนมาตรศาสตร์: หลักสูตรหมอสายตา (OD 6 ปี)', defaultCredits: 220, categories: standardCategories(30, 100, 84, 6) },
      { id: 'iis_inter', name: 'สถาบันการศึกษานานาชาติ (IIS-RU): หลักสูตรภาคอินเตอร์', defaultCredits: 132, categories: standardCategories(30, 36, 60, 6) },
    ],
  },
];

function standardCategories(ge: number, core: number, major: number, free: number) {
  return [
    { name: 'หมวดวิชาศึกษาทั่วไป', credits: ge, color: 'bg-blue-500' },
    { name: 'หมวดวิชาแกน', credits: core, color: 'bg-indigo-600' },
    { name: 'หมวดวิชาเอก', credits: major, color: 'bg-amber-600' },
    { name: 'หมวดวิชาเลือกเสรี', credits: free, color: 'bg-purple-600' },
  ];
}
