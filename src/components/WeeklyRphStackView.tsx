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
  ExternalLink,
  CheckSquare,
  Square
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
import { saveOrUpdateRptFromRph } from '../utils/rptStorage';
import { getBidangTheme, BIDANG_THEMES, BidangTheme } from '../utils/bidangColors';

export type DayKey = 'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS';

export const DAY_SELECTION_ITEMS: Array<{
  key: DayKey;
  label: string;
  count: number;
  dayIndex: number;
}> = [
  { key: 'AHAD', label: 'AHAD', count: 4, dayIndex: 0 },
  { key: 'ISNIN', label: 'ISNIN', count: 3, dayIndex: 1 },
  { key: 'SELASA', label: 'SELASA', count: 4, dayIndex: 2 },
  { key: 'RABU', label: 'RABU', count: 2, dayIndex: 3 },
  { key: 'KHAMIS', label: 'KHAMIS', count: 2, dayIndex: 4 }
];

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

  const [activeScript, setActiveScript] = useState<ScriptType>('jawi');
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

  // Re-generate or sync when week, anchor Sunday, active script, or saved RPH list changes
  useEffect(() => {
    setWeeklyRphs(generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, allRphList));
  }, [selectedWeek, anchorSunday, activeScript, allRphList]);

  // Live listener: immediately update local weeklyRphs slot when an e-RPH is saved
  useEffect(() => {
    const handleRphSaved = (e: Event) => {
      const customEvent = e as CustomEvent<RPHItem>;
      if (customEvent.detail) {
        const saved = customEvent.detail;
        setWeeklyRphs((prev) => {
          const idx = prev.findIndex((item) => item.id === saved.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return prev;
        });
      }
    };
    window.addEventListener('rph_saved', handleRphSaved);
    return () => window.removeEventListener('rph_saved', handleRphSaved);
  }, []);

  // Live listener: re-generate if RPT was updated elsewhere
  useEffect(() => {
    const handleRptSync = () => {
      setWeeklyRphs(generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, allRphList));
    };
    window.addEventListener('rpt_updated', handleRptSync);
    return () => window.removeEventListener('rpt_updated', handleRptSync);
  }, [selectedWeek, anchorSunday, activeScript, allRphList]);

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

  // Selected days state: di-tick setiap hari sebagai default
  const [selectedDays, setSelectedDays] = useState<Record<DayKey, boolean>>({
    AHAD: true,
    ISNIN: true,
    SELASA: true,
    RABU: true,
    KHAMIS: true
  });

  // Handle week change: updates Sunday and Thursday (5 days default) and resets ticks to all days
  const handleWeekChange = (newWeek: number) => {
    setSelectedWeek(newWeek);
    const sun = getSundayForWeek(newWeek);
    setStartDate(sun);
    setEndDate(addDaysToDate(sun, 4)); // Default 5 days Ahad - Khamis
    setSelectedDays({
      AHAD: true,
      ISNIN: true,
      SELASA: true,
      RABU: true,
      KHAMIS: true
    });
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

  // Check if all days are ticked
  const isAllDaysTicked = useMemo(() => {
    return DAY_SELECTION_ITEMS.every((d) => selectedDays[d.key]);
  }, [selectedDays]);

  // Toggle tick for a single day
  const handleToggleDay = (day: DayKey) => {
    setSelectedDays((prev) => {
      const nextVal = !prev[day];
      const next = { ...prev, [day]: nextVal };

      // If user is ticking a day ON, ensure date range covers this day
      if (nextVal) {
        const conf = DAY_SELECTION_ITEMS.find((d) => d.key === day);
        if (conf) {
          const dDate = getDateForDayIndex(anchorSunday, conf.dayIndex);
          if (dDate < startDate) setStartDate(dDate);
          if (dDate > endDate) setEndDate(dDate);
        }
      }

      return next;
    });
  };

  // Select all days or untick all
  const handleSelectAllDays = () => {
    if (isAllDaysTicked) {
      // Untick all so user can choose individual day easily
      setSelectedDays({
        AHAD: false,
        ISNIN: false,
        SELASA: false,
        RABU: false,
        KHAMIS: false
      });
    } else {
      // Tick all 5 days by default & set full 5-day span (Ahad - Khamis)
      setSelectedDays({
        AHAD: true,
        ISNIN: true,
        SELASA: true,
        RABU: true,
        KHAMIS: true
      });
      const sun = getSundayOfWeek(startDate);
      setStartDate(sun);
      setEndDate(addDaysToDate(sun, 4));
    }
  };

  // Group slots by day based on the selected date range and ticked days
  const { groupedByDay, totalSelectedSlots, totalSelectedDays } = useMemo(() => {
    const baseDays: Array<{
      day: 'AHAD' | 'ISNIN' | 'SELASA' | 'RABU' | 'KHAMIS';
      dayJawi: string;
      dayIndex: number;
      date: string;
      slots: Array<{ config: WeeklySlotConfig; rph: RPHItem; displayIndex: number }>;
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
      // 1. Check if day is ticked by user - unticked days are excluded from view, print, and download
      if (!selectedDays[config.day as DayKey]) {
        return;
      }

      const rph =
        weeklyRphs[config.slotNumber - 1] ||
        generateWeekly15Rph(selectedWeek, anchorSunday, activeScript, allRphList)[config.slotNumber - 1];
      const slotDate = getDateForDayIndex(anchorSunday, config.dayIndex);

      // 2. Include slot if its date is within [startDate, endDate]
      if (slotDate >= startDate && slotDate <= endDate) {
        const targetDay = baseDays.find((d) => d.day === config.day);
        if (targetDay && rph) {
          targetDay.slots.push({
            config,
            rph: {
              ...rph,
              date: slotDate
            },
            displayIndex: 0
          });
        }
      }
    });

    // Only return days that contain at least one slot in range and are ticked
    const activeDays = baseDays.filter((d) => d.slots.length > 0);
    const totalSlots = activeDays.reduce((acc, d) => acc + d.slots.length, 0);

    // Assign continuous sequential display number (1 to totalSlots) according to displayed e-RPH
    let runningDisplayIndex = 0;
    activeDays.forEach((dayGroup) => {
      dayGroup.slots.forEach((slotItem) => {
        runningDisplayIndex += 1;
        slotItem.displayIndex = runningDisplayIndex;
      });
    });

    return {
      groupedByDay: activeDays,
      totalSelectedSlots: totalSlots,
      totalSelectedDays: activeDays.length
    };
  }, [weeklyRphs, startDate, endDate, selectedDays, selectedWeek, anchorSunday, activeScript, allRphList]);

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

  // 1. Save selected e-RPH items to persistence (e-RPH sahaja)
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

  // 2. Save selected e-RPH items to both e-RPH and RPT (Kekal)
  const handleSaveAllWithRpt = () => {
    const slotsToSave: RPHItem[] = [];
    groupedByDay.forEach((dayGroup) => {
      dayGroup.slots.forEach(({ rph }) => {
        slotsToSave.push(rph);
      });
    });

    slotsToSave.forEach((item, idx) => {
      saveOrUpdateRptFromRph(item);
      onSaveRph(item, idx !== 0);
    });
    setSaveSuccessMsg(`${slotsToSave.length} e-RPH & RPT Tahunan berjaya dikemaskini secara kekal!`);
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

            {/* Pilihan Hari (Tickable Checkboxes) - Default Semua Hari Di-tick */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-cyan-500/30 text-xs font-tech">
              <button
                type="button"
                onClick={handleSelectAllDays}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
                  isAllDaysTicked
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border-cyan-300 shadow-md'
                    : 'bg-slate-950 text-cyan-300 hover:bg-slate-800 border-cyan-500/40'
                }`}
                title={isAllDaysTicked ? 'Nyahpilih (Untick) Semua Hari' : 'Tick Semua 5 Hari (Ahad - Khamis)'}
              >
                {isAllDaysTicked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>5 HARI (SEMUA)</span>
              </button>

              <div className="h-4 w-px bg-cyan-500/20 mx-0.5 hidden sm:block" />

              {DAY_SELECTION_ITEMS.map(({ key, label, count }) => {
                const isTicked = selectedDays[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleDay(key)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
                      isTicked
                        ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-1 ring-cyan-500/30 shadow'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                    title={`Klik untuk ${isTicked ? 'nyahpilih (untick)' : 'pilih (tick)'} Hari ${label} (${count} slot)`}
                  >
                    {isTicked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 stroke-[2.5]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={isTicked ? 'text-white' : 'text-slate-500'}>{label}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                        isTicked ? 'bg-cyan-900/60 text-cyan-300' : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
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

            {/* 1. Butang Simpan Sedia Ada: e-RPH Sahaja */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={totalSelectedSlots === 0}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow disabled:opacity-50"
              title="Simpan perubahan di e-RPH sahaja"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SIMPAN e-RPH ({totalSelectedSlots})</span>
            </button>

            {/* 2. Butang Simpan Baharu: e-RPH & RPT Tahunan */}
            <button
              type="button"
              onClick={handleSaveAllWithRpt}
              disabled={totalSelectedSlots === 0}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow disabled:opacity-50 ring-1 ring-cyan-300/60"
              title="Simpan perubahan di e-RPH dan kemaskini Rancangan Pengajaran Tahunan (RPT) secara kekal"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950" />
              <span>SIMPAN e-RPH & RPT ({totalSelectedSlots})</span>
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

        {/* Petunjuk Tema Warna e-RPH Ceria Mengikut Bidang */}
        <div className="mt-3.5 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-cyan-300 font-tech uppercase text-[11px] sm:text-xs">
              TEMA WARNA CETAKAN MENGIKUT BIDANG:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {Object.values(BIDANG_THEMES).map((themeItem) => (
              <span
                key={themeItem.id}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm transition hover:scale-105"
                style={{
                  backgroundColor: `${themeItem.primaryHex}20`,
                  color: themeItem.primaryHex,
                  border: `1px solid ${themeItem.primaryHex}55`
                }}
                title={`${themeItem.name} (${themeItem.jawiName}): ${themeItem.description}`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0 shadow-sm"
                  style={{ backgroundColor: themeItem.primaryHex }}
                />
                <span>{themeItem.name}</span>
                {activeScript === 'jawi' && (
                  <span className="font-jawi font-bold text-xs pr-0.5">({themeItem.jawiName})</span>
                )}
              </span>
            ))}
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
              Tiada slot e-RPH pada hari atau julat tarikh yang dipilih ({startDate} hingga {endDate}).
            </p>
            <p className="text-xs text-slate-400">
              Sila pastikan sekurang-kurangnya satu hari persekolahan (Ahad hingga Khamis) di-tick.
            </p>
            <button
              type="button"
              onClick={handleSelectAllDays}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:brightness-110 transition shadow"
            >
              Tick Semua Hari (Ahad - Khamis)
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
                {dayGroup.slots.map(({ config, rph, displayIndex }) => {
                  const slotIndex = config.slotNumber - 1;
                  const isTasmik = config.isTasmik || isTasmikRph(rph);
                  const displayItem = isJawi ? getJawiRph(rph) : rph;
                  const currentSlotNumber = displayIndex || config.slotNumber;
                  const theme = getBidangTheme(rph.learningArea, isTasmik);

                  return (
                    <div
                      key={rph.id || `slot-${config.slotNumber}`}
                      data-printable-card="true"
                      data-bidang-id={theme.id}
                      className="printable-rph-card bg-slate-950/95 rounded-2xl border-2 p-5 sm:p-6 shadow-xl space-y-3.5 hover:shadow-2xl transition text-slate-200 break-inside-avoid print:bg-white print:text-slate-900 print:shadow-none print:m-0 print:p-4 print:space-y-2.5 print:rounded-xl"
                      style={{
                        pageBreakAfter: 'always',
                        breakAfter: 'page',
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                        borderColor: theme.primaryHex
                      }}
                      data-print-border={theme.primaryHex}
                    >
                      {/* Top Badges & Screen Controls matching exact original layout */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/80 print:border-slate-300 print:pb-1.5 print:mb-1">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                          <span
                            className="px-3.5 py-1 rounded-full text-xs font-black tracking-wide text-slate-950 font-tech shadow-sm print:px-3 print:py-0.5 print:text-[10px]"
                            style={{ backgroundColor: '#14b8a6' /* teal as in original layout */ }}
                          >
                            SLOT {currentSlotNumber} / {totalSelectedSlots}
                          </span>
                          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-slate-900 text-cyan-400 border border-cyan-500/30 font-tech shadow-sm print:bg-slate-900 print:text-cyan-300 print:px-3 print:py-0.5 print:text-[10px]">
                            {config.periodLabel || `Waktu ${config.slotNumber}`}
                          </span>
                          {isTasmik && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-tech print:px-2.5 print:py-0.5 print:text-[9.5px]">
                              FORMAT TASMIK
                            </span>
                          )}
                        </div>

                        {/* Screen-only Controls (Status selector & Full Edit button) */}
                        <div className="flex items-center space-x-2 print:hidden font-tech">
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

                      {/* Metadata Grid: 4 Boxes (Hari & Tarikh, Waktu & Masa, Kelas & Tahun, Bidang Pembelajaran) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-tech">
                        <div
                          className="rph-box p-3 rounded-xl border-2 transition shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            HARI & TARIKH:
                          </span>
                          <span className="font-bold text-white print:text-slate-900 block text-sm sm:text-base">
                            {rph.date} • {isJawi ? config.dayJawi : config.day}
                          </span>
                        </div>

                        <div
                          className="rph-box p-3 rounded-xl border-2 transition shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            WAKTU & MASA:
                          </span>
                          <span className="font-bold text-white print:text-slate-900 block text-sm sm:text-base">
                            {rph.time}
                          </span>
                        </div>

                        <div
                          className="rph-box p-3 rounded-xl border-2 transition shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            KELAS & TAHUN:
                          </span>
                          <span className="font-bold text-white print:text-slate-900 block text-sm sm:text-base">
                            {rph.className}
                          </span>
                        </div>

                        <div
                          className="rph-box p-3 rounded-xl border-2 transition shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            BIDANG PEMBELAJARAN:
                          </span>
                          <span
                            className="font-black block text-sm sm:text-base"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? (displayItem.learningArea || theme.jawiName) : (rph.learningArea || theme.name)}
                          </span>
                        </div>
                      </div>

                      {/* Tajuk Pelajaran - Clean typography without outer box container, matches original screenshot */}
                      <div
                        className={`space-y-0.5 ${isJawi ? 'text-right font-jawi' : 'text-left font-sans-custom'}`}
                        dir={isJawi ? 'rtl' : 'ltr'}
                      >
                        <span className="text-xs font-bold text-slate-400 print:text-slate-700 block">
                          {isJawi ? 'تاجوق ڤمبلاجرن:' : 'TAJUK PELAJARAN:'}
                        </span>
                        <h3 className={`font-black text-white print:text-slate-950 ${isJawi ? 'text-xl sm:text-2xl leading-normal' : 'text-lg sm:text-xl'}`}>
                          {displayItem.topic}
                        </h3>
                      </div>

                      {/* Box 1: SK & SP (Combined in ONE rounded box as in original layout) */}
                      <div
                        className={`rph-box p-3 sm:p-3.5 rounded-xl border-2 space-y-2.5 shadow-sm ${isJawi ? 'text-right font-jawi' : 'text-left font-sans-custom'}`}
                        style={{
                          backgroundColor: `${theme.primaryHex}12`,
                          borderColor: theme.primaryHex
                        }}
                        data-print-bg={theme.bgLightHex}
                        data-print-border={theme.primaryHex}
                        dir={isJawi ? 'rtl' : 'ltr'}
                      >
                        <div>
                          <span
                            className="rph-box-header text-xs font-black block mb-0.5 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? 'ستندرد کاندوڠن (SK):' : 'STANDARD KANDUNGAN (SK):'}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-100 print:text-slate-900 leading-relaxed font-medium">
                            {displayItem.contentStandard}
                          </p>
                        </div>
                        <div>
                          <span
                            className="rph-box-header text-xs font-black block mb-0.5 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? 'ستندرد ڤمبلاجرن (SP):' : 'STANDARD PEMBELAJARAN (SP):'}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-100 print:text-slate-900 leading-relaxed font-medium">
                            {displayItem.learningStandard}
                          </p>
                        </div>
                      </div>

                      {/* Box 2: Objektif & Kriteria Kejayaan (Combined in ONE rounded box as in original layout) */}
                      <div
                        className={`rph-box p-3 sm:p-3.5 rounded-xl border-2 space-y-2.5 shadow-sm ${isJawi ? 'text-right font-jawi' : 'text-left font-sans-custom'}`}
                        style={{
                          backgroundColor: `${theme.primaryHex}12`,
                          borderColor: theme.primaryHex
                        }}
                        data-print-bg={theme.bgLightHex}
                        data-print-border={theme.primaryHex}
                        dir={isJawi ? 'rtl' : 'ltr'}
                      >
                        <div>
                          <span
                            className="rph-box-header text-xs font-black block mb-0.5 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? 'اوبجيکتيف ڤمبلاجرن:' : 'OBJEKTIF PEMBELAJARAN:'}
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-xs sm:text-sm text-slate-100 print:text-slate-900 leading-relaxed font-medium">
                            {displayItem.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span
                            className="rph-box-header text-xs font-black block mb-0.5 tracking-wide"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? 'کريتيريا کجايأن:' : 'KRITERIA KEJAYAAN:'}
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-xs sm:text-sm text-slate-100 print:text-slate-900 leading-relaxed font-medium">
                            {displayItem.successCriteria.map((sc, i) => (
                              <li key={i}>{sc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Box 3: Aktiviti PdPc (Combined in ONE rounded box as in original layout) */}
                      <div
                        className={`rph-box p-3 sm:p-3.5 rounded-xl border-2 space-y-2 shadow-sm ${isJawi ? 'text-right font-jawi' : 'text-left font-sans-custom'}`}
                        style={{
                          backgroundColor: `${theme.primaryHex}12`,
                          borderColor: theme.primaryHex
                        }}
                        data-print-bg={theme.bgLightHex}
                        data-print-border={theme.primaryHex}
                        dir={isJawi ? 'rtl' : 'ltr'}
                      >
                        <span
                          className="rph-box-header text-xs font-black block mb-0.5 tracking-wide"
                          style={{ color: theme.primaryHex }}
                          data-print-color={theme.primaryHex}
                        >
                          {isJawi ? 'اکتيۏيتي ڤڠاجرن دان ڤمبلاجرن (PDPC):' : 'AKTIVITI PENGAJARAN & PEMBELAJARAN (PDPC):'}
                        </span>
                        <div className="space-y-1.5 text-xs sm:text-sm text-slate-100 print:text-slate-900 leading-relaxed font-medium">
                          <p>
                            <span className="font-bold">{isJawi ? 'سيت ايندوکسي: ' : 'Set Induksi: '}</span>
                            {displayItem.inductionActivity}
                          </p>
                          <div>
                            <span className="font-bold block mb-0.5">{isJawi ? 'اکتيۏيتي اوتاما:' : 'Aktiviti Utama:'}</span>
                            <ul className="list-decimal list-inside space-y-0.5 pr-2">
                              {displayItem.mainActivities.map((act, i) => (
                                <li key={i}>{act}</li>
                              ))}
                            </ul>
                          </div>
                          <p>
                            <span className="font-bold">{isJawi ? 'ڤنوتوڤ: ' : 'Penutup: '}</span>
                            {displayItem.closureActivity}
                          </p>
                        </div>
                      </div>

                      {/* Row 4: 3 Boxes for BBM, EMK / KBAT, Pentaksiran PBD (as in original screenshot) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 font-tech" dir={isJawi ? 'rtl' : 'ltr'}>
                        <div
                          className="rph-box p-2.5 sm:p-3 rounded-xl border-2 shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? ':BBM' : 'BBM:'}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-100 print:text-slate-900 block leading-snug">
                            {displayItem.teachingAids.join('، ')}
                          </span>
                        </div>

                        <div
                          className="rph-box p-2.5 sm:p-3 rounded-xl border-2 shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? ':EMK / KBAT' : 'EMK / KBAT:'}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-100 print:text-slate-900 block leading-snug">
                            {displayItem.crossCurricularElements.join('، ')}
                          </span>
                        </div>

                        <div
                          className="rph-box p-2.5 sm:p-3 rounded-xl border-2 shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryHex}15`,
                            borderColor: theme.primaryHex
                          }}
                          data-print-bg={theme.bgLightHex}
                          data-print-border={theme.primaryHex}
                        >
                          <span
                            className="rph-box-header text-xs font-black uppercase block mb-1"
                            style={{ color: theme.primaryHex }}
                            data-print-color={theme.primaryHex}
                          >
                            {isJawi ? ':PENTAKSIRAN PBD' : 'PENTAKSIRAN PBD:'}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-100 print:text-slate-900 block leading-snug">
                            {displayItem.pbdAssessment}
                          </span>
                        </div>
                      </div>

                      {/* Refleksi & Pencapaian Murid Box (as in original screenshot) */}
                      <div
                        className="rph-box p-3 sm:p-3.5 rounded-xl border-2 space-y-2 shadow-sm font-tech"
                        style={{
                          backgroundColor: `${theme.primaryHex}15`,
                          borderColor: theme.primaryHex
                        }}
                        data-print-bg={theme.bgLightHex}
                        data-print-border={theme.primaryHex}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <UserCheck className="w-4 h-4 text-slate-300 print:text-slate-700" style={{ color: theme.primaryHex }} />
                            <span
                              className="rph-box-header text-xs font-black uppercase"
                              style={{ color: theme.primaryHex }}
                              data-print-color={theme.primaryHex}
                            >
                              {isJawi ? 'ريفليکسي دان تيليکن موريد' : 'REFLEKSI & PENCAPAIAN MURID'}
                            </span>
                          </div>

                          {/* Quick reflection templates on screen */}
                          <div className="flex items-center space-x-1.5 print:hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateSlot(slotIndex, {
                                  reflection: `Kehadiran: ${config.defaultTotalStudents}/${config.defaultTotalStudents} orang murid.\n${config.defaultTotalStudents}/${config.defaultTotalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan.`
                                })
                              }
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40"
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
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40"
                            >
                              + Ditangguhkan
                            </button>
                          </div>
                        </div>

                        {/* Textarea container with inner box as in screenshot */}
                        <div className="bg-slate-950/80 print:bg-white border border-slate-700 print:border-slate-300 rounded-lg p-2.5">
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
                            rows={2}
                            placeholder="Masukkan catatan refleksi PdPc murid..."
                            className={`w-full bg-transparent border-0 resize-none focus:outline-none text-xs sm:text-sm text-slate-100 print:text-slate-900 font-medium leading-relaxed ${
                              isJawi ? 'font-jawi text-right text-sm sm:text-base' : 'font-sans-custom'
                            }`}
                            dir={isJawi ? 'rtl' : 'ltr'}
                          />
                        </div>

                        <div className="pt-1 border-t border-slate-700/60 print:border-slate-300 text-xs font-medium text-slate-400 print:text-slate-700">
                          Disemak Oleh: Guru Besar @ Penolong Kanan (SK Merbau Pulas)
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
