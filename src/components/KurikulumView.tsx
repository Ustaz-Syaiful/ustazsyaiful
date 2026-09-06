import React, { useState } from 'react';
import {
  RPHItem,
  DskpItem,
  PbdStudentRecord,
  TasmikRecord,
  PdpcModuleItem,
  RptItem
} from '../types';
import {
  BookOpen,
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Download,
  Edit3,
  Trash2,
  Play,
  Users,
  BarChart2,
  BookMarked,
  X,
  Save,
  ShieldCheck,
  FolderOpen,
  Languages,
  CalendarDays
} from 'lucide-react';
import { getJawiRph, JAWI_DICTIONARY } from '../utils/jawiConverter';
import { ScriptType } from '../types';
import { JadualWaktuSection } from './JadualWaktuSection';
import { RptSection } from './RptSection';
import { allRptDataTahun6 } from '../data/rptTahun6Data';
import { allRptDataTahun1 } from '../data/rptTahun1Data';
import { allRptDataTahun2 } from '../data/rptTahun2Data';
import { allRptDataTahun3 } from '../data/rptTahun3Data';
import { createTasmikRph, isTasmikRph, TASMIK_OFFICIAL_DATA } from '../data/tasmikConstants';
import { WeeklyRphStackView } from './WeeklyRphStackView';

interface KurikulumViewProps {
  rphList: RPHItem[];
  dskpList: DskpItem[];
  pbdStudents: PbdStudentRecord[];
  tasmikRecords: TasmikRecord[];
  pdpcModules: PdpcModuleItem[];
  isAdmin: boolean;
  onOpenRphModal: (rph: RPHItem | null) => void;
  onDeleteRph: (id: string) => void;
  onSaveRph?: (rph: RPHItem, silent?: boolean) => void;
  onAddDskp: (dskp: DskpItem) => void;
  onUpdateDskp: (dskp: DskpItem) => void;
  onDeleteDskp: (id: string) => void;
  onAddPbdStudent: (student: PbdStudentRecord) => void;
  onUpdatePbdStudent: (student: PbdStudentRecord) => void;
  onDeletePbdStudent: (id: string) => void;
  onAddTasmik: (record: TasmikRecord) => void;
  onUpdateTasmik: (record: TasmikRecord) => void;
  onDeleteTasmik: (id: string) => void;
  onAddPdpcModule: (module: PdpcModuleItem) => void;
  onUpdatePdpcModule: (module: PdpcModuleItem) => void;
  onDeletePdpcModule: (id: string) => void;
  onOpenQuizModal: () => void;
}

export const KurikulumView: React.FC<KurikulumViewProps> = ({
  rphList = [],
  dskpList = [],
  pbdStudents = [],
  tasmikRecords = [],
  pdpcModules = [],
  isAdmin,
  onOpenRphModal,
  onDeleteRph,
  onSaveRph,
  onAddDskp,
  onUpdateDskp,
  onDeleteDskp,
  onAddPbdStudent,
  onUpdatePbdStudent,
  onDeletePbdStudent,
  onAddTasmik,
  onUpdateTasmik,
  onDeleteTasmik,
  onAddPdpcModule,
  onUpdatePdpcModule,
  onDeletePdpcModule,
  onOpenQuizModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'jadual' | 'rph' | 'rpt' | 'dskp' | 'pbd' | 'tasmik' | 'pdpc'>('jadual');
  const [rphMode, setRphMode] = useState<'weekly-15' | 'collection'>('weekly-15');
  const [dskpRptMode, setDskpRptMode] = useState<'rpt' | 'dskp'>('rpt');
  const [rphScriptView, setRphScriptView] = useState<ScriptType>('jawi');
  const [rphSearch, setRphSearch] = useState('');
  const [rphFilterArea, setRphFilterArea] = useState('Semua');
  const [dskpSearch, setDskpSearch] = useState('');
  const [dskpAreaFilter, setDskpAreaFilter] = useState('Semua');
  const [selectedClass, setSelectedClass] = useState('4 Ibnu Sina');

  const handleGenerateRphFromRpt = (rpt: RptItem) => {
    const targetClass = rpt.yearLevel === 'Tahun 1'
      ? '1 Ibnu Sina'
      : rpt.yearLevel === 'Tahun 2'
      ? '2 Ibnu Khaldun'
      : rpt.yearLevel === 'Tahun 3'
      ? '3 Al-Biruni'
      : rpt.yearLevel === 'Tahun 6'
      ? '6 Al-Ghazali'
      : selectedClass;

    // Check if this RPT item is Tasmik (category, timeslot, topic, or content standard)
    const isTasmikSlot = rpt.subjectCategory === 'Tadarus/Tasmik' ||
      (rpt.timeSlot && (rpt.timeSlot.toLowerCase().includes('tasmik') || rpt.timeSlot.includes('تسميع'))) ||
      Boolean(rpt.topicTitle && (rpt.topicTitle.toLowerCase().includes('tasmik') || rpt.topicTitle.includes('تسميع'))) ||
      Boolean(rpt.contentStandard && (rpt.contentStandard.toLowerCase().includes('tasmik') || rpt.contentStandard.includes('تسميع')));

    if (isTasmikSlot) {
      const tasmikRph = createTasmikRph({
        week: rpt.week,
        day: 'Isnin',
        date: new Date().toISOString().split('T')[0],
        time: rpt.timeSlot.includes('30') ? '08:00 - 08:30 (30 Minit)' : '11:00 - 12:00 (60 Minit)',
        className: targetClass,
        preferredScript: rphScriptView
      });
      onOpenRphModal(tasmikRph);
      return;
    }

    let categoryArea: any = 'Al-Quran';
    if (['Al-Quran', 'Tafsir/Kefahaman', 'Tajwid'].includes(rpt.subjectCategory)) {
      categoryArea = 'Al-Quran';
    } else if (['Hadis', 'Akidah', 'Ibadah', 'Sirah', 'Adab', 'Jawi'].includes(rpt.subjectCategory)) {
      categoryArea = rpt.subjectCategory;
    } else if (rpt.subjectCategory === 'Transisi') {
      categoryArea = 'Akidah';
    } else if (rpt.subjectCategory === 'Pengurusan') {
      categoryArea = 'Adab';
    }

    const rawRph: RPHItem = {
      id: `rph-${Date.now()}`,
      week: rpt.week,
      day: 'Isnin',
      date: new Date().toISOString().split('T')[0],
      time: rpt.timeSlot.includes('30') ? '08:00 - 08:30 (30 Minit)' : '08:00 - 09:00 (60 Minit)',
      className: targetClass,
      subject: 'Pendidikan Islam',
      learningArea: categoryArea,
      topic: rpt.topicTitle || rpt.contentStandard,
      contentStandard: rpt.contentStandard,
      learningStandard: rpt.learningStandard,
      objectives: rpt.objectives || [],
      successCriteria: rpt.objectives ? rpt.objectives.map((o) => `Murid dapat menguasai ${o}`) : [],
      inductionActivity: 'Guru memperdengarkan bacaan / mengaitkan dengan pengetahuan sedia ada murid.',
      mainActivities: rpt.activities || [],
      closureActivity: 'Guru membuat rumusan isi pelajaran dan memberikan latihan pengukuhan.',
      teachingAids: ['Buku Teks Pendidikan Islam', 'Buku Rekod / RPT', 'Carta / Slaid Digital / Kad Imbasan'],
      crossCurricularElements: [rpt.emk || 'Nilai Murni'],
      pbdAssessment: rpt.assessment || 'Lisan & Bertulis',
      reflection: 'Sesi PdPc mencapai objektif yang ditetapkan dengan jayanya mengikut standard DBP.',
      status: 'Lengkap',
      preferredScript: 'jawi'
    };

    const jawiVersion = getJawiRph(rawRph);
    const generatedRph: RPHItem = {
      ...rawRph,
      jawiOverrides: {
        day: jawiVersion.day,
        className: jawiVersion.className,
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
        reflection: jawiVersion.reflection
      }
    };
    onOpenRphModal(generatedRph);
  };

  // Modal States
  const [editingPbdStudent, setEditingPbdStudent] = useState<PbdStudentRecord | null>(null);
  const [isAddPbdOpen, setIsAddPbdOpen] = useState(false);
  const [newPbdForm, setNewPbdForm] = useState<Omit<PbdStudentRecord, 'id'>>({
    studentName: '',
    className: selectedClass,
    gender: 'Lelaki',
    tpQuran: 5,
    tpHadis: 5,
    tpAkidah: 5,
    tpIbadah: 5,
    tpSirah: 5,
    tpAdab: 5,
    tpJawi: 5,
    overallTp: 5,
    teacherRemarks: 'Menguasai pembelajaran dengan baik.'
  });

  const [editingTasmik, setEditingTasmik] = useState<TasmikRecord | null>(null);
  const [isAddTasmikOpen, setIsAddTasmikOpen] = useState(false);
  const [newTasmikForm, setNewTasmikForm] = useState<Omit<TasmikRecord, 'id'>>({
    studentName: '',
    className: selectedClass,
    currentStage: 'Al-Quran Juz 1-15',
    currentSurah: 'Surah Al-Baqarah',
    currentVersePage: 'Juzuk 1 / Muka Surat 5',
    hafazanProgress: 'Surah As-Sajdah (Ayat 1-10)',
    lastTasmikDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Lancar'
  });

  const [dskpModalData, setDskpModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    dskp: DskpItem;
  }>({
    isOpen: false,
    isEditing: false,
    dskp: {
      id: '',
      yearLevel: 'Tahun 4',
      area: 'Al-Quran (Tilawah)',
      theme: 'Tilawah & Hafazan',
      code: 'SK 1.1',
      contentStandard: '',
      learningStandard: '',
      performanceStandard: '',
      notes: ''
    }
  });

  const [moduleModalData, setModuleModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    module: PdpcModuleItem;
  }>({
    isOpen: false,
    isEditing: false,
    module: {
      id: '',
      title: '',
      category: 'Slaid & Media',
      targetYear: 'Tahun 4',
      description: '',
      fileSize: '4.5 MB',
      format: 'PPTX',
      downloadCount: 0
    }
  });

  // Filtered RPH
  const filteredRph = rphList.filter((r) => {
    const matchSearch =
      r.topic.toLowerCase().includes(rphSearch.toLowerCase()) ||
      r.className.toLowerCase().includes(rphSearch.toLowerCase()) ||
      r.contentStandard.toLowerCase().includes(rphSearch.toLowerCase());
    const matchArea = rphFilterArea === 'Semua' || r.learningArea === rphFilterArea;
    return matchSearch && matchArea;
  });

  // Filtered DSKP
  const filteredDskp = dskpList.filter((d) => {
    const matchSearch =
      d.contentStandard.toLowerCase().includes(dskpSearch.toLowerCase()) ||
      d.theme.toLowerCase().includes(dskpSearch.toLowerCase()) ||
      d.learningStandard.toLowerCase().includes(dskpSearch.toLowerCase());
    const matchArea = dskpAreaFilter === 'Semua' || d.area.toLowerCase().includes(dskpAreaFilter.toLowerCase());
    return matchSearch && matchArea;
  });

  // PBD class students
  const classPbdStudents = pbdStudents.filter((s) => s.className === selectedClass);

  // Tasmik class students
  const classTasmikRecords = tasmikRecords.filter((t) => t.className === selectedClass);

  const handlePbdFieldChange = (field: keyof PbdStudentRecord, val: number | string) => {
    if (!editingPbdStudent) return;
    const updated = { ...editingPbdStudent, [field]: val };
    if (typeof val === 'number') {
      const avg = Math.round(
        (updated.tpQuran + updated.tpHadis + updated.tpAkidah + updated.tpIbadah + updated.tpSirah + updated.tpAdab + updated.tpJawi) / 7
      );
      updated.overallTp = avg;
    }
    setEditingPbdStudent(updated);
  };

  const savePbdModal = () => {
    if (editingPbdStudent) {
      onUpdatePbdStudent(editingPbdStudent);
      setEditingPbdStudent(null);
    }
  };

  const handleCreatePbdStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const avg = Math.round(
      (newPbdForm.tpQuran + newPbdForm.tpHadis + newPbdForm.tpAkidah + newPbdForm.tpIbadah + newPbdForm.tpSirah + newPbdForm.tpAdab + newPbdForm.tpJawi) / 7
    );
    const newStudent: PbdStudentRecord = {
      ...newPbdForm,
      id: `pbd-${Date.now()}`,
      className: selectedClass,
      overallTp: avg
    };
    onAddPbdStudent(newStudent);
    setIsAddPbdOpen(false);
    setNewPbdForm({
      studentName: '',
      className: selectedClass,
      gender: 'Lelaki',
      tpQuran: 5,
      tpHadis: 5,
      tpAkidah: 5,
      tpIbadah: 5,
      tpSirah: 5,
      tpAdab: 5,
      tpJawi: 5,
      overallTp: 5,
      teacherRemarks: 'Menguasai pembelajaran dengan baik.'
    });
  };

  const saveTasmikModal = () => {
    if (editingTasmik) {
      onUpdateTasmik(editingTasmik);
      setEditingTasmik(null);
    }
  };

  const handleCreateTasmikRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TasmikRecord = {
      ...newTasmikForm,
      id: `tas-${Date.now()}`,
      className: selectedClass
    };
    onAddTasmik(newRecord);
    setIsAddTasmikOpen(false);
    setNewTasmikForm({
      studentName: '',
      className: selectedClass,
      currentStage: 'Al-Quran Juz 1-15',
      currentSurah: 'Surah Al-Baqarah',
      currentVersePage: 'Juzuk 1 / Muka Surat 5',
      hafazanProgress: 'Surah As-Sajdah (Ayat 1-10)',
      lastTasmikDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Lancar'
    });
  };

  const handleSaveDskp = (e: React.FormEvent) => {
    e.preventDefault();
    if (dskpModalData.isEditing) {
      onUpdateDskp(dskpModalData.dskp);
    } else {
      onAddDskp({
        ...dskpModalData.dskp,
        id: `dskp-${Date.now()}`
      });
    }
    setDskpModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (moduleModalData.isEditing) {
      onUpdatePdpcModule(moduleModalData.module);
    } else {
      onAddPdpcModule({
        ...moduleModalData.module,
        id: `mod-${Date.now()}`
      });
    }
    setModuleModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Kurikulum Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#041926] to-slate-950 rounded-2xl p-6 text-white border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 hud-bracket relative overflow-hidden print:hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30 font-tech">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>MODUL KURIKULUM & PDPC KUANTUM // j-QAF</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-tech">
            PUSAT KURIKULUM PENDIDIKAN ISLAM
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 max-w-xl font-sans-custom">
            Sistem pengurusan digital e-RPH KPM, Dokumen Standard Kurikulum (DSKP), Pentaksiran Bilik Darjah (PBD), Penjejak e-Tasmik Al-Quran dan Arkib Sumber PdPc.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10 font-tech">
          <button
            onClick={() => onOpenRphModal(null)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ CIPTA e-RPH BARU</span>
          </button>
          <button
            onClick={onOpenQuizModal}
            className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-200 text-xs font-semibold rounded-xl transition border border-cyan-500/40 flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>UJI MINDA KUANTUM</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="flex items-center space-x-2 bg-slate-950/80 p-2 rounded-2xl border border-cyan-500/30 shadow-md overflow-x-auto font-tech print:hidden">
        {[
          { id: 'jadual', label: 'JADUAL WAKTU', icon: CalendarDays, count: 28 },
          { id: 'rph', label: '15 e-RPH MINGGUAN', icon: FileText, count: 15 },
          { id: 'rpt', label: 'RPT TAHUNAN (T1 - T6)', icon: BookMarked, count: allRptDataTahun1.length + allRptDataTahun2.length + allRptDataTahun3.length + allRptDataTahun6.length },
          { id: 'dskp', label: 'DSKP KSSR', icon: BookOpen, count: dskpList.length },
          { id: 'pbd', label: 'PENTAKSIRAN PBD', icon: BarChart2, count: pbdStudents.length },
          { id: 'tasmik', label: 'e-TASMIK AL-QURAN', icon: BookOpen, count: tasmikRecords.length },
          { id: 'pdpc', label: 'BAHAN PDPC & MODUL', icon: FolderOpen, count: pdpcModules.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-600 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-cyan-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                isActive ? 'bg-slate-950/80 text-cyan-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 0: JADUAL WAKTU (SUMBER SK MERBAU PULAS KBA 5012) */}
      {activeSubTab === 'jadual' && (
        <JadualWaktuSection
          onNavigateToRph={(className) => {
            setActiveSubTab('rph');
            setRphSearch(className);
          }}
        />
      )}

      {/* SUB-TAB 1: e-RPH DIGITAL & 15 e-RPH MINGGUAN */}
      {activeSubTab === 'rph' && (
        <div className="space-y-4">
          {/* Sub-Nav Mode Bar */}
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 font-tech shadow-md print:hidden">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setRphMode('weekly-15')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  rphMode === 'weekly-15'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>15 e-RPH MINGGUAN (SUSUNAN KE BAWAH)</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  rphMode === 'weekly-15' ? 'bg-slate-950/80 text-cyan-300' : 'bg-slate-950 text-slate-400'
                }`}>
                  15 SLOT
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRphMode('collection')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  rphMode === 'collection'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>KOLEKSI & CARIAN KAD</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  rphMode === 'collection' ? 'bg-slate-950/80 text-cyan-300' : 'bg-slate-950 text-slate-400'
                }`}>
                  {rphList.length}
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onOpenRphModal(createTasmikRph({ className: selectedClass, preferredScript: rphScriptView }))}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow font-tech"
                title="Cipta e-RPH Tasmik mengikut format rasmi standard"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ e-RPH TASMIK (RASMI)</span>
              </button>
            </div>
          </div>

          {rphMode === 'weekly-15' ? (
            <WeeklyRphStackView
              initialWeek={33}
              initialStartDate="2026-01-18"
              allRphList={rphList}
              onSaveRph={(savedRph, silent) => {
                if (onSaveRph) {
                  onSaveRph(savedRph, silent);
                }
              }}
              onOpenDetailedModal={(rph) => onOpenRphModal(rph)}
            />
          ) : (
            <>
              {/* Filters & Search */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari tajuk, kelas, atau standard kandungan..."
                value={rphSearch}
                onChange={(e) => setRphSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-sans-custom"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Pilihan Tulisan Rumi / Jawi */}
              <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-bold text-cyan-300 font-tech uppercase">TULISAN e-RPH:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-cyan-500/30">
                  <button
                    type="button"
                    onClick={() => setRphScriptView('rumi')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition font-tech flex items-center space-x-1 ${
                      rphScriptView === 'rumi'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-cyan-300'
                    }`}
                  >
                    <span>RUMI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRphScriptView('jawi')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center space-x-1 ${
                      rphScriptView === 'jawi'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow font-jawi text-xs'
                        : 'text-slate-400 hover:text-amber-300 font-jawi'
                    }`}
                  >
                    <span>جاوي (JAWI)</span>
                  </button>
                </div>
              </div>

              {/* Filter Bidang */}
              <div className="flex items-center space-x-2 font-tech">
                <Filter className="w-4 h-4 text-cyan-400" />
                <label className="text-xs text-cyan-300 font-semibold uppercase">Bidang:</label>
                <select
                  value={rphFilterArea}
                  onChange={(e) => setRphFilterArea(e.target.value)}
                  className="bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-200 focus:outline-none"
                >
                  <option value="Semua">Semua Bidang</option>
                  <option value="Al-Quran">Al-Quran (القرءان)</option>
                  <option value="Hadis">Hadis (حديث)</option>
                  <option value="Akidah">Akidah (عقيدة)</option>
                  <option value="Ibadah">Ibadah (عبادة)</option>
                  <option value="Sirah">Sirah (سيرة)</option>
                  <option value="Adab">Adab (ادب)</option>
                  <option value="Jawi">Jawi (جاوي)</option>
                </select>
              </div>

              {/* Butang Cipta e-RPH Tasmik Format Rasmi Standard */}
              <button
                type="button"
                onClick={() => onOpenRphModal(createTasmikRph({ className: selectedClass, preferredScript: rphScriptView }))}
                className="px-3.5 py-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow font-tech"
                title="Cipta e-RPH Tasmik mengikut format rasmi standard"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ e-RPH TASMIK (RASMI)</span>
              </button>
            </div>
          </div>

          {/* RPH Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRph.map((item) => {
              const isJawi = rphScriptView === 'jawi';
              const displayItem = isJawi ? getJawiRph(item) : item;
              const jawiArea = JAWI_DICTIONARY[item.learningArea.toLowerCase()] || item.learningArea;
              const jawiStatus = item.status === 'Lengkap' ? 'لڠکڤ' : item.status === 'Deraf' ? 'دراف' : 'دسمق ڤݢب';

              return (
                <div
                  key={item.id}
                  className="bg-slate-950/90 rounded-2xl border border-cyan-500/25 shadow-md p-5 space-y-4 hover:border-cyan-400/60 transition flex flex-col justify-between group hud-bracket text-slate-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-tech">
                        {isJawi ? `ميڠݢو ${item.week} • ${displayItem.day}` : `MINGGU ${item.week} • ${item.day}`}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          isJawi ? 'font-jawi' : 'font-tech'
                        } ${
                          item.status === 'Lengkap'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isJawi ? jawiStatus : item.status.toUpperCase()}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isJawi ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-jawi' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-tech'
                        }`}>
                          {isJawi ? 'جاوي' : 'RUMI'}
                        </span>
                        {isTasmikRph(item) && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                            {isJawi ? 'تسميع' : 'TASMIK'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={isJawi ? 'text-right' : 'text-left'} dir={isJawi ? 'rtl' : 'ltr'}>
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-cyan-300/80 font-tech">
                        <span className={`font-bold text-white ${isJawi ? 'font-jawi text-sm' : ''}`}>
                          {isJawi ? displayItem.className : item.className}
                        </span>
                        <span>//</span>
                        <span className={`text-cyan-400 font-semibold ${isJawi ? 'font-jawi text-sm' : ''}`}>
                          {isJawi ? jawiArea : item.learningArea}
                        </span>
                      </div>
                      <h3 className={`font-bold text-white mt-1 line-clamp-2 ${
                        isJawi ? 'font-jawi text-base sm:text-lg leading-relaxed' : 'font-sans-custom text-sm'
                      }`}>
                        {displayItem.topic}
                      </h3>
                    </div>

                    <div className={`p-3 bg-slate-900/80 rounded-xl text-xs text-slate-300 space-y-1 border border-cyan-500/20 ${
                      isJawi ? 'font-jawi text-right leading-relaxed' : 'font-sans-custom text-left'
                    }`} dir={isJawi ? 'rtl' : 'ltr'}>
                      <p className="line-clamp-2 text-[11px] sm:text-xs">
                        <b className="text-cyan-300 font-tech">{isJawi ? 'ستندرد کاندوڠن (SK): ' : 'SK: '}</b>
                        {displayItem.contentStandard}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        <b className="text-cyan-300 font-tech">{isJawi ? 'ماس: ' : 'MASA: '}</b>
                        {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between font-tech">
                    <button
                      onClick={() => onOpenRphModal({ ...item, preferredScript: rphScriptView })}
                      className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isJawi ? 'بوک دان سونتيڠ (جاوي)' : 'BUKA & SUNTING'}</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onOpenRphModal({ ...item, preferredScript: rphScriptView })}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-lg transition"
                        title={isJawi ? 'چيتق e-RPH جاوي' : 'Cetak e-RPH'}
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`Padam e-RPH "${item.topic}" (${item.className})?`)) {
                              onDeleteRph(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Padam e-RPH"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  )}

      {/* SUB-TAB: RPT TAHUNAN (42 MINGGU) */}
      {activeSubTab === 'rpt' && (
        <RptSection onGenerateRphFromRpt={handleGenerateRphFromRpt} />
      )}

      {/* SUB-TAB 2: DSKP & RPT */}
      {activeSubTab === 'dskp' && (
        <div className="space-y-4">
          {/* Sub-toggle between DSKP & RPT */}
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 font-tech shadow-md">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDskpRptMode('dskp')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  dskpRptMode === 'dskp'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>DSKP KSSR SEMAKAN ({dskpList.length})</span>
              </button>
              <button
                onClick={() => setDskpRptMode('rpt')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  dskpRptMode === 'rpt'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-emerald-300'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>RPT TAHUNAN ({allRptDataTahun1.length + allRptDataTahun6.length} REKOD)</span>
              </button>
            </div>

            <span className="text-xs text-cyan-400/80">
              {dskpRptMode === 'dskp' ? 'Standard Kandungan & Pembelajaran' : 'Rancangan Pengajaran Tahunan 42 Minggu'}
            </span>
          </div>

          {dskpRptMode === 'rpt' ? (
            <RptSection onGenerateRphFromRpt={handleGenerateRphFromRpt} />
          ) : (
            <>
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari standard kandungan, tema, atau kemahiran..."
                    value={dskpSearch}
                    onChange={(e) => setDskpSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-sans-custom"
                  />
                </div>

                <div className="flex items-center space-x-2 font-tech">
                  <label className="text-xs text-cyan-300 font-semibold uppercase">Bidang DSKP:</label>
                  <select
                    value={dskpAreaFilter}
                    onChange={(e) => setDskpAreaFilter(e.target.value)}
                    className="bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-200"
                  >
                    <option value="Semua">Semua Bidang</option>
                    <option value="Al-Quran">Al-Quran</option>
                    <option value="Hadis">Hadis</option>
                    <option value="Akidah">Akidah</option>
                    <option value="Ibadah">Ibadah</option>
                    <option value="Sirah">Sirah</option>
                    <option value="Adab">Adab</option>
                    <option value="Jawi">Jawi</option>
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() =>
                        setDskpModalData({
                          isOpen: true,
                          isEditing: false,
                          dskp: {
                            id: '',
                            yearLevel: 'Tahun 4',
                            area: 'Al-Quran (Tilawah)',
                            theme: 'Tilawah & Hafazan',
                            code: 'SK 1.1',
                            contentStandard: '',
                            learningStandard: '',
                            performanceStandard: '',
                            notes: ''
                          }
                        })
                      }
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1 font-tech"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ DSKP</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {filteredDskp.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/90 rounded-2xl border border-cyan-500/25 p-5 shadow-md space-y-3 hover:border-cyan-400/60 transition relative group hud-bracket text-slate-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded font-bold text-xs font-tech">
                          {item.yearLevel.toUpperCase()}
                        </span>
                        <span className="font-bold text-sm text-white font-tech tracking-wide">{item.area}</span>
                        <span className="text-xs text-cyan-300/70 font-sans-custom">({item.theme})</span>
                      </div>

                      <div className="flex items-center space-x-2 font-tech">
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          KOD: {item.code}
                        </span>

                        {isAdmin && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() =>
                                setDskpModalData({
                                  isOpen: true,
                                  isEditing: true,
                                  dskp: { ...item }
                                })
                              }
                              className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-900 rounded"
                              title="Sunting DSKP"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Padam DSKP "${item.code} - ${item.area}"?`)) {
                                  onDeleteDskp(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded"
                              title="Padam DSKP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans-custom">
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-cyan-500/20">
                        <span className="font-bold text-cyan-300 block mb-1 font-tech uppercase">Standard Kandungan (SK):</span>
                        <p className="text-slate-300 whitespace-pre-line leading-relaxed">{item.contentStandard}</p>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-cyan-500/20">
                        <span className="font-bold text-cyan-300 block mb-1 font-tech uppercase">Standard Pembelajaran (SP):</span>
                        <p className="text-slate-300 whitespace-pre-line leading-relaxed">{item.learningStandard}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#031522] rounded-xl border border-cyan-500/30 text-xs text-cyan-200 font-sans-custom">
                      <span className="font-bold block mb-0.5 font-tech text-amber-300 uppercase tracking-wide">Deskriptor Tahap Penguasaan (PBD):</span>
                      <p className="leading-relaxed">{item.performanceStandard}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PENTAKSIRAN PBD */}
      {activeSubTab === 'pbd' && (
        <div className="space-y-4">
          {/* Class Picker */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-tech">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-cyan-300 uppercase">Pilih Kelas PBD:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-cyan-200 focus:outline-none"
              >
                <option>4 Ibnu Sina</option>
                <option>4 Al-Farabi</option>
                <option>5 Al-Biruni</option>
                <option>5 Al-Khawarizmi</option>
                <option>6 Al-Ghazali</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-300">JUMLAH MURID: <b className="text-cyan-300 font-mono">{classPbdStudents.length} ORANG</b></span>

              {isAdmin && (
                <button
                  onClick={() => setIsAddPbdOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 rounded-xl font-bold flex items-center space-x-1 transition shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ MURID PBD</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-xl font-semibold flex items-center space-x-1.5 transition border border-cyan-500/30 ml-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>CETAK BORANG</span>
              </button>
            </div>
          </div>

          {/* Student PBD Table */}
          <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 shadow-md overflow-hidden hud-bracket">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#020b12] text-cyan-300 uppercase text-[10px] tracking-wider font-tech border-b border-cyan-500/30">
                  <tr>
                    <th className="p-3.5">Bil</th>
                    <th className="p-3.5">Nama Murid</th>
                    <th className="p-3.5 text-center">Al-Quran</th>
                    <th className="p-3.5 text-center">Hadis</th>
                    <th className="p-3.5 text-center">Akidah</th>
                    <th className="p-3.5 text-center">Ibadah</th>
                    <th className="p-3.5 text-center">Sirah</th>
                    <th className="p-3.5 text-center">Adab</th>
                    <th className="p-3.5 text-center">Jawi</th>
                    <th className="p-3.5 text-center bg-cyan-950/60 text-amber-300">TP Purata</th>
                    <th className="p-3.5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10 text-slate-300 font-sans-custom">
                  {classPbdStudents.map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-3.5 font-mono text-cyan-400/80">{idx + 1}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{std.studentName}</span>
                        <span className="text-[10px] text-cyan-300/60 font-tech">{std.gender} • {std.className}</span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpQuran}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpHadis}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpAkidah}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpIbadah}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpSirah}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpAdab}</td>
                      <td className="p-3.5 text-center font-bold text-cyan-300 font-mono">TP{std.tpJawi}</td>
                      <td className="p-3.5 text-center font-extrabold bg-cyan-950/40">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-lg text-xs font-mono font-bold">
                          TP {std.overallTp}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-tech">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setEditingPbdStudent(std)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-950 text-cyan-300 font-semibold rounded-lg text-xs transition border border-cyan-500/30"
                          >
                            KEMASKINI
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                if (confirm(`Padam rekod PBD murid "${std.studentName}"?`)) {
                                  onDeletePbdStudent(std.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded"
                              title="Padam Murid"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: e-TASMIK AL-QURAN */}
      {activeSubTab === 'tasmik' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-tech">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-cyan-300 uppercase">Pilih Kelas Tasmik:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-cyan-200 focus:outline-none"
              >
                <option>4 Ibnu Sina</option>
                <option>4 Al-Farabi</option>
                <option>5 Al-Biruni</option>
                <option>5 Al-Khawarizmi</option>
                <option>6 Al-Ghazali</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-xs text-cyan-300 bg-cyan-950/70 px-3 py-1.5 rounded-xl border border-cyan-500/40 font-medium">
                Model Khatam Al-Quran j-QAF • Sasaran Khatam Tahun 6
              </div>

              <button
                type="button"
                onClick={() => onOpenRphModal(createTasmikRph({ className: selectedClass, preferredScript: rphScriptView }))}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow"
                title="Bina e-RPH Tasmik format standard rasmi untuk kelas ini"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>BINA e-RPH TASMIK</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setIsAddTasmikOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1 transition shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ REKOD TASMIK</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classTasmikRecords.map((tasmik) => (
              <div
                key={tasmik.id}
                className="bg-slate-950/90 rounded-2xl border border-cyan-500/25 p-5 shadow-md space-y-3 flex flex-col justify-between hover:border-cyan-400/60 transition group hud-bracket text-slate-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white font-tech tracking-wide">{tasmik.studentName}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md font-tech ${
                        tasmik.status === 'Cemerlang'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : tasmik.status === 'Lancar'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {tasmik.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl space-y-2 text-xs border border-cyan-500/20 font-sans-custom">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Tahap Semasa:</span>
                      <span className="font-bold text-cyan-300 font-tech">{tasmik.currentStage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Surah / Muka Surat:</span>
                      <span className="font-semibold text-white">{tasmik.currentSurah} ({tasmik.currentVersePage})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hafazan Surah Pilihan:</span>
                      <span className="font-semibold text-amber-300">{tasmik.hafazanProgress}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400 font-tech">
                  <span>TASMIK TERKINI: <b className="text-cyan-300 font-mono">{tasmik.lastTasmikDate}</b></span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingTasmik(tasmik)}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition"
                    >
                      REKOD TASMIK
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`Padam rekod tasmik "${tasmik.studentName}"?`)) {
                            onDeleteTasmik(tasmik.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded"
                        title="Padam Rekod Tasmik"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: BAHAN PDPC & MODUL */}
      {activeSubTab === 'pdpc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center space-x-2 font-tech">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Koleksi Modul & Lembaran Kerja Guru</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() =>
                  setModuleModalData({
                    isOpen: true,
                    isEditing: false,
                    module: {
                      id: '',
                      title: '',
                      category: 'Slaid & Media',
                      targetYear: 'Tahun 4',
                      description: '',
                      fileSize: '3.2 MB',
                      format: 'PDF',
                      downloadCount: 0
                    }
                  })
                }
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-1 font-tech"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ MODUL PDPC</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pdpcModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/25 shadow-md space-y-3 flex flex-col justify-between group hover:border-cyan-400/60 transition hud-bracket text-slate-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded font-bold text-[10px] font-tech">
                      {mod.targetYear.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      {mod.format} • {mod.fileSize}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white font-sans-custom">{mod.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans-custom">{mod.description}</p>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between font-tech">
                  <button
                    onClick={() => {
                      if (mod.category === 'Kuiz & Didik Hibur') {
                        onOpenQuizModal();
                      } else {
                        alert(`Memuat turun: ${mod.title} (${mod.format})`);
                      }
                    }}
                    className="py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>AKSES / MUAT TURUN</span>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          setModuleModalData({
                            isOpen: true,
                            isEditing: true,
                            module: { ...mod }
                          })
                        }
                        className="p-1 text-slate-400 hover:text-cyan-300 rounded"
                        title="Sunting Modul"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Padam modul "${mod.title}"?`)) {
                            onDeletePdpcModule(mod.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        title="Padam Modul"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MURID PBD ================= */}
      {isAddPbdOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-lg border border-cyan-500/40 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 hud-bracket text-slate-200">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                Tambah Rekod Murid PBD ({selectedClass})
              </h3>
              <button
                onClick={() => setIsAddPbdOpen(false)}
                className="p-1 text-slate-400 hover:text-cyan-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePbdStudent} className="space-y-3 text-xs font-sans-custom">
              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Nama Penuh Murid:</label>
                <input
                  type="text"
                  value={newPbdForm.studentName}
                  onChange={(e) => setNewPbdForm({ ...newPbdForm, studentName: e.target.value })}
                  placeholder="Contoh: Muhammad Danish bin Amran"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 font-medium text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Jantina:</label>
                  <select
                    value={newPbdForm.gender}
                    onChange={(e) => setNewPbdForm({ ...newPbdForm, gender: e.target.value as any })}
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 font-medium text-white focus:outline-none"
                  >
                    <option value="Lelaki">Lelaki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Kelas:</label>
                  <input
                    type="text"
                    value={selectedClass}
                    disabled
                    className="w-full bg-slate-900/50 border border-cyan-500/20 rounded-xl p-2.5 font-bold text-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1 font-tech">
                {[
                  { label: 'Al-Quran', key: 'tpQuran' },
                  { label: 'Hadis', key: 'tpHadis' },
                  { label: 'Akidah', key: 'tpAkidah' },
                  { label: 'Ibadah', key: 'tpIbadah' },
                  { label: 'Sirah', key: 'tpSirah' },
                  { label: 'Adab', key: 'tpAdab' },
                  { label: 'Jawi', key: 'tpJawi' }
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-semibold text-slate-300 mb-0.5 text-[10px] uppercase">{f.label}:</label>
                    <select
                      value={(newPbdForm as any)[f.key]}
                      onChange={(e) =>
                        setNewPbdForm({ ...newPbdForm, [f.key]: parseInt(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-1.5 text-xs font-bold text-cyan-300"
                    >
                      {[1, 2, 3, 4, 5, 6].map((tp) => (
                        <option key={tp} value={tp}>TP{tp}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Catatan Guru:</label>
                <textarea
                  rows={2}
                  value={newPbdForm.teacherRemarks}
                  onChange={(e) => setNewPbdForm({ ...newPbdForm, teacherRemarks: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
                <button
                  type="button"
                  onClick={() => setIsAddPbdOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-cyan-500/30"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl shadow"
                >
                  TAMBAH MURID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH REKOD TASMIK ================= */}
      {isAddTasmikOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-lg border border-cyan-500/40 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 hud-bracket text-slate-200">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                Tambah Rekod e-Tasmik ({selectedClass})
              </h3>
              <button
                onClick={() => setIsAddTasmikOpen(false)}
                className="p-1 text-slate-400 hover:text-cyan-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTasmikRecord} className="space-y-3 text-xs font-sans-custom">
              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Nama Murid:</label>
                <input
                  type="text"
                  value={newTasmikForm.studentName}
                  onChange={(e) => setNewTasmikForm({ ...newTasmikForm, studentName: e.target.value })}
                  placeholder="Contoh: Nur Aisyah binti Firdaus"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 font-medium text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Tahap Bacaan Semasa:</label>
                <select
                  value={newTasmikForm.currentStage}
                  onChange={(e) => setNewTasmikForm({ ...newTasmikForm, currentStage: e.target.value as any })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs font-bold text-cyan-200"
                >
                  <option value="Iqra 1">Iqra Jilid 1</option>
                  <option value="Iqra 2">Iqra Jilid 2</option>
                  <option value="Iqra 3">Iqra Jilid 3</option>
                  <option value="Iqra 4">Iqra Jilid 4</option>
                  <option value="Iqra 5">Iqra Jilid 5</option>
                  <option value="Iqra 6">Iqra Jilid 6</option>
                  <option value="Al-Quran Juz 1-15">Al-Quran (Juzuk 1 hingga 15)</option>
                  <option value="Al-Quran Juz 16-30">Al-Quran (Juzuk 16 hingga 30)</option>
                  <option value="Khatam Al-Quran">Khatam Al-Quran 30 Juzuk (Sedia Diijazahkan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Surah & Halaman Semasa:</label>
                <input
                  type="text"
                  value={newTasmikForm.currentSurah}
                  onChange={(e) => setNewTasmikForm({ ...newTasmikForm, currentSurah: e.target.value })}
                  placeholder="Surah An-Nisa (Juzuk 4 / Muka Surat 85)"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Kemajuan Hafazan Surah Pilihan:</label>
                <input
                  type="text"
                  value={newTasmikForm.hafazanProgress}
                  onChange={(e) => setNewTasmikForm({ ...newTasmikForm, hafazanProgress: e.target.value })}
                  placeholder="Surah Al-Mulk (Ayat 1-15)"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Tahap Kelancaran:</label>
                <select
                  value={newTasmikForm.status}
                  onChange={(e) => setNewTasmikForm({ ...newTasmikForm, status: e.target.value as any })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs font-semibold text-cyan-200"
                >
                  <option value="Cemerlang">Cemerlang & Fasih Bertajwid</option>
                  <option value="Lancar">Lancar</option>
                  <option value="Perlu Bimbingan Tajwid">Perlu Bimbingan Tajwid</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
                <button
                  type="button"
                  onClick={() => setIsAddTasmikOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-cyan-500/30"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl shadow"
                >
                  TAMBAH TASMIK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DSKP ================= */}
      {dskpModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-lg border border-cyan-500/40 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 hud-bracket text-slate-200">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                {dskpModalData.isEditing ? 'Sunting DSKP / RPT' : 'Tambah Standard Kandungan DSKP'}
              </h3>
              <button
                onClick={() => setDskpModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDskp} className="space-y-3 text-xs font-sans-custom">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Tahun Persekolahan:</label>
                  <select
                    value={dskpModalData.dskp.yearLevel}
                    onChange={(e) =>
                      setDskpModalData((prev) => ({
                        ...prev,
                        dskp: { ...prev.dskp, yearLevel: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-bold text-cyan-200"
                  >
                    <option value="Tahun 4">Tahun 4</option>
                    <option value="Tahun 5">Tahun 5</option>
                    <option value="Tahun 6">Tahun 6</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Bidang DSKP:</label>
                  <input
                    type="text"
                    value={dskpModalData.dskp.area}
                    onChange={(e) =>
                      setDskpModalData((prev) => ({
                        ...prev,
                        dskp: { ...prev.dskp, area: e.target.value }
                      }))
                    }
                    placeholder="Al-Quran / Hadis / Akidah / Ibadah / Sirah / Adab / Jawi"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Kod SK:</label>
                  <input
                    type="text"
                    value={dskpModalData.dskp.code}
                    onChange={(e) =>
                      setDskpModalData((prev) => ({
                        ...prev,
                        dskp: { ...prev.dskp, code: e.target.value }
                      }))
                    }
                    placeholder="SK 1.3 / SK 3.1"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Tema / Tajuk:</label>
                  <input
                    type="text"
                    value={dskpModalData.dskp.theme}
                    onChange={(e) =>
                      setDskpModalData((prev) => ({
                        ...prev,
                        dskp: { ...prev.dskp, theme: e.target.value }
                      }))
                    }
                    placeholder="Kefahaman Surah / Hukum Tajwid"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Standard Kandungan (SK):</label>
                <textarea
                  rows={2}
                  value={dskpModalData.dskp.contentStandard}
                  onChange={(e) =>
                    setDskpModalData((prev) => ({
                      ...prev,
                      dskp: { ...prev.dskp, contentStandard: e.target.value }
                    }))
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-slate-200 placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Standard Pembelajaran (SP):</label>
                <textarea
                  rows={3}
                  value={dskpModalData.dskp.learningStandard}
                  onChange={(e) =>
                    setDskpModalData((prev) => ({
                      ...prev,
                      dskp: { ...prev.dskp, learningStandard: e.target.value }
                    }))
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-slate-200 placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Deskriptor Pentaksiran (PBD):</label>
                <textarea
                  rows={2}
                  value={dskpModalData.dskp.performanceStandard}
                  onChange={(e) =>
                    setDskpModalData((prev) => ({
                      ...prev,
                      dskp: { ...prev.dskp, performanceStandard: e.target.value }
                    }))
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-slate-200 placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
                <button
                  type="button"
                  onClick={() => setDskpModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-cyan-500/30"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl shadow"
                >
                  SIMPAN DSKP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL BAHAN PDPC ================= */}
      {moduleModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-md border border-cyan-500/40 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 hud-bracket text-slate-200">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                {moduleModalData.isEditing ? 'Sunting Modul PdPc' : 'Tambah Modul PdPc Baru'}
              </h3>
              <button
                onClick={() => setModuleModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-3 text-xs font-sans-custom">
              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Tajuk Modul / Bahan:</label>
                <input
                  type="text"
                  value={moduleModalData.module.title}
                  onChange={(e) =>
                    setModuleModalData((prev) => ({
                      ...prev,
                      module: { ...prev.module, title: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Modul Pintar Tajwid & Makhraj"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 font-medium text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Kategori:</label>
                  <select
                    value={moduleModalData.module.category}
                    onChange={(e) =>
                      setModuleModalData((prev) => ({
                        ...prev,
                        module: { ...prev.module, category: e.target.value as any }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-cyan-200"
                  >
                    <option value="Slaid & Media">Slaid & Media</option>
                    <option value="Lembaran Kerja">Lembaran Kerja</option>
                    <option value="Kuiz & Didik Hibur">Kuiz & Didik Hibur</option>
                    <option value="Bahan Bantu Mengajar">Bahan Bantu Mengajar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Sasaran Tahun:</label>
                  <input
                    type="text"
                    value={moduleModalData.module.targetYear}
                    onChange={(e) =>
                      setModuleModalData((prev) => ({
                        ...prev,
                        module: { ...prev.module, targetYear: e.target.value }
                      }))
                    }
                    placeholder="Tahun 4, 5 & 6"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Penerangan Modul:</label>
                <textarea
                  rows={2}
                  value={moduleModalData.module.description}
                  onChange={(e) =>
                    setModuleModalData((prev) => ({
                      ...prev,
                      module: { ...prev.module, description: e.target.value }
                    }))
                  }
                  placeholder="Penerangan ringkas isi kandungan modul..."
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-medium text-slate-200 placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Format Fail:</label>
                  <input
                    type="text"
                    value={moduleModalData.module.format}
                    onChange={(e) =>
                      setModuleModalData((prev) => ({
                        ...prev,
                        module: { ...prev.module, format: e.target.value }
                      }))
                    }
                    placeholder="PDF / PPTX / ZIP"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-mono text-amber-300 placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cyan-300 mb-1 font-tech uppercase">Saiz Fail:</label>
                  <input
                    type="text"
                    value={moduleModalData.module.fileSize}
                    onChange={(e) =>
                      setModuleModalData((prev) => ({
                        ...prev,
                        module: { ...prev.module, fileSize: e.target.value }
                      }))
                    }
                    placeholder="4.5 MB"
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 font-mono text-cyan-300 placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
                <button
                  type="button"
                  onClick={() => setModuleModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-cyan-500/30"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl shadow"
                >
                  SIMPAN MODUL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KEMASKINI PBD ================= */}
      {editingPbdStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-lg border border-cyan-500/40 shadow-2xl p-6 space-y-4 hud-bracket text-slate-200">
            <div className="border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                Kemaskini Pentaksiran Bilik Darjah (PBD)
              </h3>
              <p className="text-xs text-cyan-300 font-semibold font-tech">
                {editingPbdStudent.studentName} ({editingPbdStudent.className})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-tech">
              {[
                { label: 'Al-Quran', field: 'tpQuran' },
                { label: 'Hadis', field: 'tpHadis' },
                { label: 'Akidah', field: 'tpAkidah' },
                { label: 'Ibadah', field: 'tpIbadah' },
                { label: 'Sirah', field: 'tpSirah' },
                { label: 'Adab', field: 'tpAdab' },
                { label: 'Jawi', field: 'tpJawi' }
              ].map((item) => (
                <div key={item.field}>
                  <label className="font-semibold text-slate-300 block mb-1 uppercase">{item.label} (TP 1-6):</label>
                  <select
                    value={(editingPbdStudent as any)[item.field]}
                    onChange={(e) => handlePbdFieldChange(item.field as any, parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-1.5 text-xs font-bold text-cyan-300"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>Tahap Penguasaan TP{num}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="font-sans-custom">
              <label className="font-semibold text-cyan-300 block mb-1 text-xs font-tech uppercase">Ulasan / Catatan Guru:</label>
              <textarea
                rows={2}
                value={editingPbdStudent.teacherRemarks}
                onChange={(e) => handlePbdFieldChange('teacherRemarks', e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
              <button
                onClick={() => setEditingPbdStudent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-cyan-500/30"
              >
                BATAL
              </button>
              <button
                onClick={savePbdModal}
                className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold rounded-xl"
              >
                SIMPAN REKOD PBD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KEMASKINI TASMIK ================= */}
      {editingTasmik && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-2xl w-full max-w-lg border border-cyan-500/40 shadow-2xl p-6 space-y-4 hud-bracket text-slate-200">
            <div className="border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-white font-tech uppercase tracking-wide">
                Kemaskini Rekod e-Tasmik Al-Quran
              </h3>
              <p className="text-xs text-cyan-300 font-semibold font-tech">
                {editingTasmik.studentName} ({editingTasmik.className})
              </p>
            </div>

            <div className="space-y-3 text-xs font-sans-custom">
              <div>
                <label className="font-semibold text-cyan-300 block mb-1 font-tech uppercase">Tahap Bacaan Semasa:</label>
                <select
                  value={editingTasmik.currentStage}
                  onChange={(e) => setEditingTasmik({ ...editingTasmik, currentStage: e.target.value as any })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs font-bold text-cyan-200"
                >
                  <option value="Iqra 1">Iqra Jilid 1</option>
                  <option value="Iqra 2">Iqra Jilid 2</option>
                  <option value="Iqra 3">Iqra Jilid 3</option>
                  <option value="Iqra 4">Iqra Jilid 4</option>
                  <option value="Iqra 5">Iqra Jilid 5</option>
                  <option value="Iqra 6">Iqra Jilid 6</option>
                  <option value="Al-Quran Juz 1-15">Al-Quran (Juzuk 1 hingga 15)</option>
                  <option value="Al-Quran Juz 16-30">Al-Quran (Juzuk 16 hingga 30)</option>
                  <option value="Khatam Al-Quran">Khatam Al-Quran 30 Juzuk (Sedia Diijazahkan)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-cyan-300 block mb-1 font-tech uppercase">Surah & Muka Surat Semasa:</label>
                <input
                  type="text"
                  value={editingTasmik.currentSurah}
                  onChange={(e) => setEditingTasmik({ ...editingTasmik, currentSurah: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-cyan-300 block mb-1 font-tech uppercase">Kemajuan Hafazan Surah Pilihan:</label>
                <input
                  type="text"
                  value={editingTasmik.hafazanProgress}
                  onChange={(e) => setEditingTasmik({ ...editingTasmik, hafazanProgress: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-cyan-300 block mb-1 font-tech uppercase">Tahap Kelancaran:</label>
                <select
                  value={editingTasmik.status}
                  onChange={(e) => setEditingTasmik({ ...editingTasmik, status: e.target.value as any })}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2 text-xs font-semibold text-cyan-200"
                >
                  <option value="Cemerlang">Cemerlang & Fasih Bertajwid</option>
                  <option value="Lancar">Lancar</option>
                  <option value="Perlu Bimbingan Tajwid">Perlu Bimbingan Tajwid</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
              <button
                onClick={() => setEditingTasmik(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-cyan-500/30"
              >
                BATAL
              </button>
              <button
                onClick={saveTasmikModal}
                className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold rounded-xl"
              >
                SIMPAN TASMIK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
