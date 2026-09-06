import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface DatePickerFieldProps {
  id?: string;
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  title?: string;
  minDate?: string;
  maxDate?: string;
}

const MONTH_NAMES_MS = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
];

const DAY_NAMES_MS = [
  { short: 'Ah', full: 'Ahad', schoolDay: true },
  { short: 'Is', full: 'Isnin', schoolDay: true },
  { short: 'Se', full: 'Selasa', schoolDay: true },
  { short: 'Ra', full: 'Rabu', schoolDay: true },
  { short: 'Kh', full: 'Khamis', schoolDay: true },
  { short: 'Ju', full: 'Jumaat', schoolDay: false },
  { short: 'Sa', full: 'Sabtu', schoolDay: false }
];

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  label,
  value,
  onChange,
  title,
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // Parse initial view date from value or fallback to today
  const parseDate = (dStr: string) => {
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
      return new Date();
    } catch {
      return new Date();
    }
  };

  const currentDateObj = parseDate(value);
  const [viewYear, setViewYear] = useState<number>(currentDateObj.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState<number>(currentDateObj.getMonth() || 0);

  // Sync view month/year when value changes externally
  useEffect(() => {
    const d = parseDate(value);
    if (!isNaN(d.getTime())) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Format display date: DD/MM/YYYY (DayName)
  const formatDisplay = (dStr: string) => {
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const dayName = DAY_NAMES_MS[d.getDay()]?.full || '';
        const dd = String(parts[2]).padStart(2, '0');
        const mm = String(parts[1]).padStart(2, '0');
        const yyyy = parts[0];
        return {
          dateStr: `${dd}/${mm}/${yyyy}`,
          dayName
        };
      }
    } catch {
      // ignore
    }
    return { dateStr: dStr, dayName: '' };
  };

  const { dateStr, dayName } = formatDisplay(value);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate calendar days grid (7 columns: Sun, Mon, Tue, Wed, Thu, Fri, Sat)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({
      dayNum,
      dateKey,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({
      dayNum,
      dateKey,
      isCurrentMonth: true
    });
  }

  // Next month leading days (to complete 35 or 42 grid cells)
  const remaining = 42 - calendarCells.length;
  if (remaining < 7) {
    // 35 cells might be enough if calendarCells <= 35
  }
  const targetTotal = calendarCells.length <= 35 ? 35 : 42;
  const trailingNeeded = targetTotal - calendarCells.length;
  for (let dayNum = 1; dayNum <= trailingNeeded; dayNum++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({
      dayNum,
      dateKey,
      isCurrentMonth: false
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSelectDate = (dateKey: string) => {
    onChange(dateKey);
    setIsOpen(false);
  };

  const handleOpenNativePicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nativeInputRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          nativeInputRef.current.showPicker();
        } else {
          setIsOpen(true);
        }
      } catch {
        setIsOpen(true);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Hidden native input synchronized for browser support */}
      <input
        ref={nativeInputRef}
        type="date"
        id={id}
        value={value}
        min={minDate}
        max={maxDate}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Main Trigger Button: Looks like a clean modern date picker */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={title || `Pilih ${label} (Buka Kalendar)`}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition font-mono ${
          isOpen
            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40'
            : 'bg-slate-950 border-cyan-500/40 text-cyan-200 hover:border-cyan-400 hover:bg-slate-900'
        }`}
      >
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide">
          {label}:
        </span>
        <span className="font-semibold text-white tracking-tight">
          {dateStr}
        </span>
        {dayName && (
          <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950/80 text-cyan-300 rounded border border-cyan-500/30">
            {dayName}
          </span>
        )}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenNativePicker}
          className="p-1 -mr-1 hover:bg-cyan-500/20 text-cyan-400 rounded-md transition"
          title="Buka Kalendar Sistem / Kalendar Terbina"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 left-0 z-50 w-72 sm:w-80 p-3.5 bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/80 backdrop-blur-xl font-tech text-white animate-in fade-in zoom-in-95 duration-150"
          style={{ minWidth: '280px' }}
        >
          {/* Header: Month & Year Selector + Prev/Next Buttons */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-cyan-500/20">
            <div className="flex items-center space-x-1">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-slate-900 border border-cyan-500/30 rounded-lg px-2 py-1 text-xs font-bold text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {MONTH_NAMES_MS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="bg-slate-900 border border-cyan-500/30 rounded-lg px-2 py-1 text-xs font-bold text-cyan-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-lg transition"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-lg transition"
                title="Bulan Seterusnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg transition ml-1"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* School Day indicator legend */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mb-2">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Ahad-Khamis (Persekolahan)</span>
            </span>
            <span className="text-slate-500">Jum & Sab (Cuti)</span>
          </div>

          {/* Day of Week Headers (Ahad first) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES_MS.map((d) => (
              <div
                key={d.short}
                title={d.full}
                className={`text-[10px] font-bold py-1 ${
                  d.schoolDay ? 'text-cyan-300' : 'text-slate-500'
                }`}
              >
                {d.short}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {calendarCells.map(({ dayNum, dateKey, isCurrentMonth }) => {
              const isSelected = dateKey === value;
              const isToday = dateKey === todayStr;
              const d = new Date(dateKey);
              const dayOfWeek = d.getDay();
              const isSchool = dayOfWeek >= 0 && dayOfWeek <= 4; // Sun-Thu

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => handleSelectDate(dateKey)}
                  className={`relative py-1.5 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-md shadow-cyan-500/40 ring-2 ring-white scale-105 z-10'
                      : isCurrentMonth
                      ? isSchool
                        ? 'text-white hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40'
                        : 'text-slate-400 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/50 opacity-40'
                  } ${isToday && !isSelected ? 'border border-cyan-400/60 bg-cyan-950/40 text-cyan-200' : ''}`}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-cyan-400 -mt-0.5" />
                  )}
                  {isSelected && (
                    <Check className="w-2.5 h-2.5 -mt-0.5 text-slate-950 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Footer Shortcuts */}
          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => handleSelectDate(todayStr)}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 transition"
            >
              Hari Ini ({new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit' })})
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition ml-auto"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
