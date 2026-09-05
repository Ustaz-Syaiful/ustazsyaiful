import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Maximize2,
  Minimize2,
  Save,
  Edit3,
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Languages,
  RotateCcw,
  Check,
  UserCheck,
  Award,
  FileDown,
  ExternalLink
} from 'lucide-react';
import { RPHItem, ScriptType } from '../types';
import {
  WEEKLY_15_SLOTS,
  WeeklySlotConfig,
  generateWeekly15Rph,
  getDateForDayIndex
} from '../utils/weeklyRphGenerator';
import { exportWeeklyRphToPdf, PdfExportProgress } from '../utils/pdfExportHelper';
import { isTasmikRph, TASMIK_OFFICIAL_DATA } from '../data/tasmikConstants';
import { getJawiRph } from '../utils/jawiConverter';

interface WeeklyRphStackViewProps {
  initialWeek?: number;
  initialStartDate?: string;
  allRphList: RPHItem[];
  onSaveRph: (rph: RPHItem, silent?: boolean) => void;
  onOpenDetailedModal: (rph: RPHItem) => void;
}

export const WeeklyRphStackView: React.FC<WeeklyRphStackViewProps> = ({
  initialWeek = 33,
  initialStartDate = '2026-01-18',
  allRphList = [],
  onSaveRph,
  onOpenDetailedModal
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [activeScript, setActiveScript] = useState<ScriptType>('rumi');
  const [isFitToScreen, setIsFitToScreen] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [pdfProgress, setPdfProgress] = useState<PdfExportProgress | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // 15 e-RPH items in local state for seamless inline editing
  const [weeklyRphs, setWeeklyRphs] = useState<RPHItem[]>(() => {
    return generateWeekly15Rph(initialWeek, initialStartDate, activeScript, allRphList);
  });

  // Re-generate or sync when week or start date changes
  useEffect(() => {
    setWeeklyRphs(generateWeekly15Rph(selectedWeek, startDate, activeScript, allRphList));
  }, [selectedWeek, startDate]);

  // Handle ESC key to exit Fit to Screen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFitToScreen) {
        setIsFitToScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFitToScreen]);

  const isJawi = activeScript === 'jawi';

  // Group the 15 slots by day for structured presentation
  const groupedByDay = useMemo(() => {
    const days: Array<{
      day: 'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS';
      dayJawi: string;
      dayIndex: number;
      date: string;
      slots: Array<{ config: WeeklySlotConfig; rph: RPHItem }>;
    }> = [
      {
        day: 'AHAD',
        dayJawi: 'احد',
        dayIndex: 0,
        date: getDateForDayIndex(startDate, 0),
        slots: []
      },
      {
        day: 'ISNIN',
        dayJawi: 'اثنين',
        dayIndex: 1,
        date: getDateForDayIndex(startDate, 1),
        slots: []
      },
      {
        day: 'SELASA',
        dayJawi: 'ثلاثاء',
        dayIndex: 2,
        date: getDateForDayIndex(startDate, 2),
        slots: []
      },
      {
        day: 'RABU',
        dayJawi: 'رابو',
        dayIndex: 3,
        date: getDateForDayIndex(startDate, 3),
        slots: []
      },
      {
        day: 'KHAMIS',
        dayJawi: 'خميس',
        dayIndex: 4,
        date: getDateForDayIndex(startDate, 4),
        slots: []
      }
    ];

    WEEKLY_15_SLOTS.forEach((config) => {
      const rph = weeklyRphs[config.slotNumber - 1] || generateWeekly15Rph(selectedWeek, startDate, activeScript, allRphList)[config.slotNumber - 1];
      const targetDay = days.find((d) => d.day === config.day);
      if (targetDay && rph) {
        targetDay.slots.push({ config, rph });
      }
    });

    return days;
  }, [weeklyRphs, startDate, selectedWeek, activeScript, allRphList]);

  // Update a single slot in local state
  const handleUpdateSlot = (slotIndex: number, updatedFields: Partial<RPHItem>) => {
    let updatedItem: RPHItem | null = null;
    setWeeklyRphs((prev) => {
      const next = [...prev];
      const current = next[slotIndex];
      if (current) {
        updatedItem = { ...current, ...updatedFields };
        next[slotIndex] = updatedItem;
      }
      return next;
    });

    if (updatedItem) {
      const itemToSave = updatedItem;
      // Defer calling parent callback strictly outside React's state updater / render cycle
      setTimeout(() => {
        onSaveRph(itemToSave, true);
      }, 0);
    }
  };

  // Save all 15 e-RPH items to persistence
  const handleSaveAll = () => {
    weeklyRphs.forEach((item, idx) => {
      onSaveRph(item, idx !== 0);
    });
    setSaveSuccessMsg('Semua 15 e-RPH berjaya disimpan!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Reset to fresh RPT values
  const handleResetToRpt = () => {
    if (confirm(`Jana semula 15 e-RPH Minggu ${selectedWeek} berdasarkan RPT & Jadual Waktu rasmi? Sebarang suntingan deraf akan disetkan semula.`)) {
      const fresh = generateWeekly15Rph(selectedWeek, startDate, activeScript, []);
      setWeeklyRphs(fresh);
      fresh.forEach((item, idx) => onSaveRph(item, idx !== 0));
      setSaveSuccessMsg('15 e-RPH telah dijana semula mengikut RPT!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Handle direct print
  const handlePrint = () => {
    window.print();
  };

  // Handle direct PDF download
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setPdfProgress({ current: 0, total: 15, status: 'Memulakan penjanaan fail PDF 15 e-RPH...' });

    try {
      const filename = `e-RPH_Minggu_${selectedWeek}_Jadual_SK_Merbau_Pulas.pdf`;
      await exportWeeklyRphToPdf('weekly-rph-print-container', filename, (p) => {
        setPdfProgress(p);
      });
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setTimeout(() => {
        setIsExportingPdf(false);
        setPdfProgress(null);
      }, 1000);
    }
  };

  return (
    <div
      className={`transition-all duration-200 ${
        isFitToScreen
          ? 'fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md overflow-y-auto p-3 sm:p-6 text-slate-200'
          : 'space-y-6 text-slate-200'
      }`}
    >
      {/* ================= TOP CONTROL BAR (STICKY) ================= */}
      <div className="sticky top-0 z-40 bg-slate-950/95 p-4 rounded-2xl border border-cyan-500/40 shadow-2xl backdrop-blur-lg mb-6 hud-bracket print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Week & Schedule Info */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center font-bold text-slate-950 shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-tech uppercase">
                  SK MERBAU PULAS (KBA 5012)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-tech">
                  15 e-RPH SEMINGGU
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-tech tracking-wide mt-0.5">
                e-RPH MINGGUAN MENGIKUT JADUAL WAKTU & RPT
              </h2>
            </div>
          </div>

          {/* Week Selector, Dates & View Controls */}
          <div className="flex flex-wrap items-center gap-2.5 font-tech">
            {/* Week Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
                disabled={selectedWeek <= 1}
                className="p-1 text-slate-400 hover:text-cyan-300 disabled:opacity-30 rounded"
                title="Minggu Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 px-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">MINGGU:</span>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="bg-slate-950 border border-cyan-500/40 rounded-lg px-2 py-1 text-xs font-bold text-cyan-300 focus:outline-none"
                >
                  {Array.from({ length: 42 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      Minggu {w}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWeek((w) => Math.min(42, w + 1))}
                disabled={selectedWeek >= 42}
                className="p-1 text-slate-400 hover:text-cyan-300 disabled:opacity-30 rounded"
                title="Minggu Seterusnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Sunday Start Date Input */}
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-cyan-500/30">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Tarikh Ahad:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-950 border border-cyan-500/40 rounded-lg px-2 py-0.5 text-xs font-mono text-cyan-200 focus:outline-none"
              />
            </div>

            {/* Tulisan Toggle (Rumi / Jawi) */}
            <div className="inline-flex rounded-xl p-0.5 bg-slate-900 border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setActiveScript('rumi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition font-tech ${
                  activeScript === 'rumi'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                RUMI
              </button>
              <button
                type="button"
                onClick={() => setActiveScript('jawi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeScript === 'jawi'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow font-jawi'
                    : 'text-slate-400 hover:text-amber-300 font-jawi'
                }`}
              >
                جاوي
              </button>
            </div>

            {/* Fit to Screen Toggle */}
            <button
              type="button"
              onClick={() => setIsFitToScreen(!isFitToScreen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition border ${
                isFitToScreen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-cyan-950'
              }`}
              title={isFitToScreen ? 'Keluar Mod Muat Skrin (Fit to Screen)' : 'Buka Paparan Muat Skrin Penuh'}
            >
              {isFitToScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFitToScreen ? 'KELUAR FIT TO SCREEN' : 'FIT TO SCREEN'}</span>
            </button>

            {/* Muat Turun (Format PDF) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-rose-900/30 disabled:opacity-50"
              title="Muat Turun 15 e-RPH dalam format dokumen PDF rasmi A4"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingPdf ? 'MENJANA PDF...' : 'MUAT TURUN (FORMAT PDF)'}</span>
            </button>

            {/* Cetak (Print) */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
              title="Cetak 15 e-RPH Mingguan"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>CETAK</span>
            </button>

            {/* Simpan Semua */}
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SIMPAN SEMUA</span>
            </button>

            {/* Reset ke RPT */}
            <button
              type="button"
              onClick={handleResetToRpt}
              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-900 rounded-xl transition border border-slate-800"
              title="Jana Semula dari RPT Rasmi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {saveSuccessMsg && (
          <div className="mt-3 p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 font-tech">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* PDF Progress Toast */}
        {pdfProgress && (
          <div className="mt-3 p-3 bg-cyan-950/90 border border-cyan-500/50 rounded-xl text-xs text-cyan-200 flex items-center justify-between font-tech animate-pulse">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>{pdfProgress.status}</span>
            </div>
            <span className="font-mono font-bold text-cyan-300">
              {pdfProgress.current} / {pdfProgress.total} Muka Surat
            </span>
          </div>
        )}
      </div>

      {/* ================= SUSUNAN 15 e-RPH KE BAWAH (SCROLLABLE VERTICAL STACK) ================= */}
      <div
        id="weekly-rph-print-container"
        className="w-full max-w-6xl mx-auto space-y-8 pb-16"
      >
        {groupedByDay.map((dayGroup) => (
          <div key={dayGroup.day} className="space-y-4">
            {/* Day Header Divider */}
            <div className="bg-slate-950/90 border-l-4 border-cyan-400 border-y border-r border-cyan-500/30 p-3 sm:p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-2 font-tech">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  HARI {dayGroup.day} ({isJawi ? dayGroup.dayJawi : dayGroup.day}) • {dayGroup.date}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                {dayGroup.slots.length} e-RPH
              </span>
            </div>

            {/* Individual e-RPH Cards stacked downwards */}
            <div className="space-y-6">
              {dayGroup.slots.map(({ config, rph }) => {
                const slotIndex = config.slotNumber - 1;
                const isTasmik = config.isTasmik || isTasmikRph(rph);
                const displayItem = isJawi ? getJawiRph(rph) : rph;

                // Tasmik standard data
                const tasmikData = isJawi ? TASMIK_OFFICIAL_DATA.jawi : TASMIK_OFFICIAL_DATA.rumi;

                return (
                  <div
                    key={rph.id || `slot-${config.slotNumber}`}
                    data-printable-card="true"
                    className="bg-slate-950/95 rounded-2xl border border-cyan-500/30 p-5 sm:p-6 shadow-xl space-y-4 hover:border-cyan-400/60 transition hud-bracket text-slate-200 break-inside-avoid print:bg-white print:text-black print:border-black print:shadow-none print:m-0 print:p-6 print:rounded-none"
                    style={{ pageBreakAfter: 'always' }}
                  >
                    {/* Header: Slot Badge, Day, Date, Time, Class, Subject */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/25 pb-3.5 print:border-black">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-tech shadow">
                          SLOT {config.slotNumber} / 15
                        </span>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-cyan-300 border border-cyan-500/40 font-tech">
                          {config.periodLabel}
                        </span>
                        {isTasmik && (
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-tech flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>TASMIK (FORMAT RASMI KPM)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 font-tech print:hidden">
                        {/* Status selector */}
                        <select
                          value={rph.status}
                          onChange={(e) => handleUpdateSlot(slotIndex, { status: e.target.value as any })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            rph.status === 'Lengkap'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          <option value="Lengkap">LENGKAP</option>
                          <option value="Deraf">DERAF</option>
                          <option value="Disemak PGB">DISEMAK PGB</option>
                        </select>

                        {/* Detailed Modal Edit */}
                        <button
                          type="button"
                          onClick={() => onOpenDetailedModal({ ...rph, preferredScript: activeScript })}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-950 text-cyan-300 font-bold rounded-lg text-xs border border-cyan-500/30 flex items-center space-x-1 transition"
                          title="Buka Borang e-RPH Terperinci & DSKP"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>SUNTING PENUH</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Grid (Tarikh, Hari, Masa, Kelas, Bidang) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-tech">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                        <span className="text-[10px] text-cyan-400/80 uppercase font-semibold block">HARI & TARIKH:</span>
                        <span className="font-bold text-white text-xs print:text-black">
                          {isJawi ? `${config.dayJawi} • ${rph.date}` : `${config.day} • ${rph.date}`}
                        </span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                        <span className="text-[10px] text-cyan-400/80 uppercase font-semibold block">WAKTU & MASA:</span>
                        <span className="font-bold text-white text-xs print:text-black">{rph.time}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                        <span className="text-[10px] text-cyan-400/80 uppercase font-semibold block">KELAS & TAHUN:</span>
                        <span className="font-bold text-emerald-300 text-xs print:text-black">{rph.className}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                        <span className="text-[10px] text-cyan-400/80 uppercase font-semibold block">BIDANG PEMBELAJARAN:</span>
                        <span className="font-bold text-cyan-300 text-xs print:text-black">
                          {isJawi ? displayItem.learningArea : rph.learningArea}
                        </span>
                      </div>
                    </div>

                    {/* Content Section: Topic, SK, SP, Objectives */}
                    <div className={`space-y-3 ${isJawi ? 'text-right font-jawi leading-relaxed' : 'text-left font-sans-custom'}`} dir={isJawi ? 'rtl' : 'ltr'}>
                      {/* Tajuk */}
                      <div>
                        <span className="text-xs text-cyan-400 font-tech font-bold uppercase block mb-0.5">
                          {isJawi ? 'تاجوق ڤمبلاجرن:' : 'TAJUK PELAJARAN:'}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white print:text-black">
                          {displayItem.topic}
                        </h4>
                      </div>

                      {/* SK & SP */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/70 p-3.5 rounded-xl border border-cyan-500/20 print:bg-slate-50 print:text-black print:border-black">
                        <div>
                          <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase block">
                            {isJawi ? 'ستندرد کاندوڠن (SK):' : 'STANDARD KANDUNGAN (SK):'}
                          </span>
                          <p className="text-xs text-slate-300 print:text-black mt-0.5">{displayItem.contentStandard}</p>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase block">
                            {isJawi ? 'ستندرد ڤمبلاجرن (SP):' : 'STANDARD PEMBELAJARAN (SP):'}
                          </span>
                          <p className="text-xs text-slate-300 print:text-black mt-0.5">{displayItem.learningStandard}</p>
                        </div>
                      </div>

                      {/* Objectives & Success Criteria */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/70 p-3.5 rounded-xl border border-cyan-500/20 print:bg-slate-50 print:text-black print:border-black">
                        <div>
                          <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase block">
                            {isJawi ? 'اوبجيکتيف ڤمبلاجرن:' : 'OBJEKTIF PEMBELAJARAN:'}
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-300 print:text-black mt-1 space-y-1">
                            {displayItem.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase block">
                            {isJawi ? 'کريتيريا کجايأن:' : 'KRITERIA KEJAYAAN:'}
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-300 print:text-black mt-1 space-y-1">
                            {displayItem.successCriteria.map((sc, i) => (
                              <li key={i}>{sc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-cyan-500/20 space-y-2 print:bg-slate-50 print:text-black print:border-black">
                        <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase block">
                          {isJawi ? 'اکتيۏيتي ڤڠاجرن دان ڤمبلاجرن (PdPc):' : 'AKTIVITI PENGAJARAN & PEMBELAJARAN (PdPc):'}
                        </span>
                        <div className="text-xs text-slate-300 print:text-black space-y-1.5">
                          <p>
                            <b className="text-cyan-400 font-tech">{isJawi ? 'سيت ايندوکسي: ' : 'Set Induksi: '}</b>
                            {displayItem.inductionActivity}
                          </p>
                          <div>
                            <b className="text-cyan-400 font-tech">{isJawi ? 'اکتيۏيتي اوتاما: ' : 'Aktiviti Utama:'}</b>
                            <ul className="list-decimal list-inside mt-0.5 space-y-1">
                              {displayItem.mainActivities.map((act, i) => (
                                <li key={i}>{act}</li>
                              ))}
                            </ul>
                          </div>
                          <p>
                            <b className="text-cyan-400 font-tech">{isJawi ? 'ڤنوتوڤ: ' : 'Penutup: '}</b>
                            {displayItem.closureActivity}
                          </p>
                        </div>
                      </div>

                      {/* Pedagogical elements (BBM, EMK, Pentaksiran) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-tech">
                        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                          <span className="text-[10px] text-cyan-400/80 font-bold uppercase block">BBM:</span>
                          <span className="text-slate-300 print:text-black">{displayItem.teachingAids.join(', ')}</span>
                        </div>
                        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                          <span className="text-[10px] text-cyan-400/80 font-bold uppercase block">EMK / KBAT:</span>
                          <span className="text-slate-300 print:text-black">{displayItem.crossCurricularElements.join(', ')}</span>
                        </div>
                        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-cyan-500/20 print:bg-slate-100 print:text-black print:border-black">
                          <span className="text-[10px] text-cyan-400/80 font-bold uppercase block">PENTAKSIRAN PBD:</span>
                          <span className="text-slate-300 print:text-black">{displayItem.pbdAssessment}</span>
                        </div>
                      </div>
                    </div>

                    {/* ================= INLINE EDITABLE REFLECTION SECTION ================= */}
                    <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-3 font-tech print:bg-slate-50 print:text-black print:border-black">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-cyan-300 uppercase">
                            {isJawi ? 'ريفليکسي دان تيليکن موريد:' : 'REFLEKSI & PENCAPAIAN MURID (EDIT INLINE):'}
                          </span>
                        </div>

                        {/* Quick reflection templates */}
                        <div className="flex items-center space-x-1.5 print:hidden">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSlot(slotIndex, {
                                reflection: `${config.defaultTotalStudents - 2}/${config.defaultTotalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan.\n2/${config.defaultTotalStudents} orang murid diberi bimbingan pemulihan berterusan.`
                              })
                            }
                            className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40"
                          >
                            + Format Penuh
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSlot(slotIndex, {
                                reflection: `Aktiviti PdPc ditangguhkan kerana program sekolah / mesyuarat rasmi. Sesi pembelajaran akan diganti pada tarikh yang ditetapkan.`
                              })
                            }
                            className="text-[10px] px-2 py-0.5 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40"
                          >
                            + Ditangguhkan
                          </button>
                        </div>
                      </div>

                      {/* Editable Textarea */}
                      <textarea
                        value={isJawi ? (rph.jawiOverrides?.reflection || rph.reflection) : rph.reflection}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (isJawi) {
                            handleUpdateSlot(slotIndex, {
                              jawiOverrides: {
                                ...(rph.jawiOverrides || {}),
                                reflection: val
                              }
                            });
                          } else {
                            handleUpdateSlot(slotIndex, { reflection: val });
                          }
                        }}
                        rows={3}
                        placeholder="Masukkan catatan refleksi PdPc murid..."
                        className={`w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none print:bg-white print:text-black print:border-black ${
                          isJawi ? 'font-jawi text-right text-sm leading-relaxed' : 'font-sans-custom'
                        }`}
                        dir={isJawi ? 'rtl' : 'ltr'}
                      />

                      {/* Footer: Disemak oleh Guru Besar / PK */}
                      <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-[11px] text-slate-400 print:text-black">
                        <span>Disemak Oleh: Guru Besar @ Penolong Kanan (SK Merbau Pulas)</span>
                        <span className="font-mono">Tarikh Cetakan / Eksport: {new Date().toLocaleDateString('ms-MY')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
