import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Printer,
  Sparkles,
  BookOpen,
  Award,
  Filter,
  CheckCircle,
  FileText,
  UserCheck,
  School,
  ChevronRight,
  Info,
  Languages,
  X
} from 'lucide-react';
import { ScriptType } from '../types';

interface JadualSlot {
  id: string;
  day: 'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS';
  dayJawi: string;
  startPeriod: number; // 1 to 12
  periodSpan: number; // 1 or 2
  startTime: string;
  endTime: string;
  code: string;
  subjectName: string;
  subjectNameJawi: string;
  className: string;
  classNameJawi: string;
  category: 'AQ' | 'ULUM' | 'JAWI' | 'TSMK' | 'PER';
  room?: string;
}

export const JADUAL_DATA: JadualSlot[] = [
  // AHAD
  {
    id: 'ahad-1',
    day: 'AHAD',
    dayJawi: 'احد',
    startPeriod: 2,
    periodSpan: 2,
    startTime: '8:15',
    endTime: '9:15',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '2 IBNU SINA (2 IS)',
    classNameJawi: '٢ ابن سينا',
    category: 'AQ'
  },
  {
    id: 'ahad-2',
    day: 'AHAD',
    dayJawi: 'احد',
    startPeriod: 6,
    periodSpan: 2,
    startTime: '10:15',
    endTime: '11:15',
    code: 'TSMK',
    subjectName: 'Tasmik Al-Quran j-QAF',
    subjectNameJawi: 'تسميع القرءان j-QAF',
    className: '6 IBNU KHALDUN (6 IK)',
    classNameJawi: '٦ ابن خلدون',
    category: 'TSMK'
  },
  {
    id: 'ahad-3',
    day: 'AHAD',
    dayJawi: 'احد',
    startPeriod: 10,
    periodSpan: 1,
    startTime: '12:15',
    endTime: '12:45',
    code: 'PI/JW',
    subjectName: 'Pendidikan Islam (Jawi)',
    subjectNameJawi: 'ڤنديديقن اسلام (جاوي)',
    className: '6 IBNU SINA (6 IS)',
    classNameJawi: '٦ ابن سينا',
    category: 'JAWI'
  },
  {
    id: 'ahad-4',
    day: 'AHAD',
    dayJawi: 'احد',
    startPeriod: 11,
    periodSpan: 2,
    startTime: '12:45',
    endTime: '1:45',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '6 IBNU SINA (6 IS)',
    classNameJawi: '٦ ابن سينا',
    category: 'AQ'
  },

  // ISNIN
  {
    id: 'isnin-1',
    day: 'ISNIN',
    dayJawi: 'اثنين',
    startPeriod: 1,
    periodSpan: 1,
    startTime: '7:45',
    endTime: '8:15',
    code: 'PER',
    subjectName: 'Perhimpunan Rasmi Sekolah',
    subjectNameJawi: 'ڤرهيمڤونن رسمي سکوله',
    className: 'Tanpa Kelas (Semua Murid)',
    classNameJawi: 'تنڤا کلس',
    category: 'PER'
  },
  {
    id: 'isnin-2',
    day: 'ISNIN',
    dayJawi: 'اثنين',
    startPeriod: 3,
    periodSpan: 2,
    startTime: '8:45',
    endTime: '9:45',
    code: 'PI/ULUM',
    subjectName: 'Pendidikan Islam (Ulum Syari\'yyah)',
    subjectNameJawi: 'ڤنديديقن اسلام (علوم شرعية)',
    className: '6 IBNU SINA (6 IS)',
    classNameJawi: '٦ ابن سينا',
    category: 'ULUM'
  },
  {
    id: 'isnin-3',
    day: 'ISNIN',
    dayJawi: 'اثنين',
    startPeriod: 8,
    periodSpan: 1,
    startTime: '11:15',
    endTime: '11:45',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '6 IBNU SINA (6 IS)',
    classNameJawi: '٦ ابن سينا',
    category: 'AQ'
  },
  {
    id: 'isnin-4',
    day: 'ISNIN',
    dayJawi: 'اثنين',
    startPeriod: 11,
    periodSpan: 2,
    startTime: '12:45',
    endTime: '1:45',
    code: 'PI/ULUM',
    subjectName: 'Pendidikan Islam (Ulum Syari\'yyah)',
    subjectNameJawi: 'ڤنديديقن اسلام (علوم شرعية)',
    className: '6 IBNU KHALDUN (6 IK)',
    classNameJawi: '٦ ابن خلدون',
    category: 'ULUM'
  },

  // SELASA
  {
    id: 'selasa-1',
    day: 'SELASA',
    dayJawi: 'ثلاث',
    startPeriod: 2,
    periodSpan: 2,
    startTime: '8:15',
    endTime: '9:15',
    code: 'TSMK',
    subjectName: 'Tasmik Al-Quran j-QAF',
    subjectNameJawi: 'تسميع القرءان j-QAF',
    className: '4 IBNU SINA (4 IS)',
    classNameJawi: '٤ ابن سينا',
    category: 'TSMK'
  },
  {
    id: 'selasa-2',
    day: 'SELASA',
    dayJawi: 'ثلاث',
    startPeriod: 4,
    periodSpan: 1,
    startTime: '9:15',
    endTime: '9:45',
    code: 'PI/JW',
    subjectName: 'Pendidikan Islam (Jawi)',
    subjectNameJawi: 'ڤنديديقن اسلام (جاوي)',
    className: '6 IBNU KHALDUN (6 IK)',
    classNameJawi: '٦ ابن خلدون',
    category: 'JAWI'
  },
  {
    id: 'selasa-3',
    day: 'SELASA',
    dayJawi: 'ثلاث',
    startPeriod: 6,
    periodSpan: 2,
    startTime: '10:15',
    endTime: '11:15',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '6 IBNU KHALDUN (6 IK)',
    classNameJawi: '٦ ابن خلدون',
    category: 'AQ'
  },
  {
    id: 'selasa-4',
    day: 'SELASA',
    dayJawi: 'ثلاث',
    startPeriod: 10,
    periodSpan: 2,
    startTime: '12:15',
    endTime: '1:15',
    code: 'TSMK',
    subjectName: 'Tasmik Al-Quran j-QAF',
    subjectNameJawi: 'تسميع القرءان j-QAF',
    className: '6 IBNU SINA (6 IS)',
    classNameJawi: '٦ ابن سينا',
    category: 'TSMK'
  },

  // RABU
  {
    id: 'rabu-1',
    day: 'RABU',
    dayJawi: 'رابو',
    startPeriod: 9,
    periodSpan: 1,
    startTime: '11:45',
    endTime: '12:15',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '6 IBNU KHALDUN (6 IK)',
    classNameJawi: '٦ ابن خلدون',
    category: 'AQ'
  },
  {
    id: 'rabu-2',
    day: 'RABU',
    dayJawi: 'رابو',
    startPeriod: 10,
    periodSpan: 2,
    startTime: '12:15',
    endTime: '1:15',
    code: 'TSMK',
    subjectName: 'Tasmik Al-Quran j-QAF',
    subjectNameJawi: 'تسميع القرءان j-QAF',
    className: '2 IBNU SINA (2 IS)',
    classNameJawi: '٢ ابن سينا',
    category: 'TSMK'
  },

  // KHAMIS
  {
    id: 'khamis-1',
    day: 'KHAMIS',
    dayJawi: 'خميس',
    startPeriod: 6,
    periodSpan: 2,
    startTime: '10:15',
    endTime: '11:15',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '1 IBNU KHALDUN (1 IK)',
    classNameJawi: '١ ابن خلدون',
    category: 'AQ'
  },
  {
    id: 'khamis-2',
    day: 'KHAMIS',
    dayJawi: 'خميس',
    startPeriod: 8,
    periodSpan: 2,
    startTime: '11:15',
    endTime: '12:15',
    code: 'PI/AQ',
    subjectName: 'Pendidikan Islam (Al-Quran)',
    subjectNameJawi: 'ڤنديديقن اسلام (القرءان)',
    className: '3 IBNU SINA (3 IS)',
    classNameJawi: '٣ ابن سينا',
    category: 'AQ'
  }
];

export const PERIOD_TIMES = [
  { period: 1, time: '7:45 - 8:15' },
  { period: 2, time: '8:15 - 8:45' },
  { period: 3, time: '8:45 - 9:15' },
  { period: 4, time: '9:15 - 9:45' },
  { period: 5, time: '9:45 - 10:15', isRehat: true },
  { period: 6, time: '10:15 - 10:45' },
  { period: 7, time: '10:45 - 11:15' },
  { period: 8, time: '11:15 - 11:45' },
  { period: 9, time: '11:45 - 12:15' },
  { period: 10, time: '12:15 - 12:45' },
  { period: 11, time: '12:45 - 1:15' },
  { period: 12, time: '1:15 - 1:45' }
];

export const RUMUSAN_TUGASAN = [
  { no: 1, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '6 IBNU SINA', count: 2 },
  { no: 2, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '6 IBNU SINA', count: 1 },
  { no: 3, subject: 'PENDIDIKAN ISLAM (ULUM)', subjectJawi: 'ڤنديديقن اسلام (علوم)', className: '6 IBNU KHALDUN', count: 2 },
  { no: 4, subject: 'PENDIDIKAN ISLAM (ULUM)', subjectJawi: 'ڤنديديقن اسلام (علوم)', className: '6 IBNU SINA', count: 2 },
  { no: 5, subject: 'PENDIDIKAN ISLAM (JAWI)', subjectJawi: 'ڤنديديقن اسلام (جاوي)', className: '6 IBNU SINA', count: 1 },
  { no: 6, subject: 'PENDIDIKAN ISLAM (JAWI)', subjectJawi: 'ڤنديديقن اسلام (جاوي)', className: '6 IBNU KHALDUN', count: 1 },
  { no: 7, subject: 'TASMIK', subjectJawi: 'تسميع القرءان', className: '6 IBNU SINA', count: 2 },
  { no: 8, subject: 'PERHIMPUNAN', subjectJawi: 'ڤرهيمڤونن رسمي', className: 'Tanpa kelas', count: 1 },
  { no: 9, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '6 IBNU KHALDUN', count: 1 },
  { no: 10, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '6 IBNU KHALDUN', count: 2 },
  { no: 11, subject: 'TASMIK', subjectJawi: 'تسميع القرءان', className: '6 IBNU KHALDUN', count: 2 },
  { no: 12, subject: 'TASMIK', subjectJawi: 'تسميع القرءان', className: '4 IBNU SINA', count: 2 },
  { no: 13, subject: 'TASMIK', subjectJawi: 'تسميع القرءان', className: '2 IBNU SINA', count: 2 },
  { no: 14, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '2 IBNU SINA', count: 2 },
  { no: 15, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '1 IBNU KHALDUN', count: 2 },
  { no: 16, subject: 'PENDIDIKAN ISLAM (AQ)', subjectJawi: 'ڤنديديقن اسلام (القرءان)', className: '3 IBNU SINA', count: 2 }
];

interface JadualWaktuSectionProps {
  onNavigateToRph?: (className: string, area: string) => void;
}

export const JadualWaktuSection: React.FC<JadualWaktuSectionProps> = ({ onNavigateToRph }) => {
  const [activeScript, setActiveScript] = useState<ScriptType>('rumi');
  const [selectedDay, setSelectedDay] = useState<string>('SEMUA');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [activeSlotModal, setActiveSlotModal] = useState<JadualSlot | null>(null);

  const isJawi = activeScript === 'jawi';

  const days: Array<'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS'> = [
    'AHAD',
    'ISNIN',
    'SELASA',
    'RABU',
    'KHAMIS'
  ];

  const getCategoryColor = (cat: JadualSlot['category']) => {
    switch (cat) {
      case 'AQ':
        return 'from-emerald-950/90 to-teal-900/90 border-emerald-500/60 text-emerald-300 hover:border-emerald-400';
      case 'ULUM':
        return 'from-cyan-950/90 to-blue-900/90 border-cyan-500/60 text-cyan-300 hover:border-cyan-400';
      case 'JAWI':
        return 'from-amber-950/90 to-yellow-950/90 border-amber-500/60 text-amber-300 hover:border-amber-400';
      case 'TSMK':
        return 'from-indigo-950/90 to-purple-950/90 border-indigo-500/60 text-indigo-300 hover:border-indigo-400';
      case 'PER':
        return 'from-slate-900/90 to-slate-800/90 border-slate-500/60 text-slate-300 hover:border-slate-400';
      default:
        return 'from-slate-900 to-slate-950 border-slate-700 text-slate-300';
    }
  };

  const getCategoryBadge = (cat: JadualSlot['category']) => {
    switch (cat) {
      case 'AQ':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ULUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'JAWI':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'TSMK':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'PER':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const totalTeachingPeriods = 27;
  const totalPerhimpunan = 1;
  const totalPeriods = totalTeachingPeriods + totalPerhimpunan;

  return (
    <div className="space-y-6">
      {/* On-screen Display (Hidden during print) */}
      <div className="space-y-6 print:hidden">
        {/* Official Timetable Header Banner (Synchronized with PDF SK Merbau Pulas) */}
      <div className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 shadow-xl relative overflow-hidden hud-bracket">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center font-bold text-white shadow-lg border border-cyan-400/40 shrink-0">
              <CalendarDays className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-tech">
                  KOD SEKOLAH: KBA 5012
                </span>
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-tech">
                  SESI 2026 • KEDAH
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-wide mt-1 font-tech">
                JADUAL WAKTU GURU: SYAIFUL AKMAL KHAUSAR BIN ZULKEFLI
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-sans-custom">
                SK MERBAU PULAS, 09300 KUALA KETIL, KEDAH • Tarikh Kuatkuasa: 11 Januari 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-tech">
            {/* Script Toggle */}
            <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setActiveScript('rumi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeScript === 'rumi'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>RUMI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScript('jawi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeScript === 'jawi'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow font-jawi text-sm'
                    : 'text-slate-400 hover:text-white font-jawi'
                }`}
              >
                <span>جاوي (JAWI)</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-1.5"
              title="Cetak Jadual Waktu Rasmi Format KPM"
            >
              <Printer className="w-4 h-4" />
              <span>CETAK JADUAL</span>
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-cyan-500/20 font-tech">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">JUMLAH WAKTU</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-bold text-white font-mono">{totalPeriods}</span>
              <span className="text-[11px] text-slate-400">WAKTU (14 JAM)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">PENDIDIKAN ISLAM</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-bold text-emerald-300 font-mono">18</span>
              <span className="text-[11px] text-slate-400">WAKTU (AQ/ULUM/JW)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-indigo-500/20">
            <span className="text-[10px] text-indigo-400 uppercase font-semibold block">TASMIK AL-QURAN</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-bold text-indigo-300 font-mono">8</span>
              <span className="text-[11px] text-slate-400">WAKTU j-QAF</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-500/20">
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">PENGESAHAN PGB</span>
            <div className="text-[11px] text-amber-200 mt-0.5 font-bold truncate">
              NORHAFIZA BINTI DOLAH
            </div>
            <span className="text-[9px] text-slate-400 block">Guru Besar SK Merbau Pulas</span>
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 font-tech">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-300 font-bold uppercase">HARI:</span>
          </div>
          <div className="inline-flex flex-wrap rounded-lg p-0.5 bg-slate-900 border border-cyan-500/30">
            {['SEMUA', ...days].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  selectedDay === d
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {d === 'SEMUA' ? (isJawi ? 'سموا هاري' : 'SEMUA') : (isJawi ? (d === 'AHAD' ? 'احد' : d === 'ISNIN' ? 'اثنين' : d === 'SELASA' ? 'ثلاث' : d === 'RABU' ? 'رابو' : 'خميس') : d)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded border bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold">
            PI/AQ: Al-Quran
          </span>
          <span className="px-2 py-0.5 rounded border bg-cyan-950/60 border-cyan-500/40 text-cyan-300 font-bold">
            PI/ULUM: Ulum Syari'yyah
          </span>
          <span className="px-2 py-0.5 rounded border bg-amber-950/60 border-amber-500/40 text-amber-300 font-bold">
            PI/JW: Jawi
          </span>
          <span className="px-2 py-0.5 rounded border bg-indigo-950/60 border-indigo-500/40 text-indigo-300 font-bold">
            TSMK: Tasmik
          </span>
          <span className="px-2 py-0.5 rounded border bg-slate-900 border-slate-600 text-slate-300 font-bold">
            PER: Perhimpunan
          </span>
        </div>
      </div>

      {/* Main Interactive Timetable Grid (Visual PDF Recreation) */}
      <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 shadow-2xl p-4 sm:p-5 overflow-x-auto hud-bracket">
        <div className="min-w-[950px]">
          {/* Header Row: Periods & Timings */}
          <div className="grid grid-cols-[100px_repeat(4,1fr)_70px_repeat(7,1fr)] gap-1.5 pb-2 text-center text-xs font-tech border-b border-cyan-500/30">
            <div className="p-2 bg-slate-900 rounded-lg text-cyan-300 font-bold flex items-center justify-center">
              {isJawi ? 'هاري / وقتو' : 'HARI / MASA'}
            </div>

            {/* Slots 1 to 4 */}
            {PERIOD_TIMES.slice(0, 4).map((pt) => (
              <div key={pt.period} className="p-2 bg-slate-900/90 rounded-lg border border-cyan-500/20 text-slate-300">
                <div className="font-bold text-cyan-300 font-mono text-[11px]">{pt.period}</div>
                <div className="text-[10px] text-slate-400 font-sans-custom">{pt.time}</div>
              </div>
            ))}

            {/* REHAT Column */}
            <div className="p-2 bg-amber-950/40 rounded-lg border border-amber-500/30 text-amber-300 flex flex-col items-center justify-center font-bold">
              <span className="text-[10px] tracking-widest">{isJawi ? 'سيسي' : 'REHAT'}</span>
              <span className="text-[9px] text-amber-400/80">9:45-10:15</span>
            </div>

            {/* Slots 6 to 12 */}
            {PERIOD_TIMES.slice(5).map((pt) => (
              <div key={pt.period} className="p-2 bg-slate-900/90 rounded-lg border border-cyan-500/20 text-slate-300">
                <div className="font-bold text-cyan-300 font-mono text-[11px]">{pt.period}</div>
                <div className="text-[10px] text-slate-400 font-sans-custom">{pt.time}</div>
              </div>
            ))}
          </div>

          {/* Day Rows */}
          <div className="divide-y divide-cyan-500/20 mt-2 space-y-2">
            {days
              .filter((d) => selectedDay === 'SEMUA' || selectedDay === d)
              .map((dayName) => {
                const daySlots = JADUAL_DATA.filter((s) => s.day === dayName);

                // Determine display content per period
                // Periods: 1, 2, 3, 4, [REHAT], 6, 7, 8, 9, 10, 11, 12
                const renderedCells: React.ReactNode[] = [];

                // Period 1 to 4
                for (let p = 1; p <= 4; p++) {
                  const slot = daySlots.find((s) => s.startPeriod === p);
                  if (slot) {
                    const span = slot.periodSpan;
                    renderedCells.push(
                      <div
                        key={`${dayName}-p${p}`}
                        style={{ gridColumn: `span ${span}` }}
                        onClick={() => setActiveSlotModal(slot)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group shadow-sm bg-gradient-to-br ${getCategoryColor(
                          slot.category
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs font-tech tracking-wider">{slot.code}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${getCategoryBadge(slot.category)}`}>
                            {span} WAKTU
                          </span>
                        </div>
                        <div className="text-center my-1">
                          <span className="font-bold text-xs sm:text-sm text-white block">
                            {isJawi ? slot.classNameJawi : slot.className.replace(/\s*\([^)]*\)/, '')}
                          </span>
                          <span className="text-[10px] opacity-80 block truncate">
                            {isJawi ? slot.subjectNameJawi : slot.subjectName}
                          </span>
                        </div>
                        <div className="text-[9px] text-center opacity-70 font-mono">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    );
                    p += span - 1; // skip spanned
                  } else {
                    // Check if current period is covered by previous span
                    const isCovered = daySlots.some(
                      (s) => s.startPeriod < p && s.startPeriod + s.periodSpan > p
                    );
                    if (!isCovered) {
                      renderedCells.push(
                        <div
                          key={`${dayName}-p${p}`}
                          className="p-2 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-center justify-center text-slate-600 text-[10px]"
                        >
                          -
                        </div>
                      );
                    }
                  }
                }

                // REHAT Column (Fixed)
                const rehatCell = (
                  <div
                    key={`${dayName}-rehat`}
                    className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold font-tech tracking-widest"
                  >
                    {isJawi ? 'استراحة' : 'REHAT'}
                  </div>
                );

                // Period 6 to 12
                const renderedAfterRehat: React.ReactNode[] = [];
                for (let p = 6; p <= 12; p++) {
                  const slot = daySlots.find((s) => s.startPeriod === p);
                  if (slot) {
                    const span = slot.periodSpan;
                    renderedAfterRehat.push(
                      <div
                        key={`${dayName}-p${p}`}
                        style={{ gridColumn: `span ${span}` }}
                        onClick={() => setActiveSlotModal(slot)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group shadow-sm bg-gradient-to-br ${getCategoryColor(
                          slot.category
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs font-tech tracking-wider">{slot.code}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${getCategoryBadge(slot.category)}`}>
                            {span} WAKTU
                          </span>
                        </div>
                        <div className="text-center my-1">
                          <span className="font-bold text-xs sm:text-sm text-white block">
                            {isJawi ? slot.classNameJawi : slot.className.replace(/\s*\([^)]*\)/, '')}
                          </span>
                          <span className="text-[10px] opacity-80 block truncate">
                            {isJawi ? slot.subjectNameJawi : slot.subjectName}
                          </span>
                        </div>
                        <div className="text-[9px] text-center opacity-70 font-mono">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    );
                    p += span - 1; // skip spanned
                  } else {
                    const isCovered = daySlots.some(
                      (s) => s.startPeriod < p && s.startPeriod + s.periodSpan > p
                    );
                    if (!isCovered) {
                      renderedAfterRehat.push(
                        <div
                          key={`${dayName}-p${p}`}
                          className="p-2 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-center justify-center text-slate-600 text-[10px]"
                        >
                          -
                        </div>
                      );
                    }
                  }
                }

                const dayLabel = isJawi
                  ? dayName === 'AHAD'
                    ? 'احد'
                    : dayName === 'ISNIN'
                    ? 'اثنين'
                    : dayName === 'SELASA'
                    ? 'ثلاث'
                    : dayName === 'RABU'
                    ? 'رابو'
                    : 'خميس'
                  : dayName;

                return (
                  <div
                    key={dayName}
                    className="grid grid-cols-[100px_repeat(4,1fr)_70px_repeat(7,1fr)] gap-1.5 pt-2 items-stretch"
                  >
                    {/* Day label */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-white font-tech">{dayLabel}</span>
                      <span className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        {daySlots.reduce((acc, curr) => acc + curr.periodSpan, 0)} WAKTU
                      </span>
                    </div>

                    {renderedCells}
                    {rehatCell}
                    {renderedAfterRehat}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Official Table: Agihan Tugasan Mengajar & Rumusan (Exact match to PDF table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4 hud-bracket">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm font-tech">
                RUMUSAN JADUAL & AGIHAN MATA PELAJARAN (KBA 5012)
              </h3>
              <p className="text-xs text-cyan-200/70 font-sans-custom">
                Rekod agihan waktu mengajar mengikut kurikulum Pendidikan Islam KSSR & j-QAF SK Merbau Pulas
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              JUMLAH: {totalPeriods} WAKTU
            </span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs text-slate-300 font-sans-custom">
              <thead className="bg-slate-900/90 text-cyan-300 font-tech uppercase text-[11px] sticky top-0 border-b border-cyan-500/30">
                <tr>
                  <th className="p-2.5">BIL</th>
                  <th className="p-2.5">MATA PELAJARAN</th>
                  <th className="p-2.5">KELAS</th>
                  <th className="p-2.5 text-center">JUM (WAKTU)</th>
                  <th className="p-2.5 text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {RUMUSAN_TUGASAN.map((row) => (
                  <tr key={row.no} className="hover:bg-slate-900/50 transition">
                    <td className="p-2.5 font-mono text-slate-400">{row.no}</td>
                    <td className="p-2.5 font-semibold text-white">
                      {isJawi ? row.subjectJawi : row.subject}
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-tech font-bold text-[10px]">
                        {row.className}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-emerald-400 font-mono">
                      {row.count}
                    </td>
                    <td className="p-2.5 text-right">
                      {row.className !== 'Tanpa kelas' && onNavigateToRph && (
                        <button
                          onClick={() => onNavigateToRph(row.className, 'Al-Quran')}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline font-tech"
                        >
                          Lihat e-RPH ➔
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 font-tech text-white border-t-2 border-cyan-500/40">
                <tr>
                  <td colSpan={3} className="p-2.5 font-bold uppercase">
                    JUMLAH KESELURUHAN WAKTU MENGAJAR
                  </td>
                  <td className="p-2.5 text-center font-bold text-cyan-300 font-mono text-sm">
                    {totalPeriods} WAKTU
                  </td>
                  <td className="p-2.5 text-right text-[10px] text-slate-400">
                    14 Jam Seminggu
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Verification & Official Signatures Box (Recreated from PDF footer) */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col justify-between space-y-4 hud-bracket">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-tech">
              <School className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                PENGESAHAN DOKUMEN RASMI
              </h4>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20 space-y-2">
              <p className="text-[11px] text-slate-400 uppercase font-tech">Disahkan Oleh:</p>
              <div className="font-bold text-white text-sm">NORHAFIZA BINTI DOLAH</div>
              <p className="text-xs text-emerald-400 font-semibold font-tech">GURU BESAR</p>
              <p className="text-xs text-slate-300">SK MERBAU PULAS, 09300 KUALA KETIL, KEDAH</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-300 font-tech uppercase block">SLOGAN SEKOLAH</span>
              <p className="text-sm font-bold text-white italic mt-1">
                "SEDERAP KITA MELONJAK PRESTASI"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-cyan-500/20 text-center">
            <p className="text-[11px] text-slate-400">
              Jadual Waktu berkuatkuasa mulai <b className="text-cyan-300">11 Januari 2026</b>.
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Dijana secara digital melalui Sistem Pengurusan Bersepadu Panitia Pendidikan Islam.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Official Printable Layout (Only visible during Print / PDF Export) */}
      <div className="hidden print:block text-black bg-white p-6 font-sans">
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-base font-bold uppercase tracking-wider">
            KBA 5012 - SK MERBAU PULAS, 09300 KUALA KETIL, KEDAH
          </h1>
          <h2 className="text-sm font-semibold mt-1">
            JADUAL WAKTU GURU: SYAIFUL AKMAL KHAUSAR BIN ZULKEFLI
          </h2>
          <div className="text-xs mt-1 flex justify-between px-4">
            <span><b>GURU:</b> PENDIDIKAN ISLAM & TASMIK</span>
            <span><b>TARIKH KUATKUASA:</b> 11 JANUARI 2026</span>
            <span><b>SESI:</b> 2026</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <table className="w-full border-collapse border border-black text-[10px] text-center mb-6">
          <thead>
            <tr className="bg-gray-100 font-bold border-b border-black">
              <th className="border border-black p-1 w-16">HARI / MASA</th>
              <th className="border border-black p-1">1<br/><span className="font-normal text-[8px]">7:45-8:15</span></th>
              <th className="border border-black p-1">2<br/><span className="font-normal text-[8px]">8:15-8:45</span></th>
              <th className="border border-black p-1">3<br/><span className="font-normal text-[8px]">8:45-9:15</span></th>
              <th className="border border-black p-1">4<br/><span className="font-normal text-[8px]">9:15-9:45</span></th>
              <th className="border border-black p-1 bg-gray-200">REHAT<br/><span className="font-normal text-[8px]">9:45-10:15</span></th>
              <th className="border border-black p-1">6<br/><span className="font-normal text-[8px]">10:15-10:45</span></th>
              <th className="border border-black p-1">7<br/><span className="font-normal text-[8px]">10:45-11:15</span></th>
              <th className="border border-black p-1">8<br/><span className="font-normal text-[8px]">11:15-11:45</span></th>
              <th className="border border-black p-1">9<br/><span className="font-normal text-[8px]">11:45-12:15</span></th>
              <th className="border border-black p-1">10<br/><span className="font-normal text-[8px]">12:15-12:45</span></th>
              <th className="border border-black p-1">11<br/><span className="font-normal text-[8px]">12:45-1:15</span></th>
              <th className="border border-black p-1">12<br/><span className="font-normal text-[8px]">1:15-1:45</span></th>
            </tr>
          </thead>
          <tbody>
            {/* AHAD */}
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">AHAD</td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/AQ<br/><span className="font-normal">2 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td rowSpan={5} className="border border-black p-1 font-bold bg-gray-200 align-middle">
                R<br/>E<br/>H<br/>A<br/>T
              </td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                TSMK<br/><span className="font-normal">6 IK</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1 font-bold">
                PI/JW<br/><span className="font-normal">6 IS</span>
              </td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/AQ<br/><span className="font-normal">6 IS</span>
              </td>
            </tr>
            {/* ISNIN */}
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">ISNIN</td>
              <td className="border border-black p-1 font-bold">
                PER<br/><span className="font-normal">Tanpa</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/ULUM<br/><span className="font-normal">6 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1 font-bold">
                PI/AQ<br/><span className="font-normal">6 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/ULUM<br/><span className="font-normal">6 IK</span>
              </td>
            </tr>
            {/* SELASA */}
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">SELASA</td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                TSMK<br/><span className="font-normal">4 IS</span>
              </td>
              <td className="border border-black p-1 font-bold">
                PI/JW<br/><span className="font-normal">6 IK</span>
              </td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/AQ<br/><span className="font-normal">6 IK</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                TSMK<br/><span className="font-normal">6 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
            </tr>
            {/* RABU */}
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">RABU</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1 font-bold">
                PI/AQ<br/><span className="font-normal">6 IK</span>
              </td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                TSMK<br/><span className="font-normal">2 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
            </tr>
            {/* KHAMIS */}
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">KHAMIS</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/AQ<br/><span className="font-normal">1 IK</span>
              </td>
              <td colSpan={2} className="border border-black p-1 font-bold bg-gray-100">
                PI/AQ<br/><span className="font-normal">3 IS</span>
              </td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
              <td className="border border-black p-1">-</td>
            </tr>
          </tbody>
        </table>

        {/* Agihan Summary Table */}
        <div className="mb-6">
          <h3 className="font-bold text-xs uppercase border-b border-black pb-1 mb-2">
            Agihan Mata Pelajaran & Waktu Mengajar
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <table className="w-full border-collapse border border-black text-[9px]">
              <thead>
                <tr className="bg-gray-100 font-bold border-b border-black">
                  <th className="border border-black p-1">BIL</th>
                  <th className="border border-black p-1">MATA PELAJARAN</th>
                  <th className="border border-black p-1">KELAS</th>
                  <th className="border border-black p-1">WAKTU</th>
                </tr>
              </thead>
              <tbody>
                {RUMUSAN_TUGASAN.slice(0, 8).map((r) => (
                  <tr key={r.no}>
                    <td className="border border-black p-1 text-center">{r.no}</td>
                    <td className="border border-black p-1">{r.subject}</td>
                    <td className="border border-black p-1">{r.className}</td>
                    <td className="border border-black p-1 text-center font-bold">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border-collapse border border-black text-[9px]">
              <thead>
                <tr className="bg-gray-100 font-bold border-b border-black">
                  <th className="border border-black p-1">BIL</th>
                  <th className="border border-black p-1">MATA PELAJARAN</th>
                  <th className="border border-black p-1">KELAS</th>
                  <th className="border border-black p-1">WAKTU</th>
                </tr>
              </thead>
              <tbody>
                {RUMUSAN_TUGASAN.slice(8).map((r) => (
                  <tr key={r.no}>
                    <td className="border border-black p-1 text-center">{r.no}</td>
                    <td className="border border-black p-1">{r.subject}</td>
                    <td className="border border-black p-1">{r.className}</td>
                    <td className="border border-black p-1 text-center font-bold">{r.count}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td colSpan={3} className="border border-black p-1 text-right">JUMLAH BESAR:</td>
                  <td className="border border-black p-1 text-center">{totalPeriods}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer & Signature in Print View */}
        <div className="flex justify-between items-end pt-6 text-xs">
          <div className="text-center w-60">
            <div className="h-14 border-b border-black mb-1"></div>
            <p className="font-bold">SYAIFUL AKMAL KHAUSAR BIN ZULKEFLI</p>
            <p className="text-[10px]">Guru Pendidikan Islam & Tasmik</p>
          </div>

          <div className="text-center italic text-xs font-semibold">
            "SEDERAP KITA MELONJAK PRESTASI"
          </div>

          <div className="text-center w-60">
            <div className="h-14 border-b border-black mb-1"></div>
            <p className="font-bold">NORHAFIZA BINTI DOLAH</p>
            <p className="text-[10px]">Guru Besar, SK Merbau Pulas</p>
          </div>
        </div>
      </div>

      {/* Slot Details Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-md p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveSlotModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-tech uppercase">
                  {activeSlotModal.day} • {activeSlotModal.periodSpan} WAKTU
                </span>
                <h3 className="font-bold text-base text-white mt-1">
                  {isJawi ? activeSlotModal.subjectNameJawi : activeSlotModal.subjectName}
                </h3>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-cyan-500/20 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 font-tech">KOD MATA PELAJARAN:</span>
                <span className="font-bold text-cyan-300 font-mono">{activeSlotModal.code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 font-tech">KELAS:</span>
                <span className="font-bold text-white">{activeSlotModal.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 font-tech">MASA:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {activeSlotModal.startTime} - {activeSlotModal.endTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 font-tech">GURU BERTUGAS:</span>
                <span className="font-semibold text-slate-200">SYAIFUL AKMAL KHAUSAR</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-tech">STATUS PERSEDIAAN e-RPH:</span>
                <span className="font-bold text-emerald-400">Tersedia & Terhubung</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  const targetClass = activeSlotModal.className.replace(/\s*\([^)]*\)/, '');
                  setActiveSlotModal(null);
                  if (onNavigateToRph) {
                    onNavigateToRph(targetClass, activeSlotModal.category === 'AQ' ? 'Al-Quran' : activeSlotModal.category === 'JAWI' ? 'Jawi' : 'Akidah');
                  }
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1.5 font-tech"
              >
                <FileText className="w-4 h-4" />
                <span>BUKA e-RPH KELAS INI</span>
              </button>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition font-tech"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
