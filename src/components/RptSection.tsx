import React, { useState, useMemo, useEffect } from 'react';
import { RptItem } from '../types';
import { rptTahun1Metadata } from '../data/rptTahun1Data';
import { getAllRptForYear } from '../utils/rptStorage';
import {
  BookOpen,
  Search,
  Printer,
  ChevronDown,
  Calendar,
  Sparkles,
  FileCheck,
  CheckCircle2,
  Share2,
  Download,
  Eye,
  PlusCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  BookMarked,
  School,
  UserCheck,
  CalendarDays
} from 'lucide-react';

export type YearLevel = 'Tahun 1' | 'Tahun 2' | 'Tahun 3' | 'Tahun 6';

interface RptSectionProps {
  onGenerateRphFromRpt?: (rpt: RptItem) => void;
  defaultYear?: YearLevel;
}

export const RptSection: React.FC<RptSectionProps> = ({
  onGenerateRphFromRpt,
  defaultYear = 'Tahun 1'
}) => {
  const [selectedYearLevel, setSelectedYearLevel] = useState<YearLevel>(defaultYear);
  const [selectedPenggal, setSelectedPenggal] = useState<'semua' | 'penggal1' | 'penggal2' | 'penggal3'>('semua');
  const [selectedWeek, setSelectedWeek] = useState<number | 'semua'>('semua');
  const [selectedBidang, setSelectedBidang] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeItemDetails, setActiveItemDetails] = useState<RptItem | null>(null);
  const [scriptMode, setScriptMode] = useState<'jawi' | 'rumi'>('jawi');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRptUpdate = () => {
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener('rpt_updated', handleRptUpdate);
    return () => window.removeEventListener('rpt_updated', handleRptUpdate);
  }, []);

  // Active dataset based on selected year level (merged with custom persistent updates)
  const activeDataset = useMemo(() => {
    return getAllRptForYear(selectedYearLevel);
  }, [selectedYearLevel, refreshKey]);

  // Filter items based on selected criteria
  const filteredRpt = useMemo(() => {
    const maxWeekP1 = 16;
    const maxWeekP2 = 27;

    return activeDataset.filter((item) => {
      // Penggal filter
      if (selectedPenggal === 'penggal1' && (item.week < 1 || item.week > maxWeekP1)) return false;
      if (selectedPenggal === 'penggal2' && (item.week < 17 || item.week > maxWeekP2)) return false;
      if (selectedPenggal === 'penggal3' && item.week < 28) return false;

      // Week filter
      if (selectedWeek !== 'semua' && item.week !== selectedWeek) return false;

      // Bidang filter
      if (selectedBidang !== 'Semua') {
        if (selectedBidang === 'Al-Quran' && !['Al-Quran', 'Tafsir/Kefahaman', 'Tadarus/Tasmik', 'Tajwid'].includes(item.subjectCategory)) {
          return false;
        } else if (selectedBidang === 'Transisi' && item.subjectCategory !== 'Transisi') {
          return false;
        } else if (selectedBidang === 'Pengurusan' && item.subjectCategory !== 'Pengurusan') {
          return false;
        } else if (selectedBidang !== 'Al-Quran' && selectedBidang !== 'Transisi' && selectedBidang !== 'Pengurusan' && item.subjectCategory !== selectedBidang) {
          return false;
        }
      }

      // Search filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchTitle = (item.topicTitle || '').toLowerCase().includes(query);
        const matchSK = item.contentStandard.toLowerCase().includes(query);
        const matchSP = item.learningStandard.toLowerCase().includes(query);
        const matchSlot = item.timeSlot.toLowerCase().includes(query);
        const matchWeek = `minggu ${item.week}`.includes(query) || `m${item.week}`.includes(query);
        const matchCivic = (item.civicTopic || '').toLowerCase().includes(query);
        const matchDates = (item.kumpADates || '').toLowerCase().includes(query) || (item.kumpBDates || '').toLowerCase().includes(query);
        if (!matchTitle && !matchSK && !matchSP && !matchSlot && !matchWeek && !matchCivic && !matchDates) {
          return false;
        }
      }

      return true;
    });
  }, [activeDataset, selectedPenggal, selectedWeek, selectedBidang, searchTerm]);

  // Group by week for structured presentation
  const groupedByWeek = useMemo(() => {
    const groups: { [key: number]: RptItem[] } = {};
    filteredRpt.forEach((item) => {
      if (!groups[item.week]) {
        groups[item.week] = [];
      }
      groups[item.week].push(item);
    });
    return groups;
  }, [filteredRpt]);

  const uniqueWeeks = useMemo(() => {
    const weeks = Array.from(new Set(activeDataset.map((i) => i.week))) as number[];
    return weeks.sort((a, b) => a - b);
  }, [activeDataset]);

  const handlePrintRpt = () => {
    window.print();
  };

  const isTahun1 = selectedYearLevel === 'Tahun 1';
  const isTahun2 = selectedYearLevel === 'Tahun 2';
  const isTahun3 = selectedYearLevel === 'Tahun 3';
  const isTahun6 = selectedYearLevel === 'Tahun 6';

  const teacherName = isTahun2
    ? "GURU: ASMA' BINTI BAHARUDDIN"
    : isTahun3
    ? 'PANITIA PENDIDIKAN ISLAM SK MERBAU PULAS'
    : 'GURU: SALNATASHA BINTI MOHAMAD SABRI';

  const classLabel = isTahun1
    ? 'KELAS: 1 IBNU SINA & 1 IBNU KHALDUN'
    : isTahun2
    ? 'KELAS: 2 IBNU KHALDUN'
    : isTahun3
    ? 'KELAS: 3 AL-BIRUNI'
    : 'KELAS: 6 AL-GHAZALI';

  const jawiYearTitle = isTahun1
    ? 'ڤنديديقن إسلام تاهون 1'
    : isTahun2
    ? 'ڤنديديقن إسلام تاهون 2'
    : isTahun3
    ? 'ڤنديديقن إسلام تاهون 3'
    : 'ڤنديديقن إسلام تاهون 6';

  const yearDescription = isTahun1
    ? 'RPT Lengkap Minggu 1 hingga Minggu 43 merangkumi Program Transisi (Minggu 1-4), Sukatan KSSR Semakan Penuh (Minggu 5-42), dan Pengurusan Akhir/PBD (Minggu 43) mengikut takwim persekolahan Kumpulan A (Kedah) dan Kumpulan B.'
    : isTahun2
    ? 'RPT Lengkap Pendidikan Islam Tahun 2 KSSR Semakan SK Merbau Pulas (Pn Asma binti Baharuddin) mengikut takwim persekolahan sesi 2025/2026 Kumpulan A (Kedah).'
    : isTahun3
    ? 'RPT Pendidikan Islam Tahun 3 KSSR Semakan merangkumi Al-Quran (Tilawah, Hafazan, Kefahaman, Tajwid), Hadis, Akidah, Ibadah, Sirah, Adab dan Jawi.'
    : 'RPT Lengkap Minggu 1 hingga Minggu 42 Pendidikan Islam Tahun 6 KSSR Semakan mengikut standard tulisan Jawi Baharu Dewan Bahasa dan Pustaka (DBP).';

  return (
    <div className="space-y-6">
      {/* YEAR LEVEL SELECTOR TABS */}
      <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 p-2 shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-3 font-tech">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-2">
            PILIH TAHUN RPT:
          </span>
          <div className="inline-flex flex-wrap rounded-xl p-1 bg-slate-900 border border-cyan-500/30 gap-1">
            <button
              onClick={() => {
                setSelectedYearLevel('Tahun 1');
                setSelectedWeek('semua');
                setSelectedBidang('Semua');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                isTahun1
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <span>📘 TAHUN 1 (43 M)</span>
            </button>
            <button
              onClick={() => {
                setSelectedYearLevel('Tahun 2');
                setSelectedWeek('semua');
                setSelectedBidang('Semua');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                isTahun2
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span>📙 TAHUN 2 (2025/26)</span>
            </button>
            <button
              onClick={() => {
                setSelectedYearLevel('Tahun 3');
                setSelectedWeek('semua');
                setSelectedBidang('Semua');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                isTahun3
                  ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-violet-300'
              }`}
            >
              <span>📕 TAHUN 3 (KSSR)</span>
            </button>
            <button
              onClick={() => {
                setSelectedYearLevel('Tahun 6');
                setSelectedWeek('semua');
                setSelectedBidang('Semua');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                isTahun6
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <span>📗 TAHUN 6 (42 M)</span>
            </button>
          </div>
        </div>

        {/* Script & Print buttons */}
        <div className="flex items-center space-x-2 px-2">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-1 flex items-center">
            <button
              onClick={() => setScriptMode('jawi')}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition ${
                scriptMode === 'jawi'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              توليسن جاوي (DBP)
            </button>
            <button
              onClick={() => setScriptMode('rumi')}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition ${
                scriptMode === 'rumi'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Rumi
            </button>
          </div>

          <button
            onClick={handlePrintRpt}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
            title="Cetak atau Simpan PDF Dokumen RPT"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>CETAK / PDF RPT</span>
          </button>
        </div>
      </div>

      {/* Header Banner with Metadata */}
      <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 p-5 shadow-lg relative overflow-hidden hud-bracket">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-1.5 font-tech uppercase tracking-wider">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-cyan-300">
                KSSR SEMAKAN DBP
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                {jawiYearTitle}
              </span>
              <span>•</span>
              <span className="text-amber-300">
                {classLabel}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-tech tracking-wide flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-cyan-400" />
              <span>
                {`RANCANGAN PENGAJARAN TAHUNAN (RPT) ${selectedYearLevel.toUpperCase()}`}
              </span>
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-300 font-sans-custom">
              <div className="flex items-center space-x-1.5 text-cyan-200">
                <School className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>SEKOLAH KEBANGSAAN MERBAU PULAS (KBA 5012)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-300">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{teacherName}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans-custom">
              {yearDescription}
            </p>
          </div>
        </div>

        {/* Statistical Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-cyan-500/20 text-xs font-tech">
          <div className="bg-[#041926] p-2.5 rounded-xl border border-cyan-500/20">
            <span className="text-slate-400 block text-[11px]">TEMPOH PERSEKOLAHAN</span>
            <span className="text-lg font-bold text-cyan-300">
              {isTahun1 ? '43 MINGGU' : isTahun6 ? '42 MINGGU' : `${uniqueWeeks.length} MINGGU`}
            </span>
          </div>
          <div className="bg-[#041926] p-2.5 rounded-xl border border-cyan-500/20">
            <span className="text-slate-400 block text-[11px]">REKOD SLOT PDPC</span>
            <span className="text-lg font-bold text-emerald-400">{activeDataset.length} REKOD RPT</span>
          </div>
          <div className="bg-[#041926] p-2.5 rounded-xl border border-cyan-500/20">
            <span className="text-slate-400 block text-[11px]">BIDANG KURIKULUM</span>
            <span className="text-lg font-bold text-amber-300">
              {isTahun1 ? 'TRANSISI + 6 BIDANG KSSR' : '7 BIDANG KURIKULUM'}
            </span>
          </div>
          <div className="bg-[#041926] p-2.5 rounded-xl border border-cyan-500/20">
            <span className="text-slate-400 block text-[11px]">STATUS TULISAN JAWI</span>
            <span className="text-lg font-bold text-cyan-400">100% PIAWAIAN DBP</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 p-4 shadow-md space-y-3 font-tech">
        {/* Row 1: Penggal Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-cyan-400 font-semibold uppercase mr-1">Penggal:</span>
            {[
              { id: 'semua', label: isTahun1 ? 'Semua (M1-43)' : 'Semua (M1-42)' },
              { id: 'penggal1', label: isTahun1 ? 'Penggal 1 (M1-16 Transisi & KSSR)' : 'Penggal 1 (M1-16)' },
              { id: 'penggal2', label: 'Penggal 2 (M17-27)' },
              { id: 'penggal3', label: isTahun1 ? 'Penggal 3 (M28-43)' : 'Penggal 3 (M28-42)' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPenggal(p.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPenggal === p.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tajuk, surah, SK, SP, aktiviti, tarikh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-sans-custom"
            />
          </div>
        </div>

        {/* Row 2: Minggu Selector & Bidang Selector */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-cyan-500/20 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-semibold uppercase">Pilih Minggu:</span>
            <select
              value={selectedWeek}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedWeek(val === 'semua' ? 'semua' : parseInt(val, 10));
              }}
              className="bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-200 focus:outline-none"
            >
              <option value="semua">Semua Minggu ({uniqueWeeks.length} Minggu)</option>
              {uniqueWeeks.map((w) => (
                <option key={w} value={w}>
                  Minggu {w} {isTahun1 && w <= 4 ? '(Program Transisi)' : w <= 16 ? '(Penggal 1)' : w <= 27 ? '(Penggal 2)' : '(Penggal 3)'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-semibold uppercase">Bidang:</span>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-200 focus:outline-none"
            >
              <option value="Semua">Semua Bidang</option>
              {isTahun1 && <option value="Transisi">Program Transisi Tahun 1 (M1-M4)</option>}
              <option value="Al-Quran">Al-Quran (Tilawah / Hafazan / Kalimah)</option>
              <option value="Hadis">Hadis</option>
              <option value="Akidah">Akidah</option>
              <option value="Ibadah">Ibadah</option>
              <option value="Sirah">Sirah</option>
              <option value="Adab">Adab</option>
              <option value="Jawi">Jawi & Seni Khat</option>
              {isTahun1 && <option value="Pengurusan">Pengurusan & PBD Akhir Tahun</option>}
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-400">
            Memaparkan <span className="text-cyan-300 font-bold">{filteredRpt.length}</span> rekod perancangan ({selectedYearLevel})
          </div>
        </div>
      </div>

      {/* RPT List Grouped by Week */}
      <div className="space-y-6">
        {Object.keys(groupedByWeek).length === 0 ? (
          <div className="p-8 text-center bg-slate-950/80 rounded-2xl border border-cyan-500/30 text-slate-400 font-sans-custom space-y-2">
            <p className="font-semibold text-cyan-300">Tiada rekod RPT yang sepadan dengan carian.</p>
            <p className="text-xs">Sila ubah kata kunci carian atau tetapkan penapis ke "Semua".</p>
          </div>
        ) : (
          Object.keys(groupedByWeek)
            .map((weekKey) => parseInt(weekKey, 10))
            .sort((a, b) => a - b)
            .map((weekNumber) => {
              const weekItems = groupedByWeek[weekNumber];
              const isPenggal1 = weekNumber <= 16;
              const isPenggal2 = weekNumber >= 17 && weekNumber <= 27;
              const isTransisi = isTahun1 && weekNumber <= 4;
              const isPengurusan = isTahun1 && weekNumber === 43;
              const firstItem = weekItems[0];

              return (
                <div
                  key={weekNumber}
                  className="bg-slate-950/90 rounded-2xl border border-cyan-500/25 overflow-hidden shadow-lg hover:border-cyan-400/50 transition hud-bracket"
                >
                  {/* Week Header */}
                  <div className="bg-[#041926] p-4 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 font-tech shadow">
                        M{weekNumber}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-base text-white font-tech tracking-wide">
                            {isTransisi
                              ? `RANCANGAN PENGAJARAN MINGGU ${weekNumber} - PROGRAM TRANSISI TAHUN 1`
                              : isPengurusan
                              ? `RANCANGAN PENGAJARAN MINGGU ${weekNumber} - PENGURUSAN AKHIR & PBD`
                              : `RANCANGAN PENGAJARAN MINGGU ${weekNumber} (${selectedYearLevel})`}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-tech uppercase ${
                              isTransisi
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                                : isPenggal1
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : isPenggal2
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {isTransisi ? 'Transisi' : isPenggal1 ? 'Penggal 1' : isPenggal2 ? 'Penggal 2' : 'Penggal 3'}
                          </span>
                        </div>

                        {/* Date Badges for Kumpulan A & B */}
                        {firstItem?.kumpADates && (
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-tech">
                            <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                              <CalendarDays className="w-3 h-3 text-emerald-400" />
                              <span>KUMP A (Kedah): {firstItem.kumpADates}</span>
                            </span>
                            {firstItem.kumpBDates && (
                              <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center space-x-1">
                                <CalendarDays className="w-3 h-3 text-cyan-400" />
                                <span>KUMP B: {firstItem.kumpBDates}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-tech text-cyan-400/80">
                      {weekItems.length} Rekod PdPc
                    </div>
                  </div>

                  {/* Slot Items Cards Grid */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weekItems.map((item) => {
                      const isQuran = ['Al-Quran', 'Tafsir/Kefahaman', 'Tadarus/Tasmik', 'Tajwid'].includes(item.subjectCategory);
                      const isJawi = item.subjectCategory === 'Jawi';
                      const isAkidahIbadah = ['Akidah', 'Ibadah'].includes(item.subjectCategory);
                      const isTransisiCategory = item.subjectCategory === 'Transisi';
                      const isPengurusanCategory = item.subjectCategory === 'Pengurusan';

                      return (
                        <div
                          key={item.id}
                          className="bg-slate-900/90 rounded-xl border border-cyan-500/20 p-4 flex flex-col justify-between hover:border-cyan-400/60 transition group space-y-3"
                        >
                          <div>
                            {/* Slot Header */}
                            <div className="flex items-center justify-between gap-2 border-b border-cyan-500/15 pb-2.5 mb-2.5">
                              <span
                                className={`px-2.5 py-0.5 rounded font-bold text-xs font-tech ${
                                  isTransisiCategory
                                    ? 'bg-purple-950/90 text-purple-300 border border-purple-500/40'
                                    : isPengurusanCategory
                                    ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-500/40'
                                    : isQuran
                                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                                    : isJawi
                                    ? 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                                    : isAkidahIbadah
                                    ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                                    : 'bg-teal-950/90 text-teal-300 border border-teal-500/40'
                                }`}
                              >
                                {item.timeSlot}
                              </span>

                              <span className="text-[11px] font-bold text-cyan-400/80 font-tech">
                                {item.subjectCategory}
                              </span>
                            </div>

                            {/* Topic Title */}
                            {item.topicTitle && (
                              <h5 className="font-bold text-sm text-white mb-1.5 font-sans-custom group-hover:text-cyan-300 transition">
                                {item.topicTitle}
                              </h5>
                            )}

                            {/* Civic Education Badge if any */}
                            {item.civicTopic && (
                              <div className="mb-2 px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-semibold font-sans-custom flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{item.civicTopic}</span>
                              </div>
                            )}

                            {/* SK and SP */}
                            <div className="space-y-2 text-xs font-sans-custom mt-2">
                              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-cyan-500/15">
                                <span className="font-bold text-cyan-300 block text-[11px] font-tech uppercase">
                                  Standard Kandungan (SK):
                                </span>
                                <p className="text-slate-200 mt-0.5 whitespace-pre-line leading-relaxed">
                                  {item.contentStandard}
                                </p>
                              </div>

                              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-cyan-500/15">
                                <span className="font-bold text-cyan-300 block text-[11px] font-tech uppercase">
                                  Standard Pembelajaran (SP):
                                </span>
                                <p className="text-slate-200 mt-0.5 whitespace-pre-line leading-relaxed">
                                  {item.learningStandard}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Footer Action Buttons */}
                          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between gap-2 font-tech">
                            <button
                              onClick={() => setActiveItemDetails(item)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded-lg transition flex items-center space-x-1 border border-cyan-500/30"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Perincian RPT</span>
                            </button>

                            {onGenerateRphFromRpt && (
                              <button
                                onClick={() => onGenerateRphFromRpt(item)}
                                className="px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white text-xs rounded-lg transition flex items-center space-x-1 border border-cyan-500/40"
                                title="Jana e-RPH berasaskan RPT ini"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Cipta e-RPH</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Modal: Full RPT Details */}
      {activeItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative hud-bracket text-slate-200 font-sans-custom">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-cyan-500/30 pb-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-tech">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                    MINGGU {activeItemDetails.week}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    {activeItemDetails.yearLevel || selectedYearLevel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {activeItemDetails.timeSlot}
                  </span>
                  <span className="text-cyan-400">{activeItemDetails.subjectCategory}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 font-tech">
                  {activeItemDetails.topicTitle || activeItemDetails.contentStandard}
                </h3>

                {/* Dates display in modal */}
                {activeItemDetails.kumpADates && (
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-tech">
                    <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      KUMPULAN A (Kedah): {activeItemDetails.kumpADates}
                    </span>
                    {activeItemDetails.kumpBDates && (
                      <span className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        KUMPULAN B: {activeItemDetails.kumpBDates}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveItemDetails(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Civic Topic if exists */}
            {activeItemDetails.civicTopic && (
              <div className="mb-4 p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeItemDetails.civicTopic}</span>
              </div>
            )}

            {/* Detailed Content */}
            <div className="space-y-4 text-xs">
              {/* SK & SP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/20">
                  <span className="font-bold text-cyan-300 block mb-1 font-tech uppercase text-[11px]">
                    Standard Kandungan (SK):
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-200">
                    {activeItemDetails.contentStandard}
                  </p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/20">
                  <span className="font-bold text-cyan-300 block mb-1 font-tech uppercase text-[11px]">
                    Standard Pembelajaran (SP):
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-200">
                    {activeItemDetails.learningStandard}
                  </p>
                </div>
              </div>

              {/* Objektif Pembelajaran */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/20">
                <span className="font-bold text-emerald-400 block mb-2 font-tech uppercase text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Objektif Pembelajaran:</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-200 leading-relaxed pl-1">
                  {activeItemDetails.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Cadangan Aktiviti PdP */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/20">
                <span className="font-bold text-cyan-300 block mb-2 font-tech uppercase text-[11px] flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Cadangan Aktiviti PdPc (PAK-21):</span>
                </span>
                <ol className="space-y-2 list-decimal list-inside text-slate-200 leading-relaxed pl-1">
                  {activeItemDetails.activities.map((act, idx) => (
                    <li key={idx} className="bg-slate-950/60 p-2 rounded-lg border border-cyan-500/10">
                      {act}
                    </li>
                  ))}
                </ol>
              </div>

              {/* EMK, Penilaian & KBAT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#031522] p-3 rounded-xl border border-cyan-500/20">
                  <span className="font-bold text-amber-300 block mb-1 font-tech uppercase text-[10px]">
                    Elemen Merentas Kurikulum (EMK):
                  </span>
                  <p className="text-slate-300 leading-relaxed">{activeItemDetails.emk}</p>
                </div>

                <div className="bg-[#031522] p-3 rounded-xl border border-cyan-500/20">
                  <span className="font-bold text-cyan-300 block mb-1 font-tech uppercase text-[10px]">
                    Kaedah Penilaian:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{activeItemDetails.assessment}</p>
                </div>

                <div className="bg-[#031522] p-3 rounded-xl border border-cyan-500/20">
                  <span className="font-bold text-purple-300 block mb-1 font-tech uppercase text-[10px]">
                    Kemahiran Berfikir Aras Tinggi (KBAT):
                  </span>
                  <p className="text-slate-300 leading-relaxed">{activeItemDetails.kbat}</p>
                </div>
              </div>

              {/* Notes if available */}
              {activeItemDetails.notes && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-200 text-xs">
                  <span className="font-bold block mb-0.5 font-tech text-amber-300 uppercase">Catatan / Takwim:</span>
                  <p>{activeItemDetails.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-cyan-500/30 flex justify-end gap-2 font-tech">
              <button
                onClick={() => setActiveItemDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
              >
                Tutup
              </button>
              {onGenerateRphFromRpt && (
                <button
                  onClick={() => {
                    const item = activeItemDetails;
                    setActiveItemDetails(null);
                    onGenerateRphFromRpt(item);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Gunakan RPT Ini Untuk Cipta e-RPH</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
