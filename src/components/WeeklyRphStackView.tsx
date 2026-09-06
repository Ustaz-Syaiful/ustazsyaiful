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
  getDateForDayIndex,
  addDaysToDate,
  getSundayOfWeek,
  getSundayForWeek
} from '../utils/weeklyRphGenerator';
import { exportWeeklyRphToPdf, PdfExportProgress } from '../utils/pdfExportHelper';
import { isTasmikRph, TASMIK_OFFICIAL_DATA } from '../data/tasmikConstants';
import { getJawiRph } from '../utils/jawiConverter';
import { DatePickerField } from './DatePickerField';

interface WeeklyRphStackViewProps {
  initialWeek?: number;
  initialStartDate?: string;
  allRphList: RPHItem[];
  onSaveRph: (rph: RPHItem, silent?: boolean) => void;
  onOpenDetailedModal: (rph: RPHItem) => void;
}

export const WeeklyRphStackView: React.FC<WeeklyRphStackViewProps> = ({
  initialWeek = 33,
  initialStartDate,
  allRphList = [],
  onSaveRph,
  onOpenDetailedModal
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);

  // Default: 5 days starting from Sunday to Thursday
  const defaultSunday = initialStartDate || getSundayForWeek(initialWeek);
  const [startDate, setStartDate] = useState<string>(defaultSunday);
  const [endDate, setEndDate] = useState<string>(() => addDaysToDate(defaultSunday, 4));

  const [activeScript, setActiveScript] = useState<ScriptType>('rumi');
  const [isFitToScreen, setIsFitToScreen] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [pdfProgress, setPdfProgress] = useState<PdfExportProgress | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Anchor Sunday corresponding to the current startDate
  const anchorSunday = useMemo(() => getSundayOfWeek(startDate), [startDate]);

  // 15 e-RPH items in local state for seamless inline editing
  const [weeklyRphs, setWeeklyRphs] = useState<RPHItem[]>(() => {
    return generateWeekly15Rph(initialWeek, defaultSunday, activeScript, allRphList);
  });

  // Re-generate or sync when week or anchor Sunday changes
  useEffect(() => {
    setWeeklyRphs(generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, allRphList));
  }, [selectedWeek, anchorSunday, activeScript]);

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

  // Handle week change: updates Sunday and Thursday (5 days default)
  const handleWeekChange = (newWeek: number) => {
    setSelectedWeek(newWeek);
    const sun = getSundayForWeek(newWeek);
    setStartDate(sun);
    setEndDate(addDaysToDate(sun, 4)); // Default 5 days Ahad - Khamis
  };

  // Handle start date picker change
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (endDate < newStart) {
      setEndDate(addDaysToDate(newStart, 4));
    }
  };

  // Handle end date picker change
  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    if (newEnd < startDate) {
      setStartDate(newEnd);
    }
  };

  // Quick Presets
  const handleSetPreset = (type: '5days' | 'ahad' | 'isnin' | 'selasa' | 'rabu' | 'khamis') => {
    const sun = getSundayOfWeek(startDate);
    if (type === '5days') {
      setStartDate(sun);
      setEndDate(addDaysToDate(sun, 4));
    } else if (type === 'ahad') {
      const d = getDateForDayIndex(sun, 0);
      setStartDate(d);
      setEndDate(d);
    } else if (type === 'isnin') {
      const d = getDateForDayIndex(sun, 1);
      setStartDate(d);
      setEndDate(d);
    } else if (type === 'selasa') {
      const d = getDateForDayIndex(sun, 2);
      setStartDate(d);
      setEndDate(d);
    } else if (type === 'rabu') {
      const d = getDateForDayIndex(sun, 3);
      setStartDate(d);
      setEndDate(d);
    } else if (type === 'khamis') {
      const d = getDateForDayIndex(sun, 4);
      setStartDate(d);
      setEndDate(d);
    }
  };

  // Group slots by day based on the selected date range
  const { groupedByDay, totalSelectedSlots, totalSelectedDays } = useMemo(() => {
    const baseDays: Array<{
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
        date: getDateForDayIndex(anchorSunday, 0),
        slots: []
      },
      {
        day: 'ISNIN',
        dayJawi: 'اثنين',
        dayIndex: 1,
        date: getDateForDayIndex(anchorSunday, 1),
        slots: []
      },
      {
        day: 'SELASA',
        dayJawi: 'ثلاثاء',
        dayIndex: 2,
        date: getDateForDayIndex(anchorSunday, 2),
        slots: []
      },
      {
        day: 'RABU',
        dayJawi: 'رابو',
        dayIndex: 3,
        date: getDateForDayIndex(anchorSunday, 3),
        slots: []
      },
      {
        day: 'KHAMIS',
        dayJawi: 'خميس',
        dayIndex: 4,
        date: getDateForDayIndex(anchorSunday, 4),
        slots: []
      }
    ];

    WEEKLY_15_SLOTS.forEach((config) => {
      const rph =
        weeklyRphs[config.slotNumber - 1] ||
        generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, allRphList)[config.slotNumber - 1];
      const slotDate = getDateForDayIndex(anchorSunday, config.dayIndex);

      // Include slot if its date is within [startDate, endDate]
      if (slotDate >= startDate && slotDate <= endDate) {
        const targetDay = baseDays.find((d) => d.day === config.day);
        if (targetDay && rph) {
          targetDay.slots.push({
            config,
            rph: {
              ...rph,
              date: slotDate
            }
          });
        }
      }
    });

    // Only return days that contain at least one slot in range
    const activeDays = baseDays.filter((d) => d.slots.length > 0);
    const totalSlots = activeDays.reduce((acc, d) => acc + d.slots.length, 0);

    return {
      groupedByDay: activeDays,
      totalSelectedSlots: totalSlots,
      totalSelectedDays: activeDays.length
    };
  }, [weeklyRphs, startDate, endDate, selectedWeek, anchorSunday, activeScript, allRphList]);

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

  // Save selected e-RPH items to persistence
  const handleSaveAll = () => {
    const slotsToSave: RPHItem[] = [];
    groupedByDay.forEach((dayGroup) => {
      dayGroup.slots.forEach(({ rph }) => {
        slotsToSave.push(rph);
      });
    });

    slotsToSave.forEach((item, idx) => {
      onSaveRph(item, idx !== 0);
    });
    setSaveSuccessMsg(`${slotsToSave.length} e-RPH berjaya disimpan!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Reset to fresh RPT values
  const handleResetToRpt = () => {
    if (
      confirm(
        `Jana semula e-RPH Minggu ${selectedWeek} berdasarkan RPT & Jadual Waktu rasmi? Sebarang suntingan deraf akan disetkan semula.`
      )
    ) {
      const fresh = generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, []);
      setWeeklyRphs(fresh);
      fresh.forEach((item, idx) => onSaveRph(item, idx !== 0));
      setSaveSuccessMsg('e-RPH telah dijana semula mengikut RPT!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Handle direct print
  const handlePrint = () => {
    window.print();
  };

  // Handle direct PDF download
  const handleDownloadPdf = async () => {
    if (totalSelectedSlots === 0) {
      alert('Tiada slot e-RPH untuk dimuat turun pada julat tarikh ini.');
      return;
    }

    setIsExportingPdf(true);
    setPdfProgress({
      current: 0,
      total: totalSelectedSlots,
      status: `Memulakan penjanaan fail PDF (${totalSelectedSlots} e-RPH)...`
    });

    try {
      const filename = `e-RPH_Minggu_${selectedWeek}_(${startDate}_hingga_${endDate})_${totalSelectedSlots}_Slot.pdf`;
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-tech">
                  {totalSelectedSlots} e-RPH DIPILIH ({totalSelectedDays} HARI)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-tech tracking-wide mt-0.5">
                e-RPH MENGIKUT JULAT TARIKH & JADUAL WAKTU
              </h2>
            </div>
          </div>

          {/* Week Selector, Dates & View Controls */}
          <div className="flex flex-wrap items-center gap-2.5 font-tech">
            {/* Week Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-cyan-500/30">
              <button
                type="button"
                onClick={() => handleWeekChange(Math.max(1, selectedWeek - 1))}
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
                  onChange={(e) => handleWeekChange(Number(e.target.value))}
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
                onClick={() => handleWeekChange(Math.min(42, selectedWeek + 1))}
                disabled={selectedWeek >= 42}
                className="p-1 text-slate-400 hover:text-cyan-300 disabled:opacity-30 rounded"
                title="Minggu Seterusnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Date Range Selector: Dari Tarikh & Hingga Tarikh with Interactive DatePicker */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/40">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <DatePickerField
                id="start-date-picker"
                label="DARI"
                value={startDate}
                onChange={handleStartDateChange}
                title="Pilih Tarikh Mula (Buka Kalendar)"
              />
              <span className="text-cyan-500/60 font-bold hidden sm:inline">→</span>
              <DatePickerField
                id="end-date-picker"
                label="HINGGA"
                value={endDate}
                onChange={handleEndDateChange}
                title="Pilih Tarikh Akhir (Buka Kalendar)"
              />
            </div>

            {/* Quick Presets: 5 Hari (Ahad-Khamis), Ahad, Isnin, Selasa, Rabu, Khamis */}
            <div className="flex items-center space-x-1 bg-slate-900/70 p-1 rounded-xl border border-cyan-500/25 text-[10px] font-tech">
              <button
                type="button"
                onClick={() => handleSetPreset('5days')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  totalSelectedDays === 5
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800'
                }`}
                title="Pilih 5 Hari Penuh Persekolahan (Ahad hingga Khamis)"
              >
                5 HARI (AHAD-KHAMIS)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset('ahad')}
                className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                title="Pilih Hari Ahad sahaja (4 slot)"
              >
                AHAD
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset('isnin')}
                className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                title="Pilih Hari Isnin sahaja (3 slot)"
              >
                ISNIN
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset('selasa')}
                className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                title="Pilih Hari Selasa sahaja (4 slot)"
              >
                SELASA
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset('rabu')}
                className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                title="Pilih Hari Rabu sahaja (2 slot)"
              >
                RABU
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset('khamis')}
                className="px-1.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                title="Pilih Hari Khamis sahaja (2 slot)"
              >
                KHAMIS
              </button>
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
              disabled={isExportingPdf || totalSelectedSlots === 0}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-rose-900/30 disabled:opacity-50"
              title={`Muat Turun ${totalSelectedSlots} e-RPH dalam format dokumen PDF rasmi A4`}
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingPdf ? 'MENJANA PDF...' : `MUAT TURUN ${totalSelectedSlots} e-RPH (PDF)`}</span>
            </button>

            {/* Cetak (Print) */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={totalSelectedSlots === 0}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow disabled:opacity-50"
              title={`Cetak ${totalSelectedSlots} e-RPH (Format 1 e-RPH 1 Halaman)`}
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>CETAK ({totalSelectedSlots} e-RPH)</span>
            </button>

            {/* Simpan Semua */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={totalSelectedSlots === 0}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SIMPAN ({totalSelectedSlots} e-RPH)</span>
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

      {/* ================= SUSUNAN e-RPH MENGIKUT JULAT TARIKH ================= */}
      <div
        id="weekly-rph-print-container"
        className="w-full max-w-6xl mx-auto space-y-8 pb-16"
      >
        {groupedByDay.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-cyan-500/30 space-y-2 font-tech">
            <p className="text-sm text-cyan-300">
              Tiada slot e-RPH pada julat tarikh yang dipilih ({startDate} hingga {endDate}).
            </p>
            <p className="text-xs text-slate-400">
              Sila pilih julat tarikh dalam hari persekolahan (Ahad hingga Khamis).
            </p>
            <button
              type="button"
              onClick={() => handleSetPreset('5days')}
              className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold hover:bg-cyan-500/30 transition"
            >
              Set Semula ke 5 Hari Penuh (Ahad - Khamis)
            </button>
          </div>
        ) : (
          groupedByDay.map((dayGroup) => (
            <div key={dayGroup.day} className="space-y-4">
              {/* Day Header Divider - Hidden in print to avoid taking an extra page */}
              <div className="bg-slate-950/90 border-l-4 border-cyan-400 border-y border-r border-cyan-500/30 p-3 sm:p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-2 font-tech print:hidden">
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

              {/* Individual e-RPH Cards - Strictly 1 e-RPH 1 Page */}
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
                      className="printable-rph-card bg-slate-950/95 rounded-2xl border border-cyan-500/30 p-5 sm:p-6 shadow-xl space-y-4 hover:border-cyan-400/60 transition hud-bracket text-slate-200 break-inside-avoid print:bg-white print:text-black print:border-black print:shadow-none print:m-0 print:p-6 print:rounded-none"
                      style={{ pageBreakAfter: 'always', breakAfter: 'page', pageBreakInside: 'avoid', breakInside: 'avoid' }}
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
                                reflection: `Kehadiran: ${config.defaultTotalStudents}/${config.defaultTotalStudents} orang murid.\n${config.defaultTotalStudents}/${config.defaultTotalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan.`
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};
