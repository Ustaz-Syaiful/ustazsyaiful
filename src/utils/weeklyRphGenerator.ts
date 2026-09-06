import { RPHItem, ScriptType, RptItem } from '../types';
import { allRptDataTahun1 } from '../data/rptTahun1Data';
import { allRptDataTahun2 } from '../data/rptTahun2Data';
import { allRptDataTahun3 } from '../data/rptTahun3Data';
import { allRptDataTahun6 } from '../data/rptTahun6Data';
import { createTasmikRph } from '../data/tasmikConstants';
import { getJawiRph } from '../utils/jawiConverter';

export interface WeeklySlotConfig {
  slotNumber: number; // 1 to 15
  day: 'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS';
  dayJawi: string;
  dayIndex: number; // 0 for Ahad, 1 for Isnin, 2 for Selasa, 3 for Rabu, 4 for Khamis
  time: string;
  periodLabel: string;
  className: string;
  yearLevel: 'Tahun 1' | 'Tahun 2' | 'Tahun 3' | 'Tahun 4' | 'Tahun 6';
  category: 'AQ' | 'ULUM' | 'JAWI' | 'TSMK';
  subjectDisplay: string;
  subjectCategoryRpt: string;
  isTasmik: boolean;
  defaultTotalStudents: number;
}

export const CLASS_DEFAULT_ATTENDANCE: Record<string, { total: number; ratio: string }> = {
  '1 IBNU SINA': { total: 29, ratio: '29/29' },
  '2 IBNU SINA': { total: 26, ratio: '26/26' },
  '3 IBNU SINA': { total: 33, ratio: '33/33' },
  '4 IBNU SINA': { total: 29, ratio: '29/29' },
  '6 IBNU SINA': { total: 27, ratio: '27/27' },
  '6 IBNU KHALDUN': { total: 25, ratio: '25/25' },
  '1 IBNU KHALDUN': { total: 29, ratio: '29/29' }
};

export function getClassAttendance(className: string): { total: number; ratio: string } {
  const norm = className.toUpperCase();
  if (norm.includes('1 IBNU SINA') || norm.includes('1 IS')) return { total: 29, ratio: '29/29' };
  if (norm.includes('2 IBNU SINA') || norm.includes('2 IS')) return { total: 26, ratio: '26/26' };
  if (norm.includes('3 IBNU SINA') || norm.includes('3 IS')) return { total: 33, ratio: '33/33' };
  if (norm.includes('4 IBNU SINA') || norm.includes('4 IS')) return { total: 29, ratio: '29/29' };
  if (norm.includes('6 IBNU SINA') || norm.includes('6 IS')) return { total: 27, ratio: '27/27' };
  if (norm.includes('6 IBNU KHALDUN') || norm.includes('6 IK')) return { total: 25, ratio: '25/25' };
  if (norm.includes('1 IBNU KHALDUN') || norm.includes('1 IK')) return { total: 29, ratio: '29/29' };
  return { total: 30, ratio: '30/30' };
}

/**
 * The 15 official weekly teaching slots from Jadual Waktu SK Merbau Pulas (KBA 5012)
 * Ordered chronologically by Day (Ahad to Khamis) and Start Time
 */
export const WEEKLY_15_SLOTS: WeeklySlotConfig[] = [
  // ================= AHAD (4 SLOTS) =================
  {
    slotNumber: 1,
    day: 'AHAD',
    dayJawi: 'احد',
    dayIndex: 0,
    time: '08:15 - 09:15 (60 Minit)',
    periodLabel: 'Waktu 2 - 3',
    className: '2 IBNU SINA (2 IS)',
    yearLevel: 'Tahun 2',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 26
  },
  {
    slotNumber: 2,
    day: 'AHAD',
    dayJawi: 'احد',
    dayIndex: 0,
    time: '10:15 - 11:15 (60 Minit)',
    periodLabel: 'Waktu 6 - 7',
    className: '6 IBNU KHALDUN (6 IK)',
    yearLevel: 'Tahun 6',
    category: 'TSMK',
    subjectDisplay: 'Tasmik Al-Quran j-QAF',
    subjectCategoryRpt: 'Tadarus/Tasmik',
    isTasmik: true,
    defaultTotalStudents: 25
  },
  {
    slotNumber: 3,
    day: 'AHAD',
    dayJawi: 'احد',
    dayIndex: 0,
    time: '12:15 - 12:45 (30 Minit)',
    periodLabel: 'Waktu 10',
    className: '6 IBNU SINA (6 IS)',
    yearLevel: 'Tahun 6',
    category: 'JAWI',
    subjectDisplay: 'Pendidikan Islam (Jawi)',
    subjectCategoryRpt: 'Jawi',
    isTasmik: false,
    defaultTotalStudents: 27
  },
  {
    slotNumber: 4,
    day: 'AHAD',
    dayJawi: 'احد',
    dayIndex: 0,
    time: '12:45 - 01:45 (60 Minit)',
    periodLabel: 'Waktu 11 - 12',
    className: '6 IBNU SINA (6 IS)',
    yearLevel: 'Tahun 6',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 27
  },

  // ================= ISNIN (3 SLOTS) =================
  {
    slotNumber: 5,
    day: 'ISNIN',
    dayJawi: 'اثنين',
    dayIndex: 1,
    time: '08:45 - 09:45 (60 Minit)',
    periodLabel: 'Waktu 3 - 4',
    className: '6 IBNU SINA (6 IS)',
    yearLevel: 'Tahun 6',
    category: 'ULUM',
    subjectDisplay: "Pendidikan Islam (Ulum Syari'yyah)",
    subjectCategoryRpt: 'Akidah',
    isTasmik: false,
    defaultTotalStudents: 27
  },
  {
    slotNumber: 6,
    day: 'ISNIN',
    dayJawi: 'اثنين',
    dayIndex: 1,
    time: '11:15 - 11:45 (30 Minit)',
    periodLabel: 'Waktu 8',
    className: '6 IBNU SINA (6 IS)',
    yearLevel: 'Tahun 6',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 27
  },
  {
    slotNumber: 7,
    day: 'ISNIN',
    dayJawi: 'اثنين',
    dayIndex: 1,
    time: '12:45 - 01:45 (60 Minit)',
    periodLabel: 'Waktu 11 - 12',
    className: '6 IBNU KHALDUN (6 IK)',
    yearLevel: 'Tahun 6',
    category: 'ULUM',
    subjectDisplay: "Pendidikan Islam (Ulum Syari'yyah)",
    subjectCategoryRpt: 'Ibadah',
    isTasmik: false,
    defaultTotalStudents: 25
  },

  // ================= SELASA (4 SLOTS) =================
  {
    slotNumber: 8,
    day: 'SELASA',
    dayJawi: 'ثلاثاء',
    dayIndex: 2,
    time: '08:15 - 09:15 (60 Minit)',
    periodLabel: 'Waktu 2 - 3',
    className: '4 IBNU SINA (4 IS)',
    yearLevel: 'Tahun 4',
    category: 'TSMK',
    subjectDisplay: 'Tasmik Al-Quran j-QAF',
    subjectCategoryRpt: 'Tadarus/Tasmik',
    isTasmik: true,
    defaultTotalStudents: 29
  },
  {
    slotNumber: 9,
    day: 'SELASA',
    dayJawi: 'ثلاثاء',
    dayIndex: 2,
    time: '09:15 - 09:45 (30 Minit)',
    periodLabel: 'Waktu 4',
    className: '6 IBNU KHALDUN (6 IK)',
    yearLevel: 'Tahun 6',
    category: 'JAWI',
    subjectDisplay: 'Pendidikan Islam (Jawi)',
    subjectCategoryRpt: 'Jawi',
    isTasmik: false,
    defaultTotalStudents: 25
  },
  {
    slotNumber: 10,
    day: 'SELASA',
    dayJawi: 'ثلاثاء',
    dayIndex: 2,
    time: '10:15 - 11:15 (60 Minit)',
    periodLabel: 'Waktu 6 - 7',
    className: '6 IBNU KHALDUN (6 IK)',
    yearLevel: 'Tahun 6',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 25
  },
  {
    slotNumber: 11,
    day: 'SELASA',
    dayJawi: 'ثلاثاء',
    dayIndex: 2,
    time: '12:15 - 01:15 (60 Minit)',
    periodLabel: 'Waktu 10 - 11',
    className: '6 IBNU SINA (6 IS)',
    yearLevel: 'Tahun 6',
    category: 'TSMK',
    subjectDisplay: 'Tasmik Al-Quran j-QAF',
    subjectCategoryRpt: 'Tadarus/Tasmik',
    isTasmik: true,
    defaultTotalStudents: 27
  },

  // ================= RABU (2 SLOTS) =================
  {
    slotNumber: 12,
    day: 'RABU',
    dayJawi: 'رابو',
    dayIndex: 3,
    time: '11:45 - 12:15 (30 Minit)',
    periodLabel: 'Waktu 9',
    className: '6 IBNU KHALDUN (6 IK)',
    yearLevel: 'Tahun 6',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 25
  },
  {
    slotNumber: 13,
    day: 'RABU',
    dayJawi: 'رابو',
    dayIndex: 3,
    time: '12:15 - 01:15 (60 Minit)',
    periodLabel: 'Waktu 10 - 11',
    className: '2 IBNU SINA (2 IS)',
    yearLevel: 'Tahun 2',
    category: 'TSMK',
    subjectDisplay: 'Tasmik Al-Quran j-QAF',
    subjectCategoryRpt: 'Tadarus/Tasmik',
    isTasmik: true,
    defaultTotalStudents: 26
  },

  // ================= KHAMIS (2 SLOTS) =================
  {
    slotNumber: 14,
    day: 'KHAMIS',
    dayJawi: 'خميس',
    dayIndex: 4,
    time: '10:15 - 11:15 (60 Minit)',
    periodLabel: 'Waktu 6 - 7',
    className: '1 IBNU SINA (1 IS)',
    yearLevel: 'Tahun 1',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 29
  },
  {
    slotNumber: 15,
    day: 'KHAMIS',
    dayJawi: 'خميس',
    dayIndex: 4,
    time: '11:15 - 12:15 (60 Minit)',
    periodLabel: 'Waktu 8 - 9',
    className: '3 IBNU SINA (3 IS)',
    yearLevel: 'Tahun 3',
    category: 'AQ',
    subjectDisplay: 'Pendidikan Islam (Al-Quran)',
    subjectCategoryRpt: 'Al-Quran',
    isTasmik: false,
    defaultTotalStudents: 33
  }
];

/**
 * Calculates date for each day index (0=Ahad, 1=Isnin, 2=Selasa, 3=Rabu, 4=Khamis)
 * based on a Sunday start date.
 */
export function getDateForDayIndex(startDateString: string, dayIndex: number): string {
  try {
    const base = new Date(startDateString);
    if (isNaN(base.getTime())) {
      const today = new Date();
      today.setDate(today.getDate() + dayIndex);
      return today.toISOString().split('T')[0];
    }
    const target = new Date(base);
    target.setDate(base.getDate() + dayIndex);
    return target.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function addDaysToDate(dateString: string, days: number): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

export function getSundayOfWeek(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = d.getDay(); // 0 is Sunday, 1 is Monday...
    d.setDate(d.getDate() - day);
    return d.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

export function getSundayForWeek(week: number, baseSundayStr: string = '2026-01-18', baseWeek: number = 30): string {
  try {
    const base = new Date(baseSundayStr);
    if (isNaN(base.getTime())) return '2026-01-18';
    const diffWeeks = week - baseWeek;
    base.setDate(base.getDate() + diffWeeks * 7);
    return base.toISOString().split('T')[0];
  } catch {
    return '2026-01-18';
  }
}

/**
 * Finds appropriate RPT item for a given slot configuration and week.
 */
function findRptForSlot(config: WeeklySlotConfig, week: number): RptItem | undefined {
  let rptPool: RptItem[] = [];

  switch (config.yearLevel) {
    case 'Tahun 1':
      rptPool = allRptDataTahun1;
      break;
    case 'Tahun 2':
      rptPool = allRptDataTahun2;
      break;
    case 'Tahun 3':
      rptPool = allRptDataTahun3;
      break;
    case 'Tahun 6':
      rptPool = allRptDataTahun6;
      break;
    default:
      rptPool = allRptDataTahun6;
  }

  // 1. Exact week match
  const weekItems = rptPool.filter((item) => item.week === week);

  if (weekItems.length > 0) {
    // Try matching category
    if (config.category === 'JAWI') {
      const jawiItem = weekItems.find(
        (i) =>
          i.subjectCategory === 'Jawi' ||
          (i.topicTitle && i.topicTitle.toLowerCase().includes('jawi')) ||
          (i.timeSlot && i.timeSlot.includes('جاوي'))
      );
      if (jawiItem) return jawiItem;
    } else if (config.category === 'ULUM') {
      const ulumItem = weekItems.find(
        (i) =>
          ['Akidah', 'Ibadah', 'Sirah', 'Adab', 'Hadis'].includes(i.subjectCategory) ||
          i.subjectCategory === config.subjectCategoryRpt
      );
      if (ulumItem) return ulumItem;
    } else if (config.category === 'AQ') {
      const aqItem = weekItems.find(
        (i) =>
          ['Al-Quran', 'Tafsir/Kefahaman', 'Tajwid'].includes(i.subjectCategory) ||
          i.timeSlot.includes('القرءان')
      );
      if (aqItem) return aqItem;
    }

    // Default to first item in week
    return weekItems[0];
  }

  // Fallback if week has no specific items
  return rptPool.find((i) => i.subjectCategory === config.subjectCategoryRpt) || rptPool[0];
}

/**
 * Generates the full set of 15 e-RPH items for a given week based on the RPT & Timetable
 */
export function generateWeekly15Rph(
  week: number,
  startDateString: string,
  preferredScript: ScriptType = 'rumi',
  existingList: RPHItem[] = []
): RPHItem[] {
  return WEEKLY_15_SLOTS.map((config) => {
    // If user already saved/edited this specific slot for this week, reuse and update date/week
    const existingId = `weekly-m${week}-slot${config.slotNumber}`;
    const existing = existingList.find((r) => r.id === existingId);

    const slotDate = getDateForDayIndex(startDateString, config.dayIndex);

    if (existing) {
      return {
        ...existing,
        week,
        date: slotDate,
        time: config.time,
        className: config.className
      };
    }

    // 1. Tasmik Slot: use standardized official KPM Tasmik format with 100% default attendance
    if (config.isTasmik) {
      return createTasmikRph({
        id: existingId,
        week,
        day: config.day,
        date: slotDate,
        time: config.time,
        className: config.className,
        preferredScript,
        totalStudents: config.defaultTotalStudents,
        masteredCount: config.defaultTotalStudents,
        unmasteredCount: 0
      });
    }

    // 2. Standard Pendidikan Islam Slot: generate from respective RPT
    const rpt = findRptForSlot(config, week);

    const areaName =
      config.category === 'AQ'
        ? 'Al-Quran'
        : config.category === 'JAWI'
        ? 'Jawi'
        : config.subjectCategoryRpt || 'Akidah';

    const topic = rpt?.topicTitle || rpt?.contentStandard || `Pelajaran ${areaName} Minggu ${week}`;
    const contentStandard = rpt?.contentStandard || `${areaName} Standard Kandungan (KSSR Semakan)`;
    const learningStandard = rpt?.learningStandard || 'Standard Pembelajaran mengikut DSKP';
    const objectives = rpt?.objectives && rpt.objectives.length > 0
      ? rpt.objectives
      : [
          `Murid dapat membaca dan memahami isi pelajaran ${areaName} dengan betul.`,
          `Murid dapat menyatakan sekurang-kurangnya 2 fakta penting dengan bimbingan guru.`
        ];

    const successCriteria = objectives.map((o) => `Murid dapat menguasai: ${o}`);

    const inductionActivity = 'Guru memperdengarkan contoh bacaan / mengaitkan dengan pengetahuan sedia ada murid.';
    const mainActivities = rpt?.activities && rpt.activities.length > 0
      ? rpt.activities
      : [
          '1. Penerangan konsep dan fakta utama oleh guru menggunakan alat bantu mengajar.',
          '2. Aktiviti latih tubi membaca dan menyebut kalimah / fakta secara individu dan kumpulan.',
          '3. Murid berbincang dalam kumpulan (Think-Pair-Share) dan menyelesaikan lembaran aktiviti.'
        ];
    const closureActivity = 'Guru membuat rumusan isi pelajaran dan memberikan latihan pengukuhan.';
    const teachingAids = ['Buku Teks Pendidikan Islam', 'Buku Aktiviti Murid', 'Papan Putih Mini / Carta Digital'];
    const emk = rpt?.emk || 'Nilai Murni (Kerjasama & Istiqamah)';
    const pbdAssessment = rpt?.assessment || 'Lisan & Bertulis';
    const totalCount = config.defaultTotalStudents;
    const attRatio = `${totalCount}/${totalCount}`;
    const reflection = `Kehadiran: ${attRatio} orang murid.\n${attRatio} orang murid dapat menguasai objektif pembelajaran dengan jayanya dan diberi latihan pengayaan.`;

    const rawRph: RPHItem = {
      id: existingId,
      week,
      day: config.day,
      date: slotDate,
      time: config.time,
      className: config.className,
      subject: config.subjectDisplay,
      learningArea: areaName as any,
      topic,
      contentStandard,
      learningStandard,
      objectives,
      successCriteria,
      inductionActivity,
      mainActivities,
      closureActivity,
      teachingAids,
      crossCurricularElements: [emk],
      pbdAssessment,
      reflection,
      status: 'Lengkap',
      preferredScript
    };

    const jawiVersion = getJawiRph(rawRph);

    return {
      ...rawRph,
      jawiOverrides: {
        day: config.dayJawi,
        className: config.className,
        subject: jawiVersion.subject,
        topic: jawiVersion.topic,
        contentStandard: jawiVersion.contentStandard,
        learningStandard: jawiVersion.learningStandard,
        objectives: jawiVersion.objectives,
        successCriteria: jawiVersion.successCriteria,
        inductionActivity: jawiVersion.inductionActivity,
        mainActivities: jawiVersion.mainActivities,
        closureActivity: jawiVersion.closureActivity,
        teachingAids: jawiVersion.teachingAids,
        crossCurricularElements: jawiVersion.crossCurricularElements,
        pbdAssessment: jawiVersion.pbdAssessment,
        reflection: `كحاضيرن: ${attRatio} اورڠ موريد.\n${attRatio} اورڠ موريد دافت مڠواساءي اوبجيکتيف ڤمبلاجرن دڠن جاياڽ دان دبري لاتيهن ڤڠايأن.`
      }
    };
  });
}
