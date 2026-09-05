import React, { useState } from 'react';
import {
  TeacherProfile,
  TimetableSlot,
  PrayerTimeData,
  HadithItem,
  IslamicEventItem,
  MainMenuType
} from '../types';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  CheckCircle,
  Copy,
  ChevronRight,
  School,
  GraduationCap,
  HeartHandshake,
  Share2,
  FileText,
  Volume2,
  Bell,
  Edit3,
  Plus,
  Trash2,
  X,
  Save,
  Check,
  ShieldCheck,
  Compass,
  Orbit,
  Atom,
  Cpu,
  Zap,
  Radio,
  Activity,
  Terminal,
  Moon,
  Sun,
  Layers,
  Gauge
} from 'lucide-react';
import { FalakiahTelemetryBar } from './FalakiahTelemetryBar';
import { IslamicScienceShowcase } from './IslamicScienceShowcase';

interface UtamaViewProps {
  teacher: TeacherProfile;
  timetable: TimetableSlot[];
  prayerData: PrayerTimeData;
  hadithList: HadithItem[];
  islamicEvents: IslamicEventItem[];
  isAdmin: boolean;
  setActiveMenu: (menu: MainMenuType) => void;
  onOpenQuickRph: () => void;
  onOpenPrayerModal: () => void;
  onOpenQuizModal: () => void;
  onUpdateTeacher: (teacher: TeacherProfile) => void;
  onAddTimetableSlot: (slot: TimetableSlot) => void;
  onUpdateTimetableSlot: (slot: TimetableSlot) => void;
  onDeleteTimetableSlot: (id: string) => void;
  onAddHadith: (hadith: HadithItem) => void;
  onUpdateHadith: (hadith: HadithItem) => void;
  onDeleteHadith: (id: string) => void;
  onAddIslamicEvent: (event: IslamicEventItem) => void;
  onUpdateIslamicEvent: (event: IslamicEventItem) => void;
  onDeleteIslamicEvent: (id: string) => void;
}

export const UtamaView: React.FC<UtamaViewProps> = ({
  teacher,
  timetable = [],
  prayerData,
  hadithList = [],
  islamicEvents = [],
  isAdmin,
  setActiveMenu,
  onOpenQuickRph,
  onOpenPrayerModal,
  onOpenQuizModal,
  onUpdateTeacher,
  onAddTimetableSlot,
  onUpdateTimetableSlot,
  onDeleteTimetableSlot,
  onAddHadith,
  onUpdateHadith,
  onDeleteHadith,
  onAddIslamicEvent,
  onUpdateIslamicEvent,
  onDeleteIslamicEvent
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [copiedHadithId, setCopiedHadithId] = useState<string | null>(null);
  const [activeHadithIndex, setActiveHadithIndex] = useState(0);

  // Admin Modal States
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState<TeacherProfile>(teacher);
  const [rolesInput, setRolesInput] = useState((teacher?.roles || []).join('\n'));
  const [classesInput, setClassesInput] = useState((teacher?.classesTaught || []).join(', '));

  const [timetableModalData, setTimetableModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    slot: TimetableSlot;
  }>({
    isOpen: false,
    isEditing: false,
    slot: {
      id: '',
      day: 'Isnin',
      time: '08:00 - 09:00',
      className: '4 Ibnu Sina',
      subject: 'Pendidikan Islam',
      topic: '',
      location: 'Bilik j-QAF 1'
    }
  });

  const [hadithModalData, setHadithModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    hadith: HadithItem;
  }>({
    isOpen: false,
    isEditing: false,
    hadith: {
      id: '',
      arabic: '',
      transliteration: '',
      translation: '',
      narrator: '',
      source: '',
      theme: 'Adab & Akhlak'
    }
  });

  const [eventModalData, setEventModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    event: IslamicEventItem;
  }>({
    isOpen: false,
    isEditing: false,
    event: {
      id: '',
      name: '',
      hijri: '',
      date: '',
      status: 'Akan Datang'
    }
  });

  const currentHadith = hadithList[activeHadithIndex] || hadithList[0] || {
    id: 'h-def',
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    translation: 'Menuntut ilmu itu adalah fardhu bagi setiap orang Islam.',
    narrator: 'Anas bin Malik R.A',
    source: 'Hadis Riwayat Ibnu Majah (No. 224)',
    theme: 'Keutamaan Menuntut Ilmu'
  };

  const daysList = ['Semua', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

  const filteredTimetable = selectedDay === 'Semua'
    ? timetable
    : timetable.filter((slot) => slot.day === selectedDay);

  const handleCopyHadith = (hadith: HadithItem) => {
    const text = `"${hadith.translation}"\n- ${hadith.source} (${hadith.narrator})`;
    navigator.clipboard.writeText(text);
    setCopiedHadithId(hadith.id);
    setTimeout(() => setCopiedHadithId(null), 2000);
  };

  // Save Teacher Profile
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TeacherProfile = {
      ...teacherFormData,
      classesTaught: classesInput.split(',').map((c) => c.trim()).filter(Boolean),
      roles: rolesInput.split('\n').map((r) => r.trim()).filter(Boolean)
    };
    onUpdateTeacher(updated);
    setIsEditTeacherOpen(false);
  };

  // Save Timetable Slot
  const handleSaveTimetableSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (timetableModalData.isEditing) {
      onUpdateTimetableSlot(timetableModalData.slot);
    } else {
      onAddTimetableSlot({
        ...timetableModalData.slot,
        id: `tt-${Date.now()}`
      });
    }
    setTimetableModalData((prev) => ({ ...prev, isOpen: false }));
  };

  // Save Hadith
  const handleSaveHadith = (e: React.FormEvent) => {
    e.preventDefault();
    if (hadithModalData.isEditing) {
      onUpdateHadith(hadithModalData.hadith);
    } else {
      const newHadith = {
        ...hadithModalData.hadith,
        id: `h-${Date.now()}`
      };
      onAddHadith(newHadith);
      setActiveHadithIndex(hadithList.length);
    }
    setHadithModalData((prev) => ({ ...prev, isOpen: false }));
  };

  // Save Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventModalData.isEditing) {
      onUpdateIslamicEvent(eventModalData.event);
    } else {
      onAddIslamicEvent({
        ...eventModalData.event,
        id: `evt-${Date.now()}`
      });
    }
    setEventModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Bar Telemetri Falakiah Kuantum (Astronomical Sensor Bar) */}
      <FalakiahTelemetryBar
        prayerData={prayerData}
        onOpenPrayerModal={onOpenPrayerModal}
      />

      {/* 2. Hab Komando Digital & Falakiah Sains Islam (Futuristic Islamic Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#061d27] to-[#041218] border border-cyan-500/40 shadow-2xl p-6 sm:p-10 text-white hud-bracket">
        {/* Animated Cyber-Islamic Matrix Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            {/* Holographic Islamic Salutation Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-tech text-cyan-300">
                <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span className="font-bold tracking-wider">AHLAN WA SAHLAAN YA {teacher.salutation.toUpperCase()}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-mono">{prayerData.hijriDate}</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-tech text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>STATUS KONSOL: OPTIMUM</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <span className="text-[11px] font-tech text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                KONSOL PENDIDIKAN ISLAM ALAF BAHARU // J-QAF & PBD
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans-custom">
                Portal Rasmi Guru Pendidikan Islam
              </h1>
            </div>

            <p className="text-sm sm:text-base text-cyan-100/80 max-w-2xl leading-relaxed font-sans-custom">
              Sistem pengurusan PdPc pintar berteraskan falsafah sains dan tamadun Islam merangkumi modul Kurikulum (e-RPH, PBD, e-Tasmik), Hal Ehwal Murid (HEM), Kokurikulum, dan Falakiah {teacher.school}.
            </p>

            {/* Cyberpunk Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenQuickRph}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center space-x-2 font-tech tracking-wide hover:scale-102"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>+ CIPTA e-RPH DIGITAL</span>
              </button>

              <button
                onClick={() => setActiveMenu('kurikulum')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 hover:from-cyan-900 hover:to-emerald-900 text-cyan-200 font-semibold text-xs sm:text-sm rounded-xl transition border border-cyan-400/40 flex items-center space-x-2 font-tech tracking-wide hover:scale-102"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>RADAR e-TASMIK & PBD</span>
              </button>

              <button
                onClick={onOpenQuizModal}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition border border-slate-700/80 flex items-center space-x-2 font-tech tracking-wide hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>KUIZ TAJWID FALAK</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Futuristic Telemetry Grid */}
          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-xs font-tech font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>TELEMETRI PDPC SEMASA</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded font-bold">
                MINGGU 32
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition">
                <span className="text-2xl font-bold text-amber-400 font-mono tracking-wider">185</span>
                <span className="block text-[11px] text-slate-300 mt-0.5 font-tech">Murid j-QAF</span>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-emerald-500/20 hover:border-emerald-400/40 transition">
                <span className="text-2xl font-bold text-emerald-400 font-mono tracking-wider">{teacher.classesTaught.length} Kelas</span>
                <span className="block text-[11px] text-slate-300 mt-0.5 font-tech">Tahun 4, 5 & 6</span>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-teal-500/20 hover:border-teal-400/40 transition">
                <span className="text-2xl font-bold text-teal-300 font-mono tracking-wider">100%</span>
                <span className="block text-[11px] text-slate-300 mt-0.5 font-tech">e-RPH Lengkap</span>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-amber-500/20 hover:border-amber-400/40 transition">
                <span className="text-2xl font-bold text-amber-300 font-mono tracking-wider">42</span>
                <span className="block text-[11px] text-slate-300 mt-0.5 font-tech">Khatam Quran</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800">
              <span className="text-cyan-400">LATENSI: 14ms // STABIL</span>
              <span className="text-emerald-400">ENKRIPSI: SHARIAH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid: Teacher Cybernetic Profile & Waktu Solat Falakiah Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teacher Cyber-ID Card */}
        <div className="lg:col-span-7 bg-slate-950/90 text-white rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-xl space-y-5 relative overflow-hidden hud-bracket">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-300 font-arabic text-2xl font-bold">
                    أستاذ
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[9px] text-slate-950 font-bold" title="Status Aktif">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {teacher.salutation} {teacher.name}
                  </h2>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono rounded">
                    {teacher.grade}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {teacher.school}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-tech font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                {teacher.option}
              </span>

              {isAdmin && (
                <button
                  onClick={() => {
                    setTeacherFormData(teacher);
                    setRolesInput(teacher.roles.join('\n'));
                    setClassesInput(teacher.classesTaught.join(', '));
                    setIsEditTeacherOpen(true);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-400/30 hover:bg-amber-400/40 text-amber-300 text-xs font-bold rounded-xl transition border border-amber-400/50 flex items-center space-x-1.5 font-tech"
                  title="Sunting Profil Guru"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>SUNTING PROFIL</span>
                </button>
              )}
            </div>
          </div>

          {/* Experience Progress Meter */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-tech">
              <span className="text-slate-400">PENGALAMAN BERKHIDMAT:</span>
              <span className="text-amber-300 font-bold font-mono">{teacher.teachingExperience} TAHUN // TAHAP CEMERLANG</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 rounded-full"
                style={{ width: `${Math.min(100, (teacher.teachingExperience / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* Philosophy / Kalam Guru */}
          <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed italic font-sans-custom relative">
            <span className="text-cyan-400/60 font-serif text-lg mr-1">“</span>
            {teacher.philosophy}
            <span className="text-cyan-400/60 font-serif text-lg ml-1">”</span>
          </div>

          {/* Key Roles & Classes */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-tech font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>PORTFOLIO & TANGGUNGJAWAB PANITIA</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {teacher.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-cyan-500/20 text-slate-300 font-medium hover:border-cyan-400/40 transition"
                >
                  ⚡ {role}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-tech">
            <div className="flex items-center space-x-2">
              <span className="text-cyan-300 font-bold">KELAS DIAJAR:</span>
              <span className="text-slate-200">{teacher.classesTaught.join(', ')}</span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px]">ID DELIMa: {teacher.email}</span>
          </div>
        </div>

        {/* Waktu Solat Falakiah Radar */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-[#071924] to-slate-950 text-white rounded-3xl p-6 border border-emerald-500/40 shadow-xl space-y-5 flex flex-col justify-between hud-bracket relative">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-tech font-bold text-sm text-cyan-200 uppercase tracking-wider">
                  RADAR FALAKIAH & WAKTU SOLAT
                </h3>
              </div>
              <button
                onClick={onOpenPrayerModal}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-tech font-medium flex items-center gap-1"
              >
                <span>{prayerData.zoneName.split(',')[0]}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prayer Pods */}
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
                <span className="block text-[10px] text-slate-400 font-tech uppercase">Subuh</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{prayerData.subuh}</span>
              </div>
              <div className="p-2 bg-gradient-to-b from-amber-950/60 to-slate-900 rounded-xl border border-amber-500/40 shadow-inner">
                <span className="block text-[10px] text-amber-300 font-tech uppercase font-bold">Zohor</span>
                <span className="text-xs font-bold text-amber-300 font-mono">{prayerData.zohor}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
                <span className="block text-[10px] text-slate-400 font-tech uppercase">Asar</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{prayerData.asar}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
                <span className="block text-[10px] text-slate-400 font-tech uppercase">Maghrib</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{prayerData.maghrib}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
                <span className="block text-[10px] text-slate-400 font-tech uppercase">Isyak</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{prayerData.isyak}</span>
              </div>
            </div>

            {/* Qibla & Azan Status */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-tech text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BEARING KE KAABAH:</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">292° 48' 22" BBL</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-tech text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>KEDUDUKAN SURIA:</span>
                </span>
                <span className="font-mono text-emerald-300 font-bold">ZENITH ANGLE +51.4°</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Solat Zohor Berjemaah di Surau: <b className="text-amber-300 font-mono">01:30 PM</b></span>
            </div>
            <button
              onClick={onOpenPrayerModal}
              className="text-[11px] text-amber-400 hover:underline font-tech font-bold"
            >
              RADAR FALAK
            </button>
          </div>
        </div>
      </div>

      {/* 4. Terminal Hologram Kalam Hikmah & Hadis (Futuristic Hadith Console) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#071822] to-[#041017] p-6 sm:p-7 text-white border border-amber-500/30 shadow-2xl hud-bracket">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-tech font-bold text-sm text-amber-300 tracking-wider uppercase">
                  TERMINAL HADIS & KALAM HIKMAH
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[9px] bg-amber-400/20 text-amber-300 font-mono">
                  TERVERIFIKASI
                </span>
              </div>
              <p className="text-xs text-cyan-300 font-medium font-sans-custom">{currentHadith.theme}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hadithList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHadithIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeHadithIndex === idx
                    ? 'bg-amber-400 w-6 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-700 w-2 hover:bg-slate-500'
                }`}
                title={`Hadis ${idx + 1}`}
              />
            ))}

            <button
              onClick={() => handleCopyHadith(currentHadith)}
              className="ml-2 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs text-cyan-300 rounded-xl transition flex items-center space-x-1.5 font-tech"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedHadithId === currentHadith.id ? 'DISALIN!' : 'SALIN'}</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() =>
                    setHadithModalData({
                      isOpen: true,
                      isEditing: true,
                      hadith: currentHadith
                    })
                  }
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1 font-tech"
                  title="Sunting Hadis Ini"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>SUNTING</span>
                </button>

                <button
                  onClick={() =>
                    setHadithModalData({
                      isOpen: true,
                      isEditing: false,
                      hadith: {
                        id: '',
                        arabic: '',
                        transliteration: '',
                        translation: '',
                        narrator: '',
                        source: '',
                        theme: 'Tazkirah & Akhlak'
                      }
                    })
                  }
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 font-tech"
                  title="Tambah Hadis Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>TAMBAH</span>
                </button>

                {hadithList.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Padam hadis "${currentHadith.theme}"?`)) {
                        onDeleteHadith(currentHadith.id);
                        setActiveHadithIndex(0);
                      }
                    }}
                    className="p-1.5 bg-rose-950/60 border border-rose-600/40 hover:bg-rose-900 text-rose-300 rounded-xl transition"
                    title="Padam Hadis Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="py-6 space-y-4">
          <p className="font-arabic text-xl sm:text-3xl text-amber-200 text-right leading-loose font-normal">
            {currentHadith.arabic}
          </p>

          {currentHadith.transliteration && (
            <p className="text-xs text-cyan-300/90 italic font-tech border-l-2 border-cyan-500/40 pl-3">
              "{currentHadith.transliteration}"
            </p>
          )}

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed font-sans-custom">
            "{currentHadith.translation}"
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 font-tech border-t border-slate-800">
            <span>PERAWI: <b className="text-cyan-300">{currentHadith.narrator}</b></span>
            <span className="text-amber-300/90 font-mono">{currentHadith.source}</span>
          </div>
        </div>
      </div>

      {/* 5. Konsol Sains & Tamadun Islam (Islamic Golden Age Science Showcase) */}
      <IslamicScienceShowcase />

      {/* 6. Jadual Waktu Mengajar Kuantum & Takwim Peristiwa Islam */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Timetable Terminal */}
        <div className="lg:col-span-8 bg-slate-950/90 rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4 text-white hud-bracket">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="font-tech font-bold text-base text-white tracking-wide uppercase">
                JADUAL WAKTU MENGAJAR MINGGUAN
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() =>
                    setTimetableModalData({
                      isOpen: true,
                      isEditing: false,
                      slot: {
                        id: '',
                        day: selectedDay === 'Semua' ? 'Isnin' : selectedDay,
                        time: '08:00 - 09:00',
                        className: '4 Ibnu Sina',
                        subject: 'Pendidikan Islam',
                        topic: '',
                        location: 'Bilik j-QAF 1'
                      }
                    })
                  }
                  className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 font-tech"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ SLOT</span>
                </button>
              )}

              {/* Day Filter Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
                {daysList.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1 rounded-xl text-xs font-tech font-semibold transition whitespace-nowrap ${
                      selectedDay === day
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto pr-1">
            {filteredTimetable.length > 0 ? (
              filteredTimetable.map((slot) => (
                <div key={slot.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/60 px-2 rounded-xl transition group">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded font-mono font-bold text-xs">
                        {slot.className}
                      </span>
                      <span className="font-bold text-xs text-white">{slot.subject}</span>
                      <span className="text-[11px] text-slate-400">• {slot.location}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{slot.topic}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-left sm:text-right shrink-0">
                    <div>
                      <span className="text-xs font-bold text-cyan-300 font-mono block">
                        {slot.time}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-tech font-semibold">
                        {slot.day}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            setTimetableModalData({
                              isOpen: true,
                              isEditing: true,
                              slot: { ...slot }
                            })
                          }
                          className="p-1 text-slate-400 hover:text-amber-400 hover:bg-amber-950/50 rounded-lg transition"
                          title="Sunting Slot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Padam slot jadual ${slot.className} (${slot.time})?`)) {
                              onDeleteTimetableSlot(slot.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition"
                          title="Padam Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 font-tech">
                TIADA JADUAL MENGAJAR UNTUK HARI INI.
              </div>
            )}
          </div>
        </div>

        {/* Islamic Events Countdown */}
        <div className="lg:col-span-4 bg-slate-950/90 rounded-3xl p-6 border border-amber-500/30 shadow-xl space-y-4 text-white hud-bracket">
          <div className="flex items-center justify-between">
            <h3 className="font-tech font-bold text-base text-white flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TAKWIM PERISTIWA ISLAM</span>
            </h3>

            {isAdmin && (
              <button
                onClick={() =>
                  setEventModalData({
                    isOpen: true,
                    isEditing: false,
                    event: {
                      id: '',
                      name: '',
                      hijri: '',
                      date: '',
                      status: 'Akan Datang'
                    }
                  })
                }
                className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 text-[11px] font-tech font-bold rounded-xl transition flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>+ ACARA</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {islamicEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white font-sans-custom">{evt.name}</h4>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full ${
                      evt.status === 'Baru Selesai'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : evt.status === 'Sedang Berlangsung'
                        ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {evt.status}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center space-x-0.5">
                        <button
                          onClick={() =>
                            setEventModalData({
                              isOpen: true,
                              isEditing: true,
                              event: { ...evt }
                            })
                          }
                          className="p-1 text-slate-400 hover:text-amber-400 rounded transition"
                          title="Sunting Peristiwa"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Padam peristiwa "${evt.name}"?`)) {
                              onDeleteIslamicEvent(evt.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                          title="Padam Peristiwa"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-tech">
                  <span className="text-amber-300/90">{evt.hijri}</span>
                  <span className="font-mono text-cyan-300">{evt.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL SUNTING PROFIL GURU ================= */}
      {isEditTeacherOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Sunting Profil Guru Pendidikan Islam
                </h3>
              </div>
              <button
                onClick={() => setIsEditTeacherOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gelaran / Salutation:</label>
                  <input
                    type="text"
                    value={teacherFormData.salutation}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, salutation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    placeholder="Contoh: Ustaz / Ustazah"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Penuh Guru:</label>
                  <input
                    type="text"
                    value={teacherFormData.name}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    placeholder="Nama penuh guru"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gred & Jawatan:</label>
                  <input
                    type="text"
                    value={teacherFormData.grade}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, grade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    placeholder="DG44 / DG41"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opsyen / Pengkhususan:</label>
                  <input
                    type="text"
                    value={teacherFormData.option}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, option: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    placeholder="Pendidikan Islam / Bahasa Arab / j-QAF"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah:</label>
                  <input
                    type="text"
                    value={teacherFormData.school}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, school: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pengalaman Mengajar:</label>
                  <input
                    type="number"
                    value={teacherFormData.teachingExperience}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, teachingExperience: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    min="1"
                    max="45"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emel Rasmi DELIMa:</label>
                  <input
                    type="email"
                    value={teacherFormData.email}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Telefon Rasmi:</label>
                  <input
                    type="text"
                    value={teacherFormData.phone}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    placeholder="019-XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Falsafah Pendidikan / Mutiara Kata:</label>
                <textarea
                  rows={2}
                  value={teacherFormData.philosophy}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, philosophy: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kelas Yang Diajar (Asingkan dengan koma):
                </label>
                <input
                  type="text"
                  value={classesInput}
                  onChange={(e) => setClassesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  placeholder="4 Ibnu Sina, 5 Al-Biruni, 6 Al-Ghazali"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Peranan & Tanggungjawab Panitia (Satu baris satu peranan):
                </label>
                <textarea
                  rows={3}
                  value={rolesInput}
                  onChange={(e) => setRolesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  placeholder="Ketua Panitia Pendidikan Islam&#10;Penyelaras j-QAF"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditTeacherOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL JADUAL WAKTU (SLOT) ================= */}
      {timetableModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {timetableModalData.isEditing ? 'Sunting Slot Jadual Waktu' : 'Tambah Slot Jadual Waktu'}
              </h3>
              <button
                onClick={() => setTimetableModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimetableSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari:</label>
                  <select
                    value={timetableModalData.slot.day}
                    onChange={(e) =>
                      setTimetableModalData((prev) => ({
                        ...prev,
                        slot: { ...prev.slot, day: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    {['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Masa:</label>
                  <input
                    type="text"
                    value={timetableModalData.slot.time}
                    onChange={(e) =>
                      setTimetableModalData((prev) => ({
                        ...prev,
                        slot: { ...prev.slot, time: e.target.value }
                      }))
                    }
                    placeholder="08:00 - 09:00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Kelas:</label>
                  <input
                    type="text"
                    value={timetableModalData.slot.className}
                    onChange={(e) =>
                      setTimetableModalData((prev) => ({
                        ...prev,
                        slot: { ...prev.slot, className: e.target.value }
                      }))
                    }
                    placeholder="4 Ibnu Sina"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran:</label>
                  <input
                    type="text"
                    value={timetableModalData.slot.subject}
                    onChange={(e) =>
                      setTimetableModalData((prev) => ({
                        ...prev,
                        slot: { ...prev.slot, subject: e.target.value }
                      }))
                    }
                    placeholder="Pendidikan Islam / e-Tasmik"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tajuk / Bidang PdPc:</label>
                <input
                  type="text"
                  value={timetableModalData.slot.topic}
                  onChange={(e) =>
                    setTimetableModalData((prev) => ({
                      ...prev,
                      slot: { ...prev.slot, topic: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Bidang Al-Quran: Hukum Mad Asli"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi:</label>
                <input
                  type="text"
                  value={timetableModalData.slot.location}
                  onChange={(e) =>
                    setTimetableModalData((prev) => ({
                      ...prev,
                      slot: { ...prev.slot, location: e.target.value }
                    }))
                  }
                  placeholder="Bilik j-QAF 1 / Surau / Kelas"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setTimetableModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  {timetableModalData.isEditing ? 'Simpan Slot' : 'Tambah Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL HADIS & TAZKIRAH ================= */}
      {hadithModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {hadithModalData.isEditing ? 'Sunting Hadis / Kalam Hikmah' : 'Tambah Hadis / Kalam Hikmah Baru'}
              </h3>
              <button
                onClick={() => setHadithModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHadith} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tema / Tajuk Hadis:</label>
                <input
                  type="text"
                  value={hadithModalData.hadith.theme}
                  onChange={(e) =>
                    setHadithModalData((prev) => ({
                      ...prev,
                      hadith: { ...prev.hadith, theme: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Keutamaan Akhlak Mulia"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teks Bahasa Arab:</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={hadithModalData.hadith.arabic}
                  onChange={(e) =>
                    setHadithModalData((prev) => ({
                      ...prev,
                      hadith: { ...prev.hadith, arabic: e.target.value }
                    }))
                  }
                  placeholder="إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ"
                  className="w-full font-arabic text-base bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-right"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sebutan Rumi (Transliterasi):</label>
                <input
                  type="text"
                  value={hadithModalData.hadith.transliteration || ''}
                  onChange={(e) =>
                    setHadithModalData((prev) => ({
                      ...prev,
                      hadith: { ...prev.hadith, transliteration: e.target.value }
                    }))
                  }
                  placeholder="Innama bu'ithtu li-utammima shaliha al-akhlaq"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terjemahan Maksud:</label>
                <textarea
                  rows={2}
                  value={hadithModalData.hadith.translation}
                  onChange={(e) =>
                    setHadithModalData((prev) => ({
                      ...prev,
                      hadith: { ...prev.hadith, translation: e.target.value }
                    }))
                  }
                  placeholder="Sesungguhnya aku diutuskan untuk menyempurnakan akhlak yang mulia."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perawi Hadis:</label>
                  <input
                    type="text"
                    value={hadithModalData.hadith.narrator}
                    onChange={(e) =>
                      setHadithModalData((prev) => ({
                        ...prev,
                        hadith: { ...prev.hadith, narrator: e.target.value }
                      }))
                    }
                    placeholder="Abu Hurairah R.A"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber Rujukan Hadis:</label>
                  <input
                    type="text"
                    value={hadithModalData.hadith.source}
                    onChange={(e) =>
                      setHadithModalData((prev) => ({
                        ...prev,
                        hadith: { ...prev.hadith, source: e.target.value }
                      }))
                    }
                    placeholder="Hadis Riwayat Ahmad (No. 8952)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setHadithModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  {hadithModalData.isEditing ? 'Simpan Hadis' : 'Tambah Hadis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL PERISTIWA ISLAM ================= */}
      {eventModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {eventModalData.isEditing ? 'Sunting Peristiwa Islam' : 'Tambah Peristiwa Islam Baru'}
              </h3>
              <button
                onClick={() => setEventModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peristiwa / Sambutan:</label>
                <input
                  type="text"
                  value={eventModalData.event.name}
                  onChange={(e) =>
                    setEventModalData((prev) => ({
                      ...prev,
                      event: { ...prev.event, name: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Awal Ramadhan 1448H"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarikh Hijrah:</label>
                  <input
                    type="text"
                    value={eventModalData.event.hijri}
                    onChange={(e) =>
                      setEventModalData((prev) => ({
                        ...prev,
                        event: { ...prev.event, hijri: e.target.value }
                      }))
                    }
                    placeholder="1 Ramadhan 1448H"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarikh Masihi:</label>
                  <input
                    type="text"
                    value={eventModalData.event.date}
                    onChange={(e) =>
                      setEventModalData((prev) => ({
                        ...prev,
                        event: { ...prev.event, date: e.target.value }
                      }))
                    }
                    placeholder="08 Februari 2027"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status:</label>
                <select
                  value={eventModalData.event.status}
                  onChange={(e) =>
                    setEventModalData((prev) => ({
                      ...prev,
                      event: { ...prev.event, status: e.target.value as any }
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                  <option value="Baru Selesai">Baru Selesai</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEventModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  {eventModalData.isEditing ? 'Simpan Peristiwa' : 'Tambah Peristiwa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
